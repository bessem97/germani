import { useState } from 'react';
import {
  Radio, Sliders
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SensorSettingsPage() {
  const [samplingRate, setSamplingRate] = useState(60);
  const [alertThreshold, setAlertThreshold] = useState(80);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Paramètres des capteurs</h1>
        <p className="text-slate-400 text-sm mt-0.5">Configurez les paramètres opérationnels de vos capteurs IoT</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="page-card p-5">
          <h2 className="font-semibold text-white mb-4">Fréquence d'échantillonnage</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white">Actuelle : {samplingRate} secondes</span>
              <Button onClick={() => setSamplingRate(samplingRate => Math.max(10, samplingRate - 10))} variant="ghost" size="icon">
                <Radio className="h-4 w-4 text-cyan-400" />
              </Button>
              <Button onClick={() => setSamplingRate(samplingRate => samplingRate + 10)} variant="ghost" size="icon">
                <Radio className="h-4 w-4 text-cyan-400" />
              </Button>
            </div>
            <div className="flex items-center">
              <Label htmlFor="sampling-rate">Fréquence (secondes)</Label>
              <Input
                id="sampling-rate"
                type="number"
                min="10"
                max="300"
                value={samplingRate}
                onChange={(e) => setSamplingRate(Number(e.target.value))}
                className="w-32"
              />
            </div>
          </div>
          <p className="text-slate-400 text-sm mt-2">
            Intervalle entre deux mesures consécutives. Une valeur plus faible augmente la précision mais consomme plus de batterie.
          </p>
        </div>

        <div className="page-card p-5">
          <h2 className="font-semibold text-white mb-4">Seuil d'alerte de pression</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white">Seuil : {alertThreshold}%</span>
              <Button onClick={() => setAlertThreshold(alertThreshold => Math.max(0, alertThreshold - 5))} variant="ghost" size="icon">
                <Radio className="h-4 w-4 text-amber-400" />
              </Button>
              <Button onClick={() => setAlertThreshold(alertThreshold => alertThreshold + 5)} variant="ghost" size="icon">
                <Radio className="h-4 w-4 text-amber-400" />
              </Button>
            </div>
            <div className="flex items-center">
              <Label htmlFor="alert-threshold">Seuil (%)</Label>
              <Input
                id="alert-threshold"
                type="number"
                min="0"
                max="100"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(Number(e.target.value))}
                className="w-24"
              />
            </div>
          </div>
          <p className="text-slate-400 text-sm mt-2">
            Pourcentage de pression au-dessus duquel une alerte est déclenchée.
          </p>
        </div>
      </div>

      <div className="page-card p-5">
        <h2 className="font-semibold text-white mb-4">Configuration avancée</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Sliders className="h-5 w-5 text-cyan-400 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-white">Compensation de température</h3>
              <p className="text-slate-400 text-sm">
                Activez la compensation automatique des variations de température pour améliorer la précision des mesures.
              </p>
              <button className="mt-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 rounded">
                Activer
              </button>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Sliders className="h-5 w-5 text-cyan-400 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-white">Filtrage des signaux</h3>
              <p className="text-slate-400 text-sm">
                Appliquez un filtre passe-bas pour réduire le bruit électrique sur les lignes de capteurs.
              </p>
              <button className="mt-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 rounded">
                Configurer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="page-card p-5">
        <Button 
          onClick={() => {
            // Handle save
            alert('Paramètres sauvegardés !');
          }}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg"
        >
          Enregistrer les paramètres
        </Button>
      </div>
    </div>
  );
}