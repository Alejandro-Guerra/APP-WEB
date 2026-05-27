<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../config/db.php';

$stmt = $pdo->query('SELECT * FROM refugios WHERE activo = 1 ORDER BY nombre');
echo json_encode($stmt->fetchAll());
