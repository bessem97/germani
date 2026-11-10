import React from 'react';
import { Button } from '@/components/ui/button';

export function SensorSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-4">Paramètres des capteurs</h1>
      <p className="text-slate-400 mb-6">Configurez les intervalles, le calibrage et les métadonnées des capteurs déployés.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl p-6 bg-slate-900 border border-white/6">
          <h2 className="font-semibold text-white mb-2">Calibrage</h2>
          <p className="text-slate-400 text-sm mb-4">Ajustez les coefficients de calibration pour les capteurs acoustiques.</p>
          <Button>Ouvrir l'assistant de calibrage</Button>
        </div>

        <div className="rounded-xl p-6 bg-slate-900 border border-white/6">
          <h2 className="font-semibold text-white mb-2">Fréquence de reporting</h2>
          <p className="text-slate-400 text-sm mb-4">Définissez la fréquence d'envoi des métriques (s, m, h).</p>
          <Button>Modifier</Button>
        </div>
      </div>
    </div>
  );
}
