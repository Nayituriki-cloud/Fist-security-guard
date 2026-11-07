import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Users,
  ShieldCheck,
  FileText,
  Plus,
  Send,
  Download,
  AlertCircle,
  CheckCircle2,
  PhoneCall,
  Clock,
} from 'lucide-react';

export const ClientPortalView: React.FC = () => {
  const { sites, guards, attendance, incidents, invoices } = useApp();

  // Active client site: Bank of Kigali or KBC Business Park
  const [selectedClientId, setSelectedClientId] = useState('site_bk_hq');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  // Additional Guards Request State
  const [reqGuardCount, setReqGuardCount] = useState(2);
  const [reqShift, setReqShift] = useState('Day (06:00 - 18:00)');
  const [reqReason, setReqReason] = useState('VIP Delegation Summit / High Cash-in-Transit Event');

  // Complaint State
  const [complaintText, setComplaintText] = useState('');

  const currentSite = sites.find((s) => s.id === selectedClientId) || sites[0];
  const clientGuards = guards.filter((g) => g.currentSiteId === currentSite.id);
  const clientAttendance = attendance.filter((a) => a.siteId === currentSite.id);
  const clientIncidents = incidents.filter((i) => i.siteId === currentSite.id);
  const clientInvoices = invoices.filter((inv) => inv.clientName.includes(currentSite.clientName.split(' ')[0]));

  const handleRequestGuards = (e: React.FormEvent) => {
    e.preventDefault();
    setShowRequestModal(false);
    setActionSuccessNotice(`Request for ${reqGuardCount} additional guards submitted to Operations Commander. Standby dispatch notification sent.`);
    setTimeout(() => setActionSuccessNotice(null), 4000);
  };

  const handleSendComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintText.trim()) return;
    setShowComplaintModal(false);
    setComplaintText('');
    setActionSuccessNotice('Security inquiry/complaint escalated directly to Chief Operations Manager Major Mugisha.');
    setTimeout(() => setActionSuccessNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header and Client Site Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-amber-400" />
            <span>Client Security Management Portal</span>
          </h1>
          <div className="text-xs text-slate-400 mt-0.5">
            Dedicated client transparency portal: Assigned guards on duty, live attendance, SLAs, invoices, and service requests
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Client View:</span>
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-semibold focus:outline-none focus:border-amber-400"
          >
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.clientName} ({s.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {actionSuccessNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessNotice}</span>
        </div>
      )}

      {/* Client Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs font-mono text-amber-400 uppercase tracking-wider">
              {currentSite.category} Facility Protection Contract
            </div>
            <h2 className="text-xl font-bold text-white mt-0.5">{currentSite.name}</h2>
            <div className="text-xs text-slate-400">
              Contract Account: <span className="font-semibold text-slate-200">{currentSite.clientName}</span> · {currentSite.address}, {currentSite.city}
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={() => setShowRequestModal(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-amber-500/10"
            >
              <Plus className="w-4 h-4" />
              <span>Request Extra Guards</span>
            </button>
            <button
              onClick={() => setShowComplaintModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Submit Inquiry</span>
            </button>
          </div>
        </div>

        {/* Client KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-2">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-500">Guards On Duty Right Now</div>
            <div className="text-2xl font-bold text-white font-mono mt-1">
              {clientGuards.length}{' '}
              <span className="text-xs text-emerald-400 font-normal">Active</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-500">Service Level Agreement (SLA)</div>
            <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">99.4%</div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-500">Site Incident Status</div>
            <div className="text-2xl font-bold text-white font-mono mt-1">
              {clientIncidents.filter((i) => i.status !== 'resolved').length}{' '}
              <span className="text-xs text-slate-400 font-normal">Open</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-500">Dedicated Supervisor</div>
            <div className="text-sm font-bold text-white mt-1.5 truncate">
              {currentSite.supervisorName}
            </div>
          </div>
        </div>
      </div>

      {/* Guards on Site & Live Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Assigned Security Personnel */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Assigned Security Guards on Duty</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {clientGuards.length} Guards Deployed
            </span>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto">
            {clientGuards.map((guard) => (
              <div
                key={guard.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={guard.photoUrl}
                    alt={guard.fullName}
                    className="w-10 h-10 rounded-lg object-cover border border-amber-500/30 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">{guard.fullName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {guard.employeeNumber} · Shift: {guard.assignedShift}
                    </div>
                    <div className="text-[10px] text-amber-300/80 mt-0.5">
                      {guard.skills.slice(0, 2).join(' · ')}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-300">
                    On Duty
                  </span>
                  <div className="text-[11px] text-slate-500 font-mono mt-1">
                    Rating: {guard.performanceRating}★
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client Invoices & Monthly Billing */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Contract Invoices & Statements</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400">Official RRA Tax Receipt</span>
          </div>

          <div className="space-y-3">
            {clientInvoices.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                All previous billing periods fully cleared.
              </div>
            ) : (
              clientInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-mono text-xs font-bold text-white">
                      {inv.invoiceNumber}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Period: {inv.billingPeriod} · {inv.totalGuardsBilled} Guards Billed
                    </div>
                    <div className="text-xs font-mono font-bold text-amber-400 mt-1">
                      {inv.totalRWF.toLocaleString()} RWF{' '}
                      <span className="text-[11px] text-slate-500 font-normal">
                        (${inv.totalUSD.toLocaleString()} USD)
                      </span>
                    </div>
                  </div>

                  <div className="text-right space-y-1.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        inv.status === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {inv.status}
                    </span>
                    <button
                      onClick={() => alert(`Downloading signed PDF invoice ${inv.invoiceNumber}`)}
                      className="block text-[11px] text-amber-400 hover:text-amber-300 font-medium"
                    >
                      Download PDF
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Request Extra Guards Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Request Additional Security Guards</span>
            </h2>

            <form onSubmit={handleRequestGuards} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Number of Additional Guards Needed
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={reqGuardCount}
                  onChange={(e) => setReqGuardCount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Shift</label>
                <select
                  value={reqShift}
                  onChange={(e) => setReqShift(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Day (06:00 - 18:00)">Day Shift (06:00 - 18:00)</option>
                  <option value="Night (18:00 - 06:00)">Night Shift (18:00 - 06:00)</option>
                  <option value="24h Continuous Double Shift">24h Continuous Double Shift</option>
                  <option value="Special Event / VIP Escort">Special Event / VIP Escort</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Reason & Special Operational Instructions
                </label>
                <textarea
                  value={reqReason}
                  onChange={(e) => setReqReason(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors"
                >
                  Transmit Deployment Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Complaint Modal */}
      {showComplaintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Submit Security Inquiry or Complaint</span>
            </h2>

            <form onSubmit={handleSendComplaint} className="space-y-3.5 text-xs">
              <p className="text-slate-400 text-[11px]">
                Your feedback routes directly to FIST GUARD Corporate Quality Assurance and Field Supervision.
              </p>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Inquiry / Observation Details
                </label>
                <textarea
                  required
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  rows={4}
                  placeholder="Provide date, time, guard involved or gate location..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowComplaintModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors"
                >
                  Submit Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
