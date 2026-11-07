import React from 'react';
import { useApp, AppView } from '../../context/AppContext';
import {
  Radar,
  Users,
  MapPin,
  Clock,
  Route,
  AlertTriangle,
  Smartphone,
  Building2,
  GraduationCap,
  DollarSign,
  PackageCheck,
  BrainCircuit,
  MessageSquare,
  Shield,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  id: AppView;
  label: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, currentUser, incidents, activeSos } = useApp();

  const activeIncidentsCount = incidents.filter(
    (i) => i.status === 'reported' || i.status === 'investigating'
  ).length;

  const navItems: { group: string; items: NavItem[] }[] = [
    {
      group: 'Tactical Operations',
      items: [
        {
          id: 'control_room',
          label: 'Control Room Live',
          badge: activeSos ? 'SOS' : undefined,
          icon: Radar,
        },
        { id: 'guard_app', label: 'Mobile Guard Terminal', icon: Smartphone },
        { id: 'patrols', label: 'Patrol & Checkpoints', icon: Route },
        {
          id: 'incidents',
          label: 'Incident Reports',
          badge: activeIncidentsCount > 0 ? `${activeIncidentsCount}` : undefined,
          icon: AlertTriangle,
        },
      ],
    },
    {
      group: 'Workforce & Sites',
      items: [
        { id: 'guards', label: 'Security Guards', icon: Users },
        { id: 'deployment', label: 'Deployments & Posts', icon: MapPin },
        { id: 'attendance', label: 'Attendance & Clock-in', icon: Clock },
        { id: 'clients', label: 'Client Accounts', icon: Building2 },
      ],
    },
    {
      group: 'Enterprise & Finance',
      items: [
        { id: 'hr', label: 'HR & Training Academy', icon: GraduationCap },
        { id: 'finance', label: 'Payroll & Invoicing', icon: DollarSign },
        { id: 'inventory', label: 'Equipment & Uniforms', icon: PackageCheck },
        { id: 'comms', label: 'Dispatch Comms', icon: MessageSquare },
        { id: 'ai_assistant', label: 'AI Security Intel', icon: BrainCircuit },
      ],
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800/80 bg-slate-950 flex flex-col justify-between hidden md:flex">
      <div className="py-4 px-3 space-y-6 overflow-y-auto">
        {/* User Card */}
        <div className="px-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60 flex items-center gap-3">
          <div className="relative shrink-0">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-10 h-10 rounded-lg object-cover border border-amber-500/30"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-white truncate">
              {currentUser.name}
            </div>
            <div className="text-[11px] text-amber-400/90 truncate font-mono">
              {currentUser.badgeNumber || 'OPERATOR'}
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              {currentUser.roleTitle}
            </div>
          </div>
        </div>

        {/* Navigation Groups */}
        {navItems.map((grp) => (
          <div key={grp.group} className="space-y-1">
            <div className="px-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
              {grp.group}
            </div>
            <div className="space-y-0.5">
              {grp.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive
                            ? 'text-amber-400'
                            : 'text-slate-500 group-hover:text-slate-300'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge ? (
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                          item.badge === 'SOS'
                            ? 'bg-rose-500 text-white animate-pulse'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight
                        className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                          isActive ? 'opacity-100 text-amber-400' : 'text-slate-600'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/80">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            <span>FIST GUARD v3.4</span>
          </div>
          <span className="text-emerald-400">KIGALI SEC</span>
        </div>
      </div>
    </aside>
  );
};
