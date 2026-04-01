import React, { useState } from 'react';
import { agents } from '../data/mockData.js';
import { ChevronDown, ChevronUp, Cpu } from 'lucide-react';

const STATUS_STYLE = {
  active: { label: 'ACTIVE', color: '#00FF94' },
  idle:   { label: 'IDLE',   color: '#FFB800' },
  error:  { label: 'ERROR',  color: '#FF3B5C' },
};

export default function AgentRoleDisplay() {
  const [expanded, setExpanded] = useState({});

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 rounded bg-accent" />
        <h2 className="mono text-accent font-bold tracking-wider text-sm">AGENT ROLE DISPLAY</h2>
        <span className="mono text-xs text-textmuted ml-auto">{agents.length} agents registered</span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {agents.map(ag => {
          const st = STATUS_STYLE[ag.status] || STATUS_STYLE.idle;
          const isExp = expanded[ag.id];
          return (
            <div
              key={ag.id}
              className="bg-surface rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 hover:border-white/10"
              style={{ boxShadow: `0 0 30px ${ag.color}10` }}
            >
              <div className="flex items-center gap-5 p-5">
                {/* Avatar */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black mono flex-shrink-0 animate-float"
                  style={{
                    backgroundColor: ag.color + '15',
                    color: ag.color,
                    border: `2px solid ${ag.color}30`,
                    boxShadow: `0 0 20px ${ag.color}20`,
                  }}
                >
                  {ag.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-text font-bold text-lg">{ag.name}</h3>
                    <div
                      className="mono text-xs px-2.5 py-1 rounded-full border font-bold"
                      style={{ color: st.color, borderColor: st.color + '50', backgroundColor: st.color + '15' }}
                    >
                      ● {st.label}
                    </div>
                  </div>
                  <div
                    className="mono text-xs px-2 py-0.5 rounded inline-block mb-2"
                    style={{ backgroundColor: ag.color + '15', color: ag.color }}
                  >
                    {ag.role}
                  </div>
                  <div className="mono text-xs text-textmuted">{ag.model}</div>
                </div>

                {/* Stats */}
                <div className="flex flex-col gap-2 items-end flex-shrink-0">
                  <div className="text-right">
                    <div className="mono text-xs text-textmuted">COMPLETED</div>
                    <div className="mono text-lg font-bold" style={{ color: ag.color }}>{ag.tasksCompleted}</div>
                  </div>
                  <div className="text-right">
                    <div className="mono text-xs text-textmuted">ACTIVE</div>
                    <div className="mono text-sm font-bold text-text">{ag.tasksActive}</div>
                  </div>
                </div>
              </div>

              {/* System prompt preview */}
              <div className="px-5 pb-4">
                <div
                  className="bg-background rounded-xl p-4 border-l-2"
                  style={{ borderColor: ag.color + '60' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Cpu size={11} style={{ color: ag.color }} />
                      <span className="mono text-xs text-textmuted">SYSTEM PROMPT SUMMARY</span>
                    </div>
                    <button
                      onClick={() => toggle(ag.id)}
                      className="flex items-center gap-1 mono text-xs text-textmuted hover:text-text transition-colors"
                    >
                      {isExp ? <><ChevronUp size={12} /> Less</> : <><ChevronDown size={12} /> More</>}
                    </button>
                  </div>
                  <p className={`mono text-xs text-text leading-relaxed transition-all ${
                    isExp ? '' : 'line-clamp-2'
                  }`}>
                    {ag.systemPromptSummary}
                  </p>
                </div>
              </div>

              {/* Divider + meta */}
              <div className="px-5 pb-4 flex items-center gap-4 border-t border-white/5 pt-3">
                <div>
                  <span className="mono text-xs text-textmuted">UPTIME: </span>
                  <span className="mono text-xs text-text">{ag.uptime}</span>
                </div>
                <div className="w-px h-3 bg-white/10" />
                <div>
                  <span className="mono text-xs text-textmuted">LAST: </span>
                  <span className="mono text-xs text-text">{ag.lastAction}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
