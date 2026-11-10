import type { Sensor, Alert, MaintenanceTask, NetworkNode, NetworkEdge, DashboardStats, FlowPressureData, WeeklyAlertsData, SensorReading } from '@/types';

function generateHistory(baseValue: number, unit: string, points = 20): SensorReading[] {
  return Array.from({ length: points }).map((_, idx) => ({
    timestamp: new Date(Date.now() - (points - idx) * 60 * 60 * 1000).toISOString().replace('T', ' ').substring(0, 19),
    value: Number((baseValue + (Math.random() * 6 - 3)).toFixed(2)),
  }));
}

function sensorWithHistory(base: Omit<Sensor, 'history'>): Sensor {
  return { ...base, history: generateHistory(base.value, base.unit) };
}

export const dashboardStats: DashboardStats = {
  leaksDetected: 12,
  activeAlerts: 8,
  networkHealth: 94.2,
  activeSensors: 4,
  leaksTrend: -3,
  alertsTrend: 2,
  healthTrend: 1.3,
  sensorsAvailability: 80,
};

export const flowPressureData: FlowPressureData[] = [
  { time: '00h', flow: 1200, pressure: 3.2 },
  { time: '02h', flow: 950, pressure: 3.1 },
  { time: '04h', flow: 700, pressure: 2.9 },
  { time: '06h', flow: 850, pressure: 3.0 },
  { time: '08h', flow: 1500, pressure: 3.4 },
  { time: '10h', flow: 1800, pressure: 3.6 },
  { time: '12h', flow: 2000, pressure: 3.8 },
  { time: '14h', flow: 1850, pressure: 3.7 },
  { time: '16h', flow: 1700, pressure: 3.5 },
  { time: '18h', flow: 1600, pressure: 3.4 },
  { time: '20h', flow: 1400, pressure: 3.3 },
  { time: '22h', flow: 1100, pressure: 3.1 },
];

export const weeklyAlertsData: WeeklyAlertsData[] = [
  { day: 'Lun', alerts: 3 },
  { day: 'Mar', alerts: 5 },
  { day: 'Mer', alerts: 2 },
  { day: 'Jeu', alerts: 7 },
  { day: 'Ven', alerts: 4 },
  { day: 'Sam', alerts: 1 },
  { day: 'Dim', alerts: 2 },
];

export const sensors: Sensor[] = [
  sensorWithHistory({ id: 'S001', name: 'Capteur Débit - Réseau Nord', type: 'flow', status: 'online', value: 1250, unit: 'm³/h', location: { x: 100, y: 100 }, lastUpdate: '2026-01-15 14:30', batteryLevel: 91, signalQuality: 88 }),
  sensorWithHistory({ id: 'S002', name: 'Capteur Pression - Réseau Sud', type: 'pressure', status: 'online', value: 3.5, unit: 'bar', location: { x: 200, y: 200 }, lastUpdate: '2026-01-15 14:28', batteryLevel: 84, signalQuality: 93 }),
  sensorWithHistory({ id: 'S003', name: 'Capteur Qualité - Station Est', type: 'quality', status: 'alert', value: 7.2, unit: 'pH', location: { x: 300, y: 150 }, lastUpdate: '2026-01-15 14:25', batteryLevel: 62, signalQuality: 54 }),
  sensorWithHistory({ id: 'S004', name: 'Capteur Débit - Réseau Ouest', type: 'flow', status: 'offline', value: 0, unit: 'm³/h', location: { x: 150, y: 250 }, lastUpdate: '2026-01-15 13:45', batteryLevel: 28, signalQuality: 14 }),
  sensorWithHistory({ id: 'S005', name: 'Capteur Pression - Réseau Central', type: 'pressure', status: 'online', value: 3.8, unit: 'bar', location: { x: 225, y: 175 }, lastUpdate: '2026-01-15 14:32', batteryLevel: 76, signalQuality: 81 }),
];

export const alerts: Alert[] = [
  { id: 'A001', title: 'Fuite détectée', description: 'Anomalie de débit sur la canalisation C12', severity: 'critical', status: 'active', timestamp: '2026-01-19 14:30', location: 'Zone manar 1', sensorId: 'S003' },
  { id: 'A002', title: 'Pression anormale', description: 'Baisse de pression détectée', severity: 'high', status: 'active', timestamp: '2026-01-17 14:15', location: 'zone manar 2', sensorId: 'S005' },
  { id: 'A003', title: 'Capteur hors ligne', description: 'Capteur S004 ne répond plus', severity: 'medium', status: 'active', timestamp: '2026-01-15 13:45', location: 'Zone cite ennaser', sensorId: 'S004' },
  { id: 'A004', title: 'Qualité d\'eau', description: 'pH légèrement élevé', severity: 'low', status: 'resolved', timestamp: '2026-01-08 12:00', location: 'Station Est', sensorId: 'S003' },
  { id: 'A005', title: 'Maintenance requise', description: 'Calibration nécessaire', severity: 'medium', status: 'active', timestamp: '2026-01-02 11:30', location: 'Pompe #3', sensorId: 'S002' },
];

export const maintenanceTasks: MaintenanceTask[] = [
  {
    id: 'MT-001',
    title: 'Pompe #3 - Station Est',
    description: 'Remplacement joint',
    priority: 'high',
    status: 'pending',
    dueDate: '2026-02-24',
    aiConfidence: 94,
    technician: 'Amine Ben Youssef',
    technicianPhone: '+216 20 123 456',
    supervisor: 'Leila Kacem',
    maintenanceDate: '2026-02-24',
    duration: '3h 15m',
    level: 'Niveau 1',
    location: 'Station Est',
  },
  {
    id: 'MT-002',
    title: 'Vanne #45 - Zone manar 1',
    description: 'Calibration',
    priority: 'medium',
    status: 'pending',
    dueDate: '2026-02-26',
    aiConfidence: 87,
    technician: 'Sami Trabelsi',
    technicianPhone: '+216 29 987 654',
    supervisor: 'Hana Chikhi',
    maintenanceDate: '2026-02-26',
    duration: '2h 00m',
    level: 'Niveau 2',
    location: 'Zone manar 1',
  },
  {
    id: 'MT-003',
    title: 'Capteur #112 - Réservoir Nord',
    description: 'Nettoyage',
    priority: 'low',
    status: 'pending',
    dueDate: '2026-02-28',
    aiConfidence: 72,
    technician: 'Nadia Mansouri',
    technicianPhone: '+216 71 654 321',
    supervisor: 'Mohamed Triki',
    maintenanceDate: '2026-02-28',
    duration: '1h 20m',
    level: 'Niveau 1',
    location: 'Réservoir Nord',
  },
  {
    id: 'MT-004',
    title: 'Canalisation C12 - Secteur 5',
    description: 'Réparation fuite',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2026-03-01',
    aiConfidence: 68,
    technician: 'Rym Saadi',
    technicianPhone: '+216 22 555 888',
    supervisor: 'Omar Haddad',
    maintenanceDate: '2026-03-01',
    duration: '4h 10m',
    level: 'Niveau 3',
    location: 'Secteur 5',
  },
  {
    id: 'MT-005',
    title: 'Pompe #7 - Station Sud',
    description: 'Inspection routine',
    priority: 'medium',
    status: 'pending',
    dueDate: '2026-03-05',
    aiConfidence: 85,
    technician: 'Adel Khadhra',
    technicianPhone: '+216 23 444 999',
    supervisor: 'Sarra Jaziri',
    maintenanceDate: '2026-03-05',
    duration: '2h 45m',
    level: 'Niveau 2',
    location: 'Station Sud',
  },
];

export const networkNodes: NetworkNode[] = [
  { id: 'R1', type: 'reservoir', name: 'Réservoir Principal', x: 100, y: 100, status: 'normal', connections: ['J1'] },
  { id: 'P1', type: 'pump', name: 'Pompe #1', x: 200, y: 150, status: 'normal', connections: ['J1', 'J2'] },
  { id: 'P2', type: 'pump', name: 'Pompe #2', x: 400, y: 300, status: 'critical', connections: ['J2', 'J3'] },
  { id: 'P3', type: 'pump', name: 'Pompe #3', x: 150, y: 350, status: 'normal', connections: ['J3'] },
  { id: 'S1', type: 'sensor', name: 'Capteur S1', x: 250, y: 120, status: 'normal', connections: ['J1'] },
  { id: 'S2', type: 'sensor', name: 'Capteur S2', x: 350, y: 200, status: 'warning', connections: ['J2'] },
  { id: 'S3', type: 'sensor', name: 'Capteur S3', x: 200, y: 280, status: 'normal', connections: ['J3'] },
  { id: 'S4', type: 'sensor', name: 'Capteur S4', x: 450, y: 250, status: 'normal', connections: ['J2'] },
  { id: 'V1', type: 'valve', name: 'Vanne V1', x: 300, y: 180, status: 'normal', connections: ['J1', 'J2'] },
  { id: 'V2', type: 'valve', name: 'Vanne V2', x: 380, y: 350, status: 'warning', connections: ['J2', 'J3'] },
  { id: 'J1', type: 'junction', name: 'Jonction J1', x: 250, y: 180, status: 'normal', connections: ['R1', 'P1', 'S1', 'V1'] },
  { id: 'J2', type: 'junction', name: 'Jonction J2', x: 380, y: 220, status: 'warning', connections: ['P1', 'P2', 'S2', 'S4', 'V1'] },
  { id: 'J3', type: 'junction', name: 'Jonction J3', x: 280, y: 320, status: 'normal', connections: ['P2', 'P3', 'S3', 'V2'] },
];

export const networkEdges: NetworkEdge[] = [
  { id: 'E1', from: 'R1', to: 'J1', status: 'normal', flowRate: 1200 },
  { id: 'E2', from: 'J1', to: 'P1', status: 'normal', flowRate: 800 },
  { id: 'E3', from: 'J1', to: 'S1', status: 'normal', flowRate: 200 },
  { id: 'E4', from: 'J1', to: 'V1', status: 'normal', flowRate: 600 },
  { id: 'E5', from: 'P1', to: 'J2', status: 'normal', flowRate: 800 },
  { id: 'E6', from: 'V1', to: 'J2', status: 'normal', flowRate: 600 },
  { id: 'E7', from: 'J2', to: 'S2', status: 'warning', flowRate: 150 },
  { id: 'E8', from: 'J2', to: 'S4', status: 'normal', flowRate: 180 },
  { id: 'E9', from: 'J2', to: 'P2', status: 'critical', flowRate: 900 },
  { id: 'E10', from: 'P2', to: 'J3', status: 'critical', flowRate: 900 },
  { id: 'E11', from: 'J3', to: 'S3', status: 'normal', flowRate: 200 },
  { id: 'E12', from: 'J3', to: 'P3', status: 'normal', flowRate: 400 },
  { id: 'E13', from: 'J2', to: 'V2', status: 'warning', flowRate: 300 },
  { id: 'E14', from: 'V2', to: 'J3', status: 'warning', flowRate: 300 },
];

export const sensorStatusData = [
  { name: 'En ligne', value: 3, color: '#10b981' },
  { name: 'Alerte', value: 1, color: '#f59e0b' },
  { name: 'Hors ligne', value: 1, color: '#ef4444' },
];
