import { useState } from 'react';
import { Package, Search, X, AlertTriangle, CheckCircle2, TrendingDown, ShoppingCart, Plus, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const pieces = [
  { id: 'PDR-001', designation: 'Capteur ultrasonique clamp-on DN50', reference: 'US-DN50-A', stock: 8, seuil: 3, unite: 'pièce', localisation: 'Étagère A1', fournisseur: 'FlowTech Pro', prix: 1250, categorie: 'Capteurs' },
  { id: 'PDR-002', designation: 'Joint torique DN100 caoutchouc EPDM', reference: 'JT-100-EPD', stock: 45, seuil: 20, unite: 'pièce', localisation: 'Étagère B2', fournisseur: 'SealMaster', prix: 12, categorie: 'Joints' },
  { id: 'PDR-003', designation: 'Câble transmission données RS485 100m', reference: 'CBL-RS485-100', stock: 2, seuil: 5, unite: 'rouleau', localisation: 'Étagère C1', fournisseur: 'CablePro', prix: 280, categorie: 'Câblage' },
  { id: 'PDR-004', designation: 'Vanne papillon DN80 inox 316L', reference: 'VP-80-316L', stock: 4, seuil: 2, unite: 'pièce', localisation: 'Étagère A3', fournisseur: 'ValveTech', prix: 850, categorie: 'Vannes' },
  { id: 'PDR-005', designation: 'Transmetteur pression 0-16 bar 4-20mA', reference: 'TP-16-420', stock: 6, seuil: 4, unite: 'pièce', localisation: 'Étagère B1', fournisseur: 'PressurePro', prix: 420, categorie: 'Capteurs' },
  { id: 'PDR-006', designation: 'Coude 90° acier galva DN50', reference: 'CD-90-50-AG', stock: 28, seuil: 10, unite: 'pièce', localisation: 'Étagère D2', fournisseur: 'PipeFit', prix: 35, categorie: 'Raccords' },
  { id: 'PDR-007', designation: 'Graisse silicone haute température 500g', reference: 'GR-SIL-HT-500', stock: 3, seuil: 6, unite: 'tube', localisation: 'Étagère E1', fournisseur: 'LubriTech', prix: 45, categorie: 'Consommables' },
  { id: 'PDR-008', designation: 'Batterie lithium 3.6V ER26500 capteur', reference: 'BAT-ER26500', stock: 24, seuil: 10, unite: 'pièce', localisation: 'Étagère F1', fournisseur: 'PowerCell', prix: 18, categorie: 'Électronique' },
];

const stockByCategory = [
  { cat: 'Capteurs', stock: 14 }, { cat: 'Joints', stock: 45 }, { cat: 'Câblage', stock: 2 },
  { cat: 'Vannes', stock: 4 }, { cat: 'Raccords', stock: 28 }, { cat: 'Consommables', stock: 3 },
];

export function MagasinPDRPage() {
  const [search, setSearch] = useState('');
  const [filterAlert, setFilterAlert] = useState(false);

  const filtered = pieces.filter(p =>
    (p.designation.toLowerCase().includes(search.toLowerCase()) || p.reference.toLowerCase().includes(search.toLowerCase()) || p.categorie.toLowerCase().includes(search.toLowerCase())) &&
    (filterAlert ? p.stock <= p.seuil : true)
  );

  const alertCount = pieces.filter(p => p.stock <= p.seuil).length;
  const valeurTotal = pieces.reduce((a, p) => a + p.stock * p.prix, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-400">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 font-mono">Maintenance / Magasin PDR</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Magasin Pièces de Rechange</h1>
          <p className="text-slate-400 text-sm mt-0.5">Gestion du stock et suivi des seuils critiques</p>
        </div>
        <Button className="bg-amber-500/10 border border-amber-500/25 text-amber-400 hover:bg-amber-500/20 rounded-xl gap-2">
          <Plus className="h-4 w-4" />Nouvelle pièce
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Références', value: pieces.length, icon: Package, color: 'text-slate-300', bg: 'bg-white/5', border: 'border-white/10' },
          { label: 'Alertes stock', value: alertCount, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
          { label: 'En stock OK', value: pieces.length - alertCount, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          { label: 'Valeur totale (DT)', value: valeurTotal.toLocaleString(), icon: ShoppingCart, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
        ].map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className={cn('rounded-2xl p-4 border flex flex-col gap-2', k.bg, k.border)}>
              <div className="h-9 w-9 rounded-xl flex items-center justify-center bg-white/5">
                <Icon className={cn('h-4 w-4', k.color)} />
              </div>
              <p className={cn('text-xl font-extrabold', k.color)}>{k.value}</p>
              <p className="text-[11px] text-slate-500">{k.label}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-amber-400" />Stock par catégorie
        </p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={stockByCategory}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="cat" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
            <Bar dataKey="stock" name="Quantité" fill="#f59e0b" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input placeholder="Rechercher une pièce…" value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-amber-500/40" />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"><X className="h-4 w-4" /></button>}
        </div>
        <button
          onClick={() => setFilterAlert(!filterAlert)}
          className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all', filterAlert ? 'bg-red-500/10 border-red-500/25 text-red-400' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20')}
        >
          <Filter className="h-4 w-4" />Alertes seulement
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Réf.','Désignation','Catégorie','Stock','Seuil','Localisation','Fournisseur','Prix unit. (DT)','Statut'].map(h => (
                  <th key={h} className="text-left px-4 py-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => {
                const isAlert = row.stock <= row.seuil;
                return (
                  <tr key={row.id} className={cn('border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors', isAlert ? 'bg-red-500/[0.02]' : i % 2 === 1 ? 'bg-white/[0.01]' : '')}>
                    <td className="px-4 py-3.5 font-mono text-[11px] text-slate-400">{row.reference}</td>
                    <td className="px-4 py-3.5 text-white text-xs font-medium max-w-[180px]">{row.designation}</td>
                    <td className="px-4 py-3.5 text-slate-400 text-xs">{row.categorie}</td>
                    <td className="px-4 py-3.5">
                      <span className={cn('font-extrabold font-mono text-sm', isAlert ? 'text-red-400' : 'text-emerald-400')}>{row.stock}</span>
                      <span className="text-slate-600 text-xs ml-1">{row.unite}</span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-400">{row.seuil}</td>
                    <td className="px-4 py-3.5 text-slate-400 text-xs">{row.localisation}</td>
                    <td className="px-4 py-3.5 text-slate-300 text-xs">{row.fournisseur}</td>
                    <td className="px-4 py-3.5 text-cyan-400 font-bold font-mono">{row.prix}</td>
                    <td className="px-4 py-3.5">
                      {isAlert
                        ? <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-400"><AlertTriangle className="h-3 w-3" />Réappro. requise</span>
                        : <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400"><CheckCircle2 className="h-3 w-3" />OK</span>
                      }
                    </td>
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
