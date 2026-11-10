import { useState } from 'react';
import {
  Brain, Activity, Droplets, Zap, AlertTriangle, TrendingUp, Cpu, Radar, Gauge, Radio, Flame
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, AreaChart, Area, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RadarComponent
} from 'recharts';
import { cn } from '@/lib/utils';

export function IaAnalytiquePage() {
  const [selectedSector, setSelectedSector] = useState('all');

  // Leak probability data over time
  const leakProbabilityData = [
    { time: '00:00', probability: 8, recent_leaks: 0, sensor_anomalies: 2 },
    { time: '04:00', probability: 12, recent_leaks: 1, sensor_anomalies: 3 },
    { time: '08:00', probability: 18, recent_leaks: 1, sensor_anomalies: 5 },
    { time: '12:00', probability: 25, recent_leaks: 2, sensor_anomalies: 7 },
    { time: '16:00', probability: 32, recent_leaks: 3, sensor_anomalies: 9 },
    { time: '20:00', probability: 28, recent_leaks: 2, sensor_anomalies: 6 },
    { time: '24:00', probability: 22, recent_leaks: 1, sensor_anomalies: 4 },
  ];

  // Sector risk analysis
  const sectorRiskData = [
    { name: 'Nord', probability: 45, severity: 7, occurrences: 12 },
    { name: 'Sud', probability: 28, severity: 4, occurrences: 5 },
    { name: 'Est', probability: 62, severity: 8, occurrences: 18 },
    { name: 'Ouest', probability: 35, severity: 5, occurrences: 8 },
    { name: 'Centre', probability: 52, severity: 6, occurrences: 14 },
  ];

  // AI confidence by analysis type
  const aiConfidenceData = [
    { category: 'Acoustique', A: 92, fullMark: 100 },
    { category: 'Débit', A: 88, fullMark: 100 },
    { category: 'Pression', A: 85, fullMark: 100 },
    { category: 'Qualité', A: 78, fullMark: 100 },
    { category: 'Anomalie', A: 81, fullMark: 100 },
  ];

  // Recent anomalies
  const recentAnomalies = [
    { id: 'AN-2847', type: 'Fuite', sector: 'Est', probability: 92, time: 'il y a 8min', status: 'critical', sensors: ['SEN-045', 'SEN-046'] },
    { id: 'AN-2846', type: 'Dégradation', sector: 'Nord', probability: 78, time: 'il y a 23min', status: 'warning', sensors: ['SEN-012', 'SEN-013', 'SEN-014'] },
    { id: 'AN-2845', type: 'Anomalie Débit', sector: 'Centre', probability: 65, time: 'il y a 47min', status: 'alert', sensors: ['SEN-028'] },
    { id: 'AN-2844', type: 'Surpression', sector: 'Ouest', probability: 52, time: 'il y a 1h 15min', status: 'warning', sensors: ['SEN-031', 'SEN-032'] },
    { id: 'AN-2843', type: 'Fuite', sector: 'Sud', probability: 41, time: 'il y a 2h 30min', status: 'resolved', sensors: ['SEN-052'] },
  ];

  // Correlation matrix
  const correlationData = [
    { time: 'Lun', temp: 22, flow: 1200, pressure: 4.2, leaks: 2 },
    { time: 'Mar', temp: 23, flow: 1280, pressure: 4.1, leaks: 3 },
    { time: 'Mer', temp: 24, flow: 1450, pressure: 3.9, leaks: 5 },
    { time: 'Jeu', temp: 25, flow: 1680, pressure: 3.8, leaks: 8 },
    { time: 'Ven', temp: 26, flow: 1890, pressure: 3.6, leaks: 12 },
    { time: 'Sam', temp: 27, flow: 2100, pressure: 3.4, leaks: 15 },
    { time: 'Dim', temp: 26, flow: 1950, pressure: 3.5, leaks: 13 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ── Header Futuriste ── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-cyan-600/5 to-blue-600/10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400 font-mono flex items-center gap-1.5">
                <Brain className="h-3 w-3" />
                Moteur IA Prédictif
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Détection & Prédiction d'Anomalies</h1>
            <p className="text-slate-400 text-sm mt-1">Analyse en temps réel basée sur l'intelligence artificielle - Probabilités de fuites et dégradations</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/30 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-violet-400 animate-pulse" />
              <span className="text-xs font-semibold text-violet-300">IA Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Probabilité Moyenne', value: '32%', icon: Radar, color: 'text-amber-400', bg: 'bg-amber-500/10', trend: '+8%' },
          { label: 'Anomalies Détectées (24h)', value: '47', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', trend: '+12' },
          { label: 'Confiance IA Moyenne', value: '86%', icon: Brain, color: 'text-violet-400', bg: 'bg-violet-500/10', trend: '+4%' },
          { label: 'Secteurs à Risque', value: '3/5', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10', trend: '+1' },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className={cn('page-card p-5 border border-white/10 relative overflow-hidden group')}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="relative flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', kpi.bg)}>
                    <Icon className={cn('h-5 w-5', kpi.color)} />
                  </div>
                  <span className="text-xs font-semibold text-emerald-400">{kpi.trend}</span>
                </div>
                <div>
                  <p className="text-3xl font-extrabold text-white">{kpi.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{kpi.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Main Charts Row 1 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leak Probability Timeline */}
        <div className="lg:col-span-2 page-card p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-white text-lg">Probabilité de Fuite - Tendance 24h</h3>
              <p className="text-xs text-slate-500 mt-1">Prédiction par algorithme LSTM</p>
            </div>
            <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30 text-xs">Temps réel</Badge>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={leakProbabilityData}>
              <defs>
                <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)' }} />
              <Area type="monotone" dataKey="probability" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorProb)" name="Probabilité %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Risk Sectors */}
        <div className="page-card p-6 border border-white/10">
          <h3 className="font-bold text-white text-lg mb-6">Secteurs à Risque</h3>
          <div className="space-y-3">
            {sectorRiskData.sort((a, b) => b.probability - a.probability).map((sector, idx) => (
              <div key={idx} className={cn(
                'p-3 rounded-lg border transition-all cursor-pointer group',
                sector.probability > 50 ? 'bg-red-500/10 border-red-500/25 hover:border-red-500/50' :
                sector.probability > 35 ? 'bg-amber-500/10 border-amber-500/25 hover:border-amber-500/50' :
                'bg-white/5 border-white/10 hover:border-cyan-500/30'
              )}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-white text-sm">{sector.name}</p>
                  <span className={cn('text-xs font-bold', sector.probability > 50 ? 'text-red-400' : 'text-amber-400')}>{sector.probability}%</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className={cn('h-full', sector.probability > 50 ? 'bg-red-500' : 'bg-amber-500')} style={{ width: `${sector.probability}%` }} />
                  </div>
                  <span>{sector.occurrences} évén.</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Charts Row 2 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sector Risk Analysis */}
        <div className="page-card p-6 border border-white/10">
          <h3 className="font-bold text-white text-lg mb-6">Analyse de Risque par Secteur</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sectorRiskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)' }} />
              <Legend />
              <Bar dataKey="probability" fill="#f97316" name="Probabilité %" radius={[8, 8, 0, 0]} />
              <Bar dataKey="severity" fill="#ef4444" name="Sévérité (0-10)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Correlation Analysis */}
        <div className="page-card p-6 border border-white/10">
          <h3 className="font-bold text-white text-lg mb-6">Corrélation Paramètres vs Fuites</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={correlationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.5)" />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)' }} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#fbbf24" strokeWidth={2} name="Température (°C)" dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="leaks" stroke="#ef4444" strokeWidth={2} name="Fuites Détectées" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── AI Confidence Radar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="page-card p-6 border border-white/10">
          <h3 className="font-bold text-white text-lg mb-6">Confiance IA par Méthode d'Analyse</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={aiConfidenceData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="category" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis stroke="rgba(255,255,255,0.5)" />
              <RadarComponent name="Confiance (%)" dataKey="A" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.25} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Anomalies Détectées */}
        <div className="page-card p-6 border border-white/10">
          <h3 className="font-bold text-white text-lg mb-6">Anomalies Récentes</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {recentAnomalies.map((anomaly) => (
              <div key={anomaly.id} className={cn(
                'p-3 rounded-lg border transition-all',
                anomaly.status === 'critical' ? 'bg-red-500/10 border-red-500/25' :
                anomaly.status === 'warning' ? 'bg-amber-500/10 border-amber-500/25' :
                anomaly.status === 'alert' ? 'bg-yellow-500/10 border-yellow-500/25' :
                'bg-emerald-500/10 border-emerald-500/25'
              )}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-white text-sm">{anomaly.type}</p>
                      <span className="text-[10px] font-mono text-slate-400">{anomaly.id}</span>
                    </div>
                    <p className="text-xs text-slate-400">{anomaly.sector} • {anomaly.time}</p>
                  </div>
                  <span className={cn('text-xs font-bold', anomaly.probability > 80 ? 'text-red-400' : 'text-amber-400')}>{anomaly.probability}%</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {anomaly.sensors.map(sensor => (
                    <Badge key={sensor} variant="outline" className="text-[9px] bg-white/5 border-white/10 text-slate-300">{sensor}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── AI Insights ── */}
      <div className="page-card p-6 border border-white/10">
        <h3 className="font-bold text-white text-lg mb-6 flex items-center gap-2">
          <Cpu className="h-5 w-5 text-violet-400" />
          Insights Intelligents
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: AlertTriangle, title: 'Alerte Critique', desc: 'Secteur Est: 92% de probabilité de fuite majeure dans les 6 prochaines heures', color: 'text-red-400', bg: 'bg-red-500/10' },
            { icon: TrendingUp, title: 'Tendance Ascendante', desc: 'Augmentation de 24% des anomalies acoustiques. Maintenance préventive recommandée', color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { icon: Zap, title: 'Optimisation', desc: 'Réduction possible de 12% de la pression moyenne sans compromettre la distribution', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          ].map((insight, idx) => {
            const Icon = insight.icon;
            return (
              <div key={idx} className={cn('p-4 rounded-lg border border-white/10', insight.bg)}>
                <div className="flex items-start gap-3">
                  <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', insight.color)} />
                  <div>
                    <p className="font-semibold text-white text-sm">{insight.title}</p>
                    <p className="text-xs text-slate-400 mt-1">{insight.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Footer Info ── */}
      <div className="bg-violet-500/5 border border-violet-500/20 rounded-lg p-4">
        <p className="text-xs text-slate-400 leading-relaxed">
          <span className="text-violet-400 font-semibold">Modèle IA: </span>
          Les prédictions sont basées sur des réseaux neuronaux LSTM entraînés sur 5 ans d'historique de données SONEDE. 
          Précision: <span className="text-emerald-400 font-semibold">94.2%</span> | Dernière mise à jour: il y a 2 min | Capteurs actifs: 847
        </p>
      </div>
    </div>
  );
}