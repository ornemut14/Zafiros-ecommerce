<?php
require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? (int)$_GET['id'] : null;

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM categories ORDER BY name ASC');
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($method === 'POST') {
    requireAdmin();
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $name = trim($data['name'] ?? '');

    if (!$name) {
        http_response_code(400);
        echo json_encode(['error' => 'El nombre de la categoría es requerido.']);
        exit;
    }

    try {
        $stmt = $pdo->prepare('INSERT INTO categories (name) VALUES (?)');
        $stmt->execute([$name]);
        $id = $pdo->lastInsertId();
        http_response_code(201);
        echo json_encode(['id' => (int)$id, 'name' => $name]);
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') {
            http_response_code(409);
            echo json_encode(['error' => 'Esa categoría ya existe.']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error del servidor.']);
        }
    }
    exit;
}

// ---------- PUT: renombrar categoría (admin) ----------
if ($method === 'PUT') {
    requireAdmin();
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Falta el id de la categoría.']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $name = trim($data['name'] ?? '');
    if (!$name) {
        http_response_code(400);
        echo json_encode(['error' => 'El nombre de la categoría es requerido.']);
        exit;
    }

    try {
        $stmt = $pdo->prepare('UPDATE categories SET name = ? WHERE id = ?');
        $stmt->execute([$name, $id]);
        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'Categoría no encontrada.']);
            exit;
        }
        echo json_encode(['id' => $id, 'name' => $name]);
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') {
            http_response_code(409);
            echo json_encode(['error' => 'Esa categoría ya existe.']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error del servidor.']);
        }
    }
    exit;
}

// ---------- DELETE: eliminar categoría (admin) ----------
if ($method === 'DELETE') {
    requireAdmin();
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Falta el id de la categoría.']);
        exit;
    }

    try {
        $stmt = $pdo->prepare('DELETE FROM categories WHERE id = ?');
        $stmt->execute([$id]);
        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['error' => 'Categoría no encontrada.']);
            exit;
        }
        http_response_code(204);
        exit;
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') {
            http_response_code(409);
            echo json_encode(['error' => 'No se puede eliminar: la categoría tiene productos asociados.']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error del servidor.']);
        }
    }
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Método no permitido.']);
