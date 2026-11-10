import { useState } from 'react';
import {
  AlertTriangle, Droplets, Gauge, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function AlertThresholdsPage() {
  const [pressureThreshold, setPressureThreshold] = useState(80);
  const [flowThresholdHigh, setFlowThresholdHigh] = useState(100);
  const [flowThresholdLow, setFlowThresholdLow] = useState(10);
  const [qualityThreshold, setQualityThreshold] = useState(50);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Seuils d'alerte</h1>
        <p className="text-slate-400 text-sm mt-0.5">Configurez les seuils qui déclenchent les alertes</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="page-card p-5">
          <h2 className="font-semibold text-white mb-4">Seuil de pression</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Gauge className="h-5 w-5 text-cyan-400 flex-shrink-0" />
              <div>
                <p className="text-slate-400">Pression maximale autorisée</p>
                <div className="flex items-center">
                  <Label htmlFor="pressure-threshold">Pression (%)</Label>
                  <Input
                    id="pressure-threshold"
                    type="number"
                    min="0"
                    max="100"
                    value={pressureThreshold}
                    onChange={(e) => setPressureThreshold(Number(e.target.value))}
                    className="w-24"
                  />
                  <span className="ml-2 text-slate-400">bar</span>
                </div>
              </div>
            </div>
            <p className="text-slate-400 text-sm mt-2">
              Au-dessus de ce seuil, une alerte de pression élevée est déclenchée.
            </p>
          </div>
        </div>

        <div className="page-card p-5">
          <h2 className="font-semibold text-white mb-4">Seuils de débit</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Droplets className="h-5 w-5 text-blue-400 flex-shrink-0" />
              <div>
                <p className="text-slate-400">Débit minimal</p>
                <div className="flex items-center">
                  <Label htmlFor="flow-threshold-low">Débit (L/h)</Label>
                  <Input
                    id="flow-threshold-low"
                    type="number"
                    min="0"
                    value={flowThresholdLow}
                    onChange={(e) => setFlowThresholdLow(Number(e.target.value))}
                    className="w-24"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Droplets className="h-5 w-5 text-blue-400 flex-shrink-0" />
              <div>
                <p className="text-slate-400">Débit maximal</p>
                <div className="flex items-center">
                  <Label htmlFor="flow-threshold-high">Débit (L/h)</Label>
                  <Input
                    id="flow-threshold-high"
                    type="number"
                    min="0"
                    value={flowThresholdHigh}
                    onChange={(e) => setFlowThresholdHigh(Number(e.target.value))}
                    className="w-24"
                  />
                </div>
              </div>
            </div>
            <p className="text-slate-400 text-sm mt-2">
              Des alertes sont déclenchées lorsque le débit sort de l'intervalle défini.
            </p>
          </div>
        </div>
      </div>

      <div className="page-card p-5">
        <h2 className="font-semibold text-white mb-4">Seuil de qualité de l'eau</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Activity className="h-5 w-5 text-violet-400 flex-shrink-0" />
            <div>
              <p className="text-slate-400">Indice de qualité minimale</p>
              <div className="flex items-center">
                <Label htmlFor="quality-threshold">Qualité (%)</Label>
                <Input
                  id="quality-threshold"
                  type="number"
                  min="0"
                  max="100"
                  value={qualityThreshold}
                  onChange={(e) => setQualityThreshold(Number(e.target.value))}
                  className="w-24"
                />
              }
            </div>
          </div>
          <p className="text-slate-400 text-sm mt-2">
            En dessous de ce seuil, une alerte de qualité de l'eau est déclenchée.
          </p>
        </div>
      </div>

      <div className="page-card p-5">
        <Button 
          onClick={() => {
            // Handle save
            alert('Seuils sauvegardés !');
          }}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg"
        >
          Enregistrer les seuils
        </Button>
      </div>
    </div>
  );
}