<?php
// Formulario web para crear el PRIMER administrador, pensado para hosting compartido sin SSH.
// Por seguridad, se bloquea solo si ya existe al menos un administrador.
// IMPORTANTE: borrá este archivo del servidor después de usarlo.

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/db.php';

$stmt = $pdo->query('SELECT COUNT(*) AS total FROM admins');
$alreadyHasAdmin = $stmt->fetch()['total'] > 0;

$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$alreadyHasAdmin) {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($username && $password) {
        $hash = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $pdo->prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)');
        $stmt->execute([$username, $hash]);
        $message = "Administrador \"$username\" creado correctamente. Ya podés borrar este archivo (create_admin.php) del servidor.";
        $alreadyHasAdmin = true;
    } else {
        $message = 'Completá usuario y contraseña.';
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Crear administrador</title></head>
<body style="font-family: sans-serif; max-width: 420px; margin: 60px auto;">
  <h2>Crear administrador de la tienda</h2>
  <?php if ($alreadyHasAdmin): ?>
    <p><?= htmlspecialchars($message ?: 'Ya existe un administrador. Por seguridad, borrá este archivo del servidor.') ?></p>
  <?php else: ?>
    <form method="POST">
      <label>Usuario<br><input type="text" name="username" required></label><br><br>
      <label>Contraseña<br><input type="password" name="password" required></label><br><br>
      <button type="submit">Crear administrador</button>
    </form>
  <?php endif; ?>
</body>
</html>
