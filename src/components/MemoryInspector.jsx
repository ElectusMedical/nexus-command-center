import React, { useState } from 'react';
import { agentMemory, agents } from '../data/mockData.js';
import { ChevronDown, ChevronUp, Database } from 'lucide-react';

export default function MemoryInspector() {
  const [open, setOpen] = useState({ 'agent-zero': true, 'moltis': false, 'n8n-bridge': false });

  const toggle = (id) => setOpen(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 rounded bg-accent" />
        <h2 className="mono text-accent font-bold tracking-wider text-sm">MEMORY INSPECTOR</h2>
        <span className="mono text-xs text-textmuted ml-auto">
          {Object.values(agentMemory).reduce((acc, m) => acc + m.memories.length, 0)} memory entries
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {agents.map(ag => {
          const mem = agentMemory[ag.id];
          if (!mem) return null;
          const isOpen = open[ag.id];
          return (
            <div key={ag.id} className="bg-surface rounded-xl border border-white/5 overflow-hidden">
              {/* Accordion header */}
              <button
                onClick={() => toggle(ag.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/3 transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mono font-bold text-xs flex-shrink-0"
                  style={{ backgroundColor: ag.color + '20', color: ag.color }}
                >
                  {ag.avatar}
                </div>
                <div className="flex-1 text-left">
                  <div className="mono text-sm text-text">{ag.name}</div>
                  <div className="mono text-xs text-textmuted">{mem.memories.length} memory entries</div>
                </div>
                <Database size={13} style={{ color: ag.color }} />
                {isOpen
                  ? <ChevronUp size={14} className="text-textmuted" />
                  : <ChevronDown size={14} className="text-textmuted" />}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 animate-fade-in">
                  {/* Context summary */}
                  <div className="bg-background rounded-lg p-3 mb-3 border-l-2" style={{ borderColor: ag.color }}>
                    <div className="mono text-xs text-textmuted mb-1">CONTEXT SUMMARY</div>
                    <p className="text-xs text-text leading-relaxed">{mem.contextSummary}</p>
                  </div>

                  {/* Memory entries */}
                  <div className="space-y-1.5">
                    <div className="mono text-xs text-textmuted mb-2">MEMORY STORE</div>
                    {mem.memories.map((m, i) => (
                      <div key={i} className="bg-background rounded-lg p-2.5 font-mono text-xs flex gap-3">
                        <span
                          className="flex-shrink-0 font-bold"
                          style={{ color: ag.color }}
                        >
                          {m.key}
                        </span>
                        <span className="text-textmuted">=</span>
                        <span className="text-text break-all">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
