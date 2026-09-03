<?php
require_once __DIR__ . '/../config/config.php';

function base64url_encode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode(string $data): string {
    $remainder = strlen($data) % 4;
    if ($remainder) $data .= str_repeat('=', 4 - $remainder);
    return base64_decode(strtr($data, '-_', '+/'));
}

// Genera un token firmado con HMAC-SHA256, expira en 8 horas
function jwt_encode(array $payload): string {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload['exp'] = time() + 8 * 3600;
    $payloadJson = json_encode($payload);

    $segments = [base64url_encode($header), base64url_encode($payloadJson)];
    $signingInput = implode('.', $segments);
    $signature = hash_hmac('sha256', $signingInput, JWT_SECRET, true);
    $segments[] = base64url_encode($signature);

    return implode('.', $segments);
}

// Verifica la firma y la expiración; devuelve el payload o null si es inválido
function jwt_decode(string $token): ?array {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;

    [$headerB64, $payloadB64, $sigB64] = $parts;
    $expectedSig = base64url_encode(hash_hmac('sha256', "$headerB64.$payloadB64", JWT_SECRET, true));
    if (!hash_equals($expectedSig, $sigB64)) return null;

    $payload = json_decode(base64url_decode($payloadB64), true);
    if (!$payload || (isset($payload['exp']) && $payload['exp'] < time())) return null;

    return $payload;
}

// Corta la ejecución con 401 si no hay un token de admin válido en el header Authorization
function requireAdmin(): array {
    $headers = function_exists('getallheaders') ? getallheaders() : [];
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? ($_SERVER['HTTP_AUTHORIZATION'] ?? '');

    // Algunos hostings (Apache/PHP-FPM como InfinityFree) no exponen el header
    // "Authorization" a PHP. Se agregan fallbacks confiables: el redirect de
    // Apache/CGI y el token por query string que manda el frontend.
    if (empty($auth) && !empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $auth = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    }
    if (empty($auth) && !empty($_GET['token'])) {
        $auth = 'Bearer ' . $_GET['token'];
    }

    if (!preg_match('/Bearer\s+(.+)$/', $auth, $m)) {
        http_response_code(401);
        echo json_encode(['error' => 'No autorizado. Falta el token.']);
        exit;
    }

    $payload = jwt_decode($m[1]);
    if (!$payload) {
        http_response_code(401);
        echo json_encode(['error' => 'Token inválido o expirado.']);
        exit;
    }

    return $payload;
}
