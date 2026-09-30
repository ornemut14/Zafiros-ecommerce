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

  const categoryId = id(req);

  try {
    // ---------- GET: categorias ----------
    if (req.method === 'GET') {
      const { rows } = await query('SELECT * FROM categories ORDER BY name ASC');
      return sendJson(res, 200, rows);
    }

    // ---------- POST: crear categoria (admin) ----------
    if (req.method === 'POST') {
      if (!requireAdmin(req, res)) return;

      const name = String(readBody(req).name || '').trim();
      if (!name) {
        return sendError(res, 400, 'El nombre de la categoría es requerido.');
      }

      try {
        const { rows } = await query(
          'INSERT INTO categories (name) VALUES ($1) RETURNING id, name',
          [name],
        );
        return sendJson(res, 201, { id: Number(rows[0].id), name: rows[0].name });
      } catch (error) {
        if (isUniqueViolation(error)) {
          return sendError(res, 409, 'Esa categoría ya existe.');
        }
        console.error('categories POST error', error);
        return sendError(res, 500, 'Error del servidor.');
      }
    }

    // ---------- PUT: renombrar categoria (admin) ----------
    if (req.method === 'PUT') {
      if (!requireAdmin(req, res)) return;
      if (!categoryId) {
        return sendError(res, 400, 'Falta el id de la categoría.');
      }

      const name = String(readBody(req).name || '').trim();
      if (!name) {
        return sendError(res, 400, 'El nombre de la categoría es requerido.');
      }

      try {
        const { rowCount } = await query('UPDATE categories SET name = $1 WHERE id = $2', [
          name,
          categoryId,
        ]);
        if (!rowCount) {
          return sendError(res, 404, 'Categoría no encontrada.');
        }
        return sendJson(res, 200, { id: categoryId, name });
      } catch (error) {
        if (isUniqueViolation(error)) {
          return sendError(res, 409, 'Esa categoría ya existe.');
        }
        console.error('categories PUT error', error);
        return sendError(res, 500, 'Error del servidor.');
      }
    }

    // ---------- DELETE: eliminar categoria (admin) ----------
    if (req.method === 'DELETE') {
      if (!requireAdmin(req, res)) return;
      if (!categoryId) {
        return sendError(res, 400, 'Falta el id de la categoría.');
      }

      try {
        const { rowCount } = await query('DELETE FROM categories WHERE id = $1', [categoryId]);
        if (!rowCount) {
          return sendError(res, 404, 'Categoría no encontrada.');
        }
        return res.status(204).end();
      } catch (error) {
        if (isForeignKeyViolation(error)) {
          return sendError(
            res,
            409,
            'No se puede eliminar: la categoría tiene productos asociados.',
          );
        }
        console.error('categories DELETE error', error);
        return sendError(res, 500, 'Error del servidor.');
      }
    }

    return sendError(res, 405, 'Método no permitido.');
  } catch (error) {
    console.error('categories error', error);
    return sendError(res, 500, 'Error del servidor.');
  }
}