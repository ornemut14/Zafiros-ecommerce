import { query } from './_lib/db.js';
import { cors, id, readBody, requireAdmin, sendError, sendJson } from './_lib/http.js';

const SELECT = `
  SELECT p.id, p.name, p.price, p.stock, p.icon, p.image_url,
         c.id AS category_id, c.name AS category_name,
         m.id AS material_id, m.name AS material_name
  FROM products p
  JOIN categories c ON c.id = p.category_id
  LEFT JOIN materials m ON m.id = p.material_id
`;

// Resguardo: si la migración de materiales aún no se ejecutó en la base,
// la tienda sigue funcionando (sin materiales) en vez de romperse.
const SELECT_LEGACY = `
  SELECT p.id, p.name, p.price, p.stock, p.icon, p.image_url,
         c.id AS category_id, c.name AS category_name,
         NULL AS material_id, NULL AS material_name
  FROM products p
  JOIN categories c ON c.id = p.category_id
`;

async function selectProducts(suffix, params) {
  try {
    return await query(`${SELECT} ${suffix}`, params);
  } catch (error) {
    // 42P01 = tabla inexistente (migración pendiente)
    if (error?.code === '42P01') {
      return await query(`${SELECT_LEGACY} ${suffix}`, params);
    }
    throw error;
  }
}

export default async function handler(req, res) {
  if (cors(req, res)) return;

  const productId = id(req);

  try {
    // ---------- GET: catalogo publico o listado completo para admin ----------
    if (req.method === 'GET') {
      if (req.query?.all) {
        if (!requireAdmin(req, res)) return;
        const { rows } = await selectProducts('ORDER BY p.created_at DESC');
        return sendJson(res, 200, rows);
      }
      const { rows } = await selectProducts('WHERE p.stock > 0 ORDER BY p.created_at DESC');
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
      const materialId = data.materialId ?? null;
      const icon = data.icon || '💎';
      const imageUrl = data.imageUrl || null;

      if (!name || price === undefined || stock === undefined || !categoryId) {
        return sendError(res, 400, 'Faltan campos requeridos.');
      }

      const { rows } = await insertProduct(name, price, stock, categoryId, materialId, icon, imageUrl);

      return sendJson(res, 201, await findOne(rows[0].id));
    }

    // ---------- PUT: editar producto (admin) ----------
    if (req.method === 'PUT') {
      if (!requireAdmin(req, res)) return;
      if (!productId) {
        return sendError(res, 400, 'Falta el id del producto.');
      }

      const data = readBody(req);
      await updateProduct(
        productId,
        data.name || '',
        data.price ?? 0,
        data.stock ?? 0,
        data.categoryId ?? null,
        data.materialId ?? null,
        data.icon || '💎',
        data.imageUrl || null,
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
  const { rows } = await selectProducts('WHERE p.id = $1', [productId]);
  return rows[0] || null;
}

// Si la migración aún no se ejecutó, guarda sin material en vez de fallar.
function isMissingColumn(error) {
  return error?.code === '42P01' || error?.code === '42703';
}

async function insertProduct(name, price, stock, categoryId, materialId, icon, imageUrl) {
  try {
    return await query(
      `INSERT INTO products (name, price, stock, category_id, material_id, icon, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [name, price, stock, categoryId, materialId, icon, imageUrl],
    );
  } catch (error) {
    if (!isMissingColumn(error)) throw error;
    return await query(
      `INSERT INTO products (name, price, stock, category_id, icon, image_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [name, price, stock, categoryId, icon, imageUrl],
    );
  }
}

async function updateProduct(productId, name, price, stock, categoryId, materialId, icon, imageUrl) {
  try {
    return await query(
      `UPDATE products
       SET name = $1, price = $2, stock = $3, category_id = $4, material_id = $5, icon = $6, image_url = $7
       WHERE id = $8`,
      [name, price, stock, categoryId, materialId, icon, imageUrl, productId],
    );
  } catch (error) {
    if (!isMissingColumn(error)) throw error;
    return await query(
      `UPDATE products
       SET name = $1, price = $2, stock = $3, category_id = $4, icon = $5, image_url = $6
       WHERE id = $7`,
      [name, price, stock, categoryId, icon, imageUrl, productId],
    );
  }
}