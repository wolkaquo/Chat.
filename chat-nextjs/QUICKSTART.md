# Inicio Rápido

## Opción 1: Ejecutar todo con un solo comando

```bash
npm run dev:all
```

Esto ejecutará tanto el servidor PartyKit (puerto 1999) como Next.js (puerto 3000) simultáneamente.

## Opción 2: Ejecutar en terminales separadas

**Terminal 1 - PartyKit:**
```bash
npm run dev:party
```

**Terminal 2 - Next.js:**
```bash
npm run dev
```

## Acceder a la aplicación

Abre tu navegador en: **http://localhost:3000**

## Probar el chat

1. Abre la aplicación en múltiples pestañas o navegadores
2. Ingresa diferentes nombres de usuario en cada pestaña
3. Envía mensajes y observa cómo se sincronizan en tiempo real
4. Escribe en el campo de mensaje y observa el indicador "usuario está escribiendo..."

## Comandos útiles

```bash
npm run dev:all      # Ejecutar PartyKit + Next.js
npm run dev:party    # Solo PartyKit
npm run dev          # Solo Next.js
npm run build        # Build para producción
npm run lint         # Ejecutar linter
npm run party:deploy # Desplegar PartyKit
```

## Solución de problemas

**Si el puerto 3000 ya está en uso:**
```bash
# Next.js usará automáticamente el puerto 3001
```

**Si el puerto 1999 ya está en uso:**
```bash
# Mata el proceso en el puerto 1999
lsof -ti:1999 | xargs kill -9
```

**Error de conexión PartyKit:**
- Verifica que PartyKit esté corriendo en el puerto 1999
- Revisa que `.env.local` tenga: `NEXT_PUBLIC_PARTYKIT_HOST=localhost:1999`
