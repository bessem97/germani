<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
$conn = new mysqli("127.0.0.1", "root", "", "water", 3307);

$data = json_decode(file_get_contents("php://input"), true);

$stmt = $conn->prepare(
  "INSERT INTO mesures (capteur_id, pression, debit) VALUES (?, ?, ?)"
);
$stmt->bind_param("sdd",
  $data["capteur_id"],
  $data["pression"],
  $data["debit"]
);
$stmt->execute();

echo json_encode(["status" => "OK"]);
?> 
