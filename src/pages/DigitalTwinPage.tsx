import { useState } from 'react';
import { Info, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NetworkMap } from '@/components/dashboard/NetworkMap';
import { networkNodes, networkEdges } from '@/data/mockData';
import type { NetworkNode } from '@/types';

export function DigitalTwinPage() {
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);

  const activeNodes = networkNodes.filter((n) => n.status === 'normal').length;
  const criticalNodes = networkNodes.filter((n) => n.status === 'critical').length;
  const totalConnections = networkEdges.length;
  const activeAlerts = networkEdges.filter((e) => e.status !== 'normal').length;

  return (
    <div className="space-y-6 h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Jumeau Numérique
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Vue interactive du réseau hydrique
          </p>
        </div>
      </div>

      {/* Network View */}
      <div className="grid gap-6 lg:grid-cols-4 h-[calc(100%-80px)]">
        {/* Map */}
        <Card className="lg:col-span-3 border-slate-200 dark:border-slate-700 h-full">
          <CardContent className="p-0 h-full">
            <NetworkMap
              nodes={networkNodes}
              edges={networkEdges}
              onNodeSelect={setSelectedNode}
              selectedNode={selectedNode}
            />
          </CardContent>
        </Card>

        {/* Sidebar Info */}
        <div className="space-y-4 overflow-auto">
          {/* Details Card */}
          <Card className="border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-cyan-500" />
                <CardTitle className="text-lg">Détails</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {selectedNode ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-400">Nom</p>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {selectedNode.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Type</p>
                    <p className="font-medium capitalize text-slate-900 dark:text-white">
                      {selectedNode.type === 'reservoir'
                        ? 'Réservoir'
                        : selectedNode.type === 'pump'
                        ? 'Pompe'
                        : selectedNode.type === 'sensor'
                        ? 'Capteur'
                        : selectedNode.type === 'valve'
                        ? 'Vanne'
                        : 'Jonction'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Statut</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          selectedNode.status === 'normal'
                            ? 'bg-emerald-500'
                            : selectedNode.status === 'warning'
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                      />
                      <span className="font-medium capitalize text-slate-900 dark:text-white">
                        {selectedNode.status === 'normal'
                          ? 'Normal'
                          : selectedNode.status === 'warning'
                          ? 'Attention'
                          : 'Critique'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Position</p>
                    <p className="font-medium text-slate-900 dark:text-white">
                      X: {selectedNode.x}, Y: {selectedNode.y}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Connexions</p>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {selectedNode.connections.length} élément(s)
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  Sélectionnez un élément sur la carte pour voir ses détails.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Network Summary */}
          <Card className="border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-cyan-500" />
                <CardTitle className="text-lg">Résumé Réseau</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Noeuds actifs</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {activeNodes}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Connexions</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {totalConnections}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Alertes</span>
                  <span className="font-medium text-amber-500">{activeAlerts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Critiques</span>
                  <span className="font-medium text-red-500">{criticalNodes}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <Card className="border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Légende</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { color: '#3b82f6', label: 'Réservoir' },
                  { color: '#06b6d4', label: 'Pompe' },
                  { color: '#10b981', label: 'Capteur' },
                  { color: '#8b5cf6', label: 'Vanne' },
                  { color: '#64748b', label: 'Jonction' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
