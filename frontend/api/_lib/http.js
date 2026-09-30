import { jwtDecode } from './jwt.js';

// En este deploy la API y la tienda viven en el mismo dominio de Vercel, asi
// que no hay CORS que negociar. Se mantiene el header para que la API siga
// siendo usable desde otras'origine si algun dia se separa otra vez.

export function cors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}

export function sendJson(res, status, payload) {
  res.status(status).json(payload);
}

export function sendError(res, status, message) {
  res.status(status).json({ error: message });
}

export function readBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

// Corta la ejecucion con 401 si no hay un token de admin valido.
export function requireAdmin(req, res) {
  const header = req.headers?.authorization || req.headers?.Authorization || '';
  let auth = header;

  // Fallback por query string: el frontend lo manda paraTolera proxies
  // que descartan el header Authorization.
  if (!auth && req.query?.token) {
    auth = `Bearer ${req.query.token}`;
  }

  const match = /^Bearer\s+(.+)$/.exec(auth);
  if (!match) {
    sendError(res, 401, 'No autorizado. Falta el token.');
    return null;
  }

  const payload = jwtDecode(match[1]);
  if (!payload) {
    sendError(res, 401, 'Token inválido o expirado.');
    return null;
  }

  return payload;
}

export function id(req) {
  const raw = req.query?.id;
  const value = Number.parseInt(raw, 10);
  return Number.isFinite(value) && value > 0 ? value : null;
}

// Postgres usa el codigo 23505 para duplicados y 23503 para clave foranea,
// en lugar del generico 23000 de MySQL.
export function isUniqueViolation(error) {
  return error?.code === '23505';
}

export function isForeignKeyViolation(error) {
  // 23503 = foreign_key_violation (INSERT/UPDATE),
  // 23001 = restrict_violation, que es lo que dispara ON DELETE RESTRICT.
  return error?.code === '23503' || error?.code === '23001';
}