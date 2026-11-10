const mqtt = require('mqtt');
const mysql = require('mysql2/promise');

// Configuration du Broker MQTT
const mqttBrokerUrl = 'mqtt://127.0.0.1:1883';
const mqttTopic = 'water/sensors';

// Configuration de la base de données MySQL (XAMPP - port 3307)
const dbConfig = {
  host: '127.0.0.1',
  port: 3307,
  user: 'root',
  password: '',
  database: 'water'
};

async function main() {
  console.log('=== PONT IoT: MQTT vers MySQL ===');
  console.log(`Connexion à la base de données MySQL sur ${dbConfig.host}:${dbConfig.port}...`);
  
  let dbConnection;
  try {
    dbConnection = await mysql.createConnection(dbConfig);
    console.log('✅ Connexion MySQL réussie !');
  } catch (err) {
    console.error('❌ Échec de la connexion MySQL :', err.message);
    process.exit(1);
  }

  console.log(`Connexion au Broker MQTT sur ${mqttBrokerUrl}...`);
  const mqttClient = mqtt.connect(mqttBrokerUrl);

  mqttClient.on('connect', () => {
    console.log('✅ Connexion au Broker MQTT réussie !');
    console.log(`Abonnement au topic : "${mqttTopic}"...`);
    mqttClient.subscribe(mqttTopic, (err) => {
      if (err) {
        console.error('❌ Échec de l\'abonnement au topic MQTT :', err.message);
      } else {
        console.log(`✅ Abonnement réussi ! En attente de messages sur "${mqttTopic}"...`);
      }
    });
  });

  mqttClient.on('message', async (topic, message) => {
    const rawPayload = message.toString();
    console.log(`\n📥 Message reçu sur [${topic}] :`, rawPayload);

    try {
      const payload = JSON.parse(rawPayload);

      // Gestion résiliente des champs du payload (Anglais ou Français)
      const capteur_id = payload.device_id || payload.capteur_id;
      const pression = typeof payload.pressure !== 'undefined' ? payload.pressure : payload.pression;
      const debit = typeof payload.flow !== 'undefined' ? payload.flow : payload.debit;

      if (!capteur_id) {
        console.warn('⚠️ Capteur ID/Device ID manquant dans le payload. Message ignoré.');
        return;
      }

      if (typeof pression === 'undefined' || typeof debit === 'undefined') {
        console.warn('⚠️ Valeurs de pression ou débit manquantes. Message ignoré.');
        return;
      }

      console.log(`Parsed: Capteur=${capteur_id}, Pression=${pression} bar, Débit=${debit} m³/h`);

      // Insertion dans la table 'mesures'
      const query = 'INSERT INTO mesures (capteur_id, pression, debit) VALUES (?, ?, ?)';
      const [result] = await dbConnection.execute(query, [capteur_id, pression, debit]);
      console.log(`💾 Données stockées dans MySQL (ID de ligne insérée: ${result.insertId})`);

    } catch (err) {
      console.error('❌ Erreur lors du traitement du message :', err.message);
    }
  });

  mqttClient.on('error', (err) => {
    console.error('❌ Erreur MQTT client :', err.message);
  });

  mqttClient.on('close', () => {
    console.warn('⚠️ Connexion au Broker MQTT perdue.');
  });
}

main().catch(err => {
  console.error('❌ Erreur fatale dans le service :', err);
});
