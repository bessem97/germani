import { Link } from 'react-router-dom';
import { Droplets, ChevronLeft, AlertTriangle, CheckCircle2, Clock, TrendingDown, Activity, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const fuites = [
  { id: 'FT-001', date: '2026-05-28', site: 'Manar 1 (NP1)', coordonnees: '36.8095°N, 10.1318°E', type: 'Majeure', volume: 145, pression: 1.2, statut: 'Active', detection: 'IA Acoustique', delaiDetection: '< 1 min' },
  { id: 'FT-002', date: '2026-05-22', site: 'Manar 2 (NP4)', coordonnees: '36.8112°N, 10.1290°E', type: 'Mineure', volume: 28, pression: 2.1, statut: 'Résolue', detection: 'Capteur Pression', delaiDetection: '3 min' },
  { id: 'FT-003', date: '2026-05-18', site: 'Ariana (NP5)', coordonnees: '36.8665°N, 10.1647°E', type: 'Majeure', volume: 210, pression: 0.9, statut: 'Résolue', detection: 'IA Acoustique', delaiDetection: '< 1 min' },
  { id: 'FT-004', date: '2026-05-14', site: 'Cité Ennasr (NP3)', coordonnees: '36.8612°N, 10.1647°E', type: 'Mineure', volume: 12, pression: 3.0, statut: 'Résolue', detection: 'Débit Anormal', delaiDetection: '8 min' },
  { id: 'FT-005', date: '2026-05-10', site: 'Manar 1 (NP1)', coordonnees: '36.8095°N, 10.1318°E', type: 'Critique', volume: 380, pression: 0.4, statut: 'Résolue', detection: 'IA Acoustique', delaiDetection: '< 30s' },
];

const volumeData = [
  { mois: 'Jan', volume: 420 }, { mois: 'Fév', volume: 280 }, { mois: 'Mar', volume: 540 },
  { mois: 'Avr', volume: 190 }, { mois: 'Mai', volume: 775 },
];

const byTypeData = [
  { type: 'Critique', count: 1 }, { type: 'Majeure', count: 2 }, { type: 'Mineure', count: 2 },
];

const typeColors: Record<string, string> = {
  Critique: 'bg-red-500/15 text-red-400 border-red-500/30',
  Majeure: 'bg-orange-500/10 text-orange-400 border-orange-500/25',
  Mineure: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
};
const statusColors: Record<string, string> = {
  Active: 'bg-red-500/15 text-red-400 border-red-500/30',
  Résolue: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
};

export function FuitePage() {
  const total = fuites.length;
  const active = fuites.filter(f => f.statut === 'Active').length;
  const totalVol = fuites.reduce((a, f) => a + f.volume, 0);
  const critique = fuites.filter(f => f.type === 'Critique').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-400">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <Link to="/dashboard/historique" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10">
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 font-mono">Historique / Fuites</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Détection & Suivi des Fuites</h1>
            <p className="text-slate-400 text-sm mt-0.5">Historique des événements de fuite détectés par l'IA</p>
          </div>
        </div>
        {active > 0 && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/25 rounded-xl px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-red-400 animate-ping" />
            <span className="text-sm font-bold text-red-400">{active} fuite{active > 1 ? 's' : ''} ACTIVE{active > 1 ? 'S' : ''}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total fuites', value: total, icon: Droplets, color: 'text-slate-300', bg: 'bg-white/5', border: 'border-white/10' },
          { label: 'Actives', value: active, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
          { label: 'Critiques', value: critique, icon: Clock, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
          { label: 'Volume total (m³)', value: totalVol, icon: TrendingDown, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
        ].map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className={cn('rounded-2xl p-4 border flex flex-col gap-2', k.bg, k.border)}>
              <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-white/5">
                <Icon className={cn('h-4 w-4', k.color)} />
              </div>
              <p className={cn('text-2xl font-extrabold', k.color)}>{k.value}</p>
              <p className="text-[11px] text-slate-500">{k.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-red-400" />Volume d'eau perdu mensuel (m³)
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={volumeData}>
              <defs>
                <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="mois" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
              <Area type="monotone" dataKey="volume" name="Volume m³" stroke="#ef4444" fill="url(#volGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm font-bold text-white mb-4">Par criticité</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byTypeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="type" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} width={65} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
              <Bar dataKey="count" name="Fuites" fill="#f97316" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['ID','Date','Site','Type','Volume (m³)','Pression (bar)','Détection','Délai','Statut'].map(h => (
                  <th key={h} className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fuites.map((row, i) => (
                <tr key={row.id} className={cn('border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors', i % 2 === 1 ? 'bg-white/[0.01]' : '')}>
                  <td className="px-4 py-3.5 font-mono text-[11px] text-slate-400">{row.id}</td>
                  <td className="px-4 py-3.5 font-mono text-[11px] text-slate-300">{row.date}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-300 font-medium"><span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-slate-500" />{row.site}</span></td>
                  <td className="px-4 py-3.5"><span className={cn('px-2.5 py-0.5 rounded-full text-[10px] font-bold border', typeColors[row.type])}>{row.type}</span></td>
                  <td className="px-4 py-3.5 font-bold text-red-400 font-mono">{row.volume}</td>
                  <td className="px-4 py-3.5 font-mono text-[11px] text-white">{row.pression}</td>
                  <td className="px-4 py-3.5 text-[11px] text-cyan-400">{row.detection}</td>
                  <td className="px-4 py-3.5 font-mono text-[11px] text-emerald-400 font-bold">{row.delaiDetection}</td>
                  <td className="px-4 py-3.5"><span className={cn('px-2.5 py-0.5 rounded-full text-[10px] font-bold border', statusColors[row.statut])}>{row.statut}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
