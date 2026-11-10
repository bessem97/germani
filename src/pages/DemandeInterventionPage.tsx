/**
 * DemandeInterventionPage.tsx
 * Section « Demander une Intervention » — style industriel moderne (Coswin-like).
 * La production soumet une demande ; la maintenance clôture après réparation.
 * Données persistées dans localStorage.
 */
import { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle, Plus, Search, ChevronRight, ArrowLeft, X,
  Clock, User, Factory, CheckCircle2, Send, FileText, Activity,
  Wrench, CalendarDays, Timer, Shield, Flame
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

/* ── Types ─────────────────────────────────────────────── */
export interface DemandeIntervention {
  id: string;
  chefEquipe: string;
  ligne: string;
  description: string;
  priorite: 'Urgente' | 'Haute' | 'Normale' | 'Basse';
  statut: 'Ouverte' | 'En cours' | 'Réparée';
  creeLe: string;         // ISO date-time
  repareLe?: string;      // ISO date-time
  reparePar?: string;     // Nom du maintenancier
  commentaireReparation?: string;
}

/* ── localStorage helpers ──────────────────────────────── */
const LS_KEY = 'qatramind_demandes_intervention';

function loadDemandes(): DemandeIntervention[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveDemandes(d: DemandeIntervention[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(d));
}

function genId(): string {
  const n = Math.floor(Math.random() * 9000) + 1000;
  return `DI-${n}`;
}

/* ── Config couleurs ───────────────────────────────────── */
const prioriteCfg: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  Urgente:  { bg: 'bg-red-500/10',    text: 'text-red-400',    border: 'border-red-500/30',    glow: 'shadow-[0_0_15px_rgba(239,68,68,0.15)]' },
  Haute:    { bg: 'bg-orange-500/10',  text: 'text-orange-400', border: 'border-orange-500/30',  glow: 'shadow-[0_0_15px_rgba(249,115,22,0.15)]' },
  Normale:  { bg: 'bg-cyan-500/10',   text: 'text-cyan-400',   border: 'border-cyan-500/30',   glow: 'shadow-[0_0_15px_rgba(6,182,212,0.15)]' },
  Basse:    { bg: 'bg-slate-500/10',  text: 'text-slate-400',  border: 'border-slate-500/30',  glow: '' },
};

const statutCfg: Record<string, { bg: string; text: string; dot: string }> = {
  'Ouverte':  { bg: 'bg-amber-500/15',   text: 'text-amber-400',   dot: 'bg-amber-400' },
  'En cours': { bg: 'bg-blue-500/15',    text: 'text-blue-400',    dot: 'bg-blue-400' },
  'Réparée':  { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400' },
};

const lignes = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'];

/* ── Component ──────────────────────────────────────────── */
export function DemandeInterventionPage() {
  const [demandes, setDemandes] = useState<DemandeIntervention[]>(loadDemandes);
  const [selected, setSelected] = useState<DemandeIntervention | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showReparer, setShowReparer] = useState(false);

  // form fields
  const [fChef, setFChef] = useState('');
  const [fLigne, setFLigne] = useState('L1');
  const [fDesc, setFDesc] = useState('');
  const [fPrio, setFPrio] = useState<DemandeIntervention['priorite']>('Normale');

  // repair fields
  const [rPar, setRPar] = useState('');
  const [rComm, setRComm] = useState('');

  const persist = useCallback((d: DemandeIntervention[]) => {
    setDemandes(d);
    saveDemandes(d);
  }, []);

  /* Créer une nouvelle demande */
  const handleCreer = () => {
    if (!fChef.trim() || !fDesc.trim()) {
      toast.error('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    const newDemande: DemandeIntervention = {
      id: genId(),
      chefEquipe: fChef.trim(),
      ligne: fLigne,
      description: fDesc.trim(),
      priorite: fPrio,
      statut: 'Ouverte',
      creeLe: new Date().toISOString(),
    };
    persist([newDemande, ...demandes]);
    setShowForm(false);
    setFChef(''); setFDesc(''); setFPrio('Normale'); setFLigne('L1');
    toast.success('Demande d\'intervention créée avec succès !');
  };

  /* Marquer comme réparée */
  const handleReparer = () => {
    if (!rPar.trim()) {
      toast.error('Veuillez indiquer qui a effectué la réparation.');
      return;
    }
    if (!selected) return;
    const updated = demandes.map(d =>
      d.id === selected.id
        ? { ...d, statut: 'Réparée' as const, repareLe: new Date().toISOString(), reparePar: rPar.trim(), commentaireReparation: rComm.trim() || undefined }
        : d
    );
    persist(updated);
    setSelected({ ...selected, statut: 'Réparée', repareLe: new Date().toISOString(), reparePar: rPar.trim(), commentaireReparation: rComm.trim() || undefined });
    setShowReparer(false);
    setRPar(''); setRComm('');
    toast.success('Intervention marquée comme réparée !');
  };

  /* Passer en cours */
  const handleEnCours = () => {
    if (!selected) return;
    const updated = demandes.map(d =>
      d.id === selected.id ? { ...d, statut: 'En cours' as const } : d
    );
    persist(updated);
    setSelected({ ...selected, statut: 'En cours' });
    toast.info('Demande passée en « En cours ».');
  };

  const filtered = demandes.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = d.chefEquipe.toLowerCase().includes(q)
      || d.description.toLowerCase().includes(q)
      || d.id.toLowerCase().includes(q)
      || d.ligne.toLowerCase().includes(q);
    const matchStatut = filterStatut ? d.statut === filterStatut : true;
    return matchSearch && matchStatut;
  });

  const counts = {
    total: demandes.length,
    ouverte: demandes.filter(d => d.statut === 'Ouverte').length,
    enCours: demandes.filter(d => d.statut === 'En cours').length,
    reparee: demandes.filter(d => d.statut === 'Réparée').length,
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
      + ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const timeSince = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ${mins % 60}min`;
    const days = Math.floor(hrs / 24);
    return `${days}j ${hrs % 24}h`;
  };

  /* ── MODAL : Nouvelle Demande ── */
  const formModal = showForm && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)}>
      <div className="bg-[#111827] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header gradient */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-amber-600/20 via-orange-600/15 to-red-600/10 border-b border-white/10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDBoMXYxSDB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+')] opacity-40" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Send className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Nouvelle Demande</h2>
                <p className="text-xs text-white/50">Formulaire d'intervention production</p>
              </div>
            </div>
            <button onClick={() => setShowForm(false)} className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Chef d'équipe */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <User className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Chef d'équipe <span className="text-red-400">*</span>
            </label>
            <Input
              value={fChef} onChange={e => setFChef(e.target.value)}
              placeholder="Nom du chef d'équipe"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-amber-500/50 focus:ring-amber-500/20 rounded-xl"
            />
          </div>

          {/* Ligne de production */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <Factory className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Ligne de production <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {lignes.map(l => (
                <button key={l} onClick={() => setFLigne(l)}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-200',
                    fLigne === l
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                      : 'bg-white/5 text-slate-500 border-white/10 hover:border-white/20 hover:text-slate-300'
                  )}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Priorité */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <Flame className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Priorité
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['Urgente', 'Haute', 'Normale', 'Basse'] as const).map(p => {
                const cfg = prioriteCfg[p];
                return (
                  <button key={p} onClick={() => setFPrio(p)}
                    className={cn(
                      'py-2 rounded-xl text-xs font-bold border transition-all duration-200',
                      fPrio === p
                        ? `${cfg.bg} ${cfg.text} ${cfg.border} ${cfg.glow}`
                        : 'bg-white/5 text-slate-500 border-white/10 hover:border-white/20'
                    )}>
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <FileText className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Description du problème <span className="text-red-400">*</span>
            </label>
            <textarea
              value={fDesc} onChange={e => setFDesc(e.target.value)}
              rows={3}
              placeholder="Décrivez brièvement la panne ou le problème constaté..."
              className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:border-amber-500/50 focus:ring-amber-500/20 rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button onClick={handleCreer}
              className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-600/20 transition-all">
              <Send className="mr-2 h-4 w-4" /> Envoyer la demande
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}
              className="rounded-xl border-white/10 text-slate-400 hover:text-white hover:bg-white/5">
              Annuler
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── MODAL : Marquer comme réparée ── */
  const repairModal = showReparer && selected && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowReparer(false)}>
      <div className="bg-[#111827] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="relative px-6 py-5 bg-gradient-to-r from-emerald-600/20 via-green-600/15 to-teal-600/10 border-b border-white/10">
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Clôturer l'intervention</h2>
                <p className="text-xs text-white/50">{selected.id} — {selected.ligne}</p>
              </div>
            </div>
            <button onClick={() => setShowReparer(false)} className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <Wrench className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Réparé par <span className="text-red-400">*</span>
            </label>
            <Input
              value={rPar} onChange={e => setRPar(e.target.value)}
              placeholder="Nom du technicien / maintenancier"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              <FileText className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />Commentaire de réparation
            </label>
            <textarea
              value={rComm} onChange={e => setRComm(e.target.value)}
              rows={3}
              placeholder="Action effectuée, pièces remplacées..."
              className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleReparer}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all">
              <CheckCircle2 className="mr-2 h-4 w-4" /> Confirmer la réparation
            </Button>
            <Button variant="outline" onClick={() => setShowReparer(false)}
              className="rounded-xl border-white/10 text-slate-400 hover:text-white hover:bg-white/5">
              Annuler
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── VUE DÉTAIL ── */
  if (selected) {
    const prio = prioriteCfg[selected.priorite];
    const stat = statutCfg[selected.statut];
    return (
      <div className="space-y-6">
        {repairModal}

        {/* Breadcrumb */}
        <div className="flex items-center gap-3">
          <button onClick={() => setSelected(null)} className="h-9 w-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-amber-500/30 transition-all">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">{selected.id}</h1>
            <p className="text-sm text-slate-500">Demande du {formatDate(selected.creeLe)}</p>
          </div>
        </div>

        {/* Card principale */}
        <div className="bg-[#111827]/80 backdrop-blur rounded-2xl border border-white/10 shadow-xl overflow-hidden">
          {/* Barre supérieure avec statut */}
          <div className={cn('px-6 py-4 border-b border-white/10 flex items-center justify-between', selected.statut === 'Ouverte' ? 'bg-amber-500/5' : selected.statut === 'En cours' ? 'bg-blue-500/5' : 'bg-emerald-500/5')}>
            <div className="flex items-center gap-3">
              <div className={cn('h-2.5 w-2.5 rounded-full animate-pulse', stat.dot)} />
              <span className={cn('text-sm font-bold', stat.text)}>{selected.statut}</span>
              {selected.statut !== 'Réparée' && (
                <span className="text-xs text-slate-500 ml-2">
                  <Timer className="inline h-3 w-3 mr-1 -mt-0.5" />
                  En attente depuis {timeSince(selected.creeLe)}
                </span>
              )}
            </div>
            <Badge className={cn('border-0 rounded-full px-3 py-1', prio.bg, prio.text, prio.border, 'border')}>
              {selected.priorite}
            </Badge>
          </div>

          <div className="p-6 space-y-6">
            {/* Infos grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-amber-400" />
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Chef d'équipe</p>
                </div>
                <p className="font-bold text-white">{selected.chefEquipe}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Factory className="h-4 w-4 text-cyan-400" />
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Ligne de production</p>
                </div>
                <p className="font-bold text-white text-lg">{selected.ligne}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays className="h-4 w-4 text-violet-400" />
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Date de création</p>
                </div>
                <p className="font-bold text-white text-sm">{formatDate(selected.creeLe)}</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-5">
              <p className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" /> Description du problème
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">{selected.description}</p>
            </div>

            {/* Infos réparation si réparée */}
            {selected.statut === 'Réparée' && selected.repareLe && (
              <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-5">
                <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Détails de la réparation
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Réparé par</p>
                    <p className="text-sm font-bold text-white">{selected.reparePar}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Date de réparation</p>
                    <p className="text-sm font-bold text-white">{formatDate(selected.repareLe)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Temps de résolution</p>
                    <p className="text-sm font-bold text-cyan-400">{timeSince(selected.creeLe)}</p>
                  </div>
                </div>
                {selected.commentaireReparation && (
                  <div className="mt-3 pt-3 border-t border-emerald-500/10">
                    <p className="text-xs text-slate-500 mb-1">Commentaire</p>
                    <p className="text-sm text-slate-300">{selected.commentaireReparation}</p>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              {selected.statut === 'Ouverte' && (
                <Button onClick={handleEnCours} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20">
                  <Activity className="mr-2 h-4 w-4" /> Passer en cours
                </Button>
              )}
              {selected.statut !== 'Réparée' && (
                <Button onClick={() => { setShowReparer(true); setRPar(''); setRComm(''); }}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20">
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Marquer comme réparée
                </Button>
              )}
              <Button variant="outline" onClick={() => setSelected(null)}
                className="rounded-xl border-white/10 text-slate-400 hover:text-white hover:bg-white/5">
                Retour
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── VUE LISTE ── */
  return (
    <div className="space-y-6">
      {formModal}

      {/* ── Header hero ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600/15 via-orange-600/10 to-red-600/5 border border-amber-500/20 p-6">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=')] opacity-50" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-xl shadow-orange-500/25">
              <AlertTriangle className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Demander une Intervention
              </h1>
              <p className="text-sm text-white/50 mt-0.5">
                Production → Maintenance · Suivi des demandes en temps réel
              </p>
            </div>
          </div>
          <Button onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 px-5 transition-all hover:scale-[1.02]">
            <Plus className="mr-2 h-4 w-4" /> Nouvelle Demande
          </Button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Demandes', value: counts.total, icon: FileText, color: 'from-slate-500/15 to-slate-600/5', textColor: 'text-white', iconColor: 'text-slate-400' },
          { label: 'Ouvertes', value: counts.ouverte, icon: AlertTriangle, color: 'from-amber-500/15 to-orange-500/5', textColor: 'text-amber-400', iconColor: 'text-amber-400' },
          { label: 'En Cours', value: counts.enCours, icon: Activity, color: 'from-blue-500/15 to-indigo-500/5', textColor: 'text-blue-400', iconColor: 'text-blue-400' },
          { label: 'Réparées', value: counts.reparee, icon: CheckCircle2, color: 'from-emerald-500/15 to-green-500/5', textColor: 'text-emerald-400', iconColor: 'text-emerald-400' },
        ].map(k => {
          const KIcon = k.icon;
          return (
            <div key={k.label} className={cn('rounded-2xl border border-white/10 p-4 bg-gradient-to-br', k.color, 'hover:border-white/20 transition-all')}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{k.label}</p>
                <KIcon className={cn('h-4 w-4', k.iconColor)} />
              </div>
              <p className={cn('text-3xl font-extrabold', k.textColor)}>{k.value}</p>
            </div>
          );
        })}
      </div>

      {/* ── Filtres ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Rechercher par ID, chef d'équipe, ligne..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-amber-500/40 rounded-xl"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['Ouverte', 'En cours', 'Réparée'].map(s => {
            const cfg = statutCfg[s];
            return (
              <button key={s} onClick={() => setFilterStatut(filterStatut === s ? null : s)}
                className={cn(
                  'px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200',
                  filterStatut === s
                    ? `${cfg.bg} ${cfg.text} border-transparent`
                    : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300'
                )}>
                <span className={cn('inline-block h-1.5 w-1.5 rounded-full mr-1.5', cfg.dot)} />
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Liste des demandes ── */}
      <div className="space-y-3">
        {filtered.map(d => {
          const prio = prioriteCfg[d.priorite];
          const stat = statutCfg[d.statut];
          return (
            <button key={d.id} onClick={() => setSelected(d)}
              className={cn(
                'w-full bg-[#111827]/60 backdrop-blur rounded-2xl border border-white/10 p-4 text-left transition-all duration-200 group flex items-center gap-4',
                'hover:border-amber-500/30 hover:shadow-[0_0_25px_rgba(245,158,11,0.07)]',
                d.statut === 'Urgente' && 'border-red-500/20'
              )}>
              {/* Icône priorité */}
              <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border', prio.bg, prio.border)}>
                <AlertTriangle className={cn('h-5 w-5', prio.text)} />
              </div>

              {/* Contenu */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-slate-500">{d.id}</span>
                  <Badge className={cn('border-0 rounded-full px-2 text-[10px]', prio.bg, prio.text)}>{d.priorite}</Badge>
                  <span className="text-xs text-slate-600 hidden sm:inline">·</span>
                  <span className="text-xs text-cyan-500 font-bold hidden sm:inline">{d.ligne}</span>
                </div>
                <p className="font-semibold text-sm text-white truncate group-hover:text-amber-400 transition-colors">
                  {d.description}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  <User className="inline h-3 w-3 mr-1 -mt-0.5" />{d.chefEquipe}
                  <span className="mx-2">·</span>
                  <Clock className="inline h-3 w-3 mr-1 -mt-0.5" />{timeSince(d.creeLe)}
                </p>
              </div>

              {/* Statut + flèche */}
              <div className="hidden sm:flex items-center gap-4 shrink-0">
                <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold', stat.bg, stat.text)}>
                  <span className={cn('h-1.5 w-1.5 rounded-full', stat.dot, d.statut !== 'Réparée' && 'animate-pulse')} />
                  {d.statut}
                </div>
                <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-amber-400 transition-colors" />
              </div>
            </button>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-slate-600" />
            </div>
            <p className="text-slate-500 text-sm font-semibold">Aucune demande d'intervention trouvée</p>
            <p className="text-slate-600 text-xs mt-1">Cliquez sur « Nouvelle Demande » pour en créer une</p>
          </div>
        )}
      </div>
    </div>
  );
}

