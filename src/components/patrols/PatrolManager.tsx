import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Route,
  CheckCircle2,
  AlertTriangle,
  Clock,
  QrCode,
  MapPin,
  Plus,
  ShieldCheck,
  Search,
  X,
} from 'lucide-react';
import { PatrolRoute } from '../../types';

export const PatrolManager: React.FC = () => {
  const { patrols, sites, guards } = useApp();

  const [selectedRoute, setSelectedRoute] = useState<PatrolRoute>(patrols[0]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [supervisorVerifiedMsg, setSupervisorVerifiedMsg] = useState(false);

  // New route state
  const [newRouteName, setNewRouteName] = useState('');
  const [newSiteId, setNewSiteId] = useState(sites[0]?.id || '');
  const [newInterval, setNewInterval] = useState(60);
  const [newGuardId, setNewGuardId] = useState(guards[0]?.id || '');

  const missedCheckpoints = patrols.flatMap((p) =>
    p.checkpoints
      .filter((c) => c.status === 'missed')
      .map((c) => ({ ...c, routeName: p.routeName, siteName: p.siteName }))
  );

  const handleSupervisorVerify = () => {
    setSupervisorVerifiedMsg(true);
    setTimeout(() => setSupervisorVerifiedMsg(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Route className="w-5 h-5 text-sky-400" />
            <span>Security Patrol & QR Checkpoint System</span>
          </h1>
          <div className="text-xs text-slate-400 mt-0.5">
            Live patrol tour tracking, GPS timestamped QR check-ins, missed checkpoint anomaly alerts, and supervisor sign-offs
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/10"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Patrol Route</span>
        </button>
      </div>

      {/* Missed Checkpoint Alert (if any) */}
      {missedCheckpoints.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-900/60 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                MISSED PATROL CHECKPOINT DETECTED
              </div>
              <div className="text-xs text-slate-300 mt-1">
                {missedCheckpoints.map((mc, idx) => (
                  <span key={idx}>
                    {mc.name} ({mc.siteName}) · Scheduled {mc.scheduledTime}.{' '}
                    {mc.notes && <span className="text-amber-300">Reason: {mc.notes}</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded shrink-0">
            Anomaly Logged
          </span>
        </div>
      )}

      {/* Routes List and Checkpoint Deep-Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Routes Summary */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Active Patrol Routes ({patrols.length})
          </div>

          <div className="space-y-2.5">
            {patrols.map((route) => {
              const isSelected = selectedRoute.id === route.id;
              const scannedCount = route.checkpoints.filter((c) => c.status === 'scanned').length;
              const totalCount = route.checkpoints.length;
              const percent = Math.round((scannedCount / totalCount) * 100);

              return (
                <div
                  key={route.id}
                  onClick={() => setSelectedRoute(route)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/40 shadow-lg'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-amber-400 text-[11px] truncate max-w-[200px]">
                      {route.siteName}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        route.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : route.status === 'overdue'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-sky-500/20 text-sky-300'
                      }`}
                    >
                      {route.status}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-white mt-1">{route.routeName}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Patrol Officer: <span className="text-slate-200">{route.assignedGuardName}</span>
                  </div>

                  {/* Progress */}
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>
                      {scannedCount} of {totalCount} Checkpoints
                    </span>
                    <span>{percent}% Complete</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full ${
                        route.status === 'completed'
                          ? 'bg-emerald-500'
                          : route.status === 'overdue'
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

        {/* Right Column: Detailed Checkpoints Ledger for Selected Route */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="text-xs font-mono text-amber-400">{selectedRoute.siteName}</div>
                <h2 className="text-lg font-bold text-white mt-0.5">{selectedRoute.routeName}</h2>
                <div className="text-xs text-slate-400">
                  Assigned Officer: {selectedRoute.assignedGuardName} · Cadence: Every{' '}
                  {selectedRoute.intervalMinutes} mins
                </div>
              </div>

              <button
                onClick={handleSupervisorVerify}
                className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Patrol Tour</span>
              </button>
            </div>

            {supervisorVerifiedMsg && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Supervisor cryptographic signature applied to patrol record!</span>
              </div>
            )}

            {/* Checkpoints Sequence Detailed List */}
            <div className="mt-5 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Sequential Checkpoint Log
              </div>

              {selectedRoute.checkpoints.map((cp, idx) => {
                const isScanned = cp.status === 'scanned';
                const isMissed = cp.status === 'missed';

                return (
                  <div
                    key={cp.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                      isScanned
                        ? 'bg-slate-950 border-slate-800'
                        : isMissed
                        ? 'bg-rose-950/20 border-rose-900/40'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                          isScanned
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : isMissed
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{cp.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Token: {cp.code} · Target Time: {cp.scheduledTime}
                        </div>
                        {cp.notes && (
                          <div className="text-[11px] text-amber-400 mt-0.5">
                            Report: {cp.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      {isScanned ? (
                        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Scanned {cp.scannedAt}</span>
                        </div>
                      ) : isMissed ? (
                        <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-md">
                          MISSED
                        </span>
                      ) : (
                        <span className="text-xs font-mono text-slate-500 bg-slate-800 px-2.5 py-1 rounded-md">
                          PENDING
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>RNP Physical Security Compliance: Standard</span>
            <span>QR GPS Geo-Tagging: Active</span>
          </div>
        </div>
      </div>

      {/* Create Route Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Create Patrol Route</span>
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowCreateModal(false);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Route Name
                </label>
                <input
                  type="text"
                  required
                  value={newRouteName}
                  onChange={(e) => setNewRouteName(e.target.value)}
                  placeholder="e.g. Route Echo: VIP Rooftop & Elevator Shafts"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Facility Post</label>
                <select
                  value={newSiteId}
                  onChange={(e) => setNewSiteId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Patrol Interval (Mins)
                  </label>
                  <input
                    type="number"
                    value={newInterval}
                    onChange={(e) => setNewInterval(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Assigned Guard
                  </label>
                  <select
                    value={newGuardId}
                    onChange={(e) => setNewGuardId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    {guards.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors"
                >
                  Save Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
