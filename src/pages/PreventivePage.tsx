import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ChevronLeft, Download, Calendar, CheckCircle2, Clock, AlertTriangle, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const preventives = [
  { id: 'PRV-001', site: 'Cité Ennasr (NP3)', frequence: 'Mensuelle', prochaine: '2026-06-15', derniere: '2026-05-15', statut: 'Planifiée', completionRate: 95, technicien: 'Sami Trabelsi' },
  { id: 'PRV-002', site: 'Ariana (NP5)', frequence: 'Mensuelle', prochaine: '2026-06-20', derniere: '2026-05-20', statut: 'Planifiée', completionRate: 88, technicien: 'Khalil Mzali' },
  { id: 'PRV-003', site: 'Manar 1 (NP1)', frequence: 'Bi-mensuelle', prochaine: '2026-06-01', derniere: '2026-05-15', statut: 'En retard', completionRate: 72, technicien: 'Ahmed Ben Ali' },
  { id: 'PRV-004', site: 'Manar 2 (NP4)', frequence: 'Trimestrielle', prochaine: '2026-07-10', derniere: '2026-04-10', statut: 'Planifiée', completionRate: 91, technicien: 'Sami Trabelsi' },
  { id: 'PRV-005', site: 'Jardin El Manzeh (NP2)', frequence: 'Mensuelle', prochaine: '2026-06-01', derniere: '2026-05-01', statut: 'Complétée', completionRate: 100, technicien: 'Khalil Mzali' },
];

const completionData = [
  { mois: 'Jan', taux: 88 }, { mois: 'Fév', taux: 92 }, { mois: 'Mar', taux: 85 },
  { mois: 'Avr', taux: 96 }, { mois: 'Mai', taux: 90 },
];

const pieData = [
  { name: 'Mensuelle', value: 3, color: '#06b6d4' },
  { name: 'Bi-mensuelle', value: 1, color: '#3b82f6' },
  { name: 'Trimestrielle', value: 1, color: '#8b5cf6' },
];

const statusColors: Record<string, string> = {
  'Planifiée': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25',
  'En retard': 'bg-red-500/10 text-red-400 border-red-500/25',
  'Complétée': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
};

export function PreventivePage() {
  const [activeRow, setActiveRow] = useState<string | null>(null);

  const planifiees = preventives.filter(p => p.statut === 'Planifiée').length;
  const retard = preventives.filter(p => p.statut === 'En retard').length;
  const completees = preventives.filter(p => p.statut === 'Complétée').length;
  const avgCompletion = Math.round(preventives.reduce((a, p) => a + p.completionRate, 0) / preventives.length);

  return (
    <div className="space-y-6 animate-in fade-in duration-400">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <Link to="/dashboard/historique" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10">
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 font-mono">Historique / Préventif</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Maintenance Préventive</h1>
            <p className="text-slate-400 text-sm mt-0.5">Suivi et planification des maintenances préventives</p>
          </div>
        </div>
        <Button className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20 rounded-xl gap-2">
          <Download className="h-4 w-4" />Exporter
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Planifiées', value: planifiees, icon: Calendar, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
          { label: 'Complétées', value: completees, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          { label: 'En retard', value: retard, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
          { label: 'Taux moy.', value: `${avgCompletion}%`, icon: Activity, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
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
            <Activity className="h-4 w-4 text-emerald-400" />Taux de complétion mensuel (%)
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={completionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="mois" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[70, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
              <Bar dataKey="taux" name="Taux %" fill="#10b981" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm font-bold text-white mb-4">Répartition fréquences</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={65} dataKey="value" labelLine={false}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['ID','Site','Fréquence','Dernière','Prochaine','Taux','Technicien','Statut'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preventives.map((row, i) => (
                <tr
                  key={row.id}
                  onClick={() => setActiveRow(activeRow === row.id ? null : row.id)}
                  className={cn('border-b border-white/[0.03] hover:bg-white/[0.04] transition-colors cursor-pointer', activeRow === row.id ? 'bg-cyan-500/5' : i % 2 === 1 ? 'bg-white/[0.01]' : '')}
                >
                  <td className="px-5 py-3.5 font-mono text-[11px] text-slate-400">{row.id}</td>
                  <td className="px-5 py-3.5 text-slate-300 text-xs font-medium">{row.site}</td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs">{row.frequence}</td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-slate-400">{row.derniere}</td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-white font-bold">{row.prochaine}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className={cn('h-full rounded-full', row.completionRate >= 90 ? 'bg-emerald-500' : row.completionRate >= 75 ? 'bg-amber-500' : 'bg-red-500')} style={{ width: `${row.completionRate}%` }} />
                      </div>
                      <span className="text-xs font-bold text-white font-mono">{row.completionRate}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-300 text-xs">{row.technicien}</td>
                  <td className="px-5 py-3.5"><span className={cn('px-2.5 py-0.5 rounded-full text-[10px] font-bold border', statusColors[row.statut])}>{row.statut}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
