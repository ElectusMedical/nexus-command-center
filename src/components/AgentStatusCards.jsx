import React, { useState, useEffect } from 'react';
import { agents } from '../data/mockData.js';
import { Clock, Zap, CheckCircle } from 'lucide-react';

const STATUS_STYLE = {
  active: { label: 'ACTIVE',  border: '#00FF94', bg: '#00FF9415', text: '#00FF94' },
  idle:   { label: 'IDLE',    border: '#FFB800', bg: '#FFB80015', text: '#FFB800' },
  error:  { label: 'ERROR',   border: '#FF3B5C', bg: '#FF3B5C15', text: '#FF3B5C' },
};

function UptimeTicker({ initial }) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const extra = seconds > 0 ? ` +${seconds}s` : '';
  return <span>{initial}{extra}</span>;
}

export default function AgentStatusCards() {
  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 rounded bg-accent" />
        <h2 className="mono text-accent font-bold tracking-wider text-sm">AGENT STATUS</h2>
        <span className="mono text-xs text-textmuted ml-auto">
          {agents.filter(a => a.status === 'active').length} active / {agents.length} total
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {agents.map(ag => {
          const st = STATUS_STYLE[ag.status] || STATUS_STYLE.idle;
          return (
            <div
              key={ag.id}
              className="bg-surface rounded-xl border p-5 transition-all duration-300 hover:-translate-y-0.5 scan-overlay"
              style={{
                borderColor: st.border + '60',
                boxShadow: `0 0 20px ${st.border}15`,
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold mono"
                    style={{ backgroundColor: ag.color + '20', color: ag.color }}
                  >
                    {ag.avatar}
                  </div>
                  <div>
                    <div className="text-text font-semibold text-base">{ag.name}</div>
                    <div className="mono text-textmuted text-xs mt-0.5">{ag.role}</div>
                  </div>
                </div>
                <div
                  className="px-2.5 py-1 rounded-lg border mono text-xs font-bold"
                  style={{ borderColor: st.border, backgroundColor: st.bg, color: st.text }}
                >
                  ● {st.label}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-background rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Clock size={11} className="text-textmuted" />
                    <span className="mono text-xs text-textmuted">UPTIME</span>
                  </div>
                  <div className="mono text-sm" style={{ color: ag.color }}>
                    <UptimeTicker initial={ag.uptime} />
                  </div>
                </div>
                <div className="bg-background rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <CheckCircle size={11} className="text-textmuted" />
                    <span className="mono text-xs text-textmuted">COMPLETED</span>
                  </div>
                  <div className="mono text-sm text-accent2">{ag.tasksCompleted}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="bg-background rounded-lg p-3">
                  <div className="mono text-xs text-textmuted mb-1">LAST ACTION</div>
                  <div className="mono text-xs text-text">{ag.lastAction}</div>
                </div>
                <div className="bg-background rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Zap size={11} style={{ color: ag.color }} />
                    <span className="mono text-xs text-textmuted">CURRENT TASK</span>
                  </div>
                  <div className="mono text-xs" style={{ color: ag.color }}>{ag.currentTask}</div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/5">
                <div className="mono text-xs text-textmuted">MODEL</div>
                <div className="mono text-xs text-text mt-0.5">{ag.model}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
