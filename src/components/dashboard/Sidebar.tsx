import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard, Bell, Wrench, Radio, Network, FileText,
  ChevronLeft, ChevronDown, ChevronRight, ShieldAlert, Droplets, LogOut,
  Activity, Package, CalendarDays, Users, BarChart2, Siren, ClipboardCheck, AlertOctagon,
  Settings, Sliders, AlertTriangle, Send
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface SubItem {
  path: string;
  label: string;
  icon: React.ElementType;
}

interface MenuItem {
  path: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  children?: SubItem[];
}

const menuItems: MenuItem[] = [
  { path: '/dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
  { path: '/dashboard/alerts', label: 'Alertes', icon: Bell, badge: '3' },
  {
    path: '/dashboard/maintenance',
    label: 'Maintenance',
    icon: Wrench,
    children: [
      { path: '/dashboard/maintenance/demande-intervention', label: 'Demander Intervention', icon: Send },
      { path: '/dashboard/maintenance', label: 'KPI Maintenance', icon: BarChart2 },
      { path: '/dashboard/maintenance/magasin', label: 'Magasin PDR', icon: Package },
      { path: '/dashboard/maintenance/planning', label: 'Planning Préventif', icon: CalendarDays },
      { path: '/dashboard/maintenance/equipe', label: 'Équipe Maintenance', icon: Users },
    ]
  },
  {
    path: '/dashboard/sensors',
    label: 'Capteurs',
    icon: Radio,
    children: [
      { path: '/dashboard/sensors', label: 'Liste Capteurs', icon: Radio },
      { path: '/dashboard/sensors/ia-analytique', label: 'IA & Analytique', icon: BarChart2 }
    ]
  },
  { path: '/dashboard/digital-twin', label: 'Jumeau Numérique', icon: Network },
  
  {
    path: '/dashboard/historique',
    label: 'Historique',
    icon: FileText,
    children: [
      { path: '/dashboard/historique/intervention', label: 'Interventions', icon: ClipboardCheck },
      { path: '/dashboard/historique/preventive', label: 'Préventif', icon: ShieldAlert },
      { path: '/dashboard/historique/fuite', label: 'Fuites', icon: AlertOctagon },
    ]
  },
  {
    path: '/dashboard/config',
    label: 'Configuration',
    icon: Settings,
    children: [
      { path: '/dashboard/config/sensor-settings', label: 'Paramètres capteurs', icon: Sliders },
      { path: '/dashboard/config/alert-thresholds', label: "Seuils d'alerte", icon: AlertTriangle },
      { path: '/dashboard/config/users', label: 'Utilisateurs', icon: Users },
      { path: '/dashboard/config/notifications', label: 'Notifications', icon: Bell }
    ]
  },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  const [openMenus, setOpenMenus] = useState<string[]>(['/dashboard/maintenance', '/dashboard/historique']);

  const toggleMenu = (path: string) => {
    setOpenMenus(prev =>
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isParentActive = (item: MenuItem) => {
    if (!item.children) return false;
    return item.children.some(child => location.pathname === child.path);
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen transition-all duration-300 border-r border-white/[0.06] flex flex-col',
        'bg-gradient-to-b from-[#0a1628] via-[#0c1a32] to-[#080f1f]',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Logo Header */}
      <div className={cn('flex items-center h-[68px] border-b border-white/[0.06] flex-shrink-0', collapsed ? 'justify-center px-3' : 'justify-between px-4')}>
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            {/* Logo SVG — Water drop + AI brain */}
            <div className="relative flex-shrink-0">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-[0_0_18px_rgba(6,182,212,0.35)]">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
                  <path d="M12 2C8 8 5 11 5 15a7 7 0 0 0 14 0c0-4-3-7-7-13z" />
                  <circle cx="10" cy="14" r="1" fill="rgba(0,0,0,0.4)" />
                  <circle cx="14" cy="13" r="1" fill="rgba(0,0,0,0.4)" />
                  <path d="M10 14 Q12 12 14 13" stroke="rgba(0,0,0,0.4)" strokeWidth="0.8" fill="none" />
                </svg>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-cyan-400 rounded-full flex items-center justify-center border-2 border-[#0a1628]">
                <div className="h-1 w-1 bg-white rounded-full" />
              </div>
            </div>
            <div>
              <div className="text-white font-extrabold text-[15px] tracking-wide leading-none">Qatra<span className="text-cyan-400">Mind</span></div>
              <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold leading-none mt-0.5">IoT · AI · Water</div>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-[0_0_14px_rgba(6,182,212,0.3)]">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
              <path d="M12 2C8 8 5 11 5 15a7 7 0 0 0 14 0c0-4-3-7-7-13z" />
            </svg>
          </div>
        )}
        {!collapsed && (
          <button onClick={onToggle} className="h-7 w-7 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {collapsed && (
        <button onClick={onToggle} className="mx-auto mt-3 h-7 w-7 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all">
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5 scrollbar-hide">
        {!collapsed && (
          <p className="mb-2 px-2 text-[9px] font-bold uppercase tracking-widest text-slate-600">SUPERVISEUR RÉSEAU</p>
        )}

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const isParent = isParentActive(item);
          const isOpen = openMenus.includes(item.path);
          const hasChildren = item.children && item.children.length > 0;

          if (hasChildren && !collapsed) {
            return (
              <div key={item.path}>
                <button
                  onClick={() => toggleMenu(item.path)}
                  className={cn(
                    'w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group',
                    isParent
                      ? 'bg-white/[0.06] text-white border border-white/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn('h-4.5 w-4.5 transition-colors', isParent ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300')} />
                    <span className="font-semibold text-[13px]">{item.label}</span>
                  </div>
                  <ChevronDown className={cn('h-3.5 w-3.5 text-slate-500 transition-transform duration-200', isOpen && 'rotate-180')} />
                </button>

                {isOpen && (
                  <div className="mt-0.5 ml-4 pl-3 border-l border-white/[0.06] space-y-0.5">
                    {item.children!.map(child => {
                      const ChildIcon = child.icon;
                      const childActive = location.pathname === child.path;
                      return (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={cn(
                            'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all group',
                            childActive
                              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                              : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
                          )}
                        >
                          <ChildIcon className={cn('h-3.5 w-3.5 flex-shrink-0', childActive ? 'text-cyan-400' : 'text-slate-600 group-hover:text-slate-400')} />
                          <span>{child.label}</span>
                          {childActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400" />}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative',
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/15 to-blue-600/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.08)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent',
                collapsed ? 'justify-center' : 'justify-between'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn('h-4.5 w-4.5 flex-shrink-0 transition-colors', isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300')} />
                {!collapsed && <span className="font-semibold text-[13px]">{item.label}</span>}
              </div>
              {!collapsed && (
                <div className="flex items-center gap-2">
                  {item.badge && !isActive && (
                    <span className="text-[9px] font-extrabold bg-red-500 text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {item.badge}
                    </span>
                  )}
                  {isActive && <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />}
                </div>
              )}
            </NavLink>
          );
        })}

        {/* Separator */}
        <div className="border-t border-white/[0.05] my-3" />
        {!collapsed && <p className="mb-2 px-2 text-[9px] font-bold uppercase tracking-widest text-slate-600">SYSTÈME</p>}

        <button
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/15 transition-all group',
            collapsed && 'justify-center'
          )}
          title={collapsed ? 'Déconnexion' : undefined}
        >
          <LogOut className="h-4.5 w-4.5 flex-shrink-0 group-hover:text-red-400" />
          {!collapsed && <span className="font-semibold text-[13px]">Déconnexion</span>}
        </button>
      </nav>

      {/* Bottom user strip */}
      {!collapsed && (
        <div className="border-t border-white/[0.06] p-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0">
              {currentUser?.username.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold text-xs truncate">{currentUser?.username || 'Utilisateur'}</p>
              <p className="text-slate-500 text-[10px] truncate">Connecté</p>
            </div>
            <div className="ml-auto h-2 w-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          </div>
        </div>
      )}
    </aside>
  );
}
