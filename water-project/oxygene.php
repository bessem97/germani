<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("127.0.0.1", "root", "", "water", 3307);

$result = $conn->query(
  "SELECT date_heure, do_mgl, temperature 
   FROM oxygene_ligne1 
   ORDER BY date_heure DESC 
   LIMIT 20"
);

$rows = [];
while ($row = $result->fetch_assoc()) {
  $rows[] = [
    "date_heure"  => $row["date_heure"],
    "do_mgl"      => floatval($row["do_mgl"]),
    "temperature" => floatval($row["temperature"])
  ];
}

echo json_encode($rows);
?>