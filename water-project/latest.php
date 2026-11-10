<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("127.0.0.1", "root", "", "water", 3307);

if ($conn->connect_error) {
  echo json_encode(["error" => $conn->connect_error]);
  exit;
}

$result = $conn->query("SELECT * FROM mesures ORDER BY id DESC LIMIT 50");

$rows = [];
while ($row = $result->fetch_assoc()) {
  $rows[] = [
    "id" => $row["id"],
    "capteur_id" => $row["capteur_id"],
    "pression" => floatval($row["pression"]),
    "debit" => floatval($row["debit"]),
    "created_at" => $row["created_at"]
  ];
}

echo json_encode($rows);
?>