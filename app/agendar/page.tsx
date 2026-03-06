'use client'
import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Script from 'next/script'
import Nav from '@/components/Nav'
import StepsIndicator from '@/components/StepsIndicator'
import { packages, calendly, type PackageId } from '@/lib/config'
import './agendar.css'

function AgendarContent() {
  const searchParams = useSearchParams()
  const [pkg, setPkg] = useState<PackageId | null>(null)

  useEffect(() => {
    const pkgId = searchParams.get('pkg') as PackageId | null
    setPkg(pkgId && pkgId in packages ? pkgId : null)
  }, [searchParams])

  const pkgData       = pkg ? packages[pkg] : null
  const calendlyReady = calendly.url !== 'https://calendly.com/TU_LINK'

  return (
    <>
      <div className="schedule-glow" />
      <main className="schedule-main">
        <StepsIndicator current={4} />
        <div className="schedule-header anim-fade-down delay-2">
          <div className="tag" style={{ justifyContent:'center' }}>Todo Listo</div>
          <h1 className="schedule-title">Agenda tu <em>primera sesión</em></h1>
          <p className="schedule-subtitle">Elige una fecha y hora abajo. Tu consejero se reunirá contigo en línea a la hora indicada.</p>
          {pkgData && (
            <div className="schedule-pill">✓ &nbsp; Pago confirmado · {pkgData.sesiones} sesiones listas para agendar</div>
          )}
        </div>
        <div className="calendly-wrap anim-fade-up delay-3">
          {calendlyReady ? (
            <>
              <div className="calendly-inline-widget" data-url={`${calendly.url}?hide_gdpr_banner=1&primary_color=9b6dd4`} />
              <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
            </>
          ) : (
            <div className="calendly-placeholder">
              <span className="placeholder-icon">🗓</span>
              <h3>Tu Calendario de Calendly</h3>
              <p>Configura <code>NEXT_PUBLIC_CALENDLY_URL</code> en Cloudflare Pages para activar el calendario.</p>
              <div className="placeholder-code">NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/tu-enlace</div>
            </div>
          )}
        </div>
        <div className="reassurance anim-fade-down delay-4">
          {[['🔒','Privado y seguro'],['📹','100% en línea'],['📧','Confirmación por correo'],['🙏','Consejería bíblica']].map(([icon,label]) => (
            <div key={label} className="reassurance-item"><span>{icon}</span>{label}</div>
          ))}
        </div>
      </main>
    </>
  )
}

export default function AgendarPage() {
  const [pkg, setPkg] = useState<PackageId | null>(null)
  const searchParams = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search)
    : null
  const pkgData = pkg ? packages[pkg] : null

  return (
    <>
      <Nav rightSlot={pkgData ? <span>Paquete: <strong style={{ color:'var(--lavender)' }}>{pkgData.nombre}</strong></span> : undefined} />
      <Suspense fallback={
        <main className="schedule-main" style={{ justifyContent:'center' }}>
          <p style={{ color:'var(--text-soft)', fontSize:'0.88rem' }}>Cargando...</p>
        </main>
      }>
        <AgendarContent />
      </Suspense>
    </>
  )
}
