// Arnés de prueba: invoca los handlers como si fueran peticiones HTTP.
//   DATABASE_URL=postgresql://... JWT_SECRET=... node scripts/test-api.mjs
import bcrypt from 'bcryptjs';
import pg from 'pg';

process.env.DATABASE_URL = process.env.DATABASE_URL || '';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'secreto-de-prueba';

if (!process.env.DATABASE_URL) {
  console.error('Falta DATABASE_URL. Ejemplo:');
  console.error('  $env:DATABASE_URL="postgresql://usuario:pass@host:5432/joyeria"; node scripts/test-api.mjs');
  process.exit(1);
}

const { pool } = await import('../api/_lib/db.js');
const auth = (await import('../api/auth.js')).default;
const categories = (await import('../api/categories.js')).default;
const products = (await import('../api/products.js')).default;
const config = (await import('../api/config.js')).default;

// usuario de prueba con contraseña conocida
await pool.query(
  `INSERT INTO admins (username, password_hash) VALUES ('tester', $1)
   ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
  [bcrypt.hashSync('clave123', 10)],
);

function mockRes() {
  const res = {
    statusCode: 200, body: null, headers: {},
    setHeader(k, v) { this.headers[k] = v; },
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; },
    end() { return this; },
  };
  return res;
}

async function call(handler, { method = 'GET', query = {}, body = {}, headers = {} } = {}) {
  const req = { method, query, body, headers };
  const res = mockRes();
  await handler(req, res);
  return res;
}

let pass = 0;
let fail = 0;
function check(label, condition, extra = '') {
  if (condition) { pass += 1; console.log(`  OK   ${label}`); }
  else { fail += 1; console.log(`  FALLA ${label} ${extra}`); }
}

console.log('\n1. GET /api/products (catalogo publico)');
let r = await call(products);
check('devuelve 65 productos con stock', r.statusCode === 200 && r.body.length === 65, `-> ${r.body.length}`);
check('solo stock > 0', r.body.every((p) => Number(p.stock) > 0));
check('trae category_name', r.body.every((p) => p.category_name));

console.log('\n2. GET /api/categories');
r = await call(categories);
check('devuelve 5 categorias', r.body.length === 5, `-> ${r.body.length}`);

console.log('\n3. GET /api/config');
r = await call(config);
check('whatsapp de produccion', r.body.whatsapp_number === '2644362739', `-> ${r.body.whatsapp_number}`);

console.log('\n4. POST /api/auth');
r = await call(auth, { method: 'POST', body: { username: 'tester', password: 'clave123' } });
check('login correcto -> 200 + token', r.statusCode === 200 && typeof r.body.token === 'string');
const token = r.body.token;
r = await call(auth, { method: 'POST', body: { username: 'tester', password: 'mala' } });
check('login incorrecto -> 401', r.statusCode === 401);
r = await call(auth, { method: 'POST', body: { username: 'nadie', password: 'x' } });
check('usuario inexistente -> 401', r.statusCode === 401);

const authHeaders = { authorization: `Bearer ${token}` };

console.log('\n5. GET /api/products?all=1 exige token');
r = await call(products, { query: { all: '1' } });
check('sin token -> 401', r.statusCode === 401);
r = await call(products, { query: { all: '1' }, headers: authHeaders });
check('con token -> 200', r.statusCode === 200);
r = await call(products, { query: { all: '1' }, headers: { authorization: 'Bearer invalido' } });
check('token basura -> 401', r.statusCode === 401);

console.log('\n6. POST /api/products (crear)');
r = await call(products, {
  method: 'POST', headers: authHeaders,
  body: { name: 'Producto de prueba', price: 1234.5, stock: 7, categoryId: 1, icon: 'P' },
});
check('crea -> 201 con id', r.statusCode === 201 && r.body.id, `-> ${r.statusCode}`);
const created = r.body.id;
r = await call(products, { method: 'POST', headers: authHeaders, body: { name: '', price: 1 } });
check('sin campos -> 400', r.statusCode === 400);

console.log('\n7. PUT /api/products?id= (editar)');
r = await call(products, {
  method: 'PUT', query: { id: String(created) }, headers: authHeaders,
  body: { name: 'Producto editado', price: 999.99, stock: 3, categoryId: 2, icon: 'E' },
});
check('edita -> 200 con el precio nuevo', r.statusCode === 200 && r.body.price === '999.99', `-> ${r.body?.price}`);
r = await call(products, { method: 'PUT', headers: authHeaders, body: { name: 'x' } });
check('sin id -> 400', r.statusCode === 400);

console.log('\n8. PATCH /api/products?id=&action=stock (descontar)');
r = await call(products, {
  method: 'PATCH', query: { id: String(created), action: 'stock' }, headers: authHeaders,
  body: { quantity: 2 },
});
check('descuenta stock 3 -> 1', r.statusCode === 200 && Number(r.body.stock) === 1, `-> ${r.body?.stock}`);
r = await call(products, {
  method: 'PATCH', query: { id: String(created), action: 'stock' }, headers: authHeaders,
  body: { quantity: 0 },
});
check('cantidad 0 -> 400', r.statusCode === 400);

console.log('\n9. DELETE /api/products?id=');
r = await call(products, { method: 'DELETE', query: { id: String(created) }, headers: authHeaders });
check('borra -> 204', r.statusCode === 204);

console.log('\n10. Categorias: crear / renombrar / borrar');
r = await call(categories, { method: 'POST', headers: authHeaders, body: { name: 'Temporal' } });
check('crea -> 201', r.statusCode === 201, `-> ${r.statusCode}`);
const catId = r.body.id;
r = await call(categories, { method: 'POST', headers: authHeaders, body: { name: 'Temporal' } });
check('duplicada -> 409', r.statusCode === 409);
r = await call(categories, { method: 'PUT', query: { id: String(catId) }, headers: authHeaders, body: { name: 'Renombrada' } });
check('renombra -> 200', r.statusCode === 200 && r.body.name === 'Renombrada');
r = await call(categories, { method: 'DELETE', query: { id: String(catId) }, headers: authHeaders });
check('borra -> 204', r.statusCode === 204);
r = await call(categories, { method: 'DELETE', query: { id: '1' }, headers: authHeaders });
check('categoria con productos -> 409', r.statusCode === 409, `-> ${r.statusCode}`);

console.log('\n11. PUT /api/config');
r = await call(config, { method: 'PUT', headers: authHeaders, body: { whatsappNumber: '34600111222' } });
check('actualiza whatsapp', r.statusCode === 200 && r.body.whatsapp_number === '34600111222');
await call(config, { method: 'PUT', headers: authHeaders, body: { whatsappNumber: '2644362739' } });

console.log('\n12. CORS y metodo no permitido');
r = await call(categories, { method: 'OPTIONS' });
check('OPTIONS -> 204', r.statusCode === 204);
check('header CORS presente', r.headers['Access-Control-Allow-Origin'] === '*');
r = await call(auth, { method: 'GET' });
check('GET en /api/auth -> 405', r.statusCode === 405);

await pool.query("DELETE FROM admins WHERE username = 'tester'");
await pool.end();

console.log(`\n${'='.repeat(46)}\n  ${pass} pruebas OK / ${fail} falhas\n${'='.repeat(46)}`);
process.exit(fail ? 1 : 0);