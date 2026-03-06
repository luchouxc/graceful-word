'use client'
import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import StepsIndicator from '@/components/StepsIndicator'
import { packages, wompi, site, type PackageId } from '@/lib/config'
import './reservar.css'

export default function ReservarPage() {
  const [selected, setSelected] = useState<PackageId | null>(null)

  function handlePago() {
    if (!selected) return
    const redirectUrl = encodeURIComponent(`${site.url}/confirmacion?pkg=${selected}`)
    const link = selected === 'starter' ? wompi.linkStarter : wompi.linkFull
    window.location.href = `${link}?redirect_url=${redirectUrl}`
  }

  return (
    <>
      <Nav backHref="/" backLabel="Inicio" />
      <div className="page-glow" />

      <main className="booking-main">
        {/* Header */}
        <div className="booking-header">
          <div className="tag" style={{ justifyContent: 'center' }}>Reservar una Sesión</div>
          <h1 className="booking-title">
            Elige tu <em>paquete</em>
          </h1>
          <p className="booking-subtitle">
            Selecciona el plan que mejor se adapte a ti.
            Todas las sesiones son completamente en línea.
          </p>
        </div>

        <StepsIndicator current={1} />

        {/* Package cards */}
        <div className="pkg-grid">
          {(Object.values(packages) as typeof packages[PackageId][]).map((pkg) => {
            const active = selected === pkg.id
            return (
              <button
                key={pkg.id}
                className={`pkg-card${active ? ' selected' : ''}`}
                onClick={() => setSelected(pkg.id as PackageId)}
                aria-pressed={active}
              >
                {pkg.popular && <div className="badge-popular">Mejor Valor</div>}

                <div className={`pkg-check${active ? ' pkg-check-active' : ''}`}>✓</div>

                <span className="pkg-icon">{pkg.icon}</span>
                <div className="pkg-name">{pkg.nombre}</div>
                <div className="pkg-sessions">{pkg.sesiones} Sesiones de Consejería</div>

                <div className="pkg-price">
                  <sup>$</sup>{pkg.precio}
                </div>
                <div className="pkg-per">{pkg.porSesion}</div>

                <div className="divider" />

                <ul className="pkg-features">
                  {pkg.beneficios.map(b => (
                    <li key={b}>
                      <span className="feature-dot">✦</span>{b}
                    </li>
                  ))}
                </ul>
              </button>
            )
          })}
        </div>

        {/* Selection summary */}
        {selected && (
          <div className="selection-summary">
            <div className="summary-text">
              Seleccionado:{' '}
              <strong>{packages[selected].nombre} — {packages[selected].sesiones} Sesiones</strong>
            </div>
            <div className="summary-price">{packages[selected].precioLabel}</div>
          </div>
        )}

        {/* CTA */}
        <div className="booking-cta">
          <button
            className="btn btn-primary btn-mob-full"
            disabled={!selected}
            onClick={handlePago}
            style={{ padding: '1rem 3rem', fontSize: '0.82rem' }}
          >
            Proceder al Pago →
          </button>
          <p className="cta-note">🔒 Pago seguro vía WOMPI · USD · El Salvador</p>
        </div>
      </main>
    </>
  )
}
