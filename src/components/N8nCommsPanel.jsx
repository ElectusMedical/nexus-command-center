import React, { useState } from 'react';
import { n8nMessages } from '../data/mockData.js';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

export default function N8nCommsPanel() {
  const [expanded, setExpanded] = useState(null);

  const toggle = (id) => setExpanded(prev => prev === id ? null : id);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 rounded bg-warning" />
        <h2 className="mono text-warning font-bold tracking-wider text-sm">n8n COMMS PANEL</h2>
        <div className="flex items-center gap-3 ml-auto">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-accent2" />
            <span className="mono text-xs text-textmuted">
              {n8nMessages.filter(m => m.status === 'approved').length} approved
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-warning" />
            <span className="mono text-xs text-textmuted">
              {n8nMessages.filter(m => m.status === 'held').length} held
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-surface rounded-xl border border-white/5 overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-12 gap-2 px-4 py-2 border-b border-white/5 bg-surface2">
          <span className="mono text-xs text-textmuted col-span-1">TIME</span>
          <span className="mono text-xs text-textmuted col-span-2">ROUTE</span>
          <span className="mono text-xs text-textmuted col-span-3">MESSAGE IN</span>
          <span className="mono text-xs text-textmuted col-span-2">WORKFLOW</span>
          <span className="mono text-xs text-textmuted col-span-3">OUTPUT</span>
          <span className="mono text-xs text-textmuted col-span-1">STATUS</span>
        </div>
        <div className="overflow-y-auto divide-y divide-white/5" style={{ maxHeight: 'calc(100% - 40px)' }}>
          {n8nMessages.map(msg => {
            const isHeld = msg.status === 'held';
            const isOpen = expanded === msg.id;
            return (
              <div key={msg.id}>
                <div
                  className="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-white/2 cursor-pointer transition-colors items-center"
                  onClick={() => toggle(msg.id)}
                >
                  <span className="mono text-xs text-textmuted col-span-1">{msg.timestamp}</span>
                  <div className="col-span-2 flex items-center gap-1">
                    <span className="mono text-xs text-text truncate" title={msg.sourceAgent}>{msg.sourceAgent}</span>
                    <ArrowRight size={10} className="text-textmuted flex-shrink-0" />
                    <span className="mono text-xs text-text truncate" title={msg.targetAgent}>{msg.targetAgent}</span>
                  </div>
                  <span className="mono text-xs text-textmuted col-span-3 truncate" title={msg.messageIn}>{msg.messageIn}</span>
                  <div className="col-span-2">
                    <span className="mono text-xs px-1.5 py-0.5 rounded bg-white/5 text-textmuted">{msg.workflowApplied}</span>
                  </div>
                  <span className="mono text-xs text-textmuted col-span-3 truncate" title={msg.output}>{msg.output}</span>
                  <div className="col-span-1">
                    <span
                      className="mono text-xs px-2 py-0.5 rounded border font-bold"
                      style={isHeld
                        ? { color: '#FFB800', borderColor: '#FFB80050', backgroundColor: '#FFB80015' }
                        : { color: '#00FF94', borderColor: '#00FF9450', backgroundColor: '#00FF9415' }
                      }
                    >
                      {isHeld ? 'HELD' : 'OK'}
                    </span>
                  </div>
                </div>
                {isOpen && (
                  <div className="px-4 py-3 bg-background border-t border-white/5 animate-fade-in">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="mono text-xs text-textmuted mb-1">FULL MESSAGE</div>
                        <div className="mono text-xs text-text bg-surface rounded p-2">{msg.messageIn}</div>
                      </div>
                      <div>
                        <div className="mono text-xs text-textmuted mb-1">FULL OUTPUT</div>
                        <div className="mono text-xs text-text bg-surface rounded p-2">{msg.output}</div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-4">
                      <div><span className="mono text-xs text-textmuted">WORKFLOW: </span><span className="mono text-xs text-accent">{msg.workflowApplied}</span></div>
                      <div><span className="mono text-xs text-textmuted">FROM: </span><span className="mono text-xs text-text">{msg.sourceAgent}</span></div>
                      <div><span className="mono text-xs text-textmuted">TO: </span><span className="mono text-xs text-text">{msg.targetAgent}</span></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
