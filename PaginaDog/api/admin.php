<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

require_once '../config/db.php';

$action = $_GET['action'] ?? ($_POST['action'] ?? '');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body   = json_decode(file_get_contents('php://input'), true) ?? [];
    $action = $body['action'] ?? $action;
}

switch ($action) {

    // ── Estadísticas generales ────────────────────────────────
    case 'stats':
        $stats = [];
        foreach (['mascotas','donaciones','usuarios','refugios'] as $t) {
            $stats[$t] = (int)$pdo->query("SELECT COUNT(*) FROM $t")->fetchColumn();
        }
        $stats['disponibles'] = (int)$pdo->query("SELECT COUNT(*) FROM mascotas WHERE estado='Disponible'")->fetchColumn();
        $stats['adoptados']   = (int)$pdo->query("SELECT COUNT(*) FROM mascotas WHERE estado='Adoptado'")->fetchColumn();
        $monto = $pdo->query("SELECT COALESCE(SUM(monto),0) FROM donaciones")->fetchColumn();
        $stats['total_donado'] = number_format((float)$monto, 2);
        echo json_encode($stats);
        break;

    // ── Listar mascotas ───────────────────────────────────────
    case 'mascotas':
        $rows = $pdo->query('SELECT * FROM mascotas ORDER BY id DESC')->fetchAll();
        echo json_encode($rows);
        break;

    // ── Agregar mascota ───────────────────────────────────────
    case 'add_mascota':
        $d = $body ?? [];
        $campos = ['nombre','tipo','tamano','sexo','edad','ubicacion','descripcion','imagen'];
        foreach (['nombre','tipo','tamano','sexo','edad','ubicacion'] as $r) {
            if (empty($d[$r])) { echo json_encode(['error' => "Campo requerido: $r"]); exit; }
        }
        $stmt = $pdo->prepare('INSERT INTO mascotas (nombre,tipo,tamano,sexo,edad,ubicacion,descripcion,imagen,estado) VALUES (?,?,?,?,?,?,?,?,?)');
        $stmt->execute([
            $d['nombre'], $d['tipo'], $d['tamano'], $d['sexo'],
            $d['edad'],   $d['ubicacion'],
            $d['descripcion'] ?? '', $d['imagen'] ?? '',
            $d['estado'] ?? 'Disponible'
        ]);
        echo json_encode(['ok' => true, 'id' => (int)$pdo->lastInsertId()]);
        break;

    // ── Cambiar estado mascota ────────────────────────────────
    case 'update_mascota':
        $id     = (int)($body['id']     ?? 0);
        $estado = $body['estado'] ?? '';
        if (!$id || !in_array($estado, ['Disponible','Adoptado']))
            { echo json_encode(['error' => 'Datos inválidos']); exit; }
        $pdo->prepare('UPDATE mascotas SET estado=? WHERE id=?')->execute([$estado, $id]);
        echo json_encode(['ok' => true]);
        break;

    // ── Eliminar mascota ──────────────────────────────────────
    case 'delete_mascota':
        $id = (int)($body['id'] ?? 0);
        if (!$id) { echo json_encode(['error' => 'ID inválido']); exit; }
        $pdo->prepare('DELETE FROM mascotas WHERE id=?')->execute([$id]);
        echo json_encode(['ok' => true]);
        break;

    // ── Listar donaciones ─────────────────────────────────────
    case 'donaciones':
        $rows = $pdo->query('SELECT * FROM donaciones ORDER BY id DESC')->fetchAll();
        echo json_encode($rows);
        break;

    // ── Listar usuarios ───────────────────────────────────────
    case 'usuarios':
        $rows = $pdo->query('SELECT id, nombre, correo, rol, created_at FROM usuarios ORDER BY id DESC')->fetchAll();
        echo json_encode($rows);
        break;

    default:
        http_response_code(400);
        echo json_encode(['error' => 'Acción desconocida']);
}
