import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GuardProfile, GuardStatus, ShiftType } from '../../types';
import {
  Users,
  Search,
  Plus,
  Shield,
  Award,
  Phone,
  AlertOctagon,
  FileText,
  Star,
  CheckCircle,
  X,
  Filter,
} from 'lucide-react';

export const GuardsDirectory: React.FC = () => {
  const { guards, sites, addGuard, currentUser } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSiteFilter, setSelectedSiteFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [activeGuardModal, setActiveGuardModal] = useState<GuardProfile | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Guard Form State
  const [newName, setNewName] = useState('');
  const [newNationalId, setNewNationalId] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newSiteId, setNewSiteId] = useState(sites[0]?.id || '');
  const [newShift, setNewShift] = useState<ShiftType>('Day (06:00 - 18:00)');
  const [newSkills, setNewSkills] = useState('Armed Guard, First Aid Responder');
  const [newSalary, setNewSalary] = useState(270000);

  const canViewDisciplinary =
    currentUser.role === 'super_admin' ||
    currentUser.role === 'director' ||
    currentUser.role === 'hr_manager';

  const filteredGuards = guards.filter((guard) => {
    const matchesSearch =
      guard.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guard.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guard.nationalId.includes(searchTerm);

    const matchesSite =
      selectedSiteFilter === 'all' || guard.currentSiteId === selectedSiteFilter;

    const matchesStatus =
      selectedStatusFilter === 'all' || guard.employmentStatus === selectedStatusFilter;

    return matchesSearch && matchesSite && matchesStatus;
  });

  const handleCreateGuard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newNationalId.trim()) return;

    const matchedSite = sites.find((s) => s.id === newSiteId);

    addGuard({
      fullName: newName,
      nationalId: newNationalId,
      phoneNumber: newPhone || '+250 788 000 000',
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, '.')}@fistguard.rw`,
      photoUrl: '/src/assets/images/guard_officer_1794075664571.jpg',
      dateOfBirth: '1995-05-10',
      gender: 'Male',
      emergencyContact: {
        name: 'Family Next of Kin',
        relationship: 'Spouse/Kin',
        phone: '+250 788 111 222',
      },
      hireDate: new Date().toISOString().split('T')[0],
      employmentStatus: 'on_duty',
      currentSiteId: newSiteId,
      currentSiteName: matchedSite ? matchedSite.name : 'Unassigned',
      assignedShift: newShift,
      skills: newSkills.split(',').map((s) => s.trim()),
      certifications: [
        {
          id: `cert_${Date.now()}`,
          name: 'Basic Private Security Guard Standard Certification',
          issuer: 'Rwanda National Police Academy',
          issueDate: new Date().toISOString().split('T')[0],
          expiryDate: '2028-12-31',
          certNumber: `RNP-SEC-${Math.floor(1000 + Math.random() * 9000)}`,
          verified: true,
        },
      ],
      disciplinaryRecords: [],
      performanceRating: 5.0,
      attendanceScore: 100.0,
      monthlyBaseSalaryRWF: Number(newSalary),
    });

    setShowAddModal(false);
    setNewName('');
    setNewNationalId('');
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Users className="w-5 h-5 text-amber-400" />
            <span>Security Guard Personnel Directory</span>
          </h1>
          <div className="text-xs text-slate-400 mt-0.5">
            Managing certified security officers, biometric dossiers, credentials, and deployment
            records
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/10"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Security Guard</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search guard name, ID or FG-number..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={selectedSiteFilter}
            onChange={(e) => setSelectedSiteFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-400"
          >
            <option value="all">All Security Posts</option>
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-400"
          >
            <option value="all">All Statuses</option>
            <option value="on_duty">On Duty</option>
            <option value="active">Active</option>
            <option value="on_leave">On Leave</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Guards Table Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="px-4 py-3">Security Guard</th>
                <th className="px-4 py-3">National ID & Code</th>
                <th className="px-4 py-3">Assigned Post</th>
                <th className="px-4 py-3">Shift</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Performance</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredGuards.map((guard) => (
                <tr
                  key={guard.id}
                  className="hover:bg-slate-850/60 transition-colors group cursor-pointer"
                  onClick={() => setActiveGuardModal(guard)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={guard.photoUrl}
                        alt={guard.fullName}
                        className="w-9 h-9 rounded-lg object-cover border border-amber-500/30 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="font-bold text-white group-hover:text-amber-300 transition-colors">
                          {guard.fullName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {guard.phoneNumber}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="font-mono text-slate-200 font-semibold">
                      {guard.employeeNumber}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500">
                      ID: {guard.nationalId}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="text-slate-300 font-medium truncate max-w-[200px]">
                      {guard.currentSiteName}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
                    {guard.assignedShift}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        guard.employmentStatus === 'on_duty'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : guard.employmentStatus === 'on_leave'
                          ? 'bg-sky-500/20 text-sky-300'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {guard.employmentStatus.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-white font-mono tabular-nums">
                        {guard.performanceRating.toFixed(1)}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        ({guard.attendanceScore.toFixed(0)}%)
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveGuardModal(guard);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
                    >
                      Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guard Detail Modal */}
      {activeGuardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <img
                  src={activeGuardModal.photoUrl}
                  alt={activeGuardModal.fullName}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-amber-500/40"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">
                      {activeGuardModal.fullName}
                    </h2>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-semibold">
                      {activeGuardModal.employeeNumber}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    National ID: <span className="font-mono text-slate-200">{activeGuardModal.nationalId}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Assigned Site: <span className="text-white font-medium">{activeGuardModal.currentSiteName}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveGuardModal(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500">Attendance Score</span>
                <div className="text-base font-bold text-white font-mono mt-0.5">
                  {activeGuardModal.attendanceScore}%
                </div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500">Performance Rating</span>
                <div className="text-base font-bold text-amber-400 font-mono mt-0.5 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{activeGuardModal.performanceRating} / 5.0</span>
                </div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500">Base Salary</span>
                <div className="text-base font-bold text-white font-mono mt-0.5">
                  {activeGuardModal.monthlyBaseSalaryRWF.toLocaleString()} RWF
                </div>
              </div>
            </div>

            {/* Skills & Certifications */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Specialized Security Skills & Certifications</span>
              </h3>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {activeGuardModal.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="space-y-2">
                {activeGuardModal.certifications.map((c) => (
                  <div
                    key={c.id}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-white">{c.name}</div>
                      <div className="text-slate-500 text-[11px]">
                        {c.issuer} · Cert: {c.certNumber}
                      </div>
                    </div>
                    <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Valid to {c.expiryDate}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Disciplinary Records (Restricted Role View) */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                <span>Confidential Disciplinary Records</span>
              </h3>

              {canViewDisciplinary ? (
                activeGuardModal.disciplinaryRecords.length === 0 ? (
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-emerald-400 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Clean disciplinary record. Exemplary conduct record on file.</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeGuardModal.disciplinaryRecords.map((d) => (
                      <div
                        key={d.id}
                        className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/40 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-rose-300 font-semibold">
                          <span>{d.incidentType}</span>
                          <span className="font-mono text-slate-400">{d.date}</span>
                        </div>
                        <div className="text-slate-400">{d.description}</div>
                        <div className="text-xs text-amber-300">Action: {d.actionTaken}</div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-500 italic">
                  Restricted to Super Admin, Company Director, and HR Management.
                </div>
              )}
            </div>

            {/* Emergency Contact */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>
                  Emergency Next of Kin: {activeGuardModal.emergencyContact.name} (
                  {activeGuardModal.emergencyContact.phone})
                </span>
              </div>
              <button
                onClick={() => setActiveGuardModal(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Guard Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Register New Security Guard</span>
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGuard} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Full Name (as per Rwandan National ID)
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Jean-Claude Niyomugabo"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    National ID (16 Digits)
                  </label>
                  <input
                    type="text"
                    required
                    value={newNationalId}
                    onChange={(e) => setNewNationalId(e.target.value)}
                    placeholder="1 1995 8 0019284 0 12"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+250 788 123 456"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Assigned Site Post
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

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Assigned Shift
                  </label>
                  <select
                    value={newShift}
                    onChange={(e) => setNewShift(e.target.value as ShiftType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Day (06:00 - 18:00)">Day (06:00 - 18:00)</option>
                    <option value="Night (18:00 - 06:00)">Night (18:00 - 06:00)</option>
                    <option value="Rotating 12h">Rotating 12h</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Specialized Skills (Comma separated)
                </label>
                <input
                  type="text"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  placeholder="Armed Guard, CCTV Monitor, First Aid"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Monthly Base Salary (RWF)
                </label>
                <input
                  type="number"
                  value={newSalary}
                  onChange={(e) => setNewSalary(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors"
                >
                  Complete Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
