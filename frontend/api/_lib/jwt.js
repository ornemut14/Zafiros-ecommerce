import crypto from 'node:crypto';

// Mismo esquema que usaba helpers/auth.php del backend PHP:
// JWT HS256 con expiracion de 8 horas, para no invalidar
// las sesiones del panel de admin entre despliegues.

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64urlDecode(input) {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(padded, 'base64').toString('utf8');
}

function secret() {
  const value = process.env.JWT_SECRET;
  if (!value) {
    throw new Error('Falta la variable de entorno JWT_SECRET');
  }
  return value;
}

function sign(input) {
  return base64url(crypto.createHmac('sha256', secret()).update(input).digest());
}

export function jwtEncode(payload) {
  const header = JSON.stringify({ typ: 'JWT', alg: 'HS256' });
  const body = JSON.stringify({ ...payload, exp: Date.now() + 8 * 3600 * 1000 });
  const segments = [base64url(header), base64url(body)];
  const signature = sign(segments.join('.'));
  return [...segments, signature].join('.');
}

export function jwtDecode(token) {
  const parts = String(token || '').split('.');
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;

  const expected = sign(`${header}.${payload}`);
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  let decoded;
  try {
    decoded = JSON.parse(base64urlDecode(payload));
  } catch {
    return null;
  }

  if (!decoded || (decoded.exp && decoded.exp < Date.now())) return null;
  return decoded;
}