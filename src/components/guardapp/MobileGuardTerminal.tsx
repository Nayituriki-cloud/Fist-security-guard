import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldAlert,
  Clock,
  QrCode,
  MapPin,
  CheckCircle2,
  Camera,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Send,
  Navigation,
} from 'lucide-react';
import { IncidentType, IncidentSeverity } from '../../types';

export const MobileGuardTerminal: React.FC = () => {
  const {
    guards,
    sites,
    attendance,
    clockInGuard,
    clockOutGuard,
    patrols,
    scanCheckpoint,
    reportIncident,
    triggerSos,
  } = useApp();

  // Pick default guard (Officer Alex Musyoka or current user)
  const currentGuard = guards[0];
  const assignedSite = sites.find((s) => s.id === currentGuard.currentSiteId) || sites[0];

  // Check if today clocked in
  const todayRecord = attendance.find(
    (a) => a.guardId === currentGuard.id && !a.clockOutTime
  );

  const [activeTab, setActiveTab] = useState<'clock' | 'patrol' | 'incident' | 'post_orders'>('clock');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsVerified, setGpsVerified] = useState(true);
  const [scannerActive, setScannerActive] = useState<string | null>(null); // checkpoint id being scanned
  const [scannerSuccessMsg, setScannerSuccessMsg] = useState<string | null>(null);

  // Quick incident report state
  const [incidentType, setIncidentType] = useState<IncidentType>('Suspicious Activity');
  const [incidentSeverity, setIncidentSeverity] = useState<IncidentSeverity>('medium');
  const [incidentLocation, setIncidentLocation] = useState('Gate 2 Perimeter');
  const [incidentDesc, setIncidentDesc] = useState('');
  const [incidentReportedMsg, setIncidentReportedMsg] = useState(false);

  // Guard's patrol route
  const assignedPatrol = patrols.find((p) => p.assignedGuardId === currentGuard.id) || patrols[0];

  const handleClockIn = () => {
    setGpsLoading(true);
    setTimeout(() => {
      setGpsLoading(false);
      clockInGuard(
        currentGuard.id,
        assignedSite.id,
        { lat: assignedSite.latitude, lng: assignedSite.longitude },
        true
      );
    }, 600);
  };

  const handleSimulateScan = (checkpointId: string, checkpointName: string) => {
    setScannerActive(checkpointId);
    setTimeout(() => {
      scanCheckpoint(
        assignedPatrol.id,
        checkpointId,
        currentGuard.fullName,
        'Biometric token & optical QR verified.'
      );
      setScannerActive(null);
      setScannerSuccessMsg(`Checkpoint "${checkpointName}" verified with GPS timestamp!`);
      setTimeout(() => setScannerSuccessMsg(null), 3500);
    }, 1200);
  };

  const handleSubmitIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentDesc.trim()) return;

    reportIncident({
      siteId: assignedSite.id,
      siteName: assignedSite.name,
      reporterId: currentGuard.id,
      reporterName: currentGuard.fullName,
      type: incidentType,
      severity: incidentSeverity,
      locationDetails: incidentLocation,
      description: incidentDesc,
      status: 'reported',
      evidencePhotoUrl: '/src/assets/images/command_center_1794075664708.jpg',
    });

    setIncidentDesc('');
    setIncidentReportedMsg(true);
    setTimeout(() => setIncidentReportedMsg(false), 4000);
  };

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Handheld Device Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={currentGuard.photoUrl}
                alt={currentGuard.fullName}
                className="w-12 h-12 rounded-xl object-cover border-2 border-amber-500/40"
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{currentGuard.fullName}</h2>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-semibold">
                  {currentGuard.employeeNumber}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span className="truncate max-w-[220px]">{assignedSite.name}</span>
              </div>
            </div>
          </div>

          {/* SOS Panic Trigger */}
          <button
            onClick={() => triggerSos(currentGuard.id, assignedSite.name)}
            className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-all active:scale-95 group shrink-0"
            title="Instant Officer Duress Emergency Signal"
          >
            <ShieldAlert className="w-6 h-6 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider">SOS</span>
          </button>
        </div>

        {/* Tab Navigation for Handheld App */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-xl mt-4">
          <button
            onClick={() => setActiveTab('clock')}
            className={`py-2 text-xs font-semibold rounded-lg transition-colors flex flex-col items-center gap-1 ${
              activeTab === 'clock'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Clock In</span>
          </button>
          <button
            onClick={() => setActiveTab('patrol')}
            className={`py-2 text-xs font-semibold rounded-lg transition-colors flex flex-col items-center gap-1 ${
              activeTab === 'patrol'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR Patrol</span>
          </button>
          <button
            onClick={() => setActiveTab('incident')}
            className={`py-2 text-xs font-semibold rounded-lg transition-colors flex flex-col items-center gap-1 ${
              activeTab === 'incident'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Incident</span>
          </button>
          <button
            onClick={() => setActiveTab('post_orders')}
            className={`py-2 text-xs font-semibold rounded-lg transition-colors flex flex-col items-center gap-1 ${
              activeTab === 'post_orders'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Orders</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Attendance & Clock-In */}
      {activeTab === 'clock' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Shift Attendance & GPS Clock</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              GPS Lock: ±3.2m
            </span>
          </div>

          {/* Current Shift Status Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-3">
            <div className="text-xs text-slate-400">Assigned Shift Schedule</div>
            <div className="text-lg font-bold text-white font-mono">
              {currentGuard.assignedShift}
            </div>

            {todayRecord ? (
              <div className="space-y-3 pt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Clocked In at {todayRecord.clockInTime}</span>
                </div>
                <div className="text-xs text-slate-400">
                  Duty Post: {assignedSite.name} · Verified by Geo-fence
                </div>
                <button
                  onClick={() => clockOutGuard(todayRecord.id)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clock Out & Complete Shift Handover</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="text-xs text-amber-300/80 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                  You are within the authorized 5-meter boundary of {assignedSite.name}.
                </div>

                <button
                  onClick={handleClockIn}
                  disabled={gpsLoading}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  {gpsLoading ? (
                    <span>Verifying Coordinates & QR...</span>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4" />
                      <span>Clock In with GPS & QR Verification</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Location Verification Details */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-500">Post Latitude</span>
              <div className="font-mono text-white mt-0.5">{assignedSite.latitude}° S</div>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-500">Post Longitude</span>
              <div className="font-mono text-white mt-0.5">{assignedSite.longitude}° E</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: QR Patrol Scanner */}
      {activeTab === 'patrol' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>Patrol Route & Checkpoints</span>
              </h3>
              <div className="text-xs text-slate-400 mt-0.5">{assignedPatrol.routeName}</div>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              Every {assignedPatrol.intervalMinutes}m
            </span>
          </div>

          {scannerSuccessMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{scannerSuccessMsg}</span>
            </div>
          )}

          {/* Scanner Viewfinder Simulation Modal/Banner */}
          {scannerActive && (
            <div className="p-6 rounded-xl bg-slate-950 border border-amber-500/40 relative overflow-hidden text-center space-y-3">
              <div className="relative w-40 h-40 mx-auto rounded-lg border-2 border-dashed border-amber-400/80 flex items-center justify-center">
                <Camera className="w-10 h-10 text-amber-400/60" />
                {/* Scanning laser bar */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-bounce" />
              </div>
              <div className="text-xs font-mono text-amber-300 font-semibold">
                SCANNING PHYSICAL CHECKPOINT QR TOKEN...
              </div>
              <div className="text-[11px] text-slate-400">
                Align checkpoint tag inside viewfinder
              </div>
            </div>
          )}

          {/* Checkpoints Sequence */}
          <div className="space-y-2.5">
            {assignedPatrol.checkpoints.map((cp, idx) => {
              const isScanned = cp.status === 'scanned';
              return (
                <div
                  key={cp.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isScanned
                      ? 'bg-slate-950/80 border-slate-800/80'
                      : 'bg-slate-950 border-slate-800 hover:border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                          isScanned
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">{cp.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Tag: {cp.code} · Target: {cp.scheduledTime}
                        </div>
                      </div>
                    </div>

                    {isScanned ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{cp.scannedAt}</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSimulateScan(cp.id, cp.name)}
                        disabled={scannerActive !== null}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Scan</span>
                      </button>
                    )}
                  </div>

                  {cp.notes && (
                    <div className="mt-2 text-[11px] text-slate-400 italic bg-slate-900/60 p-1.5 rounded">
                      Note: {cp.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Quick Incident Reporting */}
      {activeTab === 'incident' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Rapid Tactical Incident Report</span>
            </h3>
            <div className="text-xs text-slate-400 mt-0.5">
              Instantly notifies Central Control Room and Field Supervisor
            </div>
          </div>

          {incidentReportedMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Incident reported successfully and logged in Control Room!</span>
            </div>
          )}

          <form onSubmit={handleSubmitIncident} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Incident Category
              </label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value as IncidentType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Unauthorized Access / Trespass">Unauthorized Access / Trespass</option>
                <option value="Theft">Theft</option>
                <option value="Suspicious Activity">Suspicious Activity</option>
                <option value="Fire Emergency">Fire Emergency</option>
                <option value="Medical Emergency">Medical Emergency</option>
                <option value="Property Damage">Property Damage</option>
                <option value="Workplace Conflict">Workplace Conflict</option>
                <option value="Security Breach">Security Breach</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Severity Level
                </label>
                <select
                  value={incidentSeverity}
                  onChange={(e) => setIncidentSeverity(e.target.value as IncidentSeverity)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Location in Post
                </label>
                <input
                  type="text"
                  value={incidentLocation}
                  onChange={(e) => setIncidentLocation(e.target.value)}
                  placeholder="e.g. Gate 2, Basement Parking"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Description & Observed Facts
              </label>
              <textarea
                value={incidentDesc}
                onChange={(e) => setIncidentDesc(e.target.value)}
                rows={3}
                placeholder="Provide accurate description of individuals, vehicles, items involved, and actions taken..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 p-2 rounded-lg border border-slate-800">
              <Camera className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Camera snapshot will be automatically geotagged with incident.</span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Transmit Incident to Command Center</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 4: Post Orders */}
      {activeTab === 'post_orders' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Official Site Standing Orders</span>
            </h3>
            <div className="text-xs text-slate-400 mt-0.5">{assignedSite.name}</div>
          </div>

          <div className="space-y-2">
            {assignedSite.postInstructions.map((instruction, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-2.5"
              >
                <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">{instruction}</div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
            <div className="font-semibold">Supervisor Dispatch Contact:</div>
            <div>
              {assignedSite.supervisorName} · {assignedSite.contactPhone}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
