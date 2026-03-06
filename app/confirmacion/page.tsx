'use client'
import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import StepsIndicator from '@/components/StepsIndicator'
import { packages, type PackageId } from '@/lib/config'
import './confirmacion.css'

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL ?? ''
type VerifyState = 'loading' | 'approved' | 'rejected' | 'error'

function ConfirmacionContent() {
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
        if (!WORKER_URL) { setState('approved'); return }
        const res  = await fetch(`${WORKER_URL}/verify/${encodeURIComponent(id!)}`)
        if (!res.ok) { setState('error'); return }
        const data = await res.json() as { verified: boolean; amount?: number }
        if (data.verified) { if (data.amount) setAmount(data.amount); setState('approved') }
        else setState('rejected')
      } catch { setState('error') }
    }
    verify()
  }, [searchParams])

  const pkgData      = pkg ? packages[pkg] : null
  const scheduleHref = `/agendar?pkg=${pkg ?? ''}${txId ? `&tx=${txId}` : ''}`

  if (state === 'loading') return (
    <main className="confirm-main" style={{ justifyContent:'center' }}>
      <div className="confirm-loading">
        <div className="loading-spinner" />
        <p style={{ fontSize:'0.88rem', color:'var(--text-soft)', marginTop:'1rem' }}>Verificando tu pago...</p>
      </div>
    </main>
  )

  return (
    <>
      <div className="confirm-glow" />
      <main className="confirm-main">
        <StepsIndicator current={state === 'approved' ? 3 : 1} />
        {state === 'approved' && (
          <div className="confirm-card anim-scale-in delay-2">
            <div className="check-circle">
              <svg viewBox="0 0 24 24" className="check-svg" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div className="tag" style={{ justifyContent:'center', marginBottom:'0.6rem' }}>Pago Exitoso</div>
            <h1 cla
