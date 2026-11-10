import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench, Calendar as CalendarIcon, Clock, CheckCircle2,
  Brain, Search, ChevronRight, X, Zap, Users, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar as UiCalendar } from '@/components/ui/calendar';
import { maintenanceTasks } from '@/data/mockData';
import { cn } from '@/lib/utils';

const priorityConfig = {
  high: { label: 'Urgente', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/25', bar: 'bg-red-500', stripe: 'bg-red-500' },
  medium: { label: 'Moyenne', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/25', bar: 'bg-amber-500', stripe: 'bg-amber-500' },
  low: { label: 'Basse', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/25', bar: 'bg-blue-500', stripe: 'bg-blue-500' },
};

const statusConfig = {
  pending: { label: 'En attente', color: 'text-slate-400', bg: 'bg-white/5', border: 'border-white/10' },
  in_progress: { label: 'En cours', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/25' },
  completed: { label: 'Terminée', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25' },
};

export function MaintenancePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();

  const filteredTasks = maintenanceTasks.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      (t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.location.toLowerCase().includes(q)) &&
      (filterPriority ? t.priority === filterPriority : true)
    );
  });

  const pendingCount = maintenanceTasks.filter(t => t.status === 'pending').length;
  const inProgCount = maintenanceTasks.filter(t => t.status === 'in_progress').length;
  const highCount = maintenanceTasks.filter(t => t.priority === 'high').length;
  const availableTechs = Array.from(
    maintenanceTasks.reduce((map, t) => {
      if (t.technician && t.technicianPhone && t.status !== 'completed') map.set(t.technician, t.technicianPhone);
      return map;
    }, new Map<string, string>())
  ).map(([name, phone]) => ({ name, phone }));

  const kpis = [
    { label: 'En attente', value: pendingCount, icon: Clock, color: 'text-slate-300', bg: 'bg-white/5', border: 'border-white/10' },
    { label: 'En cours', value: inProgCount, icon: Wrench, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { label: 'Urgentes', value: highCount, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    { label: 'Techniciens', value: availableTechs.length, icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
    { label: 'Prédictions IA', value: 5, icon: Brain, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
    { label: 'Complétées/mois', value: 28, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  ];

  return (
    <div className="space-y-7 animate-in fade-in duration-400">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-mono">Maintenance Prédictive IA</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Plan de Maintenance</h1>
          <p className="text-slate-400 text-sm mt-0.5">Interventions planifiées par intelligence artificielle</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl gap-2" variant="outline">
                <Users className="h-4 w-4" />
                Techniciens
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-[#111c38] border border-white/10 text-white">
              <DialogTitle className="text-white">Équipe disponible</DialogTitle>
              <DialogDescription className="text-slate-400">Techniciens assignés aux interventions actives.</DialogDescription>
              <div className="mt-4 space-y-2">
                {availableTechs.map(t => (
                  <div key={t.name} className="flex items-center justify-between rounded-xl bg-white/5 border border-white/8 p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm">
                        {t.name.charAt(0)}
                      </div>
                      <span className="font-medium text-white text-sm">{t.name}</span>
                    </div>
                    <span className="text-slate-400 text-sm font-mono">{t.phone}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 text-right"><DialogClose asChild><Button variant="outline" className="border-white/10 text-slate-300 rounded-xl">Fermer</Button></DialogClose></div>
            </DialogContent>
          </Dialog>
          <Button
            onClick={() => setCalendarOpen(true)}
            className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/25 rounded-xl gap-2 font-semibold"
            variant="outline"
          >
            <CalendarIcon className="h-4 w-4" />
            Calendrier
          </Button>
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className={cn('page-card p-4 flex flex-col gap-2', k.border)}>
              <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center', k.bg)}>
                <Icon className={cn('h-4 w-4', k.color)} />
              </div>
              <p className={cn('text-xl font-extrabold', k.color)}>{k.value}</p>
              <p className="text-[11px] text-slate-500 leading-tight">{k.label}</p>
            </div>
          );
        })}
      </div>

      {/* ── AI Banner ── */}
      <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 via-cyan-500/5 to-blue-500/10 p-5">
        <div className="absolute right-0 top-0 h-full w-48 bg-gradient-to-l from-violet-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
            <Brain className="h-6 w-6 text-violet-400" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-violet-400 font-mono mb-1">Recommandation IA — Priorité critique</p>
            <p className="text-white font-semibold text-sm">Pompe #3 (Station Est) — risque de défaillance à <span className="text-red-400">94%</span> dans les 5 prochains jours</p>
            <p className="text-slate-400 text-xs mt-0.5">Planifier l'intervention avant le 26 juin pour minimiser les ruptures de service.</p>
          </div>
          <Button variant="outline" className="border-violet-500/30 text-violet-400 hover:bg-violet-500/10 rounded-xl flex-shrink-0">
            <Zap className="h-4 w-4 mr-1.5" />
            Voir l'analyse
          </Button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Rechercher une intervention…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-500/40"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          {(['high', 'medium', 'low'] as const).map(p => (
            <button
              key={p}
              onClick={() => setFilterPriority(filterPriority === p ? null : p)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                filterPriority === p
                  ? cn(priorityConfig[p].bg, priorityConfig[p].color, priorityConfig[p].border)
                  : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
              )}
            >
              {priorityConfig[p].label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Task List ── */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="page-card p-12 text-center">
            <Wrench className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">Aucune tâche trouvée</p>
          </div>
        ) : filteredTasks.map((task) => {
          const prio = priorityConfig[task.priority];
          const sta = statusConfig[task.status as keyof typeof statusConfig];
          return (
            <div
              key={task.id}
              className={cn('page-card overflow-hidden flex transition-all hover:bg-white/[0.03] cursor-pointer group', prio.border)}
              onClick={() => navigate(`/dashboard/maintenance/${task.id}`)}
            >
              {/* Priority stripe */}
              <div className={cn('w-1 flex-shrink-0', prio.stripe)} />

              <div className="flex flex-1 flex-col sm:flex-row sm:items-center gap-4 p-4">
                {/* Icon */}
                <div className={cn('h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0', prio.bg)}>
                  <Wrench className={cn('h-5 w-5', prio.color)} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-slate-500">{task.id}</span>
                    <Badge className={cn('text-[10px] px-2 py-0 border rounded-full', prio.bg, prio.color, prio.border)}>
                      {prio.label}
                    </Badge>
                    <Badge className={cn('text-[10px] px-2 py-0 border rounded-full', sta.bg, sta.color, sta.border)}>
                      {sta.label}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-white text-sm truncate">{task.title}</h4>
                  <p className="text-slate-400 text-xs mt-0.5 truncate">{task.description}</p>
                </div>

                {/* AI Confidence */}
                <div className="flex-shrink-0 min-w-[110px]">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Confiance IA</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full', task.aiConfidence > 80 ? 'bg-emerald-500' : task.aiConfidence > 60 ? 'bg-amber-500' : 'bg-red-500')}
                        style={{ width: `${task.aiConfidence}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-white">{task.aiConfidence}%</span>
                  </div>
                </div>

                {/* Due date */}
                <div className="flex-shrink-0 text-right hidden sm:block">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Échéance</p>
                  <p className="text-sm font-semibold text-white">{task.dueDate}</p>
                </div>

                {/* Arrow */}
                <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-cyan-400 transition-colors flex-shrink-0 hidden sm:block" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Calendar Dialog ── */}
      <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
        <DialogContent className="max-w-sm bg-[#111c38] border border-white/10 text-white">
          <DialogTitle className="text-white">Calendrier de Maintenance</DialogTitle>
          <DialogDescription className="text-slate-400">Sélectionner une date pour planifier une intervention.</DialogDescription>
          <div className="mt-4">
            <UiCalendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="w-full rounded-xl bg-white/5 p-3"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <DialogClose asChild>
              <Button className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 rounded-xl hover:bg-cyan-500/20">Fermer</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
