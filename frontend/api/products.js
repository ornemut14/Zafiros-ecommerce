import { query } from './_lib/db.js';
import { cors, id, readBody, requireAdmin, sendError, sendJson } from './_lib/http.js';

const SELECT = `
  SELECT p.id, p.name, p.price, p.stock, p.icon, p.image_url,
         c.id AS category_id, c.name AS category_name
  FROM products p
  JOIN categories c ON c.id = p.category_id
`;

export default async function handler(req, res) {
  if (cors(req, res)) return;

  const productId = id(req);

  try {
    // ---------- GET: catalogo publico o listado completo para admin ----------
    if (req.method === 'GET') {
      if (req.query?.all) {
        if (!requireAdmin(req, res)) return;
        const { rows } = await query(`${SELECT} ORDER BY p.created_at DESC`);
        return sendJson(res, 200, rows);
      }
      const { rows } = await query(`${SELECT} WHERE p.stock > 0 ORDER BY p.created_at DESC`);
      return sendJson(res, 200, rows);
    }

    // ---------- POST: crear producto (admin) ----------
    if (req.method === 'POST') {
      if (!requireAdmin(req, res)) return;

      const data = readBody(req);
      const name = String(data.name || '').trim();
      const price = data.price;
      const stock = data.stock;
      const categoryId = data.categoryId;
      const icon = data.icon || '💎';
      const imageUrl = data.imageUrl || null;

      if (!name || price === undefined || stock === undefined || !categoryId) {
        return sendError(res, 400, 'Faltan campos requeridos.');
      }

      const { rows } = await query(
        `INSERT INTO products (name, price, stock, category_id, icon, image_url)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [name, price, stock, categoryId, icon, imageUrl],
      );

      return sendJson(res, 201, await findOne(rows[0].id));
    }

    // ---------- PUT: editar producto (admin) ----------
    if (req.method === 'PUT') {
      if (!requireAdmin(req, res)) return;
      if (!productId) {
        return sendError(res, 400, 'Falta el id del producto.');
      }

      const data = readBody(req);
      await query(
        `UPDATE products
         SET name = $1, price = $2, stock = $3, category_id = $4, icon = $5, image_url = $6
         WHERE id = $7`,
        [
          data.name || '',
          data.price ?? 0,
          data.stock ?? 0,
          data.categoryId ?? null,
          data.icon || '💎',
          data.imageUrl || null,
          productId,
        ],
      );

      const product = await findOne(productId);
      if (!product) {
        return sendError(res, 404, 'Producto no encontrado.');
      }
      return sendJson(res, 200, product);
    }

    // ---------- DELETE: eliminar producto (admin) ----------
    if (req.method === 'DELETE') {
      if (!requireAdmin(req, res)) return;
      if (!productId) {
        return sendError(res, 400, 'Falta el id del producto.');
      }
      await query('DELETE FROM products WHERE id = $1', [productId]);
      return res.status(204).end();
    }

    // ---------- PATCH: descontar stock tras confirmar una venta (admin) ----------
    if (req.method === 'PATCH' && req.query?.action === 'stock') {
      if (!requireAdmin(req, res)) return;
      if (!productId) {
        return sendError(res, 400, 'Falta el id del producto.');
      }

      const quantity = Number.parseInt(readBody(req).quantity, 10);
      if (!Number.isFinite(quantity) || quantity <= 0) {
        return sendError(res, 400, 'La cantidad debe ser mayor a 0.');
      }

      await query(
        'UPDATE products SET stock = GREATEST(stock - $1, 0) WHERE id = $2',
        [quantity, productId],
      );

      const product = await findOne(productId);
      if (!product) {
        return sendError(res, 404, 'Producto no encontrado.');
      }
      return sendJson(res, 200, product);
    }

    return sendError(res, 405, 'Método no permitido.');
  } catch (error) {
    console.error('products error', error);
    return sendError(res, 500, 'Error del servidor.');
  }
}

async function findOne(productId) {
  const { rows } = await query(`${SELECT} WHERE p.id = $1`, [productId]);
  return rows[0] || null;
}