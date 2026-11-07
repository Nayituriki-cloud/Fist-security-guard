import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Users,
  Calendar,
  AlertOctagon,
  Award,
  CheckCircle2,
  Clock,
  UserPlus,
  BookOpen,
} from 'lucide-react';
import { LeaveRequest } from '../../types';

export const HumanResourcesView: React.FC = () => {
  const { guards } = useApp();

  const [activeTab, setActiveTab] = useState<'recruitment' | 'leaves' | 'disciplinary' | 'training'>('training');
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: 'leave_01',
      guardId: 'grd_bizimana',
      guardName: 'Gervais Bizimana',
      leaveType: 'Annual Leave',
      startDate: '2026-11-15',
      endDate: '2026-11-22',
      daysCount: 7,
      reason: 'Family visit to Huye Southern Province. Relief guard confirmed.',
      status: 'pending',
      appliedDate: '2026-11-04',
    },
    {
      id: 'leave_02',
      guardId: 'grd_nyampinga',
      guardName: 'Sonia Nyampinga',
      leaveType: 'Sick Leave',
      startDate: '2026-10-20',
      endDate: '2026-10-22',
      daysCount: 2,
      reason: 'Medical treatment certified by King Faisal Hospital Kigali.',
      status: 'approved',
      appliedDate: '2026-10-19',
      reviewedBy: 'Aline Mukandori (HR)',
    },
  ]);

  const handleApproveLeave = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, status: 'approved', reviewedBy: 'Aline Mukandori (HR)' } : l
      )
    );
  };

  const handleRejectLeave = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, status: 'rejected', reviewedBy: 'Aline Mukandori (HR)' } : l
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <span>Human Resources & Tactical Training Academy</span>
          </h1>
          <div className="text-xs text-slate-400 mt-0.5">
            Recruitment pipeline, staff onboarding, leave authorizations, confidential disciplinary hearings, and security certifications
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('training')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'training'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Training & Certs
          </button>
          <button
            onClick={() => setActiveTab('leaves')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'leaves'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Leave Approvals ({leaveRequests.filter((l) => l.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('disciplinary')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'disciplinary'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Disciplinary
          </button>
          <button
            onClick={() => setActiveTab('recruitment')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'recruitment'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Recruitment
          </button>
        </div>
      </div>

      {/* Tab: Training Academy */}
      {activeTab === 'training' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Tactical Defense & Restraint</span>
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl font-bold text-white font-mono mt-1">
                98.2% <span className="text-xs text-emerald-400 font-normal">Certified</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">RNP Academy Gishari Standard</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Rwanda Red Cross First Aid</span>
                <Award className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-bold text-white font-mono mt-1">
                94.6% <span className="text-xs text-emerald-400 font-normal">Active</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">CPR & Automated Defibrillator</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Diplomatic & VIP Protection</span>
                <Award className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-xl font-bold text-white font-mono mt-1">
                32 <span className="text-xs text-slate-400 font-normal">Guards Qualified</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Protocol & Counter-Ambush</div>
            </div>
          </div>

          {/* Training Modules Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Standard Security Training Curricula & Exam Calendar</span>
            </h3>

            <div className="space-y-3">
              {[
                {
                  course: 'Basic Private Security Fundamentals (Module 101)',
                  duration: '4 Weeks Full Time',
                  lead: 'Chief Training Officer Habimana',
                  enrolled: 24,
                  nextExam: '2026-11-20',
                  status: 'In Session',
                },
                {
                  course: 'X-Ray Luggage & Vehicle Under-Carriage Screening',
                  duration: '2 Weeks Technical',
                  lead: 'Smiths Detection Certified Trainer',
                  enrolled: 12,
                  nextExam: '2026-11-28',
                  status: 'Scheduled',
                },
                {
                  course: 'Canine (K9) Explosive Trace & Perimeter Patrol',
                  duration: '6 Weeks Advanced',
                  lead: 'East African K9 Federation',
                  enrolled: 8,
                  nextExam: '2026-12-05',
                  status: 'In Session',
                },
              ].map((c, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-white text-sm">{c.course}</div>
                    <div className="text-slate-400 mt-0.5">
                      Instructor: {c.lead} · Duration: {c.duration}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="font-mono text-amber-400 font-semibold">
                        {c.enrolled} Guards Enrolled
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        Exam: {c.nextExam}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-amber-500/15 text-amber-300 font-semibold text-[11px]">
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Leave Applications */}
      {activeTab === 'leaves' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Officer Leave Applications & Shift Relief Authorization</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Annual / Medical / Emergency Leaves
            </span>
          </div>

          <div className="space-y-3">
            {leaveRequests.map((leave) => (
              <div
                key={leave.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{leave.guardName}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                      {leave.leaveType}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        leave.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : leave.status === 'rejected'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {leave.status}
                    </span>
                  </div>
                  <div className="text-slate-400 mt-1">
                    Dates: <span className="font-mono text-slate-200">{leave.startDate} to {leave.endDate}</span> ({leave.daysCount} Days)
                  </div>
                  <div className="text-slate-300 text-[11px] mt-1 bg-slate-900/60 p-2 rounded">
                    Reason: {leave.reason}
                  </div>
                  {leave.reviewedBy && (
                    <div className="text-[11px] text-slate-500 mt-1">
                      Reviewed by: {leave.reviewedBy}
                    </div>
                  )}
                </div>

                {leave.status === 'pending' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleRejectLeave(leave.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 font-semibold text-xs transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleApproveLeave(leave.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
                    >
                      Approve & Relief
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Disciplinary Hearings */}
      {activeTab === 'disciplinary' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                <span>Restricted Disciplinary & Professional Ethics Records</span>
              </h3>
              <div className="text-xs text-slate-400 mt-0.5">
                Role-gated access in compliance with Rwandan Labor Law & FIST GUARD Code of Conduct
              </div>
            </div>
            <span className="text-xs font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
              Confidential
            </span>
          </div>

          <div className="space-y-3">
            {guards
              .flatMap((g) =>
                g.disciplinaryRecords.map((d) => ({
                  ...d,
                  guardName: g.fullName,
                  guardId: g.employeeNumber,
                }))
              )
              .map((d) => (
                <div
                  key={d.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white text-sm">{d.guardName}</span>
                      <span className="font-mono text-slate-500 ml-2">({d.guardId})</span>
                    </div>
                    <span className="font-mono text-slate-400">{d.date}</span>
                  </div>
                  <div className="text-amber-400 font-semibold">{d.incidentType}</div>
                  <div className="text-slate-300">{d.description}</div>
                  <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-slate-500">
                    <span>Action Taken: {d.actionTaken}</span>
                    <span>Officer: {d.reportedBy}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tab: Recruitment Pipeline */}
      {activeTab === 'recruitment' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-amber-400" />
              <span>Candidate Screening & Vetting Pipeline</span>
            </h3>
            <span className="text-xs font-mono text-amber-400">Batch Q4 2026 Intake</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="font-bold text-white flex items-center justify-between">
                <span>Phase 1: Background & CID Vetting</span>
                <span className="font-mono text-amber-400">18 Candidates</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Criminal Record Clearance certificates verified through Irembo / Rwanda Investigation Bureau (RIB).
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="font-bold text-white flex items-center justify-between">
                <span>Phase 2: Medical & Fitness Drills</span>
                <span className="font-mono text-sky-400">14 Candidates</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Physical endurance assessment, 5km tactical run, drug screening, and audiometry.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="font-bold text-white flex items-center justify-between">
                <span>Phase 3: Academy Indoctrination</span>
                <span className="font-mono text-emerald-400">12 Candidates</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Final uniform fit, defensive tactics swearing-in, and placement at Masoro Logistics Hub.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
