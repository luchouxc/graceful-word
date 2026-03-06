// ─────────────────────────────────────────────────────────────
// lib/config.ts
// Fuente única de configuración. Todos los valores vienen de
// variables de entorno (.env.local en local,
// Cloudflare Pages env vars en producción).
// ─────────────────────────────────────────────────────────────

export const site = {
  name:  process.env.NEXT_PUBLIC_SITE_NAME  ?? 'Graceful Word',
  url:   process.env.NEXT_PUBLIC_SITE_URL   ?? 'http://localhost:3000',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'hola@gracefulword.com',
}

export const wompi = {
  publicKey:    process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY    ?? '',
  linkStarter:  process.env.NEXT_PUBLIC_WOMPI_LINK_STARTER  ?? '#',
  linkFull:     process.env.NEXT_PUBLIC_WOMPI_LINK_FULL     ?? '#',
}

export const calendly = {
  url: process.env.NEXT_PUBLIC_CALENDLY_URL ?? 'https://calendly.com/TU_LINK',
}

const starterPrice    = Number(process.env.NEXT_PUBLIC_PKG_STARTER_PRICE    ?? 75)
const starterSessions = Number(process.env.NEXT_PUBLIC_PKG_STARTER_SESSIONS ?? 2)
const fullPrice       = Number(process.env.NEXT_PUBLIC_PKG_FULL_PRICE       ?? 100)
const fullSessions    = Number(process.env.NEXT_PUBLIC_PKG_FULL_SESSIONS    ?? 4)

export const packages = {
  starter: {
    id:           'starter' as const,
    nombre:       'Paquete Inicial',
    icon:         '🕊',
    popular:      false,
    sesiones:     starterSessions,
    precio:       starterPrice,
    precioLabel:  `$${starterPrice}`,
    porSesion:    `$${Math.round(starterPrice / starterSessions)} por sesión`,
    beneficios: [
      `${starterSessions} × sesiones en línea de 50 min`,
      'Orientación bíblica personalizada',
      'Agenda a tu propio ritmo',
      'Sesiones de video seguras',
    ],
  },
  full: {
    id:           'full' as const,
    nombre:       'Paquete Completo',
    icon:         '✨',
    popular:      true,
    sesiones:     fullSessions,
    precio:       fullPrice,
    precioLabel:  `$${fullPrice}`,
    porSesion:    `$${Math.round(fullPrice / fullSessions)} por sesión`,
    beneficios: [
      `${fullSessions} × sesiones en línea de 50 min`,
      'Consejería bíblica profunda',
      'Horario flexible',
      'Sesiones de video seguras',
      'Seguimiento entre sesiones',
    ],
  },
} as const

export type PackageId = keyof typeof packages
