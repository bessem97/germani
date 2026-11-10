import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, User, ShieldCheck, CalendarDays } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { maintenanceTasks } from '@/data/mockData';
import { cn } from '@/lib/utils';

export function MaintenanceReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const task = useMemo(
    () => maintenanceTasks.find((item) => item.id === id),
    [id]
  );

  if (!task) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-slate-500">Rapport introuvable.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Rapport de maintenance</h1>
          <p className="text-slate-500 dark:text-slate-400">Détails de l'intervention, technicien et responsables.</p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
      </div>

      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle>{task.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Technicien</p>
              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{task.technician}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Responsable</p>
              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{task.supervisor}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Date de maintenance</p>
              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{task.maintenanceDate}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Durée</p>
              <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{task.duration}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <CalendarDays className="h-4 w-4" />
                <span>Date prévue</span>
              </div>
              <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{task.dueDate}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <ShieldCheck className="h-4 w-4" />
                <span>Niveau</span>
              </div>
              <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{task.level}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <User className="h-4 w-4" />
                <span>Assigné</span>
              </div>
              <p className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{task.assignedTo ?? 'Non défini'}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Description</p>
            <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-300">{task.description}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Priorité</p>
              <Badge className={cn(
                'mt-3 px-3 py-1 text-sm',
                task.priority === 'high' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : '',
                task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : '',
                task.priority === 'low' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : ''
              )}>
                {task.priority === 'high' ? 'Haute' : task.priority === 'medium' ? 'Moyenne' : 'Basse'}
              </Badge>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Statut</p>
              <Badge className={cn(
                'mt-3 px-3 py-1 text-sm',
                task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : '',
                task.status === 'in_progress' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : '',
                task.status === 'pending' ? 'bg-slate-500/10 text-slate-500 border border-slate-500/20' : ''
              )}>
                {task.status === 'completed' ? 'Terminé' : task.status === 'in_progress' ? 'En cours' : 'En attente'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
