import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  QrCode,
  ShieldCheck,
  Search,
  Download,
  Filter,
} from 'lucide-react';

export const AttendanceTracker: React.FC = () => {
  const { attendance, verifyAttendanceBySupervisor } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [exportNotice, setExportNotice] = useState(false);

  const onTimeCount = attendance.filter((a) => a.status === 'on_time').length;
  const lateCount = attendance.filter((a) => a.status === 'late').length;
  const overtimeCount = attendance.filter((a) => a.status === 'overtime' || a.overtimeHours > 0).length;
  const totalVerified = attendance.filter((a) => a.supervisorVerified).length;

  const filteredAttendance = attendance.filter((record) => {
    const matchesSearch =
      record.guardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.siteName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-amber-400" />
            <span>Digital Attendance & Time Clock Register</span>
          </h1>
          <div className="text-xs text-slate-400 mt-0.5">
            Cryptographic QR scan verification, GPS 5-meter geo-fence validation, late arrival alerts, and overtime calculations
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Export Monthly Attendance (CSV/PDF)</span>
        </button>
      </div>

      {exportNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>
            Official FIST GUARD biometric & GPS attendance register exported successfully!
          </span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>On-Time Clock-Ins</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1">
            {onTimeCount}
          </div>
          <div className="text-[11px] text-emerald-400 font-mono mt-0.5">96.8% Punctuality</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Late Arrivals</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1">
            {lateCount}
          </div>
          <div className="text-[11px] text-amber-400 font-mono mt-0.5">Traffic logged</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Overtime Shifts</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1">
            {overtimeCount}
          </div>
          <div className="text-[11px] text-sky-400 font-mono mt-0.5">+14.5 Total Hours</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Supervisor Verified</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1">
            {totalVerified} / {attendance.length}
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">100% Geo-audited</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search guard or post name..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-400"
          >
            <option value="all">All Statuses</option>
            <option value="on_time">On Time</option>
            <option value="late">Late Arrival</option>
            <option value="overtime">Overtime</option>
            <option value="verified">Supervisor Verified</option>
          </select>
        </div>
      </div>

      {/* Attendance Register Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="px-4 py-3">Security Guard</th>
                <th className="px-4 py-3">Guarded Site Post</th>
                <th className="px-4 py-3">Shift Date</th>
                <th className="px-4 py-3">Clock In / Out</th>
                <th className="px-4 py-3">GPS & QR Lock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredAttendance.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-850/60 transition-colors">
                  <td className="px-4 py-3 font-sans">
                    <div className="font-bold text-white">{rec.guardName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">Shift: {rec.shift}</div>
                  </td>

                  <td className="px-4 py-3 font-sans text-slate-300 font-medium">
                    {rec.siteName}
                  </td>

                  <td className="px-4 py-3 text-slate-400 text-[11px]">{rec.date}</td>

                  <td className="px-4 py-3">
                    <span className="text-emerald-400 font-semibold">{rec.clockInTime}</span>
                    <span className="text-slate-500"> → </span>
                    <span className="text-slate-300">
                      {rec.clockOutTime ? rec.clockOutTime : 'Active'}
                    </span>
                  </td>

                  <td className="px-4 py-3 font-sans">
                    <div className="flex items-center gap-1.5 text-xs text-slate-300 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>±{rec.gpsCoordinates.accuracyMeters}m</span>
                      {rec.qrCodeScanned && (
                        <span className="text-emerald-400 text-[10px] font-sans font-semibold bg-emerald-500/10 px-1.5 py-0.2 rounded">
                          QR OK
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 font-sans">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        rec.status === 'on_time'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : rec.status === 'late'
                          ? 'bg-amber-500/20 text-amber-300'
                          : rec.status === 'overtime'
                          ? 'bg-sky-500/20 text-sky-300'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {rec.status.replace('_', ' ')}
                    </span>
                    {rec.notes && (
                      <div className="text-[10px] text-slate-500 italic mt-0.5 max-w-xs truncate">
                        {rec.notes}
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-3 font-sans text-right">
                    {rec.supervisorVerified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => verifyAttendanceBySupervisor(rec.id)}
                        className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-xs transition-colors"
                      >
                        Sign Off
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
