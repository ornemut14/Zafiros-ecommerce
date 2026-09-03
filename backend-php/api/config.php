<?php
require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/auth.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT whatsapp_number FROM store_config WHERE id = 1');
    $row = $stmt->fetch();
    echo json_encode($row ?: ['whatsapp_number' => null]);
    exit;
}

if ($method === 'PUT') {
    requireAdmin();
    $data = json_decode(file_get_contents('php://input'), true) ?? [];
    $whatsapp = $data['whatsappNumber'] ?? null;

    $stmt = $pdo->prepare('UPDATE store_config SET whatsapp_number = ? WHERE id = 1');
    $stmt->execute([$whatsapp]);
    echo json_encode(['whatsapp_number' => $whatsapp]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Método no permitido.']);
