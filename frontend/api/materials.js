import { query } from './_lib/db.js';
import {
  cors,
  id,
  isForeignKeyViolation,
  isUniqueViolation,
  readBody,
  requireAdmin,
  sendError,
  sendJson,
} from './_lib/http.js';

export default async function handler(req, res) {
  if (cors(req, res)) return;

  const materialId = id(req);

  try {
    // ---------- GET: materiales ----------
    if (req.method === 'GET') {
      const { rows } = await query('SELECT * FROM materials ORDER BY name ASC');
      return sendJson(res, 200, rows);
    }

    // ---------- POST: crear material (admin) ----------
    if (req.method === 'POST') {
      if (!requireAdmin(req, res)) return;

      const name = String(readBody(req).name || '').trim();
      if (!name) {
        return sendError(res, 400, 'El nombre del material es requerido.');
      }

      try {
        const { rows } = await query(
          'INSERT INTO materials (name) VALUES ($1) RETURNING id, name',
          [name],
        );
        return sendJson(res, 201, { id: Number(rows[0].id), name: rows[0].name });
      } catch (error) {
        if (isUniqueViolation(error)) {
          return sendError(res, 409, 'Ese material ya existe.');
        }
        console.error('materials POST error', error);
        return sendError(res, 500, 'Error del servidor.');
      }
    }

    // ---------- PUT: renombrar material (admin) ----------
    if (req.method === 'PUT') {
      if (!requireAdmin(req, res)) return;
      if (!materialId) {
        return sendError(res, 400, 'Falta el id del material.');
      }

      const name = String(readBody(req).name || '').trim();
      if (!name) {
        return sendError(res, 400, 'El nombre del material es requerido.');
      }

      try {
        const { rowCount } = await query('UPDATE materials SET name = $1 WHERE id = $2', [
          name,
          materialId,
        ]);
        if (!rowCount) {
          return sendError(res, 404, 'Material no encontrado.');
        }
        return sendJson(res, 200, { id: materialId, name });
      } catch (error) {
        if (isUniqueViolation(error)) {
          return sendError(res, 409, 'Ese material ya existe.');
        }
        console.error('materials PUT error', error);
        return sendError(res, 500, 'Error del servidor.');
      }
    }

    // ---------- DELETE: eliminar material (admin) ----------
    if (req.method === 'DELETE') {
      if (!requireAdmin(req, res)) return;
      if (!materialId) {
        return sendError(res, 400, 'Falta el id del material.');
      }

      try {
        const { rowCount } = await query('DELETE FROM materials WHERE id = $1', [materialId]);
        if (!rowCount) {
          return sendError(res, 404, 'Material no encontrado.');
        }
        return res.status(204).end();
      } catch (error) {
        if (isForeignKeyViolation(error)) {
          return sendError(
            res,
            409,
            'No se puede eliminar: el material tiene productos asociados.',
          );
        }
        console.error('materials DELETE error', error);
        return sendError(res, 500, 'Error del servidor.');
      }
    }

    return sendError(res, 405, 'Método no permitido.');
  } catch (error) {
    console.error('materials error', error);
    return sendError(res, 500, 'Error del servidor.');
  }
}
