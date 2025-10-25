# Chat App con Next.js + PartyKit + Tailwind

Aplicación de chat en tiempo real construida con tecnologías modernas.

## Tecnologías

- **Next.js 16** - Framework de React para el frontend
- **PartyKit** - Servidor WebSocket para comunicación en tiempo real
- **Tailwind CSS** - Estilos con tema cyberpunk/neon
- **TypeScript** - Tipado estático
- **PartyKit Storage** - Persistencia de mensajes

## Características

- Mensajería en tiempo real
- Indicador de "usuario escribiendo"
- Historial persistente de mensajes (últimos 100 en memoria)
- Diseño responsive con tema cyberpunk
- Auto-scroll a nuevos mensajes
- Sincronización entre múltiples clientes

## Instalación

```bash
# Ya tienes las dependencias instaladas
npm install
```

## Ejecutar en desarrollo

Necesitas ejecutar dos procesos en paralelo:

### 1. Servidor PartyKit (Terminal 1)

```bash
npx partykit dev
```

Esto iniciará el servidor WebSocket en `localhost:1999`

### 2. Aplicación Next.js (Terminal 2)

```bash
npm run dev
```

Esto iniciará la aplicación en `http://localhost:3000`

## Estructura del proyecto

```
chat-nextjs/
├── app/
│   ├── components/
│   │   └── ChatClient.tsx    # Componente principal del chat
│   ├── globals.css           # Estilos globales
│   ├── layout.tsx            # Layout de Next.js
│   └── page.tsx              # Página principal
├── party/
│   └── chatServer.ts         # Servidor PartyKit
├── partykit.json             # Configuración de PartyKit
└── .env.local                # Variables de entorno
```

## Configuración

El archivo `.env.local` contiene:

```env
NEXT_PUBLIC_PARTYKIT_HOST=localhost:1999
```

Para producción, cambia esto a tu URL de PartyKit desplegada.

## Despliegue

### Desplegar PartyKit

```bash
npx partykit deploy
```

Esto te dará una URL como `tu-proyecto.partykit.dev`

### Desplegar Next.js en Vercel

1. Actualiza `NEXT_PUBLIC_PARTYKIT_HOST` en Vercel con tu URL de PartyKit
2. Despliega normalmente en Vercel

## Funcionalidades implementadas

- ✅ Conexión WebSocket con PartyKit
- ✅ Envío y recepción de mensajes en tiempo real
- ✅ Persistencia de mensajes con PartyKit Storage
- ✅ Indicador de escritura
- ✅ Historial de mensajes al conectarse
- ✅ Diseño cyberpunk con Tailwind CSS
- ✅ Responsive design
- ✅ Auto-scroll a nuevos mensajes

## Diferencias con la versión anterior

**Versión anterior (Express + Socket.IO):**
- Backend: Node.js + Express
- WebSocket: Socket.IO
- Base de datos: MongoDB
- Plantillas: EJS
- CSS vanilla

**Nueva versión (Next.js + PartyKit):**
- Frontend: Next.js + React
- WebSocket: PartyKit
- Persistencia: PartyKit Storage
- UI: React + Tailwind CSS
- TypeScript
- Más moderno, escalable y fácil de desplegar

## Scripts disponibles

```bash
npm run dev        # Ejecutar Next.js en desarrollo
npm run build      # Build para producción
npm run start      # Ejecutar en producción
npm run lint       # Ejecutar ESLint
```

Para PartyKit:
```bash
npx partykit dev       # Ejecutar PartyKit en desarrollo
npx partykit deploy    # Desplegar PartyKit
```
