import React from 'react';
import { Button } from '@/components/ui/button';

export function AlertThresholdsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-4">Seuils d'alerte</h1>
      <p className="text-slate-400 mb-6">Gérez les seuils qui déclenchent les alertes et les notifications.</p>

      <div className="rounded-xl p-6 bg-slate-900 border border-white/6">
        <h2 className="font-semibold text-white mb-2">Seuils globaux</h2>
        <p className="text-slate-400 text-sm mb-4">Configurez les niveaux critiques, avertissement, et info.</p>
        <Button>Éditer les seuils</Button>
      </div>
    </div>
  );
}
