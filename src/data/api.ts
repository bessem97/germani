const API_URL = "/water-project";

// The 5 canonical monitored zones — always available as fallback
const DEFAULT_ZONES = [
  {
    id: 1,
    name: "Cité Ennaser (NP3)",
    position: [36.8612, 10.1647],
    location: "36.8612°N, 10.1647°E",
    currentFlow: 42.4,
    currentPressure: 3.2,
    lastReading: "2026-05-27 22:00:00",
    lastAlert: "Aucune alerte récente",
    activeSensors: 12,
    leakProbability: "2.1%",
    networkStatus: "Optimal",
    lastMaintenance: "2026-04-15"
  },
  {
    id: 2,
    name: "Manar 1 (NP1)",
    position: [36.8095, 10.1318],
    location: "36.8095°N, 10.1318°E",
    currentFlow: 78.1,
    currentPressure: 1.8,
    lastReading: "2026-05-27 22:00:00",
    lastAlert: "Pression basse détectée",
    activeSensors: 8,
    leakProbability: "95.7%",
    networkStatus: "Fuite Active",
    lastMaintenance: "2026-03-22"
  },
  {
    id: 3,
    name: "Jardin El Manzeh (NP2)",
    position: [36.8488, 10.1654],
    location: "36.8488°N, 10.1654°E",
    currentFlow: 34.8,
    currentPressure: 3.4,
    lastReading: "2026-05-27 22:00:00",
    lastAlert: "Aucune alerte récente",
    activeSensors: 15,
    leakProbability: "0.8%",
    networkStatus: "Optimal",
    lastMaintenance: "2026-05-01"
  },
  {
    id: 4,
    name: "Manar 2 (NP4)",
    position: [36.8112, 10.1290],
    location: "36.8112°N, 10.1290°E",
    currentFlow: 56.2,
    currentPressure: 2.2,
    lastReading: "2026-05-27 22:00:00",
    lastAlert: "Débit élevé détecté",
    activeSensors: 10,
    leakProbability: "44.8%",
    networkStatus: "Attention",
    lastMaintenance: "2026-04-10"
  },
  {
    id: 5,
    name: "Ariana (NP5)",
    position: [36.8665, 10.1647],
    location: "36.8665°N, 10.1647°E",
    currentFlow: 28.5,
    currentPressure: 3.1,
    lastReading: "2026-05-27 22:00:00",
    lastAlert: "Aucune alerte récente",
    activeSensors: 9,
    leakProbability: "0.9%",
    networkStatus: "Optimal",
    lastMaintenance: "2026-04-20"
  }
];

const LS_KEY = "ma2guard_zones";

/** Merge default zones with any extra zones stored in localStorage */
function getLocalZones(): any[] {
  try {
    const stored = localStorage.getItem(LS_KEY);
    if (!stored) return [...DEFAULT_ZONES];
    const parsed: any[] = JSON.parse(stored);
    // Keep default zones + locally added extras (id > 5)
    const extras = parsed.filter((z: any) => z.id > DEFAULT_ZONES.length);
    return [...DEFAULT_ZONES, ...extras];
  } catch {
    return [...DEFAULT_ZONES];
  }
}

function saveLocalZones(zones: any[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(zones));
  } catch {}
}

export async function fetchLatestMesures() {
  try {
    const res = await fetch(`${API_URL}/latest.php`);
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const text = await res.text();
    return JSON.parse(text);
  } catch (e: any) {
    console.error("Erreur fetch:", e);
    throw e;
  }
}

export async function sendMesure(capteur_id: string, pression: number, debit: number) {
  try {
    const res = await fetch(`${API_URL}/receive.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ capteur_id, pression, debit })
    });
    return res.json();
  } catch (e) {
    console.error("Erreur envoi:", e);
    return null;
  }
}

export async function fetchOxygene() {
  try {
    const res = await fetch(`${API_URL}/oxygene.php`);
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const text = await res.text();
    return JSON.parse(text);
  } catch (e: any) {
    console.error("Erreur fetch oxygene:", e);
    return [];
  }
}

// Zones endpoints for Ma2Guard
export async function fetchZones() {
  try {
    const res = await fetch(`${API_URL}/zones.php`);
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const data = await res.json();
    // Sync PHP data to localStorage as well
    if (Array.isArray(data) && data.length > 0) {
      saveLocalZones(data);
      return data;
    }
    return getLocalZones();
  } catch (e) {
    console.error("Erreur fetch zones (utilisation données locales):", e);
    return getLocalZones();
  }
}

export async function addZone(zoneData: {
  name: string;
  latitude: number;
  longitude: number;
  location?: string;
  pression?: number;
  debit?: number;
  statut?: string;
  activeSensors?: number;
  leakProbability?: string;
  lastAlert?: string;
  lastMaintenance?: string;
}) {
  // Build the zone object we'll add locally as fallback
  const newLocalZone = {
    id: Date.now(),
    name: zoneData.name,
    position: [zoneData.latitude, zoneData.longitude],
    location: zoneData.location || `${zoneData.latitude}°N, ${zoneData.longitude}°E`,
    currentFlow: zoneData.debit || 0,
    currentPressure: zoneData.pression || 0,
    lastReading: new Date().toISOString().replace('T', ' ').substring(0, 19),
    lastAlert: zoneData.lastAlert || "Ajoutée manuellement",
    activeSensors: zoneData.activeSensors || 0,
    leakProbability: zoneData.leakProbability || "0.0%",
    networkStatus: zoneData.statut || "Optimal",
    lastMaintenance: zoneData.lastMaintenance || "--"
  };

  try {
    const res = await fetch(`${API_URL}/zones.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(zoneData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as any).error || "Erreur lors de l'ajout");
    }
    const added = await res.json();
    // Persist to localStorage too
    const current = getLocalZones();
    saveLocalZones([...current, added]);
    return added;
  } catch (e) {
    console.warn("Serveur PHP indisponible — zone sauvegardée localement:", e);
    // Save to localStorage as primary persistence
    const current = getLocalZones();
    saveLocalZones([...current, newLocalZone]);
    return newLocalZone;
  }
}

export async function deleteZone(id: number) {
  // Always remove from localStorage
  const current = getLocalZones();
  const updated = current.filter((z: any) => z.id !== id);
  saveLocalZones(updated);

  try {
    const res = await fetch(`${API_URL}/zones.php?id=${id}`, {
      method: "DELETE"
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as any).error || "Erreur lors de la suppression");
    }
    return await res.json();
  } catch (e) {
    console.warn("Serveur PHP indisponible — zone supprimée localement:", e);
    return { success: true, message: "Zone supprimée en local" };
  }
}
