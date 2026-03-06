import Link from 'next/link'
import { site } from '@/lib/config'

interface NavProps {
  backHref?: string
  backLabel?: string
  rightSlot?: React.ReactNode
  showCta?: boolean
}

export default function Nav({ backHref, backLabel, rightSlot, showCta = false }: NavProps) {
  return (
    <nav className="nav">
      <Link href="/" className="nav-logo">
        {site.name.split(' ')[0]} <em>{site.name.split(' ')[1]}</em>
      </Link>

      {/* Desktop links — home only */}
      {!backHref && (
        <ul className="nav-links mob-hide">
          <li><Link href="/#como-funciona">Cómo Funciona</Link></li>
          <li><Link href="/reservar">Reservar</Link></li>
          <li><Link href="/#sobre-mi">Sobre Mí</Link></li>
          <li><Link href="/#donar">Donar</Link></li>
        </ul>
      )}

      {/* Back link — inner pages */}
      {backHref && (
        <Link href={backHref} className="nav-back">
          ← {backLabel ?? 'Atrás'}
        </Link>
      )}

      {/* Right slot (e.g. package name on schedule page) */}
      {rightSlot && <div className="mob-hide" style={{ fontSize: '0.7rem', color: 'var(--text-soft)' }}>{rightSlot}</div>}

      {/* CTA button */}
      {showCta && (
        <Link href="/reservar" className="nav-cta">
          <span className="mob-hide">Consulta Gratis</span>
          <span className="mob-show" style={{ display: 'none' }}>Reservar</span>
        </Link>
      )}
      {!showCta && !backHref && (
        <Link href="/reservar" className="nav-cta">Reservar</Link>
      )}
    </nav>
  )
}
