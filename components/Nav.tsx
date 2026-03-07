'use client'
import { useState } from 'react'
import Link from 'next/link'
import { site } from '@/lib/config'

interface NavProps {
  backHref?: string
  backLabel?: string
  rightSlot?: React.ReactNode
  showCta?: boolean
}

export default function Nav({ backHref, backLabel, rightSlot, showCta = false }: NavProps) {
  const [open, setOpen] = useState(false)

  const isHome = !backHref

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo" onClick={() => setOpen(false)}>
          {site.name.split(' ')[0]} <em>{site.name.split(' ')[1]}</em>
        </Link>

        {isHome && (
          <ul className="nav-links">
            <li><Link href="/#como-funciona">Cómo Funciona</Link></li>
            <li><Link href="/reservar">Reservar</Link></li>
            <li><Link href="/#sobre-mi">Sobre Mí</Link></li>
            <li><Link href="/#donar">Donar</Link></li>
          </ul>
        )}

        {backHref && (
          <Link href={backHref} className="nav-back mob-hide">
            ← {backLabel ?? 'Atrás'}
          </Link>
        )}

        {rightSlot && (
          <div className="mob-hide" style={{ fontSize: '0.7rem', color: 'var(--text-soft)' }}>
            {rightSlot}
          </div>
        )}

        {isHome && (
          <Link href="/reservar" className="nav-cta mob-hide">
            Consulta Gratis
          </Link>
        )}

        <button
          className="nav-hamburger"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
        >
          <span className={`ham-line${open ? ' open' : ''}`} />
          <span className={`ham-line${open ? ' open' : ''}`} />
          <span className={`ham-line${open ? ' open' : ''}`} />
        </button>
      </nav>

      <div className={`nav-drawer${open ? ' nav-drawer-open' : ''}`}>
        {isHome ? (
          <>
            <Link href="/#como-funciona" className="drawer-link" onClick={() => setOpen(false)}>Cómo Funciona</Link>
            <Link href="/reservar"       className="drawer-link" onClick={() => setOpen(false)}>Reservar</Link>
            <Link href="/#sobre-mi"      className="drawer-link" onClick={() => setOpen(false)}>Sobre Mí</Link>
            <Link href="/#donar"         className="drawer-link" onClick={() => setOpen(false)}>Donar</Link>
            <Link href="/reservar"       className="drawer-cta"  onClick={() => setOpen(false)}>Consulta Gratis</Link>
          </>
        ) : (
          <>
            <Link href={backHref ?? '/'} className="drawer-link" onClick={() => setOpen(false)}>
              ← {backLabel ?? 'Atrás'}
            </Link>
            <Link href="/" className="drawer-link" onClick={() => setOpen(false)}>Inicio</Link>
          </>
        )}
      </div>

      {open && <div className="nav-backdrop" onClick={() => setOpen(false)} />}

      <style>{`
        .nav-hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 36px;
          height: 36px;
          background: none;
          border: 1px solid rgba(195,164,232,0.25);
          cursor: pointer;
          padding: 8px;
          flex-shrink: 0;
        }
        .ham-line {
          display: block;
          width: 100%;
          height: 1.5px;
          background: var(--lavender);
          transition: all 0.25s ease;
          transform-origin: center;
        }
        .ham-line.open:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .ham-line.open:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .ham-line.open:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        .nav-drawer {
          position: fixed;
          top: 57px;
          left: 0; right: 0;
          z-index: 190;
          background: rgba(26,13,46,0.98);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(195,164,232,0.12);
          display: flex;
          flex-direction: column;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s ease, padding 0.35s ease;
        }
        .nav-drawer.nav-drawer-open {
          max-height: 400px;
          padding: 1rem 0 1.4rem;
        }
        .drawer-link {
          display: block;
          padding: 0.85rem 1.8rem;
          font-size: 0.78rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-soft);
          transition: color 0.2s, background 0.2s;
          border-bottom: 1px solid rgba(195,164,232,0.06);
        }
        .drawer-link:hover { color: var(--lavender); background: rgba(195,164,232,0.04); }
        .drawer-cta {
          display: block;
          margin: 1rem 1.8rem 0;
          padding: 0.85rem;
          text-align: center;
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--lavender);
          border: 1px solid rgba(195,164,232,0.35);
          transition: all 0.25s;
        }
        .drawer-cta:hover { background: var(--lavender); color: var(--deep); }

        .nav-backdrop {
          position: fixed;
          inset: 0;
          z-index: 180;
          background: rgba(0,0,0,0.4);
        }

        @media (max-width: 768px) {
          .nav-hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-drawer   { display: none !important; }
          .nav-backdrop { display: none !important; }
        }
      `}</style>
    </>
  )
}
