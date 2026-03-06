/**
 * Graceful Word — Cloudflare Worker
 * ─────────────────────────────────────────────────────────────────────────────
 * Handles two routes:
 *
 *  POST /webhook/wompi
 *    WOMPI calls this after every transaction.
 *    1. Verifies the HMAC-SHA256 signature in the `wompi_hash` header.
 *    2. Confirms the transaction is APPROVED via the WOMPI REST API.
 *    3. Stores the verified transaction ID in KV so the confirmation
 *       page can trust it.
 *
 *  GET /verify/:txId
 *    Called by the Next.js confirmation page BEFORE showing the receipt.
 *    Returns { verified: true } only for transaction IDs stored by step 3 above.
 *    Anything else → { verified: false }.
 *
 * Secrets (set via `wrangler secret put`, never hardcoded):
 *   WOMPI_API_SECRET  — API Secret from WOMPI dashboard (for HMAC verification)
 *   WOMPI_API_KEY     — API Key from WOMPI dashboard (for transaction lookup)
 *   ALLOWED_ORIGIN    — Your site URL for CORS (e.g. https://gracefulword.com)
 *
 * KV:
 *   PAID_TXS          — KV namespace that stores verified transaction IDs
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface Env {
  PAID_TXS:        KVNamespace
  WOMPI_API_SECRET: string
  WOMPI_API_KEY:    string
  ALLOWED_ORIGIN:   string
}

// WOMPI El Salvador base URL
const WOMPI_API = 'https://api.wompi.sv'

// How long we store a verified tx ID in KV (30 days in seconds)
const KV_TTL_SECONDS = 60 * 60 * 24 * 30

// ── ENTRY POINT ─────────────────────────────────────────────────────────────
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url    = new URL(request.url)
    const origin = request.headers.get('Origin') ?? ''

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return corsPreFlight(env.ALLOWED_ORIGIN)
    }

    // Route: POST /webhook/wompi
    if (request.method === 'POST' && url.pathname === '/webhook/wompi') {
      return handleWebhook(request, env)
    }

    // Route: GET /verify/:txId
    const verifyMatch = url.pathname.match(/^\/verify\/([^/]+)$/)
    if (request.method === 'GET' && verifyMatch) {
      return handleVerify(verifyMatch[1], env, origin)
    }

    return jsonResponse({ error: 'Not found' }, 404)
  },
}

// ── WEBHOOK HANDLER ─────────────────────────────────────────────────────────
async function handleWebhook(request: Request, env: Env): Promise<Response> {
  // Read the raw body BEFORE any parsing — critical for HMAC verification
  const rawBody = await request.text()

  // ── Step 1: Verify HMAC-SHA256 signature ─────────────────────────────────
  const receivedHash = request.headers.get('wompi_hash') ?? ''

  if (!receivedHash) {
    console.warn('[webhook] Missing wompi_hash header')
    return jsonResponse({ error: 'Missing signature' }, 401)
  }

  const isValidSignature = await verifyHmac(rawBody, receivedHash, env.WOMPI_API_SECRET)

  if (!isValidSignature) {
    console.warn('[webhook] Invalid HMAC signature — possible spoofed request')
    return jsonResponse({ error: 'Invalid signature' }, 401)
  }

  // ── Step 2: Parse webhook body ───────────────────────────────────────────
  let payload: WompiWebhookPayload
  try {
    payload = JSON.parse(rawBody)
  } catch {
    console.warn('[webhook] Failed to parse JSON body')
    return jsonResponse({ error: 'Invalid JSON' }, 400)
  }

  const txId     = payload?.IdTransaccion
  const status   = payload?.Estado
  const amount   = payload?.Monto

  if (!txId) {
    console.warn('[webhook] No IdTransaccion in payload')
    return jsonResponse({ error: 'No transaction ID' }, 400)
  }

  // Only process approved transactions
  if (status !== 'Aprobada') {
    console.log(`[webhook] Transaction ${txId} status: ${status} — ignoring`)
    return jsonResponse({ received: true })
  }

  // ── Step 3: Confirm with WOMPI REST API ───────────────────────────────────
  // Even with a valid HMAC, we verify directly with WOMPI to ensure the
  // transaction genuinely exists and is approved at their end.
  const txVerified = await confirmTransactionWithWompi(txId, env.WOMPI_API_KEY)

  if (!txVerified) {
    console.warn(`[webhook] WOMPI API could not confirm transaction ${txId}`)
    return jsonResponse({ error: 'Transaction not confirmed by WOMPI' }, 400)
  }

  // ── Step 4: Store in KV ───────────────────────────────────────────────────
  const kvValue = JSON.stringify({
    txId,
    status,
    amount,
    verifiedAt: new Date().toISOString(),
  })

  await env.PAID_TXS.put(`tx:${txId}`, kvValue, { expirationTtl: KV_TTL_SECONDS })

  console.log(`[webhook] ✓ Transaction ${txId} verified and stored`)
  return jsonResponse({ received: true })
}

// ── VERIFY HANDLER ───────────────────────────────────────────────────────────
async function handleVerify(
  txId: string,
  env: Env,
  origin: string,
): Promise<Response> {
  if (!txId || txId.length > 100) {
    return corsJson({ verified: false }, 400, env.ALLOWED_ORIGIN, origin)
  }

  const record = await env.PAID_TXS.get(`tx:${txId}`)

  if (!record) {
    return corsJson({ verified: false }, 200, env.ALLOWED_ORIGIN, origin)
  }

  const data = JSON.parse(record)
  return corsJson({ verified: true, ...data }, 200, env.ALLOWED_ORIGIN, origin)
}

// ── HMAC VERIFICATION ────────────────────────────────────────────────────────
// WOMPI SV spec: wompi_hash = HMAC-SHA256(rawBody, apiSecret)
async function verifyHmac(
  body:     string,
  received: string,
  secret:   string,
): Promise<boolean> {
  const encoder   = new TextEncoder()
  const keyData   = encoder.encode(secret)
  const bodyData  = encoder.encode(body)

  // Import the secret as a CryptoKey
  const cryptoKey = await crypto.subtle.importKey(
    'raw', keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )

  // Compute HMAC-SHA256
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, bodyData)

  // Convert to lowercase hex string
  const computed = Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  // Constant-time comparison to prevent timing attacks
  return constantTimeEqual(computed, received.toLowerCase())
}

// ── WOMPI REST API CONFIRMATION ──────────────────────────────────────────────
async function confirmTransactionWithWompi(
  txId:   string,
  apiKey: string,
): Promise<boolean> {
  try {
    const res = await fetch(`${WOMPI_API}/TransaccionCompra/${txId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
      },
    })

    if (!res.ok) {
      console.warn(`[wompi-api] Response ${res.status} for tx ${txId}`)
      return false
    }

    const data = await res.json() as WompiTransactionResponse
    return data?.Estado === 'Aprobada'
  } catch (err) {
    console.error('[wompi-api] Fetch error:', err)
    return false
  }
}

// ── CONSTANT-TIME STRING COMPARISON ─────────────────────────────────────────
// Prevents timing attacks where an attacker deduces the secret
// by measuring how long the comparison takes.
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

// ── HELPERS ──────────────────────────────────────────────────────────────────
function jsonResponse(body: object, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function corsJson(
  body:          object,
  status:        number,
  allowedOrigin: string,
  requestOrigin: string,
): Response {
  const origin = requestOrigin === allowedOrigin ? allowedOrigin : ''
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type':                'application/json',
      'Access-Control-Allow-Origin': origin,
    },
  })
}

function corsPreFlight(allowedOrigin: string): Response {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin':  allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

// ── TYPES ────────────────────────────────────────────────────────────────────
// Based on the WOMPI SV webhook payload structure
interface WompiWebhookPayload {
  IdTransaccion:            string
  Estado:                   'Aprobada' | 'Rechazada' | 'Anulada' | 'Error'
  Monto:                    number
  Moneda:                   string
  FechaCreacion:            string
  IdEnlaceComercio?:        string
  IdentificadorEnlace?:     string
  [key: string]: unknown
}

interface WompiTransactionResponse {
  IdTransaccion: string
  Estado:        string
  Monto:         number
  [key: string]: unknown
}
