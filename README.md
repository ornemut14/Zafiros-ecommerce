# Joyería Zafiros — E-commerce

Tienda de joystickas con React (Vite) en el frontend y una API serverless en Node.js.
Todo se despliega en **Vercel** contra una base de datos **Postgres** (Neon o Supabase).

## Por qué el backend ya no es PHP

El proyecto original usaba PHP + MySQL en InfinityFree. Se migró porque el hosting
gratuito de InfinityFree tiene una protección anti-bot obligatoria que **no se puede
desactivar**: devuelve una página con `aes.js` en vez de la respuesta de la API cuando
la llamada viene de otro dominio. Una tienda en Vercel le pide los productos a
`zafirosjoyas.site.je` desde un origen distinto, así que siempre recibía HTML en lugar
de JSON y el catálogo nunca cargaba.

La carpeta `backend-php/` se conserva a propósito como referencia del código anterior.
No la uses ni la subas a ningún hosting.

## Estructura

```
frontend/
  api/                 -> funciones serverless (Vercel los despliega como /api/*)
    _lib/              -> db (pool de Postgres), jwt, helpers HTTP/CORS
    auth.js            -> POST   login del admin
    categories.js      -> GET/POST/PUT/DELETE  categorías
    products.js        -> GET/POST/PUT/DELETE/PATCH  productos
    config.js          -> GET/PUT  número de WhatsApp
    db/schema.sql      -> estructura de tablas (Postgres)
    db/seed-produccion.sql -> datos reales migrados desde MySQL
  scripts/
    mysql-to-postgres.mjs  -> convierte un dump de phpMyAdmin a Postgres
    test-api.mjs           -> 27 pruebas contra la API
  src/                 -> aplicación React
```

## 1. Base de datos

Creá una base en [Neon](https://neon.tech) o [Supabase](https://supabase.com) (ambos
tienen plan gratuito) y ejecutá en el editor SQL, en este orden:

1. `frontend/api/db/schema.sql` — crea las tablas
2. `frontend/api/db/seed-produccion.sql` — carga los 65 productos reales

Copiá la **connection string** que te dan. La vas a necesitar como `DATABASE_URL`.

## 2. Deploy en Vercel

1. Importá el repositorio en Vercel
2. **Root Directory = `frontend`** ← obligatorio
3. Framework: se detecta solo como Vite
4. Cargá las variables de entorno (Settings → Environment Variables):

| Variable | Dónde | Valor |
|---|---|---|
| `DATABASE_URL` | Solo servidor | la connection string de Neon/Supabase |
| `JWT_SECRET` | Solo servidor | una frase larga y secreta que inventes |
| `VITE_CLOUDINARY_CLOUD_NAME` | Frontend y servidor | `rawwtykh` |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Frontend y servidor | `uqa8a7zk` |
| `VITE_API_URL` | Frontend | **vacío** — la API está en el mismo dominio |

`VITE_API_URL` se deja vacío a propósito: como la API y la tienda se sirven desde el
mismo dominio de Vercel, las rutas `/api/*` son relativas y no hay CORS que negociar.

## Desarrollo local

```bash
cd frontend
npm install
npm run dev          # vercel dev: sirve la app y las funciones a la vez
```

Requiere `DATABASE_URL` y `JWT_SECRET` en un `.env` local. Para probar la API sin
levantar Vercel:

```bash
node scripts/test-api.mjs
```

## Flujo de uso

1. El cliente navega el catálogo por categoría.
2. Entra como admin y configura su número de WhatsApp.
3. Carga categorías y productos; las fotos se suben directo a Cloudinary desde el
   navegador y solo se guarda la URL en la base.
4. El cliente arma el carrito y manda el pedido por WhatsApp.
5. El admin descuenta el stock manualmente al confirmar el pago.
6. Un producto con stock 0 desaparece del catálogo público, pero sigue visible en el panel.

## Notas de seguridad

- `DATABASE_URL` y `JWT_SECRET` solo viven en el panel de Vercel. Nunca en git.
- El token de sesión es un JWT HS256 que expira a las 8 horas.
- Las contraseñas se guardan como hash bcrypt.
- Para producción conviene restringir el CORS a tu dominio en vez de `*`.