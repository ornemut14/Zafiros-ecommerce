<?php
require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/auth.php';

const PRODUCT_SELECT = "
  SELECT p.id, p.name, p.price, p.stock, p.icon, p.image_url,
         c.id AS category_id, c.name AS category_name
  FROM products p
  JOIN categories c ON c.id = p.category_id
";

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;
$action = $_GET['action'] ?? null;

// ---------- GET: catálogo público o listado completo para admin ----------
if ($method === 'GET') {
    if (isset($_GET['all'])) {
        requireAdmin();
        $stmt = $pdo->query(PRODUCT_SELECT . ' ORDER BY p.created_at DESC');
    } else {
        $stmt = $pdo->query(PRODUCT_SELECT . ' WHERE p.stock > 0 ORDER BY p.created_at DESC');
    }
    echo json_encode($stmt->fetchAll());
    exit;
}

// ---------- POST: crear producto (admin) ----------
if ($method === 'POST') {
    requireAdmin();
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $name = trim($data['name'] ?? '');
    $price = $data['price'] ?? null;
    $stock = $data['stock'] ?? null;
    $categoryId = $data['categoryId'] ?? null;
    $icon = $data['icon'] ?? '💎';
    $imageUrl = $data['imageUrl'] ?? null;

    if (!$name || $price === null || $stock === null || !$categoryId) {
        http_response_code(400);
        echo json_encode(['error' => 'Faltan campos requeridos.']);
        exit;
    }

    $stmt = $pdo->prepare('INSERT INTO products (name, price, stock, category_id, icon, image_url) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->execute([$name, $price, $stock, $categoryId, $icon, $imageUrl]);
    $newId = $pdo->lastInsertId();

    $stmt = $pdo->prepare(PRODUCT_SELECT . ' WHERE p.id = ?');
    $stmt->execute([$newId]);
    http_response_code(201);
    echo json_encode($stmt->fetch());
    exit;
}

// ---------- PUT: editar producto (admin) ----------
if ($method === 'PUT') {
    requireAdmin();
    if (!$id) { http_response_code(400); echo json_encode(['error' => 'Falta el id del producto.']); exit; }

    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $stmt = $pdo->prepare('UPDATE products SET name=?, price=?, stock=?, category_id=?, icon=?, image_url=? WHERE id=?');
    $stmt->execute([
        $data['name'] ?? '',
        $data['price'] ?? 0,
        $data['stock'] ?? 0,
        $data['categoryId'] ?? null,
        $data['icon'] ?? '💎',
        $data['imageUrl'] ?? null,
        $id,
    ]);

    $stmt = $pdo->prepare(PRODUCT_SELECT . ' WHERE p.id = ?');
    $stmt->execute([$id]);
    $product = $stmt->fetch();
    if (!$product) { http_response_code(404); echo json_encode(['error' => 'Producto no encontrado.']); exit; }
    echo json_encode($product);
    exit;
}

// ---------- DELETE: eliminar producto (admin) ----------
if ($method === 'DELETE') {
    requireAdmin();
    if (!$id) { http_response_code(400); echo json_encode(['error' => 'Falta el id del producto.']); exit; }
    $stmt = $pdo->prepare('DELETE FROM products WHERE id = ?');
    $stmt->execute([$id]);
    http_response_code(204);
    exit;
}

// ---------- PATCH: descontar stock tras confirmar una venta (admin) ----------
if ($method === 'PATCH' && $action === 'stock') {
    requireAdmin();
    if (!$id) { http_response_code(400); echo json_encode(['error' => 'Falta el id del producto.']); exit; }

    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $quantity = (int)($data['quantity'] ?? 0);
    if ($quantity <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'La cantidad debe ser mayor a 0.']);
        exit;
    }

    $stmt = $pdo->prepare('UPDATE products SET stock = GREATEST(stock - ?, 0) WHERE id = ?');
    $stmt->execute([$quantity, $id]);

    $stmt = $pdo->prepare(PRODUCT_SELECT . ' WHERE p.id = ?');
    $stmt->execute([$id]);
    $product = $stmt->fetch();
    if (!$product) { http_response_code(404); echo json_encode(['error' => 'Producto no encontrado.']); exit; }
    echo json_encode($product); // si stock llega a 0, el GET público ya no lo va a devolver
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Método no permitido.']);
