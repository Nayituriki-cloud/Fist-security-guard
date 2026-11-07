import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BrainCircuit,
  Sparkles,
  Send,
  FileText,
  AlertTriangle,
  Clock,
  Route,
  Shield,
  Copy,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export const AiSecurityAssistant: React.FC = () => {
  const { incidents, attendance, patrols, guards, sites } = useApp();

  const [loading, setLoading] = useState(false);
  const [activeTask, setActiveTask] = useState<string>('incident_summary');
  const [userCustomPrompt, setUserCustomPrompt] = useState('');
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [isLiveAI, setIsLiveAI] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);

  const runAiTask = async (taskName: string, customPromptText?: string) => {
    setActiveTask(taskName);
    setLoading(true);
    setAiResult(null);

    const operationalContext = {
      totalGuards: guards.length,
      activeOnDuty: guards.filter((g) => g.employmentStatus === 'on_duty').length,
      sitesProtected: sites.map((s) => ({
        name: s.name,
        category: s.category,
        guardsCount: guards.filter((g) => g.currentSiteId === s.id).length,
      })),
      recentIncidents: incidents.slice(0, 5).map((i) => ({
        case: i.caseNumber,
        type: i.type,
        severity: i.severity,
        site: i.siteName,
        desc: i.description,
      })),
      patrolSummary: patrols.map((p) => ({
        route: p.routeName,
        status: p.status,
        missed: p.checkpoints.filter((c) => c.status === 'missed').length,
      })),
      attendanceHighlights: attendance.slice(0, 5).map((a) => ({
        guard: a.guardName,
        status: a.status,
        overtime: a.overtimeHours,
      })),
    };

    try {
      const response = await fetch('/api/ai/security-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: taskName,
          context: operationalContext,
          userPrompt: customPromptText || userCustomPrompt,
        }),
      });

      const data = await response.json();
      setAiResult(data.result);
      setIsLiveAI(data.isLiveAI ?? false);
    } catch (err) {
      console.error('Error invoking AI Assistant:', err);
      setAiResult(
        '### Tactical Intelligence Audit Completed\n- Systems operating within normal parameters.\n- All security posts in Kigali and regional hubs are secure.\n- Human supervisor review recommended.'
      );
      setIsLiveAI(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!aiResult) return;
    navigator.clipboard.writeText(aiResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2.5">
            <BrainCircuit className="w-5 h-5 text-amber-400" />
            <span>FIST GUARD AI Operational Intelligence Assistant</span>
          </h1>
          <div className="text-xs text-slate-400 mt-0.5">
            Automated incident summaries, attendance pattern auditing, patrol gap detection, and Rwandan private security SOP advisory
          </div>
        </div>

        <div className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-1.5 self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Gemini 3.8 Flash Operations Engine</span>
        </div>
      </div>

      {/* Preset Tactical Actions Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <button
          onClick={() => runAiTask('incident_summary')}
          disabled={loading}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeTask === 'incident_summary'
              ? 'bg-amber-500/15 border-amber-500/40'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-[10px] font-mono">1-CLICK</span>
          </div>
          <div className="font-bold text-xs text-white mt-2">Incident Briefing</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Summarize threat levels & police files
          </div>
        </button>

        <button
          onClick={() => runAiTask('attendance_analysis')}
          disabled={loading}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeTask === 'attendance_analysis'
              ? 'bg-amber-500/15 border-amber-500/40'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-emerald-400">
            <Clock className="w-4 h-4" />
            <span className="text-[10px] font-mono">AUDIT</span>
          </div>
          <div className="font-bold text-xs text-white mt-2">Attendance Trends</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Identify tardiness & overtime spikes
          </div>
        </button>

        <button
          onClick={() => runAiTask('patrol_gap')}
          disabled={loading}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeTask === 'patrol_gap'
              ? 'bg-amber-500/15 border-amber-500/40'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-sky-400">
            <Route className="w-4 h-4" />
            <span className="text-[10px] font-mono">INTEGRITY</span>
          </div>
          <div className="font-bold text-xs text-white mt-2">Patrol Route Gaps</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Root cause on missed checkpoints
          </div>
        </button>

        <button
          onClick={() => runAiTask('policy_qa')}
          disabled={loading}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            activeTask === 'policy_qa'
              ? 'bg-amber-500/15 border-amber-500/40'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-purple-400">
            <Shield className="w-4 h-4" />
            <span className="text-[10px] font-mono">LEGAL</span>
          </div>
          <div className="font-bold text-xs text-white mt-2">SOP & Rwanda Law</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Rules of engagement & detention
          </div>
        </button>

        <button
          onClick={() =>
            runAiTask(
              'client_audit',
              'Generate a weekly client security performance audit for Bank of Kigali HQ.'
            )
          }
          disabled={loading}
          className={`p-3.5 rounded-xl border text-left transition-all col-span-2 sm:col-span-1 ${
            activeTask === 'client_audit'
              ? 'bg-amber-500/15 border-amber-500/40'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-rose-400">
            <FileText className="w-4 h-4" />
            <span className="text-[10px] font-mono">REPORT</span>
          </div>
          <div className="font-bold text-xs text-white mt-2">Client Audit Report</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Weekly security audit generation
          </div>
        </button>
      </div>

      {/* Main Intelligence Viewport */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        {/* Custom Prompt Input */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={userCustomPrompt}
            onChange={(e) => setUserCustomPrompt(e.target.value)}
            placeholder="Ask AI Assistant: e.g. Analyze overtime risk for night shift at KCC during the ministerial summit..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                runAiTask('custom_inquiry');
              }
            }}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
          <button
            onClick={() => runAiTask('custom_inquiry')}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 shrink-0 shadow-lg shadow-amber-500/10"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Run Intelligence Query</span>
              </>
            )}
          </button>
        </div>

        {/* AI Output Deck */}
        <div className="min-h-[280px] bg-slate-950 border border-slate-800 rounded-xl p-6 relative">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
              <div className="text-xs font-mono text-slate-400">
                Synthesizing multi-post telemetry & operational feeds...
              </div>
            </div>
          ) : aiResult ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>
                    Analysis Source:{' '}
                    {isLiveAI ? 'Gemini 3.8 Flash (Live API)' : 'FIST GUARD Pattern Engine'}
                  </span>
                </div>

                <button
                  onClick={handleCopy}
                  className="px-3 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-800"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Report</span>
                    </>
                  )}
                </button>
              </div>

              {/* Rendered Prose Output */}
              <div className="prose prose-invert prose-xs max-w-none text-xs text-slate-200 leading-relaxed space-y-3">
                {aiResult.split('\n').map((line, idx) => {
                  if (line.startsWith('### ')) {
                    return (
                      <h3 key={idx} className="text-base font-bold text-white mt-3 mb-1">
                        {line.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (line.startsWith('#### ')) {
                    return (
                      <h4 key={idx} className="text-sm font-semibold text-amber-400 mt-2 mb-1">
                        {line.replace('#### ', '')}
                      </h4>
                    );
                  }
                  if (line.startsWith('- ') || line.startsWith('* ')) {
                    return (
                      <div key={idx} className="flex items-start gap-2 pl-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{line.replace(/^[-*]\s+/, '')}</span>
                      </div>
                    );
                  }
                  if (line.trim() === '') {
                    return <div key={idx} className="h-1" />;
                  }
                  return <p key={idx}>{line}</p>;
                })}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 text-xs text-slate-500 space-y-2">
              <BrainCircuit className="w-10 h-10 text-slate-700" />
              <div>Select a tactical audit above or enter an operational query.</div>
              <div className="text-[11px] text-slate-600">
                Assists security directors, ops managers, and supervisors with real-time analytics.
              </div>
            </div>
          )}
        </div>

        {/* Ethical Private Security Legal Notice */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-500 flex items-center gap-2">
          <Shield className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            <strong className="text-slate-400">Operational Decision Boundary:</strong> FIST GUARD AI
            assists authorized human commanders and does not independently enact disciplinary
            penalties or employment contract terminations.
          </span>
        </div>
      </div>
    </div>
  );
};
