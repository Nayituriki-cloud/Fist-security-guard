import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PackageCheck,
  Shield,
  Radio,
  Plus,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
} from 'lucide-react';
import { EquipmentItem } from '../../types';

export const EquipmentInventory: React.FC = () => {
  const { equipment, guards, issueEquipment, returnEquipment } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedEquipToIssue, setSelectedEquipToIssue] = useState<EquipmentItem | null>(null);
  const [targetGuardId, setTargetGuardId] = useState(guards[0]?.id || '');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const totalAssetsCount = equipment.reduce((sum, e) => sum + e.totalQuantity, 0);
  const totalIssuedCount = equipment.reduce((sum, e) => sum + e.issuedQuantity, 0);
  const totalInStockCount = equipment.reduce((sum, e) => sum + e.inStockQuantity, 0);
  const totalMaintenanceCount = equipment.reduce((sum, e) => sum + e.maintenanceQuantity, 0);

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assetTag.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipToIssue || !targetGuardId) return;

    const guard = guards.find((g) => g.id === targetGuardId);
    if (!guard) return;

    issueEquipment(selectedEquipToIssue.id, guard.id, guard.fullName);
    setSelectedEquipToIssue(null);
    setActionNotice(`Asset ${selectedEquipToIssue.name} issued to Officer ${guard.fullName}.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleReturn = (eq: EquipmentItem) => {
    returnEquipment(eq.id);
    setActionNotice(`Asset ${eq.name} returned to inventory storage.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
            <PackageCheck className="w-5 h-5 text-amber-400" />
            <span>Uniform & Tactical Equipment Management</span>
          </h1>
          <div className="text-xs text-slate-400 mt-0.5">
            Motorola DP4801 radios, Level IIIA ballistic body armor, metal detectors, tactical boots, and maintenance auditing
          </div>
        </div>

        <button
          onClick={() => setSelectedEquipToIssue(equipment[0])}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/10"
        >
          <Plus className="w-4 h-4" />
          <span>Issue Tactical Gear</span>
        </button>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Tactical Assets</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">{totalAssetsCount}</div>
          <div className="text-[11px] text-slate-500 font-mono mt-0.5">Tracked by Asset Tag</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Currently Deployed</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            {totalIssuedCount}
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-0.5">In Active Field Service</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">In Armory & Stock</div>
          <div className="text-2xl font-bold text-sky-400 font-mono mt-1">
            {totalInStockCount}
          </div>
          <div className="text-[11px] text-sky-400 font-mono mt-0.5">Ready for Issue</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">In Maintenance</div>
          <div className="text-2xl font-bold text-amber-400 font-mono mt-1">
            {totalMaintenanceCount}
          </div>
          <div className="text-[11px] text-amber-400 font-mono mt-0.5">Routine Calibration</div>
        </div>
      </div>

      {/* Search and Category Filter */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search gear name or asset tag..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-400"
          >
            <option value="all">All Categories</option>
            <option value="Communication (Radio)">Communication (Radio)</option>
            <option value="Body Armor & Vest">Body Armor & Vest</option>
            <option value="Surveillance & Detection">Surveillance & Detection</option>
            <option value="Illumination">Illumination</option>
            <option value="Uniform & Boots">Uniform & Boots</option>
            <option value="Restraint">Restraint</option>
          </select>
        </div>
      </div>

      {/* Equipment Ledger Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="px-4 py-3">Equipment Item & Tag</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Stock Balance</th>
                <th className="px-4 py-3">Assigned Custodian</th>
                <th className="px-4 py-3">Condition</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums">
              {filteredEquipment.map((eq) => (
                <tr key={eq.id} className="hover:bg-slate-850/60 transition-colors">
                  <td className="px-4 py-3 font-sans">
                    <div className="font-bold text-white">{eq.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Asset Tag: {eq.assetTag}
                    </div>
                  </td>

                  <td className="px-4 py-3 font-sans text-slate-300">{eq.category}</td>

                  <td className="px-4 py-3">
                    <div className="text-white font-bold">{eq.totalQuantity} Total</div>
                    <div className="text-[11px] text-slate-400">
                      {eq.issuedQuantity} Issued · {eq.inStockQuantity} In Armory
                    </div>
                  </td>

                  <td className="px-4 py-3 font-sans">
                    {eq.assignedToGuardName ? (
                      <span className="text-amber-400 font-semibold">{eq.assignedToGuardName}</span>
                    ) : (
                      <span className="text-slate-500 italic">Armory Central Depot</span>
                    )}
                  </td>

                  <td className="px-4 py-3 font-sans">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-300">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{eq.condition}</span>
                    </span>
                  </td>

                  <td className="px-4 py-3 font-sans text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedEquipToIssue(eq)}
                        disabled={eq.inStockQuantity === 0}
                        className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                          eq.inStockQuantity > 0
                            ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300'
                            : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                        }`}
                      >
                        Issue
                      </button>
                      <button
                        onClick={() => handleReturn(eq)}
                        disabled={eq.issuedQuantity === 0}
                        className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                          eq.issuedQuantity > 0
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                            : 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                        }`}
                      >
                        Return
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Modal */}
      {selectedEquipToIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-amber-400" />
              <span>Issue Tactical Gear to Guard</span>
            </h2>

            <form onSubmit={handleIssueSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Equipment Name</label>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold">
                  {selectedEquipToIssue.name} ({selectedEquipToIssue.assetTag})
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Assign to Security Guard
                </label>
                <select
                  value={targetGuardId}
                  onChange={(e) => setTargetGuardId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  {guards.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.fullName} ({g.employeeNumber}) · {g.currentSiteName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
                The recipient officer signs acknowledgment of equipment custody under standard FIST
                GUARD asset doctrine.
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedEquipToIssue(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors"
                >
                  Authorize Gear Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
