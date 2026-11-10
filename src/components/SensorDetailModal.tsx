import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, Calendar, Zap, Activity, Wrench, CheckCircle, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Sensor } from '@/types';

interface SensorDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  sensor: Sensor | null;
}

const formatTime = (iso: string) => iso.split(' ')[1]?.substring(0, 5) ?? iso;

const chartData = (history: Sensor['history']) =>
  history.map((item) => ({ time: formatTime(item.timestamp), value: item.value }));

export function SensorDetailModal({ isOpen, onClose, sensor }: SensorDetailModalProps) {
  if (!sensor) return null;

  const data = chartData(sensor.history);

  const installationDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR');
  const calibrationDate = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR');
  const lastPreventiveMaintenance = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR');
  const nextPreventiveMaintenance = new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR');
  const lastLeakReport = sensor.status === 'alert'
    ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')
    : 'Aucune';

  const typeConfig = {
    flow: { label: 'Capteur de Débit', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    pressure: { label: 'Capteur de Pression', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    quality: { label: 'Capteur de Qualité', color: 'text-violet-400', bg: 'bg-violet-500/10' },
  };

  const statusConfig = {
    online: { label: 'En ligne', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25' },
    offline: { label: 'Hors ligne', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/25' },
    alert: { label: 'Alerte', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/25' },
  };

  const st = statusConfig[sensor.status];
  const tp = typeConfig[sensor.type];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-slate-800 pb-4">
          <DialogTitle className="text-2xl font-bold text-white flex items-center justify-between">
            <span>Détails du Capteur</span>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
              <X className="h-5 w-5 text-slate-400" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Header Info */}
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-mono text-slate-500 mb-1">{sensor.id}</p>
                <h3 className="text-xl font-bold text-white">{sensor.name}</h3>
              </div>
              <div className="flex gap-2">
                <Badge className={`${tp.bg} ${tp.color} border-transparent text-xs`}>{tp.label}</Badge>
                <Badge className={`${st.bg} ${st.color} border ${st.border} text-xs`}>{st.label}</Badge>
              </div>
            </div>

            {/* Current Value */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Valeur Actuelle</p>
              <p className="text-3xl font-extrabold text-white">
                {sensor.value}
                <span className="text-lg font-normal text-slate-400 ml-2">{sensor.unit}</span>
              </p>
              <p className="text-xs text-slate-400 mt-2">Mise à jour: {sensor.lastUpdate}</p>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Localisation</p>
            <p className="text-sm text-white font-mono">X: {sensor.location.x} | Y: {sensor.location.y}</p>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Qualité Signal</p>
              <div className="flex items-end gap-3">
                <span className="text-2xl font-bold text-blue-400">{sensor.signalQuality}%</span>
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${sensor.signalQuality > 60 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${sensor.signalQuality}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Niveau Batterie</p>
              <div className="flex items-end gap-3">
                <span className="text-2xl font-bold text-emerald-400">{sensor.batteryLevel}%</span>
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${sensor.batteryLevel > 50 ? 'bg-emerald-500' : sensor.batteryLevel > 20 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${sensor.batteryLevel}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* History Chart */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              <p className="text-xs text-slate-500 uppercase tracking-widest">Historique complet des lectures</p>
            </div>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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

          {/* Dates Information */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-sm">Informations de Maintenance</h4>

            <div className="space-y-2">
              {[
                { icon: Calendar, label: "Date d'Installation", value: installationDate, color: 'text-slate-400' },
                { icon: Zap, label: "Date d'Étalonnage", value: calibrationDate, color: 'text-cyan-400' },
                { icon: Wrench, label: 'Dernier Préventif', value: lastPreventiveMaintenance, color: 'text-emerald-400' },
                { icon: CheckCircle, label: 'Prochain Préventif', value: nextPreventiveMaintenance, color: 'text-blue-400' },
                { icon: Activity, label: 'Dernière Fuite Signalée', value: lastLeakReport, color: sensor.status === 'alert' ? 'text-amber-400' : 'text-slate-400' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${item.color} flex-shrink-0`} />
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm font-semibold text-white mt-0.5">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status History */}
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h4 className="font-semibold text-white text-sm mb-3">Historique Récent</h4>
            <div className="space-y-2 text-xs">
              <p className="text-slate-400">Derniers événements du capteur {sensor.name}:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Dernier redémarrage: il y a 45 jours</li>
                <li>Dernier test de validation: il y a 8 jours</li>
                <li>Nombre d'alertes ce mois: {Math.floor(Math.random() * 5)}</li>
                <li>Temps moyen de réponse: &lt;2 secondes</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
