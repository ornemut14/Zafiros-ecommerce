import { query } from './_lib/db.js';
import { cors, readBody, requireAdmin, sendError, sendJson } from './_lib/http.js';

export default async function handler(req, res) {
  if (cors(req, res)) return;

  try {
    // ---------- GET: numero de WhatsApp ----------
    if (req.method === 'GET') {
      const { rows } = await query('SELECT whatsapp_number FROM store_config WHERE id = 1');
      return sendJson(res, 200, rows[0] || { whatsapp_number: null });
    }

    // ---------- PUT: actualizar numero de WhatsApp (admin) ----------
    if (req.method === 'PUT') {
      if (!requireAdmin(req, res)) return;

      const data = readBody(req);
      const whatsapp = data.whatsappNumber ?? null;

      const { rows } = await query(
        `INSERT INTO store_config (id, whatsapp_number) VALUES (1, $1)
         ON CONFLICT (id) DO UPDATE SET whatsapp_number = EXCLUDED.whatsapp_number
         RETURNING whatsapp_number`,
        [whatsapp],
      );

      return sendJson(res, 200, { whatsapp_number: rows[0].whatsapp_number });
    }

    return sendError(res, 405, 'Método no permitido.');
  } catch (error) {
    console.error('config error', error);
    return sendError(res, 500, 'Error del servidor.');
  }
}