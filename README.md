# Graceful Word — Sitio Web de Consejería Bíblica

Sitio Next.js 14 con flujo de pago WOMPI, agendamiento Calendly y deploy en Cloudflare Pages.

---

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno y completar con tus valores
cp .env.example .env.local

# 3. Correr localmente
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Variables de Entorno

Todas las configuraciones están en `.env.local` (local) y en Cloudflare Pages (producción).
**Nunca subas `.env.local` a GitHub.**

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SITE_NAME` | Nombre del sitio / marca |
| `NEXT_PUBLIC_SITE_URL` | URL de producción (ej: `https://gracefulword.com`) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Correo de contacto |
| `NEXT_PUBLIC_WOMPI_PUBLIC_KEY` | Llave pública de WOMPI |
| `NEXT_PUBLIC_WOMPI_LINK_STARTER` | Link de pago WOMPI — Paquete Inicial ($75) |
| `NEXT_PUBLIC_WOMPI_LINK_FULL` | Link de pago WOMPI — Paquete Completo ($100) |
| `NEXT_PUBLIC_CALENDLY_URL` | URL de Calendly (ej: `https://calendly.com/tu-nombre/sesion`) |
| `NEXT_PUBLIC_PKG_STARTER_PRICE` | Precio paquete inicial (default: 75) |
| `NEXT_PUBLIC_PKG_STARTER_SESSIONS` | Sesiones paquete inicial (default: 2) |
| `NEXT_PUBLIC_PKG_FULL_PRICE` | Precio paquete completo (default: 100) |
| `NEXT_PUBLIC_PKG_FULL_SESSIONS` | Sesiones paquete completo (default: 4) |

---

## 💳 Configurar WOMPI

1. Inicia sesión en tu [dashboard de WOMPI](https://wompi.sv)
2. Ve a **Desarrollador → Links de Pago**
3. Crea dos links de pago:
   - **Inicial** — $75 USD, nombre: "Paquete Inicial de Consejería"
   - **Completo** — $100 USD, nombre: "Paquete Completo de Consejería"
4. En cada link, configura la **URL de redirección**:
   ```
   https://tu-dominio.com/confirmacion
   ```
   *(WOMPI agregará automáticamente `?status=APPROVED&id=TX_ID`)*
5. Copia cada URL de pago en tu `.env.local`

> **Importante:** Antes de lanzar en producción, elimina la línea con `|| status === null` en `app/confirmacion/page.tsx`. Ese fallback solo existe para pruebas locales.

---

## 🗓 Configurar Calendly

1. Crea una cuenta en [Calendly](https://calendly.com)
2. Crea un tipo de evento: **"Sesión de Consejería Bíblica"** (50 min, en línea)
3. Copia tu link (ej: `https://calendly.com/tu-nombre/sesion`)
4. Pégalo como `NEXT_PUBLIC_CALENDLY_URL` en `.env.local`

---

## ☁️ Deploy en Cloudflare Pages

### Paso 1 — Subir a GitHub
```bash
git init
git add .
git commit -m "Initial commit — Graceful Word"
git remote add origin https://github.com/TU_USUARIO/graceful-word.git
git push -u origin main
```

### Paso 2 — Conectar Cloudflare Pages
1. Inicia sesión en [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Ve a **Workers & Pages → Create → Pages → Connect to Git**
3. Selecciona tu repositorio de GitHub
4. Configura el build:
   - **Framework preset:** Next.js (Static HTML Export)
   - **Build command:** `npm run build`
   - **Build output directory:** `out`
5. Haz clic en **Save and Deploy**

### Paso 3 — Agregar Variables de Entorno en Cloudflare
1. Ve a tu proyecto Pages → **Settings → Environment Variables**
2. Agrega todas las variables de `.env.example` con tus valores reales
3. Activa un nuevo deploy

### Paso 4 — Dominio Personalizado (opcional)
1. En tu proyecto Pages → **Custom Domains → Add**
2. Ingresa tu dominio y sigue las instrucciones de DNS

---

## 📁 Estructura del Proyecto

```
graceful-word/
├── app/
│   ├── layout.tsx          # Layout raíz + fuentes Google
│   ├── page.tsx            # Página de inicio
│   ├── home.css            # Estilos del home
│   ├── globals.css         # Tokens de diseño + estilos globales
│   ├── reservar/
│   │   ├── page.tsx        # Selección de paquete → WOMPI
│   │   └── reservar.css
│   ├── confirmacion/
│   │   ├── page.tsx        # Confirmación de pago
│   │   └── confirmacion.css
│   └── agendar/
│       ├── page.tsx        # Embed de Calendly
│       └── agendar.css
├── components/
│   ├── Nav.tsx             # Navegación compartida
│   └── StepsIndicator.tsx  # Barra de progreso de 4 pasos
├── lib/
│   └── config.ts           # Todas las variables en un solo lugar
├── .env.example            # Plantilla — copiar como .env.local
├── .gitignore
├── next.config.js          # Exportación estática para Cloudflare
└── README.md
```

---

## 🔄 Flujo de Reserva

```
/reservar → WOMPI → /confirmacion?status=APPROVED&id=TX&pkg=full → /agendar
```

---

## 🛠 Tips para Desarrollo Local

- `npm run dev` — servidor con hot reload
- Para probar confirmación localmente: `/confirmacion?pkg=full`
- Para probar agendamiento: `/agendar?pkg=full`
- El calendario de Calendly aparece automáticamente cuando `NEXT_PUBLIC_CALENDLY_URL` está configurado

---

## ✏️ Personalización

| Qué cambiar | Dónde |
|---|---|
| Nombre del consejero, bio, foto | `app/page.tsx` — sección `#sobre-mi` |
| Versículo del hero | `app/page.tsx` — sección `.verse-card` |
| Precios y sesiones | `.env.local` → `NEXT_PUBLIC_PKG_*` |
| Colores del tema | `app/globals.css` → `:root { --violet, --lavender... }` |
| Nombre del sitio | `.env.local` → `NEXT_PUBLIC_SITE_NAME` |
