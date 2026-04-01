import React, { useState, useEffect, useRef } from 'react';
import { taskFeedEvents } from '../data/mockData.js';
import { Pause, Play, Wifi } from 'lucide-react';

const TYPE_COLOR = {
  created:     { bg: '#00D4FF20', text: '#00D4FF', border: '#00D4FF40', label: 'CREATED' },
  delegated:   { bg: '#FFB80020', text: '#FFB800', border: '#FFB80040', label: 'DELEGATED' },
  'in-progress':{ bg: '#00D4FF20', text: '#00D4FF', border: '#00D4FF40', label: 'IN PROGRESS' },
  complete:    { bg: '#00FF9420', text: '#00FF94', border: '#00FF9440', label: 'COMPLETE' },
  failed:      { bg: '#FF3B5C20', text: '#FF3B5C', border: '#FF3B5C40', label: 'FAILED' },
};

const AGENT_COLOR = { 'agent-zero': '#00D4FF', 'moltis': '#00FF94', 'n8n-bridge': '#FFB800' };
const AGENT_LABEL = { 'agent-zero': 'Agent Zero', 'moltis': 'Moltis', 'n8n-bridge': 'n8n Bridge' };

const SYNTHETIC = [
  { type: 'in-progress', agent: 'agent-zero', taskName: 'NEXUS Build Phase 1', message: 'Compiling component bundle...' },
  { type: 'complete',    agent: 'moltis',     taskName: 'Scrape competitor pricing', message: 'Page 13/47 extracted' },
  { type: 'delegated',   agent: 'agent-zero', taskName: 'Memory sweep', message: 'Routine task dispatched' },
  { type: 'created',     agent: 'n8n-bridge', taskName: 'Alert check', message: 'Cron trigger fired' },
  { type: 'failed',      agent: 'moltis',     taskName: 'Auth flow test', message: 'CAPTCHA block detected' },
];

export default function LiveTaskFeed() {
  const [events, setEvents] = useState([...taskFeedEvents]);
  const [paused, setPaused] = useState(false);
  const feedRef = useRef(null);
  const counterRef = useRef(0);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      const syn = SYNTHETIC[counterRef.current % SYNTHETIC.length];
      counterRef.current++;
      const now = new Date();
      const ts = now.toTimeString().slice(0, 8);
      const newEvent = { id: `live-${Date.now()}`, timestamp: ts, ...syn };
      setEvents(prev => [newEvent, ...prev.slice(0, 49)]);
    }, 3000);
    return () => clearInterval(interval);
  }, [paused]);

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 rounded bg-accent" />
        <h2 className="mono text-accent font-bold tracking-wider text-sm">LIVE TASK FEED</h2>
        <div className="flex items-center gap-1 ml-2">
          {!paused && <div className="w-2 h-2 rounded-full bg-accent2 animate-pulse" />}
          <span className="mono text-xs text-textmuted">{paused ? 'PAUSED' : 'STREAMING'}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="mono text-xs text-textmuted">{events.length} events</span>
          <button
            onClick={() => setPaused(p => !p)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-accent/40 text-textmuted hover:text-accent transition-all mono text-xs"
          >
            {paused ? <Play size={12} /> : <Pause size={12} />}
            {paused ? 'Resume' : 'Pause'}
          </button>
        </div>
      </div>

      <div ref={feedRef} className="flex-1 bg-surface rounded-xl border border-white/5 overflow-y-auto scan-overlay">
        <div className="divide-y divide-white/5">
          {events.map((ev, i) => {
            const tc = TYPE_COLOR[ev.type] || TYPE_COLOR.created;
            const agColor = AGENT_COLOR[ev.agent] || '#64748B';
            const isNew = i < 3 && !paused;
            return (
              <div
                key={ev.id}
                className={`flex items-start gap-3 px-4 py-2.5 hover:bg-white/2 transition-colors ${isNew ? 'animate-slide-in-top' : '' }`}
              >
                <span className="mono text-xs text-textmuted w-[68px] flex-shrink-0 pt-0.5">{ev.timestamp}</span>
                <div
                  className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                  style={{ backgroundColor: tc.text }}
                />
                <div
                  className="mono text-xs px-1.5 py-0.5 rounded border flex-shrink-0"
                  style={{ color: agColor, borderColor: agColor + '40', backgroundColor: agColor + '10' }}
                >
                  {AGENT_LABEL[ev.agent] || ev.agent}
                </div>
                <div
                  className="mono text-xs px-1.5 py-0.5 rounded border flex-shrink-0"
                  style={{ color: tc.text, borderColor: tc.border, backgroundColor: tc.bg }}
                >
                  {tc.label}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="mono text-xs text-text">{ev.taskName}</span>
                  <span className="mono text-xs text-textmuted ml-2">{ev.message}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
