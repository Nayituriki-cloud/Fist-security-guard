import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Users,
  Sun,
  Moon,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  Edit3,
  X,
} from 'lucide-react';
import { SecuritySite } from '../../types';

export const DeploymentPlanner: React.FC = () => {
  const {
    sites,
    guards,
    reassignGuardSite,
    updateSiteInstructions,
    selectedSiteId,
    setSelectedSiteId,
  } = useApp();

  const [activeSite, setActiveSite] = useState<SecuritySite>(
    sites.find((s) => s.id === selectedSiteId) || sites[0]
  );

  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedGuardToMove, setSelectedGuardToMove] = useState(guards[0]?.id || '');
  const [targetSiteId, setTargetSiteId] = useState(sites[1]?.id || sites[0]?.id);

  // New instruction input
  const [newOrderText, setNewOrderText] = useState('');
  const [editOrdersMode, setEditOrdersMode] = useState(false);

  const siteGuards = guards.filter((g) => g.currentSiteId === activeSite.id);
  const dayGuards = siteGuards.filter((g) => g.assignedShift.includes('Day'));
  const nightGuards = siteGuards.filter((g) => g.assignedShift.includes('Night'));

  const handleExecuteReassignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuardToMove || !targetSiteId) return;

    reassignGuardSite(selectedGuardToMove, targetSiteId);
    setShowReassignModal(false);
  };

  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderText.trim()) return;

    updateSiteInstructions(activeSite.id, [...activeSite.postInstructions, newOrderText.trim()]);
    setNewOrderText('');
  };

  const handleRemoveOrder = (index: number) => {
    const updated = activeSite.postInstructions.filter((_, i) => i !== index);
    updateSiteInstructions(activeSite.id, updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
            <MapPin className="w-5 h-5 text-amber-400" />
            <span>Guard Deployment & Post Coverage Planner</span>
          </h1>
          <div className="text-xs text-slate-400 mt-0.5">
            Shift roster scheduling, Day & Night coverage quotas, emergency guard replacement, and post orders
          </div>
        </div>

        <button
          onClick={() => setShowReassignModal(true)}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/10"
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Quick Guard Replacement / Transfer</span>
        </button>
      </div>

      {/* Site Selection Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {sites.map((site) => {
          const isSelected = activeSite.id === site.id;
          const assignedCount = guards.filter((g) => g.currentSiteId === site.id).length;
          const requiredTotal = site.guardsRequiredDay + site.guardsRequiredNight;
          const isUnderstaffed = assignedCount < site.guardsRequiredDay;

          return (
            <button
              key={site.id}
              onClick={() => {
                setActiveSite(site);
                setSelectedSiteId(site.id);
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-500/40 shadow-md'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  {site.city}
                </span>
                {isUnderstaffed && (
                  <span className="w-2 h-2 rounded-full bg-rose-500" title="Coverage deficit" />
                )}
              </div>
              <div className="font-bold text-xs text-white truncate mt-1">{site.name}</div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                {assignedCount} deployed / {requiredTotal} req
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Site Tactical Deployment Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Post Coverage Status */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="text-xs font-mono text-amber-400">
                {activeSite.category} · {activeSite.address}
              </div>
              <h2 className="text-lg font-bold text-white mt-0.5">{activeSite.name}</h2>
              <div className="text-xs text-slate-400">Client: {activeSite.clientName}</div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400">Field Supervisor:</span>
              <div className="text-xs font-bold text-white mt-0.5">
                {activeSite.supervisorName}
              </div>
            </div>
          </div>

          {/* Day and Night Shift Coverage Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Day Shift */}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Day Shift (06:00 - 18:00)</span>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {dayGuards.length} / {activeSite.guardsRequiredDay} Required
                </span>
              </div>

              <div className="mt-3 space-y-2">
                {dayGuards.length === 0 ? (
                  <div className="text-xs text-slate-500 py-2 italic">
                    No guards assigned to Day Shift.
                  </div>
                ) : (
                  dayGuards.map((guard) => (
                    <div
                      key={guard.id}
                      className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={guard.photoUrl}
                          alt={guard.fullName}
                          className="w-7 h-7 rounded-md object-cover border border-amber-500/30"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="text-xs font-bold text-white">{guard.fullName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {guard.employeeNumber}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        On Duty
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Night Shift */}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-300">
                  <Moon className="w-4 h-4 text-sky-400" />
                  <span>Night Shift (18:00 - 06:00)</span>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {nightGuards.length} / {activeSite.guardsRequiredNight} Required
                </span>
              </div>

              <div className="mt-3 space-y-2">
                {nightGuards.length === 0 ? (
                  <div className="text-xs text-slate-500 py-2 italic">
                    No guards assigned to Night Shift.
                  </div>
                ) : (
                  nightGuards.map((guard) => (
                    <div
                      key={guard.id}
                      className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={guard.photoUrl}
                          alt={guard.fullName}
                          className="w-7 h-7 rounded-md object-cover border border-amber-500/30"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="text-xs font-bold text-white">{guard.fullName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {guard.employeeNumber}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        On Duty
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Weekly Deployment Matrix Preview */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Weekly Shift Rotation Schedule</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] text-slate-500 font-mono">
                    <th className="py-2 px-3">Guard</th>
                    <th className="py-2 px-2">Mon</th>
                    <th className="py-2 px-2">Tue</th>
                    <th className="py-2 px-2">Wed</th>
                    <th className="py-2 px-2">Thu</th>
                    <th className="py-2 px-2">Fri</th>
                    <th className="py-2 px-2">Sat</th>
                    <th className="py-2 px-2">Sun</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {siteGuards.map((g) => {
                    const isDay = g.assignedShift.includes('Day');
                    return (
                      <tr key={g.id} className="hover:bg-slate-950/50">
                        <td className="py-2.5 px-3 font-sans font-semibold text-white truncate max-w-[140px]">
                          {g.fullName}
                        </td>
                        {['D', 'D', 'D', 'D', 'D', 'OFF', 'OFF'].map((dayShift, idx) => (
                          <td key={idx} className="py-2 px-2">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                dayShift === 'OFF'
                                  ? 'bg-slate-800 text-slate-500'
                                  : isDay
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-sky-500/20 text-sky-300'
                              }`}
                            >
                              {dayShift === 'OFF' ? 'OFF' : isDay ? 'DAY' : 'NGT'}
                            </span>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Site Post Orders Management */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Post Standing Orders</span>
              </h3>
              <button
                onClick={() => setEditOrdersMode(!editOrdersMode)}
                className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{editOrdersMode ? 'Done' : 'Edit Orders'}</span>
              </button>
            </div>

            <div className="mt-4 space-y-2.5">
              {activeSite.postInstructions.map((order, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-start justify-between gap-2"
                >
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-slate-300">{order}</span>
                  </div>
                  {editOrdersMode && (
                    <button
                      onClick={() => handleRemoveOrder(idx)}
                      className="text-rose-400 hover:text-rose-300 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Order Form */}
            {editOrdersMode && (
              <form onSubmit={handleAddOrder} className="mt-4 space-y-2">
                <input
                  type="text"
                  value={newOrderText}
                  onChange={(e) => setNewOrderText(e.target.value)}
                  placeholder="Enter mandatory post directive..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
                >
                  Add Site Order
                </button>
              </form>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="font-semibold text-white">Emergency Client Protocol:</div>
            <div>
              Direct Line: <span className="font-mono text-amber-400">{activeSite.contactPhone}</span>
            </div>
            <div>Client Focal: {activeSite.contactPerson}</div>
          </div>
        </div>
      </div>

      {/* Quick Guard Reassignment Modal */}
      {showReassignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-amber-400" />
                <span>Emergency Guard Transfer / Replacement</span>
              </h2>
              <button
                onClick={() => setShowReassignModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteReassignment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Select Security Guard to Redeploy
                </label>
                <select
                  value={selectedGuardToMove}
                  onChange={(e) => setSelectedGuardToMove(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  {guards.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.fullName} ({g.employeeNumber}) · Currently: {g.currentSiteName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Target Destination Security Post
                </label>
                <select
                  value={targetSiteId}
                  onChange={(e) => setTargetSiteId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.district}, {s.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
                Upon confirmation, the guard terminal and central dispatch will immediately update
                the post orders and geo-fence perimeter.
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowReassignModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors"
                >
                  Confirm Deployment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
