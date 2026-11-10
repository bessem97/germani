<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Connect without db to create it if not exists
$conn = new mysqli("127.0.0.1", "root", "", "", 3307);

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Create database
if (!$conn->query("CREATE DATABASE IF NOT EXISTS water")) {
    echo json_encode(["status" => "error", "message" => "Error creating database: " . $conn->error]);
    exit;
}

// Select database
$conn->select_db("water");

// Table zones
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

// Table capteurs
$conn->query("CREATE TABLE IF NOT EXISTS capteurs (
    id VARCHAR(50) PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    statut VARCHAR(50) NOT NULL,
    valeur DOUBLE NOT NULL,
    unite VARCHAR(20) NOT NULL,
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

// Table alertes
$conn->query("CREATE TABLE IF NOT EXISTS alertes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    gravite VARCHAR(50) NOT NULL,
    statut VARCHAR(50) NOT NULL,
    date_heure TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    localisation VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

// Table utilisateurs
$conn->query("CREATE TABLE IF NOT EXISTS utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

// Table mesures
$conn->query("CREATE TABLE IF NOT EXISTS mesures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    capteur_id VARCHAR(50) NOT NULL,
    pression DOUBLE DEFAULT 0.0,
    debit DOUBLE DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

// Table oxygene_ligne1
$conn->query("CREATE TABLE IF NOT EXISTS oxygene_ligne1 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date_heure DATETIME NOT NULL,
    do_mgl DOUBLE NOT NULL,
    temperature DOUBLE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

// Seed default zones if empty
$res = $conn->query("SELECT COUNT(*) as count FROM zones");
$row = $res->fetch_assoc();
if ($row['count'] == 0) {
    $zones = [
        ["Cité Ennaser (NP3)", "36.8612°N, 10.1647°E", 3.2, 42.4, "Optimal", 36.8612, 10.1647, 12, "2.1%", "Aucune alerte récente", "2026-04-15"],
        ["Manar 1 (NP1)", "36.8095°N, 10.1318°E", 1.8, 78.1, "Fuite Active", 36.8095, 10.1318, 8, "95.7%", "Pression basse détectée", "2026-03-22"],
        ["Jardin El Manzeh (NP2)", "36.8488°N, 10.1654°E", 3.4, 34.8, "Optimal", 36.8488, 10.1654, 15, "0.8%", "Aucune alerte récente", "2026-05-01"],
        ["Manar 2 (NP4)", "36.8112°N, 10.1290°E", 2.2, 56.2, "Attention", 36.8112, 10.129, 10, "44.8%", "Débit élevé détecté", "2026-04-10"],
        ["Ariana (NP5)", "36.8665°N, 10.1647°E", 3.1, 28.5, "Optimal", 36.8665, 10.1647, 9, "0.9%", "Aucune alerte récente", "2026-04-20"],
    ];
    
    $stmt = $conn->prepare("INSERT INTO zones (nom, localisation, pression, debit, statut, latitude, longitude, active_sensors, leak_probability, last_alert, last_maintenance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($zones as $z) {
        $stmt->bind_param("ssddsddisss", $z[0], $z[1], $z[2], $z[3], $z[4], $z[5], $z[6], $z[7], $z[8], $z[9], $z[10]);
        $stmt->execute();
    }
}

echo json_encode(["status" => "success", "message" => "Base de données 'water' initialisée avec succès !"]);
?>
