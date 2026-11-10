export interface SensorReading {
  timestamp: string;
  value: number;
}

export interface Sensor {
  id: string;
  name: string;
  type: 'flow' | 'pressure' | 'quality';
  status: 'online' | 'offline' | 'alert';
  value: number;
  unit: string;
  location: { x: number; y: number };
  lastUpdate: string;
  batteryLevel: number;
  signalQuality: number;
  history: SensorReading[];
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'resolved';
  timestamp: string;
  location: string;
  sensorId?: string;
}

export interface MaintenanceTask {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  aiConfidence: number;
  assignedTo?: string;
  technician?: string;
  technicianPhone?: string;
  supervisor?: string;
  maintenanceDate?: string;
  duration?: string;
  level?: string;
  location: string;
}

export interface NetworkNode {
  id: string;
  type: 'reservoir' | 'pump' | 'sensor' | 'valve' | 'junction';
  name: string;
  x: number;
  y: number;
  status: 'normal' | 'warning' | 'critical';
  connections: string[];
}

export interface NetworkEdge {
  id: string;
  from: string;
  to: string;
  status: 'normal' | 'warning' | 'critical';
  flowRate?: number;
}

export interface DashboardStats {
  leaksDetected: number;
  activeAlerts: number;
  networkHealth: number;
  activeSensors: number;
  leaksTrend: number;
  alertsTrend: number;
  healthTrend: number;
  sensorsAvailability: number;
}

export interface FlowPressureData {
  time: string;
  flow: number;
  pressure: number;
}

export interface WeeklyAlertsData {
  day: string;
  alerts: number;
}
