<?php
require_once __DIR__ . '/../helpers/cors.php';
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true) ?? [];
$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';

if (!$username || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Usuario y contraseña son requeridos.']);
    exit;
}

$stmt = $pdo->prepare('SELECT * FROM admins WHERE username = ?');
$stmt->execute([$username]);
$admin = $stmt->fetch();

if (!$admin || !password_verify($password, $admin['password_hash'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Credenciales inválidas.']);
    exit;
}

$token = jwt_encode(['id' => $admin['id'], 'username' => $admin['username']]);
echo json_encode(['token' => $token, 'username' => $admin['username']]);
