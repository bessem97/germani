import { useState } from 'react';
import { Users, User, Phone, Mail, Star, CheckCircle2, Clock, AlertTriangle, Wrench, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

const techniciens = [
  { id: 'TECH-001', nom: 'Ahmed Ben Ali', specialite: 'Capteurs IoT', phone: '+216 55 123 456', email: 'ahmed.benali@sonede.tn', niveau: 'Senior', disponibilite: true, interventions: 28, satisfaction: 4.8, competences: { capteurs: 95, hydraulique: 78, electrique: 82, it: 90, mecanique: 70 } },
  { id: 'TECH-002', nom: 'Sami Trabelsi', specialite: 'Hydraulique', phone: '+216 52 234 567', email: 'sami.trabelsi@sonede.tn', niveau: 'Senior', disponibilite: true, interventions: 35, satisfaction: 4.6, competences: { capteurs: 75, hydraulique: 98, electrique: 65, it: 55, mecanique: 90 } },
  { id: 'TECH-003', nom: 'Khalil Mzali', specialite: 'Électricité & Automatisme', phone: '+216 58 345 678', email: 'khalil.mzali@sonede.tn', niveau: 'Expert', disponibilite: false, interventions: 42, satisfaction: 4.9, competences: { capteurs: 88, hydraulique: 60, electrique: 97, it: 85, mecanique: 75 } },
  { id: 'TECH-004', nom: 'Riadh Habib', specialite: 'Mécanique générale', phone: '+216 50 456 789', email: 'riadh.habib@sonede.tn', niveau: 'Intermédiaire', disponibilite: true, interventions: 18, satisfaction: 4.3, competences: { capteurs: 60, hydraulique: 80, electrique: 55, it: 45, mecanique: 95 } },
  { id: 'TECH-005', nom: 'Hichem Bouaziz', specialite: 'IT & Réseau IoT', phone: '+216 56 567 890', email: 'hichem.bouaziz@sonede.tn', niveau: 'Intermédiaire', disponibilite: true, interventions: 22, satisfaction: 4.5, competences: { capteurs: 85, hydraulique: 45, electrique: 70, it: 98, mecanique: 50 } },
];

const niveauColors: Record<string, string> = {
  Expert: 'bg-violet-500/10 text-violet-400 border-violet-500/25',
  Senior: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25',
  Intermédiaire: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
};

const radarKeys = [
  { key: 'capteurs', label: 'Capteurs' },
  { key: 'hydraulique', label: 'Hydraulique' },
  { key: 'electrique', label: 'Électricité' },
  { key: 'it', label: 'IT/IoT' },
  { key: 'mecanique', label: 'Mécanique' },
];

export function EquipeMaintenancePage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>('TECH-001');

  const filtered = techniciens.filter(t =>
    t.nom.toLowerCase().includes(search.toLowerCase()) ||
    t.specialite.toLowerCase().includes(search.toLowerCase())
  );

  const selectedTech = techniciens.find(t => t.id === selected);
  const radarData = selectedTech
    ? radarKeys.map(k => ({ subject: k.label, score: selectedTech.competences[k.key as keyof typeof selectedTech.competences] }))
    : [];

  const disponibles = techniciens.filter(t => t.disponibilite).length;
  const totalInterv = techniciens.reduce((a, t) => a + t.interventions, 0);
  const avgSat = (techniciens.reduce((a, t) => a + t.satisfaction, 0) / techniciens.length).toFixed(1);

  return (
    <div className="space-y-6 animate-in fade-in duration-400">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 font-mono">Maintenance / Équipe</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Équipe Maintenance</h1>
          <p className="text-slate-400 text-sm mt-0.5">Profils, disponibilité et compétences des techniciens</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Techniciens', value: techniciens.length, icon: Users, color: 'text-slate-300', bg: 'bg-white/5', border: 'border-white/10' },
          { label: 'Disponibles', value: disponibles, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          { label: 'Interventions (cumul)', value: totalInterv, icon: Wrench, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
          { label: 'Satisfaction moy.', value: `${avgSat}/5`, icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* List */}
        <div className="lg:col-span-3 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input placeholder="Rechercher un technicien…" value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-500/40" />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"><X className="h-4 w-4" /></button>}
          </div>

          {filtered.map(tech => (
            <div
              key={tech.id}
              onClick={() => setSelected(tech.id)}
              className={cn('rounded-2xl border p-4 cursor-pointer transition-all', selected === tech.id ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]')}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={cn('h-11 w-11 rounded-2xl flex items-center justify-center text-white font-bold text-lg', tech.disponibilite ? 'bg-gradient-to-br from-cyan-500 to-blue-600' : 'bg-slate-800')}>
                    {tech.nom.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-sm">{tech.nom}</span>
                      <span className={cn('px-1.5 py-0.5 rounded text-[9px] font-bold border', niveauColors[tech.niveau])}>{tech.niveau}</span>
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5">{tech.specialite}</p>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className={cn('flex items-center gap-1 text-[10px] font-bold', tech.disponibilite ? 'text-emerald-400' : 'text-red-400')}>
                    <div className={cn('h-1.5 w-1.5 rounded-full', tech.disponibilite ? 'bg-emerald-400 animate-pulse' : 'bg-red-400')} />
                    {tech.disponibilite ? 'Disponible' : 'En mission'}
                  </div>
                  <div className="flex items-center gap-1 mt-1 justify-end">
                    <Star className="h-3 w-3 text-amber-400" />
                    <span className="text-amber-400 font-bold text-xs">{tech.satisfaction}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-3 pt-3 border-t border-white/5">
                <span className="text-xs text-slate-500 flex items-center gap-1"><Phone className="h-3 w-3" />{tech.phone}</span>
                <span className="text-xs text-slate-500 flex items-center gap-1"><Wrench className="h-3 w-3" />{tech.interventions} interv.</span>
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {selectedTech && (
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className={cn('h-14 w-14 rounded-2xl flex items-center justify-center text-white font-bold text-2xl', selectedTech.disponibilite ? 'bg-gradient-to-br from-cyan-500 to-blue-600' : 'bg-slate-800')}>
                  {selectedTech.nom.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-extrabold">{selectedTech.nom}</p>
                  <p className="text-slate-400 text-xs">{selectedTech.specialite}</p>
                  <span className={cn('px-2 py-0.5 rounded text-[9px] font-bold border mt-1 inline-block', niveauColors[selectedTech.niveau])}>{selectedTech.niveau}</span>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-400"><Phone className="h-3.5 w-3.5 text-slate-600" />{selectedTech.phone}</div>
                <div className="flex items-center gap-2 text-slate-400"><Mail className="h-3.5 w-3.5 text-slate-600" />{selectedTech.email}</div>
                <div className="flex items-center gap-2 text-slate-400"><Wrench className="h-3.5 w-3.5 text-slate-600" />{selectedTech.interventions} interventions totales</div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm font-bold text-white mb-3">Profil de compétences</p>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.06)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Radar name={selectedTech.nom} dataKey="score" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                </RadarChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {radarKeys.map(k => {
                  const val = selectedTech.competences[k.key as keyof typeof selectedTech.competences];
                  return (
                    <div key={k.key} className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 w-20">{k.label}</span>
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className={cn('h-full rounded-full', val >= 90 ? 'bg-emerald-500' : val >= 75 ? 'bg-cyan-500' : val >= 60 ? 'bg-amber-500' : 'bg-red-500')} style={{ width: `${val}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-white font-mono w-8 text-right">{val}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
