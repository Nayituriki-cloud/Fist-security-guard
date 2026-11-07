import React, { useState } from 'react';
import { useApp, AppView } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  ShieldAlert,
  ChevronDown,
  UserCheck,
  Radio,
  SlidersHorizontal,
} from 'lucide-react';

const ROLE_LABELS: Record<UserRole, { label: string; desc: string }> = {
  super_admin: { label: 'Super Admin', desc: 'Full Enterprise Control' },
  director: { label: 'Company Director', desc: 'Executive & Strategic Oversight' },
  operations_manager: { label: 'Ops Manager', desc: 'Deployments & Post Roster' },
  supervisor: { label: 'Field Supervisor', desc: 'Site Inspections & Guard Checks' },
  guard: { label: 'Security Guard', desc: 'Terminal & Patrol Scanner' },
  hr_manager: { label: 'HR Manager', desc: 'Recruitment & Disciplinary Records' },
  finance_manager: { label: 'Finance Manager', desc: 'Payroll, Allowances & Invoices' },
  client: { label: 'Client Portal', desc: 'Bank of Kigali / KCC Executive' },
  control_room_operator: { label: 'Control Room', desc: 'Live Telemetry & Radar' },
};

export const Header: React.FC = () => {
  const {
    currentUser,
    switchRole,
    currentView,
    setCurrentView,
    activeSos,
    triggerSos,
    resolveSos,
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const navLinks: { view: AppView; label: string }[] = [
    { view: 'control_room', label: 'Control Room' },
    { view: 'deployment', label: 'Deployment' },
    { view: 'patrols', label: 'Patrols' },
    { view: 'incidents', label: 'Incidents' },
    { view: 'ai_assistant', label: 'AI Intel' },
  ];

  return (
    <header className="relative z-30 flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-md">
      {/* Zone 1: Single text element wordmark (Top Bar Contract) */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setCurrentView('control_room')}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 transition-colors">
            <Radio className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
              FIST GUARD
            </span>
          </div>
        </button>
      </div>

      {/* Zone 2: 4-5 concise single-line text navigation links */}
      <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-400">
        {navLinks.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => setCurrentView(item.view)}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                isActive
                  ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                  : 'hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: 1 primary action area with role-based switcher and quick SOS indicator */}
      <div className="flex items-center gap-3 shrink-0">
        {activeSos ? (
          <button
            onClick={resolveSos}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold hover:bg-rose-500/30 transition-colors whitespace-nowrap"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Active SOS: {activeSos.siteName}</span>
          </button>
        ) : (
          <button
            onClick={() => triggerSos(currentUser.id, 'KBC Business Park')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-800/40 text-rose-400 text-xs font-medium hover:bg-rose-900/60 transition-colors whitespace-nowrap"
            title="Simulate guard distress panic alert"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Panic Drill</span>
          </button>
        )}

        {/* Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 hover:bg-slate-850 transition-colors whitespace-nowrap"
            aria-expanded={roleMenuOpen}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-400 font-normal">Role:</span>
            <span className="font-semibold text-white">{ROLE_LABELS[currentUser.role]?.label}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50">
              <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                <div className="text-xs font-medium text-slate-400 flex items-center justify-between">
                  <span>Switch Operational Role</span>
                  <SlidersHorizontal className="w-3 h-3 text-slate-500" />
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Experience all 9 specialized security portals
                </div>
              </div>

              <div className="space-y-0.5 max-h-80 overflow-y-auto">
                {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => {
                  const isCurrent = currentUser.role === r;
                  return (
                    <button
                      key={r}
                      onClick={() => {
                        switchRole(r);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full flex items-start gap-2.5 px-3 py-2 rounded-lg text-left transition-colors text-xs ${
                        isCurrent
                          ? 'bg-amber-500/10 text-amber-300 font-medium'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <UserCheck
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          isCurrent ? 'text-amber-400' : 'text-slate-500'
                        }`}
                      />
                      <div className="min-w-0">
                        <div className="font-medium truncate">{ROLE_LABELS[r].label}</div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {ROLE_LABELS[r].desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
