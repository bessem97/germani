'use client';
import { useEffect, useState, useMemo } from "react";
import { fetchLatestMesures, fetchOxygene, fetchZones, addZone, deleteZone } from "../data/api";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Label as RechartsLabel
} from 'recharts';
import {
  MapPin,
  Droplets,
  Zap,
  AlertTriangle,
  Radio,
  Wrench,
  Activity,
  AlertCircle,
  Clock,
  Download,
  Plus,
  Trash2,
  Database,
  Search,
  X,
  Gauge
} from 'lucide-react';
import { cn } from '@/lib/utils';
import OxygeneTable from '@/components/dashboard/OxygeneTable';
import { toast } from 'sonner';

const generateScadaData = (baseLevel: number, amplitude: number, seedOffset: number) => {
  const data = [];
  const totalPoints = 300;
  for (let i = 0; i <= totalPoints; i++) {
    const x = 24 + (i / totalPoints) * 5;
    let value = 0;
    if (x >= 24.5 && x <= 28.5) {
      const primaryCycle = Math.sin((x - 24.3 + seedOffset) * 2 * Math.PI) * amplitude;
      const secondaryCycle = Math.cos((x * 3.7 + seedOffset * 2) * Math.PI) * (amplitude * 0.4);
      const microFluctuations = Math.sin((x * 15 + seedOffset * 5) * Math.PI) * (amplitude * 0.2);
      const randomNoise = (Math.random() - 0.5) * 0.08;
      value = baseLevel + primaryCycle + secondaryCycle + microFluctuations + randomNoise;
    }
    data.push({ x, value: Math.max(0, value) });
  }
  return data;
};

const DashboardPage = () => {
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [mesures, setMesures] = useState<any[]>([]);
  const [apiError, setApiError] = useState<string>('');
  const [dbZones, setDbZones] = useState<any[]>([]);
  const [oxygene, setOxygene] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Add Zone Form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneLat, setNewZoneLat] = useState('36.84');
  const [newZoneLng, setNewZoneLng] = useState('10.16');
  const [newZoneFlow, setNewZoneFlow] = useState('12.5');
  const [newZonePressure, setNewZonePressure] = useState('3.5');
  const [newZoneStatus, setNewZoneStatus] = useState('Optimal');

  // Delete Confirmation states
  const [zoneToDelete, setZoneToDelete] = useState<any>(null);

  // Fetch zones from MySQL on load
  const loadZones = async () => {
    try {
      const data = await fetchZones();
      setDbZones(data);
    } catch (e: any) {
      console.error("Erreur chargement zones:", e);
    }
  };

  useEffect(() => {
    loadZones();
    const interval = setInterval(loadZones, 8000);
    return () => clearInterval(interval);
  }, []);

  // Fetch metrics periodically
  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await fetchLatestMesures();
        setMesures(data);
        setApiError('');
      } catch (e: any) {
        console.error("Erreur API:", e);
        setApiError(e.message || String(e));
      }
    };
    loadMetrics();
    const interval = setInterval(loadMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Oxygen sensor data
  useEffect(() => {
    const loadOxygen = async () => {
      try {
        const data = await fetchOxygene();
        setOxygene(data);
      } catch (e) {
        console.error(e);
      }
    };
    loadOxygen();
    const interval = setInterval(loadOxygen, 10000);
    return () => clearInterval(interval);
  }, []);

  const getMesureField = (capteurId: string, field: 'debit' | 'pression') => {
    let lookupId = capteurId.trim();
    if (lookupId === 'NP1') lookupId = '+21653713006';
    if (lookupId === 'NP2') lookupId = '22190754';

    const mesure = mesures.find((m: any) => {
      const cid = m.capteur_id?.trim();
      return cid === lookupId || cid === capteurId.trim();
    });
    return mesure?.[field] ?? null;
  };

  // Compile final zones combining Database and active API metrics
  const compiledZones = useMemo(() => {
    return dbZones.map((zone) => {
      // If zone has static capteur mapping (e.g. NP3 in parentheses), update metrics from API in real time
      const match = zone.name.match(/\(([^)]+)\)/);
      if (match && match[1]) {
        const capteurId = match[1];
        const apiFlow = getMesureField(capteurId, 'debit');
        const apiPressure = getMesureField(capteurId, 'pression');
        return {
          ...zone,
          currentFlow: apiFlow !== null ? apiFlow : zone.currentFlow,
          currentPressure: apiPressure !== null ? apiPressure : zone.currentPressure,
          graph: zone.graph || generateScadaData(apiPressure || 5.0, 0.6, zone.id * 0.1)
        };
      }
      return {
        ...zone,
        graph: zone.graph || generateScadaData(parseFloat(zone.currentPressure) || 4.2, 0.5, zone.id * 0.1)
      };
    });
  }, [dbZones, mesures]);

  const filteredZones = useMemo(() => {
    return compiledZones.filter(z =>
      z.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      z.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [compiledZones, searchTerm]);

  // Handle adding monitored zone
  const handleCreateZone = async (e: React.FormEvent) => {
    e.preventDefault();

    // Field validations
    if (!newZoneName.trim()) {
      toast.error("Le nom de la zone est requis.");
      return;
    }
    const lat = parseFloat(newZoneLat);
    const lng = parseFloat(newZoneLng);
    if (isNaN(lat) || lat < 35 || lat > 38) {
      toast.error("Veuillez saisir une latitude valide de Tunisie (35.0 à 38.0).");
      return;
    }
    if (isNaN(lng) || lng < 8 || lng > 12) {
      toast.error("Veuillez saisir une longitude valide de Tunisie (8.0 à 12.0).");
      return;
    }

    const flowVal = parseFloat(newZoneFlow);
    const pressureVal = parseFloat(newZonePressure);

    toast.loading("Enregistrement de la nouvelle zone dans la base de données...", { id: "add-zone" });

    try {
      const added = await addZone({
        name: newZoneName,
        latitude: lat,
        longitude: lng,
        location: `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`,
        debit: isNaN(flowVal) ? 0.0 : flowVal,
        pression: isNaN(pressureVal) ? 0.0 : pressureVal,
        statut: newZoneStatus,
        activeSensors: Math.floor(Math.random() * 8) + 3,
        leakProbability: newZoneStatus === 'Optimal' ? `${(Math.random() * 2).toFixed(1)}%` : `${(Math.random() * 10 + 40).toFixed(1)}%`,
        lastAlert: newZoneStatus === 'Optimal' ? "Aucune alerte" : "Pression anormale détectée",
        lastMaintenance: new Date().toISOString().split('T')[0]
      });

      // Update state dynamically without refresh
      setDbZones(prev => [...prev, added]);
      setSelectedZone(added);

      // Reset fields
      setNewZoneName('');
      setShowAddModal(false);
      toast.success(`Zone "${newZoneName}" ajoutée et synchronisée avec succès !`, { id: "add-zone" });
    } catch (err: any) {
      toast.error(`Erreur lors de l'enregistrement: ${err.message || err}`, { id: "add-zone" });
    }
  };

  // Handle deleting monitored zone
  const handleDeleteZone = async (id: number) => {
    toast.loading("Suppression de la zone dans la base de données...", { id: "delete-zone" });

    try {
      await deleteZone(id);

      // Update state dynamically
      setDbZones(prev => prev.filter(z => z.id !== id));
      if (selectedZone?.id === id) {
        setSelectedZone(null);
      }
      setZoneToDelete(null);
      toast.success("Zone supprimée définitivement avec succès !", { id: "delete-zone" });
    } catch (err: any) {
      toast.error(`Erreur lors de la suppression: ${err.message || err}`, { id: "delete-zone" });
    }
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportRecordsToCsv = (records: any[], filename: string) => {
    if (!records || records.length === 0) {
      downloadFile('Aucune donnée disponible.', filename, 'text/plain;charset=utf-8;');
      return;
    }
    const headers = Array.from(
      records.reduce((keys, record) => {
        Object.keys(record).forEach((key) => keys.add(key));
        return keys;
      }, new Set<string>())
    ) as string[];

    const rows = records.map((record: any) =>
      headers
        .map((header: string) => {
          const value = record[header] ?? '';
          const safeValue = String(value).replace(/"/g, '""');
          return `"${safeValue}"`;
        })
        .join(',')
    );

    const csv = [headers.join(','), ...rows].join('\r\n');
    downloadFile(csv, filename, 'text/csv;charset=utf-8;');
  };

  const handleDownloadMesuresEtGraphe = () => {
    exportRecordsToCsv(mesures, 'mesures-reseau.csv');
    if (selectedZone?.graph) {
      exportRecordsToCsv(selectedZone.graph, `${selectedZone.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_graphe.csv`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Top Banner / Rebranded Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 pb-6 border-b border-cyan-500/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse glow-cyan" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 font-mono">PLATEFORME SECURITE CYBER-PHYSIQUE</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-none">
            Qatra Mind
          </h1>
          <p className="text-slate-400 mt-1 font-light">
            Smart Supervision acoustique
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge
            variant={mesures.length > 0 ? "default" : "destructive"}
            className={cn(
              "px-3 py-1.5 font-mono text-xs border rounded-xl shadow-lg",
              mesures.length > 0
                ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 glow-border-cyan"
                : "bg-red-500/10 text-red-500 border-red-500/20"
            )}
          >
            <Database className="w-3.5 h-3.5 mr-1.5 animate-pulse" />
            {mesures.length > 0
              ? `TELEMETRY ACTIVE (${mesures.length} NŒUDS)`
              : (apiError ? `DECONNECTE: ${apiError}` : "EN ATTENTE D'API...")}
          </Badge>

          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter une zone
          </Button>

          <Button
            variant="outline"
            onClick={handleDownloadMesuresEtGraphe}
            className="border-slate-800 bg-slate-950/60 hover:bg-slate-900 text-slate-300 font-bold px-4 py-2 rounded-xl transition-all"
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter CSV
          </Button>
        </div>
      </div>

      {/* Main Grid: Interactive Map & Zones panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Interactive Map (75% width) */}
        <Card className="lg:col-span-3 overflow-hidden border border-slate-900 bg-slate-950/30 rounded-3xl shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-transparent" />
          <CardHeader className="bg-slate-950/80 border-b border-slate-900 py-5">
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-white">
              <MapPin className="w-5 h-5 text-cyan-400" />
              Cartographie Réseau Tunis
            </CardTitle>
            <CardDescription className="text-slate-400 font-light text-xs">
              Cliquez sur un marqueur acoustique pour charger les flux de pression
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <div className="h-[550px] overflow-hidden">
              <MapContainer
                center={[36.84, 10.16]}
                zoom={12}
                scrollWheelZoom={true}
                className="h-full w-full z-0"
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {compiledZones.map((zone) => {
                  const isSelected = selectedZone?.id === zone.id;
                  const isAttention = zone.networkStatus === 'Attention' || zone.networkStatus === 'Fuite Active';
                  return (
                    <CircleMarker
                      key={zone.id}
                      center={zone.position as [number, number]}
                      radius={isSelected ? 16 : 11}
                      pathOptions={{
                        fillColor: isSelected ? '#38bdf8' : (isAttention ? '#f59e0b' : '#06b6d4'),
                        color: '#030712',
                        weight: isSelected ? 4 : 2,
                        fillOpacity: isSelected ? 1 : 0.8,
                      }}
                      eventHandlers={{
                        click: () => setSelectedZone(zone),
                      }}
                    >
                      <Popup>
                        <div className="space-y-1 text-slate-100 font-sans">
                          <h4 className="font-bold text-cyan-400 text-sm">
                            {zone.name}
                          </h4>
                          <p className="text-xs text-slate-400">{zone.location}</p>
                          <p className="text-xs text-slate-200 mt-1">
                            État: <span className="font-bold">{zone.networkStatus}</span>
                          </p>
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}
              </MapContainer>
            </div>
          </CardContent>
        </Card>

        {/* Zones Panel (25% width) */}
        <Card className="lg:col-span-1 border border-slate-900 bg-slate-950/20 rounded-3xl shadow-2xl flex flex-col max-h-[640px]">
          <CardHeader className="bg-slate-950/80 border-b border-slate-900 py-5">
            <CardTitle className="text-lg font-bold flex items-center justify-between text-white">
              <span className="flex items-center gap-2">
                <Radio className="w-4.5 h-4.5 text-cyan-400 animate-pulse" />
                Zones Surveillées
              </span>
              <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono text-[10px]">
                {filteredZones.length} SITES
              </Badge>
            </CardTitle>

            {/* Search Input inside list */}
            <div className="relative mt-3">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
              <Input
                type="text"
                placeholder="Filtrer les zones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-slate-950/60 border-slate-900 text-xs rounded-lg text-slate-200 placeholder-slate-500 h-8 focus:border-cyan-500/40 focus:ring-0"
              />
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {filteredZones.map((zone) => {
              const isSelected = selectedZone?.id === zone.id;
              const isDanger = zone.networkStatus === 'Attention' || zone.networkStatus === 'Fuite Active';
              return (
                <div
                  key={zone.id}
                  className={cn(
                    "w-full group rounded-2xl border transition-all duration-300 p-4 relative overflow-hidden flex flex-col gap-2.5",
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-transparent border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                      : 'bg-slate-950/40 border-slate-900 hover:border-slate-800'
                  )}
                >
                  <div className="flex items-start justify-between gap-2 relative z-10">
                    <button
                      className="text-left flex-1"
                      onClick={() => setSelectedZone(zone)}
                    >
                      <span className={cn(
                        "text-sm font-semibold block transition-colors truncate",
                        isSelected ? 'text-cyan-400 font-bold' : 'text-slate-200 group-hover:text-cyan-400'
                      )}>
                        {zone.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                        {zone.location}
                      </span>
                    </button>

                    {/* Delete button with validation confirmation prompt */}
                    <button
                      onClick={() => setZoneToDelete(zone)}
                      className="text-slate-600 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                      title="Supprimer la zone"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-1 relative z-10">
                    <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 font-mono px-2 py-0.5 rounded-full">
                      {zone.activeSensors || 0} capteurs
                    </span>
                    <Badge
                      className={cn(
                        "text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border shadow-sm",
                        isDanger
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-green-500/10 text-green-400 border-green-500/20'
                      )}
                    >
                      {zone.networkStatus}
                    </Badge>
                  </div>
                </div>
              );
            })}

            {filteredZones.length === 0 && (
              <div className="text-center py-12 text-slate-500 space-y-2">
                <AlertCircle className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs">Aucune zone ne correspond</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Selected Zone Deep Analytics */}
      {selectedZone && (
        selectedZone.name && selectedZone.name.toLowerCase().includes('oxyg') ? (
          <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-500 border-t border-slate-900 pt-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-cyan-400" />
                  Données d'Oxygène & Température
                </h2>
                <p className="text-sm text-slate-400 font-light">Relevés de la station hydro-chimique</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setSelectedZone(null)}
                className="border-slate-800 text-slate-400 hover:text-white"
              >
                Fermer
              </Button>
            </div>
            <div className="glass-premium rounded-3xl border border-slate-900 overflow-hidden shadow-2xl">
              <OxygeneTable data={oxygene} />
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500 border-t border-slate-900 pt-8">

            {/* Analytics Header bar */}
            <div className="relative rounded-3xl border border-cyan-500/10 bg-slate-950/60 p-6 shadow-xl overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-cyan-500/30 to-transparent" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-inner">
                  <Gauge className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    Analyse Acoustique Spectrale : {selectedZone.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-light">Surveillance dynamique active de la canalisation</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 relative z-10">
                <Button
                  onClick={handleDownloadMesuresEtGraphe}
                  className="bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20 rounded-xl text-xs py-2 px-3 font-semibold transition-all"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Télécharger mesures et graphe
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedZone(null)}
                  className="border-slate-850 bg-slate-950/60 text-slate-400 hover:text-white rounded-xl text-xs py-2 px-3 transition-all"
                >
                  Fermer l'analyse
                </Button>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">

              {/* Telemetry Charts Card */}
              <Card className="border border-slate-900 bg-slate-950/40 rounded-3xl shadow-xl overflow-hidden">
                <CardHeader className="border-b border-slate-900 py-5 bg-slate-950/80">
                  <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    Pression Spectrale Transitoire (24h)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[380px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedZone.graph} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="glowColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#0f172a" strokeDasharray="3 3" />
                        <XAxis
                          dataKey="x"
                          type="number"
                          domain={[24, 29]}
                          ticks={[24, 25, 26, 27, 28, 29]}
                          tickFormatter={(tick) => tick === 24 ? "24 Avr" : `${tick}h`}
                          stroke="#475569"
                          fontSize={11}
                          tickLine={{ stroke: '#1e293b' }}
                        />
                        <YAxis
                          stroke="#475569"
                          fontSize={11}
                          tickLine={{ stroke: '#1e293b' }}
                        >
                          <RechartsLabel
                            value="Pression (Bar)"
                            angle={-90}
                            position="insideLeft"
                            style={{ textAnchor: 'middle', fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }}
                            offset={0}
                          />
                        </YAxis>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#090d1a',
                            border: '1px solid #1e293b',
                            borderRadius: '12px',
                            color: '#fff'
                          }}
                          itemStyle={{ color: '#06b6d4' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#06b6d4"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 5, fill: '#38bdf8', stroke: '#030712', strokeWidth: 2 }}
                          isAnimationActive={true}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Metrics Cards Panel */}
              <Card className="border border-slate-900 bg-slate-950/20 rounded-3xl shadow-xl overflow-hidden">
                <CardHeader className="border-b border-slate-900 py-5 bg-slate-950/80">
                  <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                    <Database className="w-4.5 h-4.5 text-cyan-400" />
                    Indicateurs Cyber-Physiques & Hydriques
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6 grid grid-cols-2 gap-4">
                  {/* Location Info */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-900 hover:border-slate-800 transition-all flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">COORDONNEES</span>
                      <span className="text-sm font-semibold text-slate-200 mt-1 block truncate max-w-[150px]">{selectedZone.location}</span>
                    </div>
                  </div>

                  {/* Flow Rate */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-900 hover:border-slate-800 transition-all flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 mt-0.5">
                      <Droplets className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">DEBIT FLUX</span>
                      <span className="text-base font-bold font-mono text-blue-400 mt-1 block">
                        {selectedZone.currentFlow} <span className="text-xs font-sans text-slate-500 font-normal">m³/h</span>
                      </span>
                    </div>
                  </div>

                  {/* Pressure */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-900 hover:border-slate-800 transition-all flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 mt-0.5">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">PRESSION RESIDUELLE</span>
                      <span className="text-base font-bold font-mono text-amber-400 mt-1 block">
                        {selectedZone.currentPressure} <span className="text-xs font-sans text-slate-500 font-normal">bar</span>
                      </span>
                    </div>
                  </div>

                  {/* Active Sensors */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-900 hover:border-slate-800 transition-all flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 mt-0.5">
                      <Radio className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">SONDES ACOUSTIQUES</span>
                      <span className="text-base font-bold font-mono text-purple-400 mt-1 block">
                        {selectedZone.activeSensors} <span className="text-xs font-sans text-slate-500 font-normal">IoT</span>
                      </span>
                    </div>
                  </div>

                  {/* Leak Probability */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-900 hover:border-slate-800 transition-all flex items-start gap-3 col-span-2">
                    <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500 mt-0.5">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Risque fissure & dégradation</span>
                        <span className="text-xs font-bold text-red-400 font-mono">{selectedZone.leakProbability}</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full bg-red-500 rounded-full"
                          style={{ width: `${parseFloat(selectedZone.leakProbability) || 5}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Network Health Alert Status */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-900 hover:border-slate-800 transition-all col-span-2 flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 mt-0.5">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Statut Réseau & Alertes</span>
                      <p className="text-sm font-semibold text-slate-200 mt-1 block">{selectedZone.lastAlert}</p>
                    </div>
                  </div>

                  {/* Periodic maintenance & reading logs */}
                  <div className="col-span-2 flex gap-4 pt-2">
                    <div className="flex-1 flex items-center gap-2.5 p-3 rounded-xl border border-slate-900 bg-slate-950/40">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase block">DERNIER ACQUITTEMENT</span>
                        <span className="text-xs font-semibold text-slate-300">{selectedZone.lastReading}</span>
                      </div>
                    </div>

                    <div className="flex-1 flex items-center gap-2.5 p-3 rounded-xl border border-slate-900 bg-slate-950/40">
                      <Wrench className="w-4 h-4 text-slate-500" />
                      <div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase block">MAINTENANCE PREVUE</span>
                        <span className="text-xs font-semibold text-slate-300">{selectedZone.lastMaintenance}</span>
                      </div>
                    </div>
                  </div>

                </CardContent>
              </Card>

            </div>

          </div>
        )
      )}

      {/* GORGEOUS MODAL: AJOUTER ZONE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg overflow-hidden border border-slate-800 bg-[#090d1a] rounded-3xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-500 via-blue-500 to-transparent" />

            <div className="flex items-center justify-between pb-4 border-b border-slate-900">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Database className="w-4.5 h-4.5 text-cyan-400" />
                  Ajouter une Zone Surveillée
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-light">
                  Enregistrement persistant dans la base de données SQL.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-950 border border-slate-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateZone} className="space-y-4 pt-4">
              <div className="space-y-1.5">
                <Label htmlFor="zoneName" className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Nom de la zone
                </Label>
                <Input
                  id="zoneName"
                  type="text"
                  placeholder="ex: Manar 3 (NP6)"
                  value={newZoneName}
                  onChange={(e) => setNewZoneName(e.target.value)}
                  className="bg-slate-950 border-slate-900 text-slate-200 placeholder-slate-650 h-10 rounded-xl focus:border-cyan-500/40"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="zoneLat" className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Latitude
                  </Label>
                  <Input
                    id="zoneLat"
                    type="text"
                    placeholder="ex: 36.84"
                    value={newZoneLat}
                    onChange={(e) => setNewZoneLat(e.target.value)}
                    className="bg-slate-950 border-slate-900 text-slate-200 font-mono h-10 rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="zoneLng" className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Longitude
                  </Label>
                  <Input
                    id="zoneLng"
                    type="text"
                    placeholder="ex: 10.16"
                    value={newZoneLng}
                    onChange={(e) => setNewZoneLng(e.target.value)}
                    className="bg-slate-950 border-slate-900 text-slate-200 font-mono h-10 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="zoneFlow" className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Débit initial (m³/h)
                  </Label>
                  <Input
                    id="zoneFlow"
                    type="text"
                    placeholder="ex: 15.4"
                    value={newZoneFlow}
                    onChange={(e) => setNewZoneFlow(e.target.value)}
                    className="bg-slate-950 border-slate-900 text-slate-200 font-mono h-10 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="zonePressure" className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Pression initiale (bar)
                  </Label>
                  <Input
                    id="zonePressure"
                    type="text"
                    placeholder="ex: 4.1"
                    value={newZonePressure}
                    onChange={(e) => setNewZonePressure(e.target.value)}
                    className="bg-slate-950 border-slate-900 text-slate-200 font-mono h-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="zoneStatus" className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Statut Initial du Réseau
                </Label>
                <select
                  id="zoneStatus"
                  value={newZoneStatus}
                  onChange={(e) => setNewZoneStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 text-slate-200 h-10 px-3 rounded-xl focus:border-cyan-500/40 text-sm font-sans"
                >
                  <option value="Optimal">Optimal (Aucune fuite)</option>
                  <option value="Attention">Attention (Anomalie acoustique)</option>
                  <option value="Fuite Active">Fuite Active (Alerte rouge)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-900">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="border-slate-850 text-slate-400 hover:text-white rounded-xl"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold px-6 rounded-xl shadow-lg"
                >
                  Valider & Enregistrer SQL
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG: SUPPRESSION ZONE */}
      {zoneToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md overflow-hidden border border-slate-800 bg-[#090d1a] rounded-3xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500" />

            <div className="flex items-center gap-3.5 pb-3 border-b border-slate-900">
              <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                <Trash2 className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Confirmation de Suppression</h3>
                <p className="text-xs text-slate-500 font-mono uppercase tracking-widest mt-0.5">ACTION DESTRUCTIVE</p>
              </div>
            </div>

            <div className="py-4 text-sm text-slate-300 space-y-2">
              <p>Êtes-vous sûr de vouloir supprimer définitivement la zone suivante ?</p>
              <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl">
                <span className="font-bold text-white block">{zoneToDelete.name}</span>
                <span className="text-xs text-slate-500 font-mono mt-0.5 block">{zoneToDelete.location}</span>
              </div>
              <p className="text-xs text-red-400/80 font-light italic">Cette action est irréversible et effacera l'enregistrement de la base de données SQL.</p>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-900">
              <Button
                variant="outline"
                onClick={() => setZoneToDelete(null)}
                className="border-slate-850 text-slate-400 hover:text-white rounded-xl"
              >
                Annuler
              </Button>
              <Button
                onClick={() => handleDeleteZone(zoneToDelete.id)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold px-5 rounded-xl shadow-lg"
              >
                Confirmer la Suppression
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardPage;