import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Signal, Gauge, Calendar, Activity, Droplets } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { sensors } from '@/data/mockData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';

const typeConfig = {
  flow: { icon: Droplets, label: 'Débit', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  pressure: { icon: Gauge, label: 'Pression', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  quality: { icon: Activity, label: 'Qualité', color: 'text-violet-400', bg: 'bg-violet-500/10' },
};

const formatTime = (iso: string) => iso.split(' ')[1]?.substring(0, 5) ?? iso;

export function SensorDetailPage() {
  const { sensorId } = useParams();
  const navigate = useNavigate();
  const sensor = sensors.find((item) => item.id === sensorId);

  if (!sensor) {
    return (
      <div className="space-y-4 animate-in fade-in duration-400">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Capteur introuvable</h1>
            <p className="text-slate-400 text-sm mt-0.5">Le capteur demandé n&apos;existe pas.</p>
          </div>
        </div>
      </div>
    );
  }

  const tp = typeConfig[sensor.type];
  const TypeIcon = tp.icon;
  const chartData = sensor.history.map((item) => ({
    time: formatTime(item.timestamp),
    value: item.value,
  }));

  return (
    <div className="space-y-7 animate-in fade-in duration-400">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 transition-all">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 font-mono">Fiche Capteur</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">{sensor.name}</h1>
          <p className="text-slate-400 text-sm mt-0.5">Données temps réel et historique complet des lectures</p>
        </div>
      </div>

      {/* KPIs rapides */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <div className="page-card p-4 flex flex-col gap-2 border border-white/10 bg-white/5">
          <p className="text-[11px] text-slate-500">ID</p>
          <p className="text-sm font-bold text-white font-mono">{sensor.id}</p>
        </div>
        <div className="page-card p-4 flex flex-col gap-2 border border-white/10 bg-white/5">
          <p className="text-[11px] text-slate-500">Valeur actuelle</p>
          <p className="text-sm font-bold text-white">
            {sensor.value} <span className="text-xs text-slate-400">{sensor.unit}</span>
          </p>
        </div>
        <div className="page-card p-4 flex flex-col gap-2 border border-white/10 bg-white/5">
          <p className="text-[11px] text-slate-500">Dernière mise à jour</p>
          <p className="text-sm font-bold text-white">{sensor.lastUpdate}</p>
        </div>
        <div className="page-card p-4 flex flex-col gap-2 border border-white/10 bg-white/5">
          <p className="text-[11px] text-slate-500">Signal</p>
          <p className="text-sm font-bold text-cyan-400">{sensor.signalQuality}%</p>
        </div>
      </div>

      {/* Current reading + location */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="page-card p-5 border border-white/10 bg-white/5">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Lecture actuelle</p>
          <p className="text-4xl font-extrabold text-white">
            {sensor.value}
            <span className="text-base font-normal text-slate-400 ml-2">{sensor.unit}</span>
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Signal className="h-4 w-4 text-cyan-400" />
            <span className="text-xs text-slate-300">Qualité du signal: {sensor.signalQuality}%</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <TypeIcon className={cn('h-4 w-4', tp.color)} />
            <span className="text-xs text-slate-300">Type: {tp.label}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="text-xs text-slate-300">Mise à jour: {sensor.lastUpdate}</span>
          </div>
        </div>

        <div className="page-card p-5 border border-white/10 bg-white/5">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Localisation</p>
          <p className="text-sm text-white font-mono">X: {sensor.location.x} | Y: {sensor.location.y}</p>
          <div className="flex items-center gap-3 mt-4">
            <Badge className={cn('border rounded-lg px-2', tp.bg, tp.color)}>{tp.label}</Badge>
            <Badge className={cn(
              'border rounded-lg px-2',
              sensor.status === 'online'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                : sensor.status === 'alert'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                : 'bg-red-500/10 text-red-400 border-red-500/25'
            )}>
              {sensor.status}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-4">Historique des événements:</p>
          <ul className="mt-2 space-y-1 text-xs text-slate-400">
            <li>Dernier redémarrage: il y a 45 jours</li>
            <li>Dernier test de validation: il y a 8 jours</li>
            <li>Nombre d&apos;alertes ce mois: {Math.floor(Math.random() * 5)}</li>
            <li>Temps moyen de réponse: &lt;2 secondes</li>
          </ul>
        </div>
      </div>

      {/* Complete reading history chart */}
      <div className="page-card p-5 border border-white/10 bg-white/5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-4 w-4 text-cyan-400" />
          <p className="text-xs text-slate-500 uppercase tracking-widest">Historique complet des lectures</p>
        </div>
        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="#0f172a" strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                stroke="#475569"
                fontSize={11}
                tickLine={{ stroke: '#1e293b' }}
              />
              <YAxis
                stroke="#475569"
                fontSize={11}
                tickLine={{ stroke: '#1e293b' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090d1a',
                  border: '1px solid #1e293b',
                  borderRadius: '12px',
                  color: '#fff',
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
                isAnimationActive
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
