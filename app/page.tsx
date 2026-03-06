import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import { site } from '@/lib/config'
import './home.css'

export const metadata: Metadata = { title: 'Inicio' }

export default function HomePage() {
  return (
    <>
      <Nav showCta />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="hero-section">
        {/* Ambient glows */}
        <div className="hero-glow-right" />
        <div className="hero-glow-left" />

        {/* Text column */}
        <div className="hero-text">
          <div className="tag anim-fade-down delay-1">
            Consejería Bíblica · Sesiones en Línea
          </div>

          <h1 className="hero-title anim-fade-down delay-2">
            Encuentra <em>sanidad</em><br />
            a través<br />
            de la Palabra
          </h1>

          <p className="hero-body anim-fade-down delay-3">
            Un espacio seguro y compasivo para quienes buscan orientación,
            restauración y esperanza renovada — arraigado en las Escrituras
            y ofrecido completamente en línea.
          </p>

          <div className="hero-actions anim-fade-down delay-4">
            <Link href="/reservar" className="btn btn-primary btn-mob-full">
              Reservar una Sesión
            </Link>
            <Link href="#donar" className="hero-ghost">
              Patrocinar a Alguien →
            </Link>
          </div>

          <div className="hero-trust anim-fade-down delay-5">
            <span>✦ 100% en Línea</span>
            <span>✦ Centrado en la Biblia</span>
            <span>✦ 1ª Consulta Gratis</span>
          </div>
        </div>

        {/* Verse card column */}
        <div className="hero-visual anim-fade-up delay-3">
          <div className="verse-card">
            <p className="verse-text">
              "Venid a mí todos los que estáis trabajados y cargados,
              y yo os haré descansar."
            </p>
            <div className="verse-ref">Mateo 11:28</div>
          </div>

          <div className="stat-row">
            {[
              ['5+',     'Años sirviendo'],
              ['100%',   'En línea'],
              ['Gratis', '1ª consulta'],
            ].map(([n, l]) => (
              <div key={l} className="stat-box">
                <span className="stat-num">{n}</span>
                <span className="stat-label">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ORNAMENT ──────────────────────────────────────────── */}
      <div className="ornament">✦ &nbsp; ✦ &nbsp; ✦</div>

      {/* ── CÓMO FUNCIONA ─────────────────────────────────────── */}
      <section className="section" id="como-funciona" style={{ background: 'var(--deep2)' }}>
        <div className="container">
          <div className="how-intro">
            <div className="tag">El Proceso</div>
            <h2 className="section-title">
              Cómo <em>funciona</em>
            </h2>
            <p className="section-body">
              Un camino sencillo y amoroso hacia la sanidad — sin formularios complicados,
              sin salas de espera. Solo tú, un consejero compasivo y la Palabra de Dios.
            </p>
          </div>

          <div className="how-steps">
            {[
              ['1', 'Reserva una Consulta Gratuita',   'Elige un horario en nuestro calendario. 15 minutos, sin compromiso.'],
              ['2', 'Recibe un Plan Personalizado',     'Tu consejero escuchará, orará y creará un camino arraigado en las Escrituras.'],
              ['3', 'Inicia tus Sesiones en Línea',     'Reúnete por video desde la comodidad de tu hogar, a tu propio ritmo.'],
              ['4', 'Camina con Esperanza Renovada',    'Experimenta sanidad, claridad y fortaleza a través de la sabiduría bíblica.'],
            ].map(([n, title, body]) => (
              <div key={n} className="how-step">
                <div className="how-step-num">{n}</div>
                <div>
                  <div className="how-step-title">{title}</div>
                  <p className="how-step-body">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOBRE MÍ ──────────────────────────────────────────── */}
      <section
        className="section"
        id="sobre-mi"
        style={{ background: 'linear-gradient(160deg, var(--plum) 0%, var(--deep2) 100%)' }}
      >
        <div className="container">
          <div className="grid-2">
            {/* Visual side */}
            <div className="about-visual">
              <div className="about-photo">🙏</div>
              <div className="grid-2-auto">
                {[
                  ['5+',     'Años de ministerio'],
                  ['100%',   'Sesiones en línea'],
                  ['Biblia', 'Enfoque central'],
                  ['Seguro', 'Confidencial'],
                ].map(([h, p]) => (
                  <div key={h} className="credential">
                    <div className="credential-h">{h}</div>
                    <div className="credential-p">{p}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Text side */}
            <div>
              <div className="tag">El Consejero</div>
              <h2 className="section-title">
                Un llamado<br />a <em>servir</em>
              </h2>
              <p className="section-body" style={{ marginBottom: '2rem' }}>
                [Nombre del Consejero] ha dedicado su vida a ayudar a personas a navegar
                el dolor, las pérdidas, las relaciones y las luchas espirituales a través
                del poder transformador de la Palabra de Dios.
                <br /><br />
                Con formación en consejería bíblica y un corazón compasivo, cada sesión
                se aborda con oración, cuidado y profundo respeto por el camino único
                de cada persona.
              </p>
              <Link href="/reservar" className="btn btn-primary btn-mob-full">
                Reservar Consulta Gratis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── DONAR ─────────────────────────────────────────────── */}
      <section className="section" id="donar">
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div className="tag" style={{ justifyContent: 'center' }}>Dar Esperanza</div>
          <h2 className="section-title">
            Patrocina una <em>sesión</em>
          </h2>
          <p className="section-body" style={{ margin: '0 auto 1.4rem', textAlign: 'center' }}>
            ¿Conoces a alguien que necesita consejería pero no puede costearla?
            Regálale sesiones como un acto de amor — tu donación cubre el costo directamente.
          </p>

          <div className="verse-strip">
            <p>"Sobrellevad los unos las cargas de los otros, y cumplid así la ley de Cristo."</p>
            <span>Gálatas 6:2</span>
          </div>

          <div className="grid-3 donate-grid">
            {[
              { amt: '$35',  label: 'Una Sesión',      desc: 'Cubre una sesión de consejería de 50 min para alguien con una carga pesada.', icon: '🕊', featured: false },
              { amt: '$100', label: '3 Sesiones',      desc: 'Tres sesiones para comenzar un camino de sanidad duradero y significativo.',  icon: '✨', featured: true  },
              { amt: '$200', label: 'Paquete Completo', desc: 'Patrocina 6 sesiones completas de consejería para alguien que amas.',          icon: '🙏', featured: false },
            ].map(d => (
              <div key={d.label} className={`donate-card${d.featured ? ' featured' : ''}`}>
                {d.featured && <div className="featured-badge">Más Impacto</div>}
                <span className="donate-icon">{d.icon}</span>
                <div className="donate-amt">{d.amt}</div>
                <div className="donate-label">{d.label}</div>
                <div style={{ width: 22, height: 1, background: 'rgba(195,164,232,0.2)' }} />
                <p className="donate-desc">{d.desc}</p>
                <a
                  href={`mailto:${site.email}?subject=Donación - ${d.label}`}
                  className="btn btn-outline"
                  style={{ marginTop: '0.5rem', fontSize: '0.68rem' }}
                >
                  Donar Ahora
                </a>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '0.72rem', color: 'var(--text-soft)' }}>
            🔒 Pagos procesados de forma segura vía PayPal o Stripe
          </p>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer className="footer">
        <div className="footer-logo">
          {site.name.split(' ')[0]} <em>{site.name.split(' ')[1]}</em>
        </div>
        <ul className="footer-links">
          <li><Link href="/#como-funciona">Cómo Funciona</Link></li>
          <li><Link href="/reservar">Reservar</Link></li>
          <li><Link href="/#sobre-mi">Sobre Mí</Link></li>
          <li><Link href="/#donar">Donar</Link></li>
        </ul>
        <div className="footer-copy">© {new Date().getFullYear()} {site.name}</div>
      </footer>
    </>
  )
}
