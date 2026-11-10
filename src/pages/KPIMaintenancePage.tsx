import { Brain, Activity, CheckCircle2, AlertTriangle, Clock, TrendingUp, Zap, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const weeklyKpi = [
  { jour: 'Lun', taches: 8, clotures: 7, urgences: 1 },
  { jour: 'Mar', taches: 5, clotures: 5, urgences: 0 },
  { jour: 'Mer', taches: 10, clotures: 8, urgences: 2 },
  { jour: 'Jeu', taches: 6, clotures: 6, urgences: 0 },
  { jour: 'Ven', taches: 9, clotures: 7, urgences: 1 },
  { jour: 'Sam', taches: 3, clotures: 3, urgences: 0 },
];

const mtbfData = [
  { mois: 'Jan', mtbf: 32 }, { mois: 'Fév', mtbf: 28 }, { mois: 'Mar', mtbf: 35 },
  { mois: 'Avr', mtbf: 40 }, { mois: 'Mai', mtbf: 38 },
];

const radarData = [
  { subject: 'Réactivité', score: 88 },
  { subject: 'Prévention', score: 92 },
  { subject: 'Coût', score: 75 },
  { subject: 'Fiabilité', score: 95 },
  { subject: 'Délai', score: 82 },
];

const sitePerf = [
  { site: 'NP1', disponibilite: 94.2, mttr: 1.8, pannes: 3 },
  { site: 'NP2', disponibilite: 99.1, mttr: 0.5, pannes: 1 },
  { site: 'NP3', disponibilite: 97.8, mttr: 0.9, pannes: 2 },
  { site: 'NP4', disponibilite: 88.5, mttr: 2.5, pannes: 5 },
  { site: 'NP5', disponibilite: 98.3, mttr: 0.7, pannes: 1 },
];

export function KPIMaintenancePage() {
  const globalDisp = (sitePerf.reduce((a, s) => a + s.disponibilite, 0) / sitePerf.length).toFixed(1);
  const totalPannes = sitePerf.reduce((a, s) => a + s.pannes, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-400">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400 font-mono">Maintenance / KPI</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">KPI Maintenance</h1>
          <p className="text-slate-400 text-sm mt-0.5">Indicateurs clés de performance du département maintenance</p>
        </div>
        <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/25 rounded-xl px-4 py-2">
          <Brain className="h-4 w-4 text-violet-400" />
          <span className="text-sm font-bold text-violet-400">Score global: {globalDisp}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Disponibilité', value: `${globalDisp}%`, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          { label: 'Pannes totales', value: totalPannes, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
          { label: 'MTBF moyen (j)', value: '37.4', icon: Clock, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
          { label: 'Tâches /sem', value: 41, icon: CheckCircle2, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
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
            <BarChart2 className="h-4 w-4 text-violet-400" />Tâches hebdomadaires
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyKpi}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="jour" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              <Bar dataKey="taches" name="Tâches" fill="#8b5cf6" radius={[4,4,0,0]} />
              <Bar dataKey="clotures" name="Clôturées" fill="#06b6d4" radius={[4,4,0,0]} />
              <Bar dataKey="urgences" name="Urgences" fill="#ef4444" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm font-bold text-white mb-4">Score maintenance</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 9 }} />
              <Radar name="Score" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-cyan-400" />MTBF mensuel (jours)
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={mtbfData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="mois" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
            <Line type="monotone" dataKey="mtbf" name="MTBF (j)" stroke="#06b6d4" strokeWidth={2.5} dot={{ fill: '#06b6d4', r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/5">
          <p className="text-sm font-bold text-white flex items-center gap-2"><Zap className="h-4 w-4 text-amber-400" />Performance par site</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Site','Disponibilité','MTTR (h)','Pannes','Indice Santé'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sitePerf.map((row, i) => {
                const sante = row.disponibilite >= 97 ? 'Excellent' : row.disponibilite >= 92 ? 'Bon' : 'Critique';
                const santeColor = row.disponibilite >= 97 ? 'text-emerald-400 border-emerald-500/25 bg-emerald-500/10' : row.disponibilite >= 92 ? 'text-cyan-400 border-cyan-500/25 bg-cyan-500/10' : 'text-red-400 border-red-500/25 bg-red-500/10';
                return (
                  <tr key={row.site} className={cn('border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors', i % 2 === 1 ? 'bg-white/[0.01]' : '')}>
                    <td className="px-5 py-4 text-white font-bold">{row.site}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden max-w-[80px]">
                          <div className={cn('h-full rounded-full', row.disponibilite >= 97 ? 'bg-emerald-500' : row.disponibilite >= 92 ? 'bg-cyan-500' : 'bg-red-500')} style={{ width: `${row.disponibilite}%` }} />
                        </div>
                        <span className="font-bold font-mono text-white">{row.disponibilite}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-white">{row.mttr}</td>
                    <td className="px-5 py-4 font-bold text-red-400">{row.pannes}</td>
                    <td className="px-5 py-4"><span className={cn('px-2.5 py-0.5 rounded-full text-[10px] font-bold border', santeColor)}>{sante}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
