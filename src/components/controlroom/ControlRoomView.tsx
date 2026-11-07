import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SecuritySite } from '../../types';
import {
  Shield,
  Radio,
  MapPin,
  Users,
  AlertTriangle,
  Route,
  CheckCircle2,
  Clock,
  Eye,
  Camera,
  Activity,
  PhoneCall,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const ControlRoomView: React.FC = () => {
  const {
    sites,
    guards,
    patrols,
    incidents,
    activeSos,
    triggerSos,
    resolveSos,
    setCurrentView,
    setSelectedSiteId,
  } = useApp();

  const [selectedSite, setSelectedSite] = useState<SecuritySite>(sites[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'cctv' | 'dispatch'>('overview');

  const onDutyGuards = guards.filter((g) => g.employmentStatus === 'on_duty');
  const activeIncidents = incidents.filter(
    (i) => i.status === 'reported' || i.status === 'investigating'
  );
  const inProgressPatrols = patrols.filter((p) => p.status === 'in_progress');
  const missedCheckpointsCount = patrols.flatMap((p) =>
    p.checkpoints.filter((c) => c.status === 'missed')
  ).length;

  // Selected site details
  const siteGuards = guards.filter((g) => g.currentSiteId === selectedSite.id);
  const sitePatrols = patrols.filter((p) => p.siteId === selectedSite.id);
  const siteIncidents = incidents.filter((i) => i.siteId === selectedSite.id);

  return (
    <div className="space-y-6">
      {/* Emergency SOS Banner (when triggered) */}
      {activeSos && (
        <div className="bg-rose-950/80 border-2 border-rose-600 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-600 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>TACTICAL EMERGENCY SOS DECLARED</span>
                <span className="text-xs font-mono bg-rose-600 px-2 py-0.5 rounded text-white">
                  {activeSos.timestamp}
                </span>
              </div>
              <div className="text-xs text-rose-200 mt-0.5">
                Officer <span className="font-semibold text-white">{activeSos.guardName}</span>{' '}
                at <span className="font-semibold text-white">{activeSos.siteName}</span> triggered
                duress beacon. Rapid Response Unit 1 en route.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedSiteId(selectedSite.id);
                setCurrentView('incidents');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-500 transition-colors"
            >
              Dispatch Incident Desk
            </button>
            <button
              onClick={resolveSos}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs font-medium hover:bg-slate-800 transition-colors"
            >
              Acknowledge & Stand Down
            </button>
          </div>
        </div>
      )}

      {/* Hero Command Operations Deck */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900">
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/command_center_1794075664708.jpg"
            alt="FIST GUARD Tactical Command Operations Center"
            className="w-full h-full object-cover opacity-25"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/60" />
        </div>

        <div className="relative p-6 md:p-8 flex flex-col justify-between min-h-[190px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>KIGALI CENTRAL CONTROL ROOM · LIVE TELEMETRY</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-1">
                Security Operations & Command Center
              </h1>
              <p className="text-sm text-slate-400 max-w-2xl mt-1">
                Protecting 6 strategic commercial, banking, and diplomatic facilities across Rwanda
                with real-time patrol telemetry and automated GPS checkpoint verification.
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-start md:self-auto">
              <button
                onClick={() => setCurrentView('guard_app')}
                className="px-3.5 py-2 rounded-lg bg-amber-500 text-slate-950 font-semibold text-xs hover:bg-amber-400 transition-colors flex items-center gap-1.5"
              >
                <span>Open Guard App</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => triggerSos('grd_musyoka', 'KBC Business Park')}
                className="px-3 py-2 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Trigger Drill</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 pt-5 border-t border-slate-800/80">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Guards On Duty</span>
                <Users className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-xl font-bold text-white font-mono tabular-nums mt-1">
                {onDutyGuards.length} <span className="text-xs text-slate-500 font-normal">/ {guards.length} total</span>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Active Sites</span>
                <Shield className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-xl font-bold text-white font-mono tabular-nums mt-1">
                {sites.length} <span className="text-xs text-emerald-400 font-normal">100% Secure</span>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Live Patrols</span>
                <Route className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <div className="text-xl font-bold text-white font-mono tabular-nums mt-1">
                {inProgressPatrols.length} <span className="text-xs text-slate-500 font-normal">active tours</span>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Open Incidents</span>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-xl font-bold text-white font-mono tabular-nums mt-1">
                {activeIncidents.length} <span className="text-xs text-slate-500 font-normal">investigating</span>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Missed Checkpoints</span>
                <Clock className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <div className="text-xl font-bold text-white font-mono tabular-nums mt-1">
                {missedCheckpointsCount}{' '}
                <span className="text-xs text-rose-400 font-normal">requires review</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Tactical Map & Site Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Rwandan Tactical Operations Map */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Rwanda Operational Map & Security Sites</span>
                </h2>
                <div className="text-xs text-slate-400">
                  Click a facility marker to inspect live guards, posts, and CCTV telemetry
                </div>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                GPS Live Polling: 10s
              </span>
            </div>

            {/* Simulated High-Tech Tactical Vector Map */}
            <div className="relative h-80 rounded-xl border border-slate-800 bg-slate-950 overflow-hidden p-4">
              {/* Radar Grid Lines Background */}
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage: `radial-gradient(circle at center, #f59e0b 1px, transparent 1px), linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                }}
              />

              {/* Sector Radar Sweep Circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-amber-500/10 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-amber-500/20 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-amber-500/30 pointer-events-none" />

              {/* Kigali Label */}
              <div className="absolute top-4 left-4 z-10 text-[11px] font-mono text-slate-500">
                SECTOR: KIGALI PROVINCE / GASABO & NYARUGENGE
              </div>

              {/* Interactive Site Pins */}
              {sites.map((site, index) => {
                const isSelected = selectedSite.id === site.id;
                // Calculate positioned offsets based on simulated map coordinates
                const positions = [
                  { top: '42%', left: '48%' }, // KBC
                  { top: '35%', left: '38%' }, // BK HQ
                  { top: '48%', left: '52%' }, // KCC
                  { top: '25%', left: '56%' }, // Nyarutarama
                  { top: '65%', left: '68%' }, // SEZ Masoro
                  { top: '15%', left: '15%' }, // Rubavu
                ];
                const pos = positions[index] || { top: '50%', left: '50%' };

                return (
                  <button
                    key={site.id}
                    onClick={() => setSelectedSite(site)}
                    style={{ top: pos.top, left: pos.left }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group flex flex-col items-center transition-transform ${
                      isSelected ? 'scale-110' : 'hover:scale-105'
                    }`}
                  >
                    <div
                      className={`relative flex items-center justify-center w-7 h-7 rounded-full border shadow-lg transition-colors ${
                        isSelected
                          ? 'bg-amber-500 border-white text-slate-950 font-bold'
                          : site.status === 'critical_watch'
                          ? 'bg-rose-600 border-rose-300 text-white'
                          : 'bg-slate-900 border-amber-500/60 text-amber-400 hover:bg-slate-800'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      {site.status === 'critical_watch' && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
                      )}
                    </div>
                    <span
                      className={`mt-1 text-[10px] font-medium px-1.5 py-0.5 rounded backdrop-blur-sm whitespace-nowrap ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-semibold'
                          : 'bg-slate-900/90 text-slate-300 border border-slate-800'
                      }`}
                    >
                      {site.name.split(' ')[0]} ({site.activeGuardsCount})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Site Picker Strip */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1">
            {sites.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSite(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                  selectedSite.id === s.id
                    ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Selected Site Tactical Dossier */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
              <div>
                <div className="text-[11px] font-mono text-amber-400 flex items-center gap-2">
                  <span>{selectedSite.category}</span>
                  <span>·</span>
                  <span>{selectedSite.district}, {selectedSite.city}</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-0.5">{selectedSite.name}</h3>
                <div className="text-xs text-slate-400">{selectedSite.clientName}</div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setSelectedSiteId(selectedSite.id);
                    setCurrentView('deployment');
                  }}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors"
                >
                  Manage Roster
                </button>
              </div>
            </div>

            {/* Segmented View Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg mb-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Post Overview
              </button>
              <button
                onClick={() => setActiveTab('cctv')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'cctv'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>CCTV Perimeter</span>
              </button>
              <button
                onClick={() => setActiveTab('dispatch')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'dispatch'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Guards on Duty ({siteGuards.length})
              </button>
            </div>

            {/* Tab 1: Post Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500">Day / Night Shift</span>
                    <div className="font-semibold text-white mt-0.5">
                      {selectedSite.guardsRequiredDay} Day / {selectedSite.guardsRequiredNight} Night
                    </div>
                  </div>
                  <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500">Field Supervisor</span>
                    <div className="font-semibold text-white mt-0.5 truncate">
                      {selectedSite.supervisorName}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-300 mb-1.5">
                    Post Standing Orders
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-400">
                    {selectedSite.postInstructions.map((order, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-slate-950/50 p-2 rounded border border-slate-800/60">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{order}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 2: CCTV Feed Preview */}
            {activeTab === 'cctv' && (
              <div className="space-y-3">
                <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video">
                  <img
                    src={selectedSite.imageUrl}
                    alt={selectedSite.name}
                    className="w-full h-full object-cover filter brightness-90"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
                    CAM-01 · MAIN GATE 1
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-slate-300">
                    LIVE HD · 25 FPS
                  </div>
                </div>
                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>Smiths Detection Arch & Undercarriage Scanner</span>
                  <span className="text-emerald-400 font-mono">NOMINAL</span>
                </div>
              </div>
            )}

            {/* Tab 3: Guards on Duty */}
            {activeTab === 'dispatch' && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {siteGuards.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No guards currently deployed at this site.
                  </div>
                ) : (
                  siteGuards.map((guard) => (
                    <div
                      key={guard.id}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={guard.photoUrl}
                          alt={guard.fullName}
                          className="w-8 h-8 rounded-md object-cover border border-amber-500/30"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="text-xs font-semibold text-white">{guard.fullName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {guard.employeeNumber} · {guard.assignedShift.split(' ')[0]}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        Active
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Quick Contact Client Liaison */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>Contact: {selectedSite.contactPerson} ({selectedSite.contactPhone})</span>
            </div>
            <button
              onClick={() => setCurrentView('patrols')}
              className="text-amber-400 hover:text-amber-300 font-medium"
            >
              Checkpoints &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Operational Dispatch Stream & Live Incident Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Incident Ticker */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Active Security Incidents & Investigations</span>
            </h3>
            <button
              onClick={() => setCurrentView('incidents')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium"
            >
              View All ({incidents.length})
            </button>
          </div>

          <div className="space-y-3">
            {incidents.slice(0, 3).map((inc) => (
              <div
                key={inc.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-500">{inc.caseNumber}</span>
                  <span
                    className={`font-semibold text-[10px] px-2 py-0.5 rounded ${
                      inc.severity === 'critical'
                        ? 'bg-rose-500/20 text-rose-300'
                        : inc.severity === 'high'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {inc.severity.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs font-semibold text-white mt-1">{inc.type}</div>
                <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                  {inc.description}
                </div>
                <div className="mt-2 pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{inc.siteName}</span>
                  <span className="font-mono">{inc.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Patrol & Checkpoint Heartbeat */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Route className="w-4 h-4 text-sky-400" />
              <span>Live Patrol Tours & Checkpoint Heartbeat</span>
            </h3>
            <button
              onClick={() => setCurrentView('patrols')}
              className="text-xs text-sky-400 hover:text-sky-300 font-medium"
            >
              Manage Routes
            </button>
          </div>

          <div className="space-y-3">
            {patrols.map((patrol) => {
              const scannedCount = patrol.checkpoints.filter((c) => c.status === 'scanned').length;
              const totalCount = patrol.checkpoints.length;
              const percent = Math.round((scannedCount / totalCount) * 100);

              return (
                <div
                  key={patrol.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{patrol.routeName}</span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                        patrol.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : patrol.status === 'overdue'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-sky-500/20 text-sky-300'
                      }`}
                    >
                      {patrol.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                    <span>Officer: {patrol.assignedGuardName}</span>
                    <span className="font-mono text-slate-500">
                      {scannedCount}/{totalCount} Checkpoints ({percent}%)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full transition-all duration-500 ${
                        patrol.status === 'completed'
                          ? 'bg-emerald-500'
                          : patrol.status === 'overdue'
                          ? 'bg-rose-500'
                          : 'bg-amber-400'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
