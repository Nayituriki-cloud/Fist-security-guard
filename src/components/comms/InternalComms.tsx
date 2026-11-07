import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Radio,
  Plus,
  Send,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { CompanyAnnouncement } from '../../types';

export const InternalComms: React.FC = () => {
  const { announcements, addAnnouncement, currentUser } = useApp();

  const [filterAudience, setFilterAudience] = useState('All');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  // New broadcast state
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<CompanyAnnouncement['priority']>('routine');
  const [newTarget, setNewTarget] = useState<CompanyAnnouncement['targetAudience']>('All Staff');
  const [newContent, setNewContent] = useState('');

  const filteredAnnouncements = announcements.filter(
    (a) => filterAudience === 'All' || a.targetAudience === filterAudience || a.targetAudience === 'All Staff'
  );

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    addAnnouncement({
      title: newTitle,
      author: currentUser.name,
      authorRole: currentUser.roleTitle,
      priority: newPriority,
      content: newContent,
      targetAudience: newTarget,
    });

    setShowBroadcastModal(false);
    setNewTitle('');
    setNewContent('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <span>Employee Communication & Operational Dispatch Channels</span>
          </h1>
          <div className="text-xs text-slate-400 mt-0.5">
            Company-wide tactical directives, supervisor shift handover notices, emergency broadcasts, and guard bulletins
          </div>
        </div>

        <button
          onClick={() => setShowBroadcastModal(true)}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/10"
        >
          <Plus className="w-4 h-4" />
          <span>New Command Broadcast</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['All', 'All Staff', 'Supervisors Only', 'Guards Only', 'Operations'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterAudience(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filterAudience === cat
                ? 'bg-amber-500 text-slate-950'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Bulletins List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((ann) => (
          <div
            key={ann.id}
            className={`p-5 rounded-2xl border transition-all ${
              ann.priority === 'urgent' || ann.priority === 'critical'
                ? 'bg-slate-900 border-rose-900/60'
                : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    ann.priority === 'urgent'
                      ? 'bg-rose-500/20 text-rose-300'
                      : ann.priority === 'critical'
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {ann.priority}
                </span>
                <span className="text-xs font-mono text-amber-400">
                  Target: {ann.targetAudience}
                </span>
              </div>

              <div className="text-xs font-mono text-slate-500">{ann.date}</div>
            </div>

            <h3 className="text-base font-bold text-white mt-3">{ann.title}</h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{ann.content}</p>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
              <span>
                Authorized by: <strong className="text-slate-300">{ann.author}</strong> (
                {ann.authorRole})
              </span>
              <span className="font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Distributed to Terminals</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-400" />
              <span>Broadcast Command Announcement</span>
            </h2>

            <form onSubmit={handleBroadcast} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Announcement Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. VIP Escort Protocols for Ministerial Summit"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="routine">Routine</option>
                    <option value="urgent">Urgent</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Target Audience
                  </label>
                  <select
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="All Staff">All Staff</option>
                    <option value="Guards Only">Guards Only</option>
                    <option value="Supervisors Only">Supervisors Only</option>
                    <option value="Operations">Operations</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Message Body</label>
                <textarea
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                  placeholder="Enter detailed command guidance..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors"
                >
                  Transmit Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
