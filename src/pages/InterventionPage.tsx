import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ChevronLeft, Download, Search, X, Clock, CheckCircle2, AlertTriangle, TrendingUp, Calendar, MapPin, User, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

const interventions = [
  { id: 'INT-001', date: '2026-05-28', site: 'Manar 1 (NP1)', type: 'Urgence', technicien: 'Ahmed Ben Ali', duree: 2.5, status: 'Terminée', cout: 850 },
  { id: 'INT-002', date: '2026-05-25', site: 'Ariana (NP5)', type: 'Préventive', technicien: 'Sami Trabelsi', duree: 1.0, status: 'Terminée', cout: 320 },
  { id: 'INT-003', date: '2026-05-22', site: 'Cité Ennasr (NP3)', type: 'Corrective', technicien: 'Khalil Mzali', duree: 3.5, status: 'Terminée', cout: 1250 },
  { id: 'INT-004', date: '2026-05-20', site: 'Manar 2 (NP4)', type: 'Urgence', technicien: 'Ahmed Ben Ali', duree: 1.5, status: 'Terminée', cout: 650 },
  { id: 'INT-005', date: '2026-05-18', site: 'Jardin El Manzeh (NP2)', type: 'Préventive', technicien: 'Sami Trabelsi', duree: 2.0, status: 'Terminée', cout: 480 },
  { id: 'INT-006', date: '2026-05-15', site: 'Manar 1 (NP1)', type: 'Corrective', technicien: 'Khalil Mzali', duree: 4.0, status: 'En cours', cout: 2100 },
  { id: 'INT-007', date: '2026-05-12', site: 'Ariana (NP5)', type: 'Urgence', technicien: 'Ahmed Ben Ali', duree: 2.0, status: 'Terminée', cout: 950 },
  { id: 'INT-008', date: '2026-05-10', site: 'Cité Ennasr (NP3)', type: 'Préventive', technicien: 'Sami Trabelsi', duree: 1.5, status: 'Terminée', cout: 280 },
];

const monthlyData = [
  { mois: 'Jan', urgences: 3, preventives: 5, correctives: 2 },
  { mois: 'Fév', urgences: 2, preventives: 6, correctives: 3 },
  { mois: 'Mar', urgences: 4, preventives: 4, correctives: 1 },
  { mois: 'Avr', urgences: 1, preventives: 7, correctives: 4 },
  { mois: 'Mai', urgences: 5, preventives: 5, correctives: 3 },
];

const durationData = [
  { mois: 'Jan', duree: 18 }, { mois: 'Fév', duree: 14 },
  { mois: 'Mar', duree: 22 }, { mois: 'Avr', duree: 16 }, { mois: 'Mai', duree: 19 },
];

const typeColors: Record<string, string> = {
  Urgence: 'bg-red-500/10 text-red-400 border-red-500/25',
  Préventive: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25',
  Corrective: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
};
const statusColors: Record<string, string> = {
  'Terminée': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  'En cours': 'bg-blue-500/10 text-blue-400 border-blue-500/25',
};

export function InterventionPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = interventions.filter(i =>
    (i.site.toLowerCase().includes(search.toLowerCase()) || i.technicien.toLowerCase().includes(search.toLowerCase()) || i.id.toLowerCase().includes(search.toLowerCase())) &&
    (filter ? i.type === filter : true)
  );

  const total = interventions.length;
  const terminated = interventions.filter(i => i.status === 'Terminée').length;
  const urgent = interventions.filter(i => i.type === 'Urgence').length;
  const avgDuration = (interventions.reduce((a, i) => a + i.duree, 0) / total).toFixed(1);

  return (
    <div className="space-y-6 animate-in fade-in duration-400">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3">
          <Link to="/dashboard/historique" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/10">
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 font-mono">Historique / Interventions</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Interventions Terrain</h1>
            <p className="text-slate-400 text-sm mt-0.5">Registre complet de toutes les interventions techniques</p>
          </div>
        </div>
        <Button className="bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 hover:bg-cyan-500/20 rounded-xl gap-2">
          <Download className="h-4 w-4" />Exporter CSV
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: total, icon: Wrench, color: 'text-slate-300', bg: 'bg-white/5', border: 'border-white/10' },
          { label: 'Terminées', value: terminated, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          { label: 'Urgences', value: urgent, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
          { label: 'Durée moy. (h)', value: avgDuration, icon: Clock, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-400" />Interventions par mois & type
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="mois" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              <Bar dataKey="urgences" name="Urgences" fill="#ef4444" radius={[4,4,0,0]} />
              <Bar dataKey="preventives" name="Préventives" fill="#06b6d4" radius={[4,4,0,0]} />
              <Bar dataKey="correctives" name="Correctives" fill="#f59e0b" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-cyan-400" />Durée totale mensuelle (heures)
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={durationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="mois" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
              <Line type="monotone" dataKey="duree" name="Heures" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input placeholder="Rechercher…" value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-500/40" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"><X className="h-4 w-4" /></button>}
        </div>
        <div className="flex gap-2">
          {['Urgence', 'Préventive', 'Corrective'].map(t => (
            <button key={t} onClick={() => setFilter(filter === t ? null : t)} className={cn('px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all', filter === t ? typeColors[t] : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20')}>{t}</button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['ID','Date','Site','Type','Technicien','Durée (h)','Coût (DT)','Statut'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={row.id} className={cn('border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors', i % 2 === 1 ? 'bg-white/[0.01]' : '')}>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-slate-400">{row.id}</td>
                  <td className="px-5 py-3.5 text-slate-300 font-mono text-[11px]"><span className="flex items-center gap-1.5"><Calendar className="h-3 w-3 text-slate-500" />{row.date}</span></td>
                  <td className="px-5 py-3.5 text-slate-300 text-xs font-medium"><span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-slate-500" />{row.site}</span></td>
                  <td className="px-5 py-3.5"><span className={cn('px-2.5 py-0.5 rounded-full text-[10px] font-bold border', typeColors[row.type])}>{row.type}</span></td>
                  <td className="px-5 py-3.5 text-slate-300 text-xs"><span className="flex items-center gap-1.5"><User className="h-3 w-3 text-slate-500" />{row.technicien}</span></td>
                  <td className="px-5 py-3.5 text-white font-bold font-mono">{row.duree}</td>
                  <td className="px-5 py-3.5 text-cyan-400 font-bold font-mono">{row.cout}</td>
                  <td className="px-5 py-3.5"><span className={cn('px-2.5 py-0.5 rounded-full text-[10px] font-bold border', statusColors[row.status])}>{row.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">{filtered.length} résultats sur {total}</span>
          <span className="text-[11px] text-slate-500 font-mono">Coût total: <span className="text-cyan-400 font-bold">{interventions.reduce((a, i) => a + i.cout, 0).toLocaleString()} DT</span></span>
        </div>
      </div>
    </div>
  );
}
