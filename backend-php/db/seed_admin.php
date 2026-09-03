<?php
// Uso: php seed_admin.php <usuario> <password>
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/db.php';

$username = $argv[1] ?? null;
$password = $argv[2] ?? null;

if (!$username || !$password) {
    echo "Uso: php seed_admin.php <usuario> <password>\n";
    exit(1);
}

$hash = password_hash($password, PASSWORD_BCRYPT);

$stmt = $pdo->prepare(
    'INSERT INTO admins (username, password_hash) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)'
);
$stmt->execute([$username, $hash]);

echo "Administrador \"$username\" creado/actualizado correctamente.\n";
