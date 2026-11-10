<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$conn = new mysqli("127.0.0.1", "root", "", "water", 3307);

if ($conn->connect_error) {
    // If database connection fails, try to connect to server and create database
    $conn_init = new mysqli("127.0.0.1", "root", "", "", 3307);
    if (!$conn_init->connect_error) {
        $conn_init->query("CREATE DATABASE IF NOT EXISTS water");
        $conn = new mysqli("127.0.0.1", "root", "", "water", 3307);
    }
}

// Function to ensure tables exist
function ensureTablesExist($conn) {
    $conn->query("CREATE TABLE IF NOT EXISTS zones (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        localisation VARCHAR(100) NOT NULL,
        pression DOUBLE DEFAULT 0.0,
        debit DOUBLE DEFAULT 0.0,
        statut VARCHAR(50) DEFAULT 'Optimal',
        date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        latitude DOUBLE DEFAULT 36.84,
        longitude DOUBLE DEFAULT 10.16,
        active_sensors INT DEFAULT 0,
        leak_probability VARCHAR(50) DEFAULT '0.0%',
        last_alert VARCHAR(255) DEFAULT 'Aucune',
        last_maintenance VARCHAR(100) DEFAULT '--'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
}

if (!$conn->connect_error) {
    ensureTablesExist($conn);
} else {
    echo json_encode(["error" => "Erreur de connexion base de données: " . $conn->connect_error]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $result = $conn->query("SELECT * FROM zones ORDER BY id ASC");
        $zones = [];
        
        while ($row = $result->fetch_assoc()) {
            $zones[] = [
                "id" => intval($row["id"]),
                "name" => $row["nom"],
                "position" => [floatval($row["latitude"]), floatval($row["longitude"])],
                "location" => $row["localisation"],
                "currentFlow" => $row["debit"] == 0.0 ? '--' : floatval($row["debit"]),
                "currentPressure" => $row["pression"] == 0.0 ? '--' : floatval($row["pression"]),
                "lastReading" => $row["date_creation"],
                "lastAlert" => $row["last_alert"],
                "activeSensors" => intval($row["active_sensors"]),
                "leakProbability" => $row["leak_probability"],
                "networkStatus" => $row["statut"],
                "lastMaintenance" => $row["last_maintenance"]
            ];
        }
        
        // If empty, let's auto-seed
        if (count($zones) === 0) {
            $seed_zones = [
                ["Cité Ennaser (NP3)", "36.8612°N, 10.1647°E", 3.2, 42.4, "Optimal", 36.8612, 10.1647, 12, "2.1%", "Aucune alerte récente", "2026-04-15"],
                ["Manar 1 (NP1)", "36.8095°N, 10.1318°E", 1.8, 78.1, "Fuite Active", 36.8095, 10.1318, 8, "95.7%", "Pression basse détectée", "2026-03-22"],
                ["Jardin El Manzeh (NP2)", "36.8488°N, 10.1654°E", 3.4, 34.8, "Optimal", 36.8488, 10.1654, 15, "0.8%", "Aucune alerte récente", "2026-05-01"],
                ["Manar 2 (NP4)", "36.8112°N, 10.1290°E", 2.2, 56.2, "Attention", 36.8112, 10.129, 10, "44.8%", "Débit élevé détecté", "2026-04-10"],
                ["Ariana (NP5)", "36.8665°N, 10.1647°E", 3.1, 28.5, "Optimal", 36.8665, 10.1647, 9, "0.9%", "Aucune alerte récente", "2026-04-20"],
            ];
            
            // Re-create the seed statement with corrected "ssdddddisss" parameter types
            $stmt = $conn->prepare("INSERT INTO zones (nom, localisation, pression, debit, statut, latitude, longitude, active_sensors, leak_probability, last_alert, last_maintenance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            if ($stmt) {
                foreach ($seed_zones as $z) {
                    $stmt->bind_param("ssddsddisss", $z[0], $z[1], $z[2], $z[3], $z[4], $z[5], $z[6], $z[7], $z[8], $z[9], $z[10]);
                    $stmt->execute();
                }
                $stmt->close();
            }
            
            // Re-fetch seed data
            $result = $conn->query("SELECT * FROM zones ORDER BY id ASC");
            while ($row = $result->fetch_assoc()) {
                $zones[] = [
                    "id" => intval($row["id"]),
                    "name" => $row["nom"],
                    "position" => [floatval($row["latitude"]), floatval($row["longitude"])],
                    "location" => $row["localisation"],
                    "currentFlow" => $row["debit"] == 0.0 ? '--' : floatval($row["debit"]),
                    "currentPressure" => $row["pression"] == 0.0 ? '--' : floatval($row["pression"]),
                    "lastReading" => $row["date_creation"],
                    "lastAlert" => $row["last_alert"],
                    "activeSensors" => intval($row["active_sensors"]),
                    "leakProbability" => $row["leak_probability"],
                    "networkStatus" => $row["statut"],
                    "lastMaintenance" => $row["last_maintenance"]
                ];
            }
        }
        
        echo json_encode($zones);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        
        // Input validation
        if (empty($data['name'])) {
            http_response_code(400);
            echo json_encode(["error" => "Le nom de la zone est obligatoire."]);
            exit;
        }
        
        $nom = htmlspecialchars(strip_tags($data['name']));
        $latitude = isset($data['latitude']) ? floatval($data['latitude']) : 36.84;
        $longitude = isset($data['longitude']) ? floatval($data['longitude']) : 10.16;
        $localisation = isset($data['location']) ? htmlspecialchars(strip_tags($data['location'])) : "{$latitude}°N, {$longitude}°E";
        $pression = isset($data['pression']) ? floatval($data['pression']) : 0.0;
        $debit = isset($data['debit']) ? floatval($data['debit']) : 0.0;
        $statut = isset($data['statut']) ? htmlspecialchars(strip_tags($data['statut'])) : "Optimal";
        $active_sensors = isset($data['activeSensors']) ? intval($data['activeSensors']) : 0;
        $leak_probability = isset($data['leakProbability']) ? htmlspecialchars(strip_tags($data['leakProbability'])) : "0.0%";
        $last_alert = isset($data['lastAlert']) ? htmlspecialchars(strip_tags($data['lastAlert'])) : "Ajoutée manuellement";
        $last_maintenance = isset($data['lastMaintenance']) ? htmlspecialchars(strip_tags($data['lastMaintenance'])) : "--";
        
        // Corrected bind_param parameter specification: ssdddddisss
        $stmt = $conn->prepare("INSERT INTO zones (nom, localisation, pression, debit, statut, latitude, longitude, active_sensors, leak_probability, last_alert, last_maintenance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        if ($stmt) {
            $stmt->bind_param("ssddsddisss", $nom, $localisation, $pression, $debit, $statut, $latitude, $longitude, $active_sensors, $leak_probability, $last_alert, $last_maintenance);
            if ($stmt->execute()) {
                $new_id = $conn->insert_id;
                echo json_encode([
                    "id" => $new_id,
                    "name" => $nom,
                    "position" => [$latitude, $longitude],
                    "location" => $localisation,
                    "currentFlow" => $debit == 0.0 ? '--' : $debit,
                    "currentPressure" => $pression == 0.0 ? '--' : $pression,
                    "lastReading" => date("Y-m-d H:i:s"),
                    "lastAlert" => $last_alert,
                    "activeSensors" => $active_sensors,
                    "leakProbability" => $leak_probability,
                    "networkStatus" => $statut,
                    "lastMaintenance" => $last_maintenance
                ]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Impossible d'insérer la zone: " . $stmt->error]);
            }
            $stmt->close();
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Erreur de préparation SQL: " . $conn->error]);
        }
        break;

    case 'DELETE':
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        
        if ($id <= 0) {
            http_response_code(400);
            echo json_encode(["error" => "ID invalide."]);
            exit;
        }
        
        $stmt = $conn->prepare("DELETE FROM zones WHERE id = ?");
        if ($stmt) {
            $stmt->bind_param("i", $id);
            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Zone supprimée avec succès !"]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Impossible de supprimer la zone : " . $stmt->error]);
            }
            $stmt->close();
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Erreur de préparation SQL: " . $conn->error]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(["error" => "Méthode non autorisée."]);
        break;
}
?>
