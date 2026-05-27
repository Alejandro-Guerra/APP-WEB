<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

require_once '../config/db.php';

$data   = json_decode(file_get_contents('php://input'), true) ?? [];
$action = $data['action'] ?? '';

if ($action === 'registro') {
    $nombre = trim($data['nombre']   ?? '');
    $correo = trim($data['correo']   ?? '');
    $pass   = $data['password'] ?? '';

    if (strlen($nombre) < 3)
        { echo json_encode(['error' => 'El nombre debe tener al menos 3 caracteres.']); exit; }
    if (!filter_var($correo, FILTER_VALIDATE_EMAIL))
        { echo json_encode(['error' => 'Correo no válido.']); exit; }
    if (strlen($pass) < 6)
        { echo json_encode(['error' => 'La contraseña debe tener al menos 6 caracteres.']); exit; }

    $stmt = $pdo->prepare('SELECT id FROM usuarios WHERE correo = ?');
    $stmt->execute([$correo]);
    if ($stmt->fetch())
        { echo json_encode(['error' => 'Ese correo ya está registrado.']); exit; }

    $hash = password_hash($pass, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare('INSERT INTO usuarios (nombre, correo, password_hash) VALUES (?, ?, ?)');
    $stmt->execute([$nombre, $correo, $hash]);

    echo json_encode(['ok' => true, 'nombre' => $nombre, 'id' => (int)$pdo->lastInsertId()]);

} elseif ($action === 'login') {
    $correo = trim($data['correo']   ?? '');
    $pass   = $data['password'] ?? '';

    $stmt = $pdo->prepare('SELECT id, nombre, rol, password_hash FROM usuarios WHERE correo = ?');
    $stmt->execute([$correo]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($pass, $user['password_hash']))
        { echo json_encode(['error' => 'Correo o contraseña incorrectos.']); exit; }

    echo json_encode(['ok' => true, 'nombre' => $user['nombre'], 'id' => (int)$user['id'], 'rol' => $user['rol']]);

} else {
    http_response_code(400);
    echo json_encode(['error' => 'Acción desconocida.']);
}
