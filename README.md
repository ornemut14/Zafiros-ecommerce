# Joyería Lumière — E-commerce

Proyecto compuesto por:
- **backend-php/**: API en PHP puro (sin frameworks) + MySQL, pensada para funcionar en cualquier hosting compartido con cPanel/phpMyAdmin
- **frontend/**: React (Vite)

## 1. Base de datos (MySQL)

**Con phpMyAdmin (hosting compartido o XAMPP/MAMP local):**
1. Creá una base de datos llamada `joyeria` (o el nombre que prefieras)
2. Entrá a la pestaña **SQL** de phpMyAdmin sobre esa base
3. Pegá el contenido completo de `backend-php/db/schema.sql` y ejecutalo

Esto crea las tablas `categories`, `products`, `admins`, `store_config` y precarga categorías básicas (Anillos, Collares, Aros, Pulseras).

## 2. Backend PHP

Este zip ya incluye `backend-php/config/config.php` completo y listo para **XAMPP local** (usuario `root`, sin contraseña). Si usás otro hosting o contraseña de MySQL distinta, editá ese archivo con tus datos reales:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'joyeria');
   define('DB_USER', 'tu_usuario_mysql');
   define('DB_PASS', 'tu_password_mysql');
   define('JWT_SECRET', 'una-frase-larga-y-secreta-que-inventes');
   ```

Creá tu usuario administrador. Dos formas, elegí la que te sirva:

   **Si tenés terminal/SSH:**
   ```bash
   cd backend-php/db
   php seed_admin.php tu_usuario tu_contraseña
   ```

   **Si NO tenés terminal (hosting compartido típico):**
   - Subí el proyecto al hosting
   - Entrá desde el navegador a `tudominio.com/backend-php/db/create_admin.php`
   - Completá el formulario para crear tu usuario y contraseña
   - **Borrá ese archivo del servidor** apenas termines (por seguridad)

Levantar el backend (el `.env` del frontend ya viene apuntando a esta opción):

   **Con XAMPP (recomendado para probar en tu compu):**
   - Copiá la carpeta `backend-php` dentro de `htdocs/joyeria/` (ej. `C:\xampp\htdocs\joyeria\backend-php`)
   - Iniciá **Apache** y **MySQL** desde el Panel de Control de XAMPP
   - Probá que responda entrando a `http://localhost/joyeria/backend-php/api/products.php` (debería mostrar `[]`)

   **Alternativa con el servidor propio de PHP** (si no querés usar XAMPP):
   ```bash
   cd backend-php
   php -S localhost:8000 -t api
   ```
   En ese caso cambiá `VITE_API_URL` en `frontend/.env` a `http://localhost:8000`.

   **Para un hosting real (cPanel, etc.):** simplemente subís la carpeta `backend-php` vía FTP/File Manager; Apache ya sabe correr `.php` sin configuración extra. Ahí también vas a tener que ajustar `VITE_API_URL` a tu dominio real.

## 3. Fotos de producto (Cloudinary)

1. Entrá a [console.cloudinary.com](https://console.cloudinary.com) → ⚙️ **Settings** → **Upload**
2. **Upload presets** → **Add upload preset** → **Signing Mode: Unsigned** → guardar
3. Anotá tu **Cloud name** (arriba a la izquierda del dashboard) y el **nombre del preset** que acabás de crear

Las fotos se suben directo desde el navegador del admin a Cloudinary (no pasan por el backend PHP), y solo guardamos la URL resultante en la base de datos.

## 4. Frontend

El `frontend/.env` de este zip ya viene completo con tu `cloud_name` y `upload_preset` de Cloudinary, apuntando a la ruta de XAMPP. Si corrés el backend distinto (por ejemplo con `php -S`), ajustá `VITE_API_URL` como se indicó arriba.

```bash
cd frontend
npm install
npm run dev    # http://localhost:5173
```

## Flujo de uso

1. Entrá a la web como cliente y navegá el catálogo por categoría.
2. Hacé clic en "Iniciar sesión" y entrá con el usuario/contraseña que creaste.
3. En "Configuración de la tienda" cargá tu número de WhatsApp (con código de país, sin el +).
4. Cargá categorías y productos desde el panel.
5. El cliente arma su carrito y presiona "Finalizar compra por WhatsApp": se abre WhatsApp con el detalle y el total.
6. **Vos, como administrador, una vez que confirmás el pago, entrás al panel y le bajás el stock manualmente** a cada producto vendido.
7. Si el stock de un producto llega a 0, automáticamente deja de aparecer en el catálogo del cliente (el endpoint público solo devuelve `stock > 0`), pero en tu panel seguís viéndolo marcado como "Sin stock" para reponerlo cuando quieras.

## Notas de seguridad para producción

- `config.php` nunca debe subirse a un repositorio público ni quedar accesible por navegador fuera de la carpeta protegida del hosting.
- Borrá `db/create_admin.php` del servidor apenas crees tu usuario.
- Considerá restringir `Access-Control-Allow-Origin` en `helpers/cors.php` a tu dominio real en vez de `*` una vez que la tienda esté online.
- Usá siempre HTTPS en producción (la mayoría de los hostings lo dan gratis con Let's Encrypt).

## Próximos pasos sugeridos

- Subida de imágenes reales (guardando la ruta/URL en la tabla `products`).
- Historial de pedidos/ventas en una tabla `orders` (hoy el pedido solo viaja por WhatsApp, no queda registrado en la base).
- Deploy: cualquier hosting compartido con PHP+MySQL para el backend, y Vercel/Netlify para el frontend React.
