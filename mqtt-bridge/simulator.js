const mqtt = require('mqtt');

const mqttBrokerUrl = 'mqtt://127.0.0.1:1883';
const mqttTopic = 'water/sensors';

console.log('=== SIMULATEUR DE CAPTEURS IOT 4G ===');
console.log(`Connexion au Broker MQTT sur ${mqttBrokerUrl}...`);

const mqttClient = mqtt.connect(mqttBrokerUrl);

mqttClient.on('connect', () => {
  console.log('✅ Connecté au broker MQTT. Début de la simulation dans 2 secondes...');
  
  // Attendre 2 secondes puis commencer à publier
  setTimeout(() => {
    setInterval(publishTelemetry, 4000); // Publier toutes les 4 secondes
  }, 2000);
});

function getRandomValue(base, variation) {
  const diff = (Math.random() - 0.5) * variation;
  return parseFloat((base + diff).toFixed(2));
}

function publishTelemetry() {
  // Capteur 1: Manar 1 (NP1) -> SIM: +21653713006
  // Valeurs de base: Débit = 78.1 m³/h, Pression = 1.8 bar
  const capteur1Payload = {
    device_id: '+21653713006',
    pressure: getRandomValue(1.8, 0.4),
    flow: getRandomValue(78.1, 6.0),
    timestamp: new Date().toISOString()
  };

  // Capteur 2: Jardin El Manzeh (NP2) -> SIM: 22190754
  // Valeurs de base: Débit = 34.8 m³/h, Pression = 3.4 bar
  const capteur2Payload = {
    device_id: '+21622190754',
    pressure: getRandomValue(3.4, 0.4),
    flow: getRandomValue(34.8, 5.0),
    timestamp: new Date().toISOString()
  };

  // Publier Capteur 1
  const payload1Str = JSON.stringify(capteur1Payload);
  mqttClient.publish(mqttTopic, payload1Str, (err) => {
    if (err) {
      console.error('❌ Erreur de publication capteur 1 :', err.message);
    } else {
      console.log(`📤 Publié Capteur 1 (SIM +21653713006) :`, payload1Str);
    }
  });

  // Publier Capteur 2 après un léger décalage pour éviter les collisions
  setTimeout(() => {
    const payload2Str = JSON.stringify(capteur2Payload);
    mqttClient.publish(mqttTopic, payload2Str, (err) => {
      if (err) {
        console.error('❌ Erreur de publication capteur 2 :', err.message);
      } else {
        console.log(`📤 Publié Capteur 2 (SIM 22190754) :`, payload2Str);
      }
    });
  }, 1500);
}

mqttClient.on('error', (err) => {
  console.error('❌ Erreur client MQTT :', err.message);
});
