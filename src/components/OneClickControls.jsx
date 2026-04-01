import React, { useState } from 'react';
import { RefreshCw, Pause, Play, Zap, Radio, Shield, AlertTriangle, X, Check } from 'lucide-react';

const ACTIONS = [
  { id: 'restart-az',   label: 'Restart Agent Zero',     icon: RefreshCw, color: '#FF3B5C', bg: '#FF3B5C', desc: 'This will terminate and restart the Agent Zero process. All active tasks will be interrupted.' },
  { id: 'restart-ml',   label: 'Restart Moltis',          icon: RefreshCw, color: '#FF3B5C', bg: '#FF3B5C', desc: 'This will terminate the Moltis browser agent. Active browser sessions will be lost.' },
  { id: 'pause-all',    label: 'Pause All Agents',        icon: Pause,     color: '#FFB800', bg: '#FFB800', desc: 'Pauses task execution across all agents. Agents will complete current micro-step then halt.' },
  { id: 'resume-all',   label: 'Resume All Agents',       icon: Play,      color: '#00FF94', bg: '#00FF94', desc: 'Resumes all paused agents. Tasks will continue from last checkpoint.' },
  { id: 'trigger-n8n',  label: 'Trigger n8n Workflow',    icon: Zap,       color: '#00D4FF', bg: '#00D4FF', desc: 'Manually fire the primary n8n webhook. This will execute the default workflow chain.' },
  { id: 'broadcast',    label: 'Broadcast Instruction',   icon: Radio,     color: '#A855F7', bg: '#A855F7', desc: 'Send a global instruction to all active agents simultaneously.' },
  { id: 'memory-sweep', label: 'Run Memory Sweep',        icon: Shield,    color: '#00D4FF', bg: '#00D4FF', desc: 'Trigger an immediate memory consolidation and pruning pass across all agent stores.' },
  { id: 'deploy-nexus', label: 'Deploy NEXUS Build',      icon: Zap,       color: '#00FF94', bg: '#00FF94', desc: 'Push latest build to Cloudflare Pages. Requires a successful vite build in dist/.' },
];

function ConfirmModal({ action, onConfirm, onCancel }) {
  if (!action) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-surface2 border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: action.color + '20' }}
          >
            <AlertTriangle size={20} style={{ color: action.color }} />
          </div>
          <div>
            <div className="mono text-xs text-textmuted">CONFIRM ACTION</div>
            <div className="text-text font-semibold">{action.label}</div>
          </div>
          <button onClick={onCancel} className="ml-auto text-textmuted hover:text-text transition-colors">
            <X size={16} />
          </button>
        </div>
        <p className="text-sm text-textmuted leading-relaxed mb-6">{action.desc}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-white/10 mono text-sm text-textmuted hover:text-text hover:border-white/20 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(action)}
            className="flex-1 py-2.5 rounded-xl mono text-sm font-bold transition-all"
            style={{ backgroundColor: action.color + '20', color: action.color, border: `1px solid ${action.color}50` }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OneClickControls({ addToast }) {
  const [pending, setPending] = useState(null);
  const [loading, setLoading] = useState(null);

  const handleConfirm = (action) => {
    setPending(null);
    setLoading(action.id);
    setTimeout(() => {
      setLoading(null);
      if (addToast) addToast(`${action.label} executed successfully`, 'success');
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 rounded bg-accent" />
        <h2 className="mono text-accent font-bold tracking-wider text-sm">ONE-CLICK CONTROLS</h2>
        <span className="mono text-xs text-textmuted ml-auto">Click any action to execute</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ACTIONS.map(action => {
          const Icon = action.icon;
          const isLoading = loading === action.id;
          return (
            <button
              key={action.id}
              onClick={() => !isLoading && setPending(action)}
              disabled={isLoading}
              className="flex items-center gap-3 p-4 bg-surface rounded-xl border border-white/5 hover:border-white/15 transition-all duration-200 text-left group hover:-translate-y-0.5"
              style={{ boxShadow: isLoading ? `0 0 20px ${action.color}30` : undefined }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                style={{ backgroundColor: action.color + '15', border: `1px solid ${action.color}30` }}
              >
                {isLoading
                  ? <div className="w-4 h-4 border-2 rounded-full border-t-transparent animate-spin" style={{ borderColor: action.color, borderTopColor: 'transparent' }} />
                  : <Icon size={18} style={{ color: action.color }} />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="mono text-xs font-bold text-text group-hover:text-white transition-colors">{action.label}</div>
                <div className="mono text-xs text-textmuted mt-0.5 line-clamp-1">{action.desc.slice(0, 40)}...</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-surface rounded-xl border border-white/5 p-4">
        <div className="mono text-xs text-textmuted mb-3">RECENT EXECUTIONS</div>
        <div className="space-y-2">
          {[
            { label: 'Memory Sweep', time: '17:57', status: 'success' },
            { label: 'Trigger n8n Workflow', time: '17:30', status: 'success' },
            { label: 'Pause All Agents', time: '16:45', status: 'success' },
            { label: 'Resume All Agents', time: '16:50', status: 'success' },
          ].map((exec, i) => (
            <div key={i} className="flex items-center gap-3">
              <Check size={12} className="text-accent2" />
              <span className="mono text-xs text-text">{exec.label}</span>
              <span className="mono text-xs text-textmuted ml-auto">{exec.time}</span>
            </div>
          ))}
        </div>
      </div>

      <ConfirmModal action={pending} onConfirm={handleConfirm} onCancel={() => setPending(null)} />
    </div>
  );
}
