'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import StepsIndicator from '@/components/StepsIndicator'
import { packages, type PackageId } from '@/lib/config'
import './confirmacion.css'

// Deployed Worker URL — add NEXT_PUBLIC_WORKER_URL to your Cloudflare Pages env vars
// e.g. https://graceful-word-webhook.YOUR_SUBDOMAIN.workers.dev
const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL ?? ''

type VerifyState = 'loading' | 'approved' | 'rejected' | 'error'

export default function ConfirmacionPage() {
  const searchParams = useSearchParams()
  const [state,  setState]  = useState<VerifyState>('loading')
  const [pkg,    setPkg]    = useState<PackageId | null>(null)
  const [txId,   setTxId]   = useState<string | null>(null)
  const [amount, setAmount] = useState<number | null>(null)

  useEffect(() => {
    const id    = searchParams.get('id')
    const pkgId = searchParams.get('pkg') as PackageId | null

    setPkg(pkgId && pkgId in packages ? pkgId : null)
    setTxId(id)

    if (!id) { setState('rejected'); return }

    async function verify() {
      try {
        // Worker not yet deployed → skip verification in local dev only
        if (!WORKER_URL) {
          console.warn('[confirmacion] NEXT_PUBLIC_WORKER_URL not set — skipping verification (dev only)')
          setState('approved')
          return
        }

        const res  = await fetch(`${WORKER_URL}/verify/${encodeURIComponent(id!)}`)
        if (!res.ok) { setState('error'); return }

        const data = await res.json() as { verified: boolean; amount?: number }

        if (data.verified) {
          if (data.amount) setAmount(data.amount)
          setState('approved')
        } else {
          setState('rejected')
        }
      } catch (err) {
        console.error('[confirmacion] Verification error:', err)
        setState('error')
      }
    }

    verify()
  }, [searchParams])

  const pkgData      = pkg ? packages[pkg] : null
  const scheduleHref = `/agendar?pkg=${pkg ?? ''}${txId ? `&tx=${txId}` : ''}`

  // ── LOADING ───────────────────────────────────────────────────────────────
  if (state === 'loading') {
    return (
      <>
        <Nav />
        <main className="confirm-main" style={{ justifyContent: 'center' }}>
          <div className="confirm-loading">
            <div className="loading-spinner" />
            <p style={{ fontSize: '0.88rem', color: 'var(--text-soft)', marginTop: '1rem' }}>
              Verificando tu pago...
            </p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Nav backHref="/reservar" backLabel="Paquetes" />
      <div className="confirm-glow" />

      <main className="confirm-main">
        <StepsIndicator current={state === 'approved' ? 3 : 1} />

        {/* ── APPROVED ─────────────────────────────────────────────────────── */}
        {state === 'approved' && (
          <div className="confirm-card anim-scale-in delay-2">
            <div className="check-circle">
              <svg viewBox="0 0 24 24" className="check-svg" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <div className="tag" style={{ justifyContent: 'center', marginBottom: '0.6rem' }}>
              Pago Exitoso
            </div>

            <h1 className="confirm-title">
              Estás un paso más cerca<br />de la <em>sanidad</em>
            </h1>

            <p className="confirm-body">
              Tu pago ha sido confirmado. Tus sesiones están reservadas —
              ahora elijamos un horario que funcione para ti.
            </p>

            <div className="receipt" style={{ marginBottom: '1.4rem' }}>
              <div className="receipt-row">
                <span className="label">Paquete</span>
                <span className="value">{pkgData?.nombre ?? 'Paquete de Consejería'}</span>
              </div>
              <div className="receipt-row">
                <span className="label">Sesiones</span>
                <span className="value">{pkgData ? `${pkgData.sesiones} Sesiones` : 'Confirmado'}</span>
              </div>
              {txId && (
                <div className="receipt-row">
                  <span className="label">ID de Transacción</span>
                  <span className="value" style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>{txId}</span>
                </div>
              )}
              <div className="receipt-row">
                <span className="label">Método de pago</span>
                <span className="value">WOMPI · USD</span>
              </div>
              <div className="receipt-row">
                <span className="label">Estado</span>
                <span className="value success">✦ Verificado</span>
              </div>
              <div className="receipt-row total">
                <span className="label">Total pagado</span>
                <span className="value">
                  {amount
                    ? `$${(amount / 100).toFixed(2)}`
                    : pkgData?.precioLabel ?? 'Pagado'}
                </span>
              </div>
            </div>

            <div className="next-box" style={{ marginBottom: '1.4rem' }}>
              <span style={{ fontSize: '1.7rem', flexShrink: 0 }}>🗓</span>
              <div>
                <h4>Siguiente: Agenda tu primera sesión</h4>
                <p>Haz clic abajo para abrir el calendario y elegir tu horario.</p>
              </div>
            </div>

            <Link href={scheduleHref} className="btn btn-primary btn-full" style={{ fontSize: '0.8rem' }}>
              Agendar Mi Primera Sesión →
            </Link>
            <p className="confirm-note">
              Recibirás un correo de confirmación después de agendar.
            </p>
          </div>
        )}

        {/* ── REJECTED ─────────────────────────────────────────────────────── */}
        {state === 'rejected' && (
          <div className="confirm-error">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h2>Pago no completado</h2>
            <p>No pudimos verificar tu pago. Puede que haya sido rechazado o el enlace no sea válido.</p>
            <Link href="/reservar" className="btn btn-outline" style={{ marginTop: '1.5rem' }}>
              ← Volver a Reservar
            </Link>
          </div>
        )}

        {/* ── ERROR ────────────────────────────────────────────────────────── */}
        {state === 'error' && (
          <div className="confirm-error">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔄</div>
            <h2>Error de verificación</h2>
            <p>Hubo un problema al verificar tu pago. Si ya fue cobrado, contáctanos.</p>
            {txId && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--lavender)' }}>
                ID: <code style={{ background: 'rgba(195,164,232,0.1)', padding: '0.1rem 0.4rem' }}>{txId}</code>
              </p>
            )}
            <a
              href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}?subject=Verificación de Pago&body=ID de transacción: ${txId ?? 'desconocido'}`}
              className="btn btn-outline"
              style={{ marginTop: '1.5rem' }}
            >
              Contactar Soporte
            </a>
          </div>
        )}
      </main>
    </>
  )
}
