import { useState } from 'react';
import {
  Radio, Search, MapPin, Signal,
  Activity, Droplets, Gauge, Wifi, X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SensorDetailModal } from '@/components/SensorDetailModal';
import { sensors } from '@/data/mockData';
import { cn } from '@/lib/utils';
import type { Sensor } from '@/types';

const statusConfig = {
  online: { label: 'En ligne', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', dot: 'bg-emerald-400' },
  offline: { label: 'Hors ligne', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/25', dot: 'bg-red-400' },
  alert: { label: 'Alerte', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/25', dot: 'bg-amber-400' },
};

const typeConfig = {
  flow: { icon: Droplets, label: 'Débit', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  pressure: { icon: Gauge, label: 'Pression', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  quality: { icon: Activity, label: 'Qualité', color: 'text-violet-400', bg: 'bg-violet-500/10' },
};

export function SensorsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredSensors = sensors.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      (s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)) &&
      (filterStatus ? s.status === filterStatus : true)
    );
  });

  const onlineCount = sensors.filter(s => s.status === 'online').length;
  const alertCount = sensors.filter(s => s.status === 'alert').length;
  const offlineCount = sensors.filter(s => s.status === 'offline').length;
  const avgSignal = Math.round(sensors.reduce((s, x) => s + (x.signalQuality || 0), 0) / sensors.length);

  const kpis = [
    { label: 'En ligne', value: onlineCount, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: Signal },
    { label: 'Signal Moy', value: `${avgSignal}%`, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', icon: Wifi },
    { label: 'Actifs', value: sensors.length, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', icon: Activity },
    { label: 'Alertes', value: alertCount, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Radio },
    { label: 'Hors ligne', value: offlineCount, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', icon: Radio },
  ];

  const handleSensorClick = (sensor: Sensor) => {
    setSelectedSensor(sensor);
    setModalOpen(true);
  };

  return (
    <div className="space-y-7 animate-in fade-in duration-400">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 font-mono">Réseau IoT</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Gestion des Capteurs</h1>
          <p className="text-slate-400 text-sm mt-0.5">Monitoring et configuration de vos capteurs IoT</p>
        </div>
        <div className="flex gap-2">
          {(['online', 'alert', 'offline'] as const).map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(filterStatus === st ? null : st)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                filterStatus === st
                  ? cn(statusConfig[st].bg, statusConfig[st].color, `border-${statusConfig[st].border}`)
                  : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
              )}
            >
              {statusConfig[st].label}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI Grid (5 items - no Battery) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {kpis.map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className={cn('page-card p-4 flex flex-col gap-2 transition-all border', k.border, k.bg)}>
              <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center', k.bg)}>
                <Icon className={cn('h-4.5 w-4.5', k.color)} />
              </div>
              <p className={cn('text-xl font-extrabold', k.color)}>{k.value}</p>
              <p className="text-[11px] text-slate-500 leading-tight">{k.label}</p>
            </div>
          );
        })}
      </div>

      {/* ── Search & Filter ── */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Rechercher un capteur…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-500/40 focus:ring-cyan-500/10"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ── Sensor Cards (Clickable buttons) ── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredSensors.map((sensor) => {
          const st = statusConfig[sensor.status];
          const tp = typeConfig[sensor.type];
          const TypeIcon = tp.icon;
          return (
            <button
              key={sensor.id}
              onClick={() => handleSensorClick(sensor)}
              className={cn(
                'page-card p-5 flex flex-col gap-4 transition-all hover:bg-white/[0.03] hover:scale-[1.01] cursor-pointer text-left border',
                st.border
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn('h-11 w-11 rounded-xl flex items-center justify-center', tp.bg)}>
                    <TypeIcon className={cn('h-5 w-5', tp.color)} />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-slate-500">{sensor.id}</p>
                    <h4 className="font-semibold text-white text-sm leading-snug max-w-[160px] truncate">{sensor.name}</h4>
                  </div>
                </div>
                <div className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border', st.bg, st.color)}>
                  <span className={cn('h-1.5 w-1.5 rounded-full', st.dot, sensor.status === 'online' && 'animate-pulse')} />
                  {st.label}
                </div>
              </div>

              {/* Value Section */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">Valeur actuelle</p>
                  <p className="text-2xl font-extrabold text-white mt-0.5">
                    {sensor.value}
                    <span className="text-sm font-normal text-slate-400 ml-1">{sensor.unit}</span>
                  </p>
                </div>
                <Badge className={cn('text-[10px] border rounded-lg px-2', tp.bg, tp.color)}>
                  {tp.label}
                </Badge>
              </div>

              {/* Signal Only (Battery removed) */}
              <div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase tracking-wider">
                      <Signal className="h-3.5 w-3.5" />
                      Signal
                    </div>
                    <span className={cn(
                      'text-[10px] font-semibold px-1.5 py-0.5 rounded-full',
                      sensor.signalQuality > 75 ? 'bg-emerald-500/10 text-emerald-400' : sensor.signalQuality > 40 ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
                    )}>
                      {sensor.signalQuality > 75 ? 'Bon' : sensor.signalQuality > 40 ? 'Moyen' : 'Faible'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={cn('h-full rounded-full transition-all', sensor.signalQuality > 75 ? 'bg-emerald-500' : sensor.signalQuality > 40 ? 'bg-amber-500' : 'bg-red-500')} style={{ width: `${sensor.signalQuality}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-slate-300">{sensor.signalQuality}%</span>
                  </div>
                </div>
              </div>

              {/* Location Footer */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-white/5 pt-3">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>x:{sensor.location.x} y:{sensor.location.y}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Empty State ── */}
      {filteredSensors.length === 0 && (
        <div className="page-card p-12 text-center border border-white/5">
          <Radio className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">Aucun capteur trouvé</p>
          <p className="text-slate-500 text-sm mt-1">Modifiez vos filtres de recherche</p>
        </div>
      )}

      {/* ── Modal ── */}
      <SensorDetailModal isOpen={modalOpen} onClose={() => setModalOpen(false)} sensor={selectedSensor} />
    </div>
  );
}
