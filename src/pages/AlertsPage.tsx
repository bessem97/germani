import { useState } from 'react';
import {
  Bell, Search, AlertTriangle, CheckCircle2,
  Clock, MapPin, Filter, Download, X, ShieldAlert, Zap
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { alerts } from '@/data/mockData';
import { cn } from '@/lib/utils';

const severityConfig = {
  critical: { label: 'Critique', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/25', dot: 'bg-red-400', ring: 'ring-red-500/20', glow: 'shadow-red-500/10' },
  high: { label: 'Haute', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/25', dot: 'bg-orange-400', ring: 'ring-orange-500/20', glow: 'shadow-orange-500/10' },
  medium: { label: 'Moyenne', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/25', dot: 'bg-yellow-400', ring: 'ring-yellow-500/20', glow: 'shadow-yellow-500/10' },
  low: { label: 'Basse', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/25', dot: 'bg-blue-400', ring: 'ring-blue-500/20', glow: 'shadow-blue-500/10' },
};

const statusConfig = {
  active: { label: 'Active', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  resolved: { label: 'Résolue', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
};

export function AlertsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const downloadFile = (content: string, filename: string, type = 'text/csv') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  function exportAlertsCsv() {
    const headers = ['id', 'title', 'description', 'severity', 'status', 'timestamp', 'location'];
    const rows = filtered.map(a => headers.map(h => `"${String((a as any)[h] ?? '').replace(/"/g, '""')}"`).join(','));
    downloadFile([headers.join(','), ...rows].join('\r\n'), 'export-alertes.csv');
  }

  const filtered = alerts.filter((a) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.location.toLowerCase().includes(q);
    return matchSearch && (filterSeverity ? a.severity === filterSeverity : true) && (filterStatus ? a.status === filterStatus : true);
  });

  const activeCount = alerts.filter(a => a.status === 'active').length;
  const criticalCount = alerts.filter(a => a.severity === 'critical' && a.status === 'active').length;
  const resolvedCount = alerts.filter(a => a.status === 'resolved').length;
  const uniqueLocations = Array.from(new Set(alerts.map(a => a.location)));

  const stats = [
    { label: 'Alertes actives', value: activeCount, icon: Bell, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    { label: 'Critiques', value: criticalCount, icon: ShieldAlert, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
    { label: 'Résolues', value: resolvedCount, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { label: 'Zones concernées', value: uniqueLocations.length, icon: MapPin, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  ];

  return (
    <div className="space-y-7 animate-in fade-in duration-400">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-400 font-mono">Système d'Alertes</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Alertes Réseau</h1>
          <p className="text-slate-400 text-sm mt-0.5">Supervision temps réel des anomalies détectées</p>
        </div>
        <Button
          onClick={exportAlertsCsv}
          className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/25 rounded-xl gap-2 font-semibold transition-all"
          variant="outline"
        >
          <Download className="h-4 w-4" />
          Exporter CSV
        </Button>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={cn('page-card p-5 flex items-center gap-4 transition-all', s.border)}>
              <div className={cn('h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0', s.bg)}>
                <Icon className={cn('h-5 w-5', s.color)} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">{s.value}</p>
                <p className="text-xs text-slate-400 leading-tight mt-0.5">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Rechercher une alerte…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-cyan-500/40 focus:ring-cyan-500/10"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {(['critical', 'high', 'medium', 'low'] as const).map(sv => (
            <button
              key={sv}
              onClick={() => setFilterSeverity(filterSeverity === sv ? null : sv)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                filterSeverity === sv
                  ? cn(severityConfig[sv].bg, severityConfig[sv].color, severityConfig[sv].border)
                  : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
              )}
            >
              {severityConfig[sv].label}
            </button>
          ))}
          <button
            onClick={() => setFilterStatus(filterStatus === 'active' ? null : 'active')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
              filterStatus === 'active'
                ? 'bg-red-500/10 text-red-400 border-red-500/25'
                : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
            )}
          >
            Actives seulement
          </button>
          {(filterSeverity || filterStatus) && (
            <button onClick={() => { setFilterSeverity(null); setFilterStatus(null); }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-slate-400 hover:text-white gap-1 flex items-center">
              <Filter className="h-3 w-3" /> Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* ── Alert List ── */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="page-card p-12 text-center">
            <Bell className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">Aucune alerte trouvée</p>
            <p className="text-slate-500 text-sm mt-1">Modifiez vos filtres de recherche</p>
          </div>
        ) : filtered.map((alert) => {
          const sev = severityConfig[alert.severity as keyof typeof severityConfig];
          const sta = statusConfig[alert.status as keyof typeof statusConfig];
          return (
            <div
              key={alert.id}
              className={cn(
                'page-card p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-all cursor-pointer hover:bg-white/[0.03]',
                alert.status === 'active' && alert.severity === 'critical' && 'border-red-500/20 shadow-lg shadow-red-500/5'
              )}
            >
              {/* Severity icon */}
              <div className={cn('h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0', sev.bg)}>
                {alert.severity === 'critical' ? (
                  <Zap className={cn('h-5 w-5', sev.color)} />
                ) : (
                  <AlertTriangle className={cn('h-5 w-5', sev.color)} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-slate-500">{alert.id}</span>
                  <Badge className={cn('text-[10px] px-2 py-0 border rounded-full', sev.bg, sev.color, sev.border)}>
                    {sev.label}
                  </Badge>
                  <Badge className={cn('text-[10px] px-2 py-0 border rounded-full', sta.bg, sta.color, sta.border)}>
                    {sta.label}
                  </Badge>
                </div>
                <h3 className="font-semibold text-white text-sm leading-tight">{alert.title}</h3>
                <p className="text-slate-400 text-xs mt-0.5 truncate">{alert.description}</p>
              </div>

              {/* Meta */}
              <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 flex-shrink-0 text-right">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="max-w-[120px] truncate">{alert.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{alert.timestamp}</span>
                </div>
              </div>

              {/* Active pulse indicator */}
              {alert.status === 'active' && (
                <div className="relative flex-shrink-0 hidden sm:flex">
                  <span className={cn('h-2.5 w-2.5 rounded-full', sev.dot)} />
                  <span className={cn('animate-ping-slow absolute inline-flex h-2.5 w-2.5 rounded-full opacity-50', sev.dot)} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length > 0 && (
        <p className="text-center text-xs text-slate-500 pb-2">
          {filtered.length} alerte{filtered.length > 1 ? 's' : ''} affichée{filtered.length > 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}
