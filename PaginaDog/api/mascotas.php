<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../config/db.php';

$tipo      = $_GET['tipo']      ?? 'Todos';
$tamano    = $_GET['tamano']    ?? 'Todos';
$sexo      = $_GET['sexo']      ?? 'Todos';
$ubicacion = $_GET['ubicacion'] ?? 'Todos';
$edad      = $_GET['edad']      ?? 'Todos';
$estado    = $_GET['estado']    ?? 'Todos';
$buscar    = $_GET['buscar']    ?? '';

$where  = [];
$params = [];

if ($tipo      !== 'Todos') { $where[] = 'tipo = ?';      $params[] = $tipo; }
if ($tamano    !== 'Todos') { $where[] = 'tamano = ?';    $params[] = $tamano; }
if ($sexo      !== 'Todos') { $where[] = 'sexo = ?';      $params[] = $sexo; }
if ($ubicacion !== 'Todos') { $where[] = 'ubicacion = ?'; $params[] = $ubicacion; }
if ($edad      !== 'Todos') { $where[] = 'edad = ?';      $params[] = $edad; }
if ($estado    !== 'Todos') { $where[] = 'estado = ?';    $params[] = $estado; }
if ($buscar    !== '')      { $where[] = 'nombre LIKE ?';  $params[] = "%$buscar%"; }

$sql = 'SELECT * FROM mascotas';
if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
$sql .= ' ORDER BY id DESC';

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
echo json_encode($stmt->fetchAll());
