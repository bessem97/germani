import { useRef, useState } from 'react';
import type { NetworkNode, NetworkEdge } from '@/types';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Layers,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NetworkMapProps {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  onNodeSelect?: (node: NetworkNode) => void;
  selectedNode?: NetworkNode | null;
}

const nodeColors = {
  reservoir: '#3b82f6',
  pump: '#06b6d4',
  sensor: '#10b981',
  valve: '#8b5cf6',
  junction: '#64748b',
};

const nodeIcons = {
  reservoir: 'R',
  pump: 'P',
  sensor: 'S',
  valve: 'V',
  junction: 'J',
};

export function NetworkMap({ nodes, edges, onNodeSelect, selectedNode }: NetworkMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => setScale((s) => Math.min(s * 1.2, 3));
  const handleZoomOut = () => setScale((s) => Math.max(s / 1.2, 0.5));
  const handleReset = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === svgRef.current) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - translate.x, y: e.clientY - translate.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setTranslate({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const getEdgeColor = (status: string) => {
    switch (status) {
      case 'critical':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      default:
        return '#94a3b8';
    }
  };

  const getNodeStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      default:
        return '#10b981';
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900">
      {/* Controls */}
      <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          onClick={handleZoomIn}
          className="h-10 w-10 bg-white shadow-lg dark:bg-slate-800"
        >
          <ZoomIn className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleZoomOut}
          className="h-10 w-10 bg-white shadow-lg dark:bg-slate-800"
        >
          <ZoomOut className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleReset}
          className="h-10 w-10 bg-white shadow-lg dark:bg-slate-800"
        >
          <Maximize2 className="h-5 w-5" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-10 w-10 bg-white shadow-lg dark:bg-slate-800"
        >
          <Layers className="h-5 w-5" />
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 rounded-xl bg-white/90 p-4 shadow-lg backdrop-blur-sm dark:bg-slate-800/90">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Légende
        </p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(nodeColors).map(([type, color]) => (
            <div key={type} className="flex items-center gap-1.5">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs capitalize text-slate-600 dark:text-slate-300">
                {type === 'reservoir'
                  ? 'Réservoir'
                  : type === 'pump'
                  ? 'Pompe'
                  : type === 'sensor'
                  ? 'Capteur'
                  : type === 'valve'
                  ? 'Vanne'
                  : 'Jonction'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Info panel */}
      {selectedNode && (
        <div className="absolute bottom-4 right-4 z-10 w-64 rounded-xl bg-white p-4 shadow-lg dark:bg-slate-800">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-cyan-500" />
            <span className="font-semibold text-slate-900 dark:text-white">
              Détails
            </span>
          </div>
          <div className="mt-3 space-y-2">
            <div>
              <span className="text-xs text-slate-500">Nom</span>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {selectedNode.name}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-500">Type</span>
              <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                {selectedNode.type}
              </p>
            </div>
            <div>
              <span className="text-xs text-slate-500">Statut</span>
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: getNodeStatusColor(selectedNode.status) }}
                />
                <span className="text-sm font-medium capitalize text-slate-900 dark:text-white">
                  {selectedNode.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SVG Map */}
      <svg
        ref={svgRef}
        className="h-full w-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <g
          transform={`translate(${translate.x}, ${translate.y}) scale(${scale})`}
        >
          {/* Grid */}
          <defs>
            <pattern
              id="grid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-slate-200 dark:text-slate-700"
              />
            </pattern>
          </defs>
          <rect width="2000" height="2000" fill="url(#grid)" />

          {/* Edges */}
          {edges.map((edge) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);
            if (!fromNode || !toNode) return null;
            return (
              <line
                key={edge.id}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={getEdgeColor(edge.status)}
                strokeWidth={edge.status === 'critical' ? 3 : 2}
                strokeDasharray={edge.status !== 'normal' ? '5,5' : undefined}
                className={edge.status !== 'normal' ? 'network-line' : ''}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              className="cursor-pointer"
              onClick={() => onNodeSelect?.(node)}
            >
              {/* Node circle */}
              <circle
                r="20"
                fill={nodeColors[node.type]}
                className={cn(
                  'network-node transition-all',
                  selectedNode?.id === node.id && 'ring-4 ring-cyan-400'
                )}
                stroke={getNodeStatusColor(node.status)}
                strokeWidth={node.status !== 'normal' ? 3 : 0}
              />
              {/* Node label */}
              <text
                textAnchor="middle"
                dy="0.35em"
                className="fill-white text-xs font-bold pointer-events-none"
              >
                {nodeIcons[node.type]}
              </text>
              {/* Status indicator */}
              {node.status !== 'normal' && (
                <circle
                  r="6"
                  cx="14"
                  cy="-14"
                  fill={getNodeStatusColor(node.status)}
                  className="animate-pulse"
                />
              )}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
