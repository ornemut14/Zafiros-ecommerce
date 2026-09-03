<?php
require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/auth.php';

$method = $_SERVER['REQUEST_METHOD'];

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

http_response_code(405);
echo json_encode(['error' => 'Método no permitido.']);
