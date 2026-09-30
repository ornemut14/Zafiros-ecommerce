import bcrypt from 'bcryptjs';
import { query } from './_lib/db.js';
import { cors, readBody, sendError, sendJson } from './_lib/http.js';
import { jwtEncode } from './_lib/jwt.js';

export default async function handler(req, res) {
  if (cors(req, res)) return;

  if (req.method !== 'POST') {
    return sendError(res, 405, 'Método no permitido.');
  }

  const { username, password } = readBody(req);
  const user = String(username || '').trim();
  const pass = String(password || '');

  if (!user || !pass) {
    return sendError(res, 400, 'Usuario y contraseña son requeridos.');
  }

  try {
    const { rows } = await query('SELECT * FROM admins WHERE username = $1', [user]);
    const admin = rows[0];

    // bcryptjs devuelve false sin launching error, pero el usuario no debe
    // poder distinguir "no existe" de "contrasena incorrecta".
    const hash = admin?.password_hash || '$2b$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinv';
    const valid = bcrypt.compareSync(pass, hash);

    if (!admin || !valid) {
      return sendError(res, 401, 'Credenciales inválidas.');
    }

    const token = jwtEncode({ id: admin.id, username: admin.username });
    return sendJson(res, 200, { token, username: admin.username });
  } catch (error) {
    console.error('auth error', error);
    return sendError(res, 500, 'Error del servidor.');
  }
}