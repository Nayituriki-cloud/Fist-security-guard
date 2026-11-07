import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  Plus,
  ShieldAlert,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Camera,
  FileCheck,
  ChevronRight,
  X,
  ExternalLink,
} from 'lucide-react';
import { IncidentReport, IncidentSeverity, IncidentType } from '../../types';

export const IncidentReports: React.FC = () => {
  const { incidents, sites, guards, reportIncident, updateIncidentStatus } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(incidents[0] || null);
  const [showLogModal, setShowLogModal] = useState(false);

  // New report form state
  const [newSiteId, setNewSiteId] = useState(sites[0]?.id || '');
  const [newType, setNewType] = useState<IncidentType>('Theft');
  const [newSeverity, setNewSeverity] = useState<IncidentSeverity>('medium');
  const [newLocation, setNewLocation] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('/src/assets/images/command_center_1794075664708.jpg');

  // Resolution state
  const [resolutionText, setResolutionText] = useState('');

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSearch =
      inc.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inc.reporterName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = severityFilter === 'all' || inc.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim() || !newLocation.trim()) return;

    const site = sites.find((s) => s.id === newSiteId);

    reportIncident({
      siteId: newSiteId,
      siteName: site ? site.name : 'Sector Post',
      reporterId: guards[0]?.id || 'grd_musyoka',
      reporterName: guards[0]?.fullName || 'Officer Alex Musyoka',
      type: newType,
      severity: newSeverity,
      locationDetails: newLocation,
      description: newDesc,
      status: 'reported',
      evidencePhotoUrl: newPhotoUrl,
    });

    setShowLogModal(false);
    setNewDesc('');
    setNewLocation('');
  };

  const handleResolve = (status: IncidentReport['status']) => {
    if (!selectedIncident) return;
    updateIncidentStatus(selectedIncident.id, status, resolutionText);
    setResolutionText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>Emergency & Incident Investigation Management</span>
          </h1>
          <div className="text-xs text-slate-400 mt-0.5">
            Comprehensive incident dossiers, chain of custody evidence, Rwanda National Police (RNP) coordination, and resolution timelines
          </div>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-rose-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Log Security Incident</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search case #, description, or post..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500">Severity:</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-400"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Incidents Ledger & Active Case File */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Incidents Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Registered Incidents ({filteredIncidents.length})
          </div>

          <div className="space-y-2.5">
            {filteredIncidents.map((inc) => {
              const isSelected = selectedIncident?.id === inc.id;

              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/40 shadow-lg'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-400 font-semibold">{inc.caseNumber}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        inc.severity === 'critical'
                          ? 'bg-rose-500/20 text-rose-300'
                          : inc.severity === 'high'
                          ? 'bg-amber-500/20 text-amber-300'
                          : inc.severity === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {inc.severity}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-white mt-1">{inc.type}</div>
                  <div className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                    {inc.description}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate max-w-[170px]">{inc.siteName}</span>
                    <span className="font-mono">{inc.timestamp}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Case File Deep-Dive */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          {selectedIncident ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400">
                      {selectedIncident.caseNumber}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        selectedIncident.status === 'resolved'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : selectedIncident.status === 'escalated_police'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {selectedIncident.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-1">{selectedIncident.type}</h2>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Location: {selectedIncident.locationDetails} · {selectedIncident.siteName}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500">Reporting Officer:</div>
                  <div className="text-xs font-bold text-white mt-0.5">
                    {selectedIncident.reporterName}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    {selectedIncident.timestamp}
                  </div>
                </div>
              </div>

              {/* Case Narrative */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Factual Operational Narrative
                </h3>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed">
                  {selectedIncident.description}
                </div>
              </div>

              {/* Evidence Photo */}
              {selectedIncident.evidencePhotoUrl && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-amber-400" />
                    <span>Evidence Documentation & CCTV Snapshot</span>
                  </h3>
                  <div className="relative rounded-xl overflow-hidden border border-slate-800 max-h-56 bg-slate-950">
                    <img
                      src={selectedIncident.evidencePhotoUrl}
                      alt="Incident Evidence"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-amber-400 border border-amber-500/30">
                      SEC-EVIDENCE · TAMPER-PROOF ARCHIVE
                    </div>
                  </div>
                </div>
              )}

              {/* Police Escalation Status */}
              {selectedIncident.policeCaseRef && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500">Rwanda National Police (RNP) Reference:</span>
                    <div className="font-mono font-bold text-amber-400 mt-0.5">
                      {selectedIncident.policeCaseRef}
                    </div>
                  </div>
                  <span className="text-emerald-400 font-medium">Handover Complete</span>
                </div>
              )}

              {/* Resolution Notes & Actions */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>Investigation Resolution & Sign-Off</span>
                </h3>

                {selectedIncident.resolutionNotes ? (
                  <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-xs space-y-1">
                    <div className="font-semibold text-emerald-300">Official Case Resolution:</div>
                    <div className="text-slate-300">{selectedIncident.resolutionNotes}</div>
                    {selectedIncident.resolvedAt && (
                      <div className="text-[11px] font-mono text-slate-500">
                        Closed At: {selectedIncident.resolvedAt}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <textarea
                      value={resolutionText}
                      onChange={(e) => setResolutionText(e.target.value)}
                      placeholder="Add corrective security measures, physical repairs completed, or police findings..."
                      rows={2}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleResolve('investigating')}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold transition-colors"
                      >
                        Set Under Investigation
                      </button>
                      <button
                        onClick={() => handleResolve('contained')}
                        className="px-3 py-1.5 rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 text-xs font-semibold transition-colors"
                      >
                        Mark Contained
                      </button>
                      <button
                        onClick={() => handleResolve('resolved')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                      >
                        Sign Off & Resolve
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              Select an incident from the ledger to inspect the case file.
            </div>
          )}
        </div>
      </div>

      {/* Log Incident Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Log Security Incident Report</span>
              </h2>
              <button
                onClick={() => setShowLogModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Security Site / Post
                </label>
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
                    Incident Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as IncidentType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Theft">Theft</option>
                    <option value="Unauthorized Access / Trespass">
                      Unauthorized Access / Trespass
                    </option>
                    <option value="Fire Emergency">Fire Emergency</option>
                    <option value="Property Damage">Property Damage</option>
                    <option value="Suspicious Activity">Suspicious Activity</option>
                    <option value="Medical Emergency">Medical Emergency</option>
                    <option value="Workplace Conflict">Workplace Conflict</option>
                    <option value="Security Breach">Security Breach</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Severity Rating
                  </label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as IncidentSeverity)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Specific Location on Site
                </label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Loading Dock Gate 3, Vault Elevator Lobby"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Incident Description & Facts
                </label>
                <textarea
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                  placeholder="Describe timeline, persons involved, weapons/tools observed, and immediate containment steps taken..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors"
                >
                  File Incident Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
