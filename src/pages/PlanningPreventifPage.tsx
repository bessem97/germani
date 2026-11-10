import { CalendarDays, Clock, CheckCircle2, AlertTriangle, Wrench, User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const months = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];

const tasks = [
  { id: 'PP-001', titre: 'Inspection capteurs NP1', site: 'Manar 1 (NP1)', technicien: 'Ahmed Ben Ali', debut: 1, fin: 3, mois: 5, type: 'Inspection', statut: 'Planifiée', priorite: 'Haute' },
  { id: 'PP-002', titre: 'Étalonnage débitmètres NP3', site: 'Cité Ennasr (NP3)', technicien: 'Sami Trabelsi', debut: 5, fin: 6, mois: 5, type: 'Étalonnage', statut: 'Terminée', priorite: 'Moyenne' },
  { id: 'PP-003', titre: 'Remplacement joints NP4', site: 'Manar 2 (NP4)', technicien: 'Khalil Mzali', debut: 10, fin: 14, mois: 5, type: 'Remplacement', statut: 'En cours', priorite: 'Haute' },
  { id: 'PP-004', titre: 'Audit sécurité NP5', site: 'Ariana (NP5)', technicien: 'Ahmed Ben Ali', debut: 15, fin: 17, mois: 5, type: 'Audit', statut: 'Planifiée', priorite: 'Basse' },
  { id: 'PP-005', titre: 'Maintenance pompes NP2', site: 'Jardin El Manzeh (NP2)', technicien: 'Sami Trabelsi', debut: 18, fin: 22, mois: 5, type: 'Maintenance', statut: 'Planifiée', priorite: 'Haute' },
  { id: 'PP-006', titre: 'Inspection réseau NP1', site: 'Manar 1 (NP1)', technicien: 'Khalil Mzali', debut: 1, fin: 5, mois: 6, type: 'Inspection', statut: 'Planifiée', priorite: 'Moyenne' },
  { id: 'PP-007', titre: 'Test pression global', site: 'Tous les sites', technicien: 'Équipe Terrain', debut: 8, fin: 12, mois: 6, type: 'Test', statut: 'Planifiée', priorite: 'Haute' },
];

const typeColors: Record<string, string> = {
  Inspection: '#06b6d4',
  Étalonnage: '#8b5cf6',
  Remplacement: '#f59e0b',
  Audit: '#3b82f6',
  Maintenance: '#10b981',
  Test: '#ef4444',
};

const statusColors: Record<string, string> = {
  'Planifiée': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25',
  'En cours': 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  'Terminée': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
};

const prioriteColors: Record<string, string> = {
  Haute: 'text-red-400', Moyenne: 'text-amber-400', Basse: 'text-slate-400',
};

const DAYS = 31;

export function PlanningPreventifPage() {
  const currentMonth = 5; // May

  const planifiees = tasks.filter(t => t.statut === 'Planifiée').length;
  const enCours = tasks.filter(t => t.statut === 'En cours').length;
  const terminees = tasks.filter(t => t.statut === 'Terminée').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-400">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 font-mono">Maintenance / Planning</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Planning Préventif</h1>
          <p className="text-slate-400 text-sm mt-0.5">Diagramme de Gantt des interventions préventives planifiées</p>
        </div>
        <Button className="bg-blue-500/10 border border-blue-500/25 text-blue-400 hover:bg-blue-500/20 rounded-xl gap-2">
          <Plus className="h-4 w-4" />Planifier tâche
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Planifiées', value: planifiees, icon: CalendarDays, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
          { label: 'En cours', value: enCours, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
          { label: 'Terminées', value: terminees, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        ].map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className={cn('rounded-2xl p-4 border flex flex-col gap-2', k.bg, k.border)}>
              <Icon className={cn('h-5 w-5', k.color)} />
              <p className={cn('text-2xl font-extrabold', k.color)}>{k.value}</p>
              <p className="text-[11px] text-slate-500">{k.label}</p>
            </div>
          );
        })}
      </div>

      {/* Gantt Chart */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between">
          <p className="text-sm font-bold text-white flex items-center gap-2"><CalendarDays className="h-4 w-4 text-blue-400" />Diagramme de Gantt — Mai 2026</p>
          <div className="flex items-center gap-3">
            {Object.entries(typeColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color, opacity: 0.85 }} />
                <span className="text-[10px] text-slate-500">{type}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto p-4">
          {/* Day header */}
          <div className="flex min-w-[900px]">
            <div className="w-48 flex-shrink-0" />
            <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${DAYS}, 1fr)` }}>
              {Array.from({ length: DAYS }, (_, i) => i + 1).map(d => (
                <div key={d} className={cn('text-center text-[9px] font-mono py-1 border-r border-white/[0.03]', d === new Date().getDate() ? 'text-cyan-400 font-bold' : 'text-slate-600')}>
                  {d}
                </div>
              ))}
            </div>
          </div>

          {/* Rows */}
          <div className="space-y-2 min-w-[900px]">
            {tasks.filter(t => t.mois === currentMonth).map(task => (
              <div key={task.id} className="flex items-center gap-0">
                <div className="w-48 flex-shrink-0 pr-3">
                  <p className="text-[11px] text-white font-semibold truncate">{task.titre}</p>
                  <p className="text-[9px] text-slate-500 truncate flex items-center gap-1"><User className="h-2.5 w-2.5" />{task.technicien}</p>
                </div>
                <div className="flex-1 relative h-8" style={{ display: 'grid', gridTemplateColumns: `repeat(${DAYS}, 1fr)` }}>
                  {/* Background grid cells */}
                  {Array.from({ length: DAYS }, (_, i) => i + 1).map(d => (
                    <div key={d} className="border-r border-white/[0.03] h-full" />
                  ))}
                  {/* Gantt bar */}
                  <div
                    className="absolute top-1 bottom-1 rounded-md flex items-center px-2 text-[10px] font-bold text-white/90 shadow-lg"
                    style={{
                      left: `${((task.debut - 1) / DAYS) * 100}%`,
                      width: `${((task.fin - task.debut + 1) / DAYS) * 100}%`,
                      backgroundColor: typeColors[task.type],
                      opacity: task.statut === 'Terminée' ? 0.6 : 0.85,
                    }}
                  >
                    <span className="truncate">{task.type}</span>
                  </div>
                </div>
                <div className="w-20 flex-shrink-0 pl-3">
                  <span className={cn('px-1.5 py-0.5 rounded text-[9px] font-bold border', statusColors[task.statut])}>{task.statut}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming tasks June */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/5">
          <p className="text-sm font-bold text-white flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-400" />Prochaines tâches — Juin 2026</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['ID','Tâche','Site','Technicien','Début','Fin','Type','Priorité'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.filter(t => t.mois === 6).map((row, i) => (
                <tr key={row.id} className={cn('border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors', i % 2 === 1 ? 'bg-white/[0.01]' : '')}>
                  <td className="px-5 py-3 font-mono text-[11px] text-slate-400">{row.id}</td>
                  <td className="px-5 py-3 text-white text-xs font-medium">{row.titre}</td>
                  <td className="px-5 py-3 text-slate-400 text-xs">{row.site}</td>
                  <td className="px-5 py-3 text-slate-300 text-xs flex items-center gap-1"><Wrench className="h-3 w-3 text-slate-500" />{row.technicien}</td>
                  <td className="px-5 py-3 font-mono text-[11px] text-slate-300">Jun {row.debut}</td>
                  <td className="px-5 py-3 font-mono text-[11px] text-slate-300">Jun {row.fin}</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white" style={{ backgroundColor: typeColors[row.type] + '25', border: `1px solid ${typeColors[row.type]}50`, color: typeColors[row.type] }}>{row.type}</span>
                  </td>
                  <td className="px-5 py-3 text-xs font-bold"><span className={prioriteColors[row.priorite]}>{row.priorite}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
