<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

require_once '../config/db.php';

$data   = json_decode(file_get_contents('php://input'), true) ?? [];
$nombre = trim($data['nombre'] ?? '');
$correo = trim($data['correo'] ?? '');
$monto  = (float)($data['monto'] ?? 0);
$tipo   = trim($data['tipo']   ?? '');
$metodo = trim($data['metodo'] ?? '');
$mensaje = trim($data['mensaje'] ?? '');

if (strlen($nombre) < 3)                          { echo json_encode(['error' => 'Escribe tu nombre completo.']); exit; }
if (!filter_var($correo, FILTER_VALIDATE_EMAIL))  { echo json_encode(['error' => 'Correo no válido.']); exit; }
if ($monto < 10)                                  { echo json_encode(['error' => 'El monto mínimo es $10 MXN.']); exit; }
if (!$tipo)                                       { echo json_encode(['error' => 'Selecciona el tipo de donación.']); exit; }
if (!$metodo)                                     { echo json_encode(['error' => 'Selecciona un método.']); exit; }

$stmt = $pdo->prepare(
    'INSERT INTO donaciones (nombre, correo, monto, tipo, metodo, mensaje) VALUES (?, ?, ?, ?, ?, ?)'
);
$stmt->execute([$nombre, $correo, $monto, $tipo, $metodo, $mensaje]);

echo json_encode(['ok' => true, 'id' => (int)$pdo->lastInsertId()]);
