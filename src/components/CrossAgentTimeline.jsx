import React, { useState, useRef } from 'react';
import { timelineEvents, agents } from '../data/mockData.js';
import { ZoomIn, ZoomOut, AlignRight } from 'lucide-react';

const TYPE_COLOR = {
  task:       '#00D4FF',
  delegation: '#FFB800',
  complete:   '#00FF94',
  failed:     '#FF3B5C',
  alert:      '#FF3B5C',
};

const AGENT_COLOR = {
  'agent-zero': '#00D4FF',
  'moltis':     '#00FF94',
  'n8n-bridge': '#FFB800',
};

export default function CrossAgentTimeline() {
  const [zoom, setZoom] = useState(1);
  const scrollRef = useRef(null);

  // Layout constants
  const LABEL_W = 110;
  const LANE_H  = 90;
  const HEADER_H = 36;
  const DOT_R   = 6;
  const STEP_BASE = 68;
  const STEP    = STEP_BASE * zoom;

  // Sorted events
  const sorted = [...timelineEvents].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  const uniqueTimes = [...new Set(sorted.map(e => e.timestamp))];

  const SVG_W = LABEL_W + uniqueTimes.length * STEP + 40;
  const SVG_H = HEADER_H + agents.length * LANE_H + 10;

  const xFor = (ts) => LABEL_W + uniqueTimes.indexOf(ts) * STEP + STEP / 2;
  const yFor = (agentId) => {
    const idx = agents.findIndex(a => a.id === agentId);
    return HEADER_H + idx * LANE_H + LANE_H / 2;
  };

  const scrollToEnd = () => {
    if (scrollRef.current) scrollRef.current.scrollLeft = 99999;
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 rounded bg-accent" />
        <h2 className="mono text-accent font-bold tracking-wider text-sm">CROSS-AGENT TIMELINE</h2>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
            className="p-1.5 rounded-lg border border-white/10 text-textmuted hover:text-text hover:border-white/20 transition-all"
          >
            <ZoomOut size={14} />
          </button>
          <span className="mono text-xs text-textmuted w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(z => Math.min(2.5, z + 0.25))}
            className="p-1.5 rounded-lg border border-white/10 text-textmuted hover:text-text hover:border-white/20 transition-all"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={scrollToEnd}
            className="p-1.5 rounded-lg border border-white/10 text-textmuted hover:text-accent hover:border-accent/40 transition-all"
            title="Jump to latest"
          >
            <AlignRight size={14} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 bg-surface rounded-xl border border-white/5 overflow-auto scan-overlay"
      >
        <svg
          width={SVG_W}
          height={SVG_H}
          style={{ display: 'block', minWidth: SVG_W }}
        >
          {/* Agent lane backgrounds */}
          {agents.map((agent, i) => (
            <g key={agent.id}>
              <rect
                x={0} y={HEADER_H + i * LANE_H}
                width={SVG_W} height={LANE_H}
                fill={i % 2 === 0 ? '#0F172920' : '#00000015'}
              />
              {/* Lane label */}
              <rect
                x={4} y={HEADER_H + i * LANE_H + LANE_H / 2 - 18}
                width={100} height={36}
                rx={6}
                fill={agent.color + '10'}
                stroke={agent.color + '30'}
                strokeWidth={1}
              />
              <text
                x={54} y={HEADER_H + i * LANE_H + LANE_H / 2 - 4}
                textAnchor="middle"
                fill={agent.color}
                fontSize={10}
                fontFamily="JetBrains Mono, monospace"
                fontWeight="bold"
              >
                {agent.name}
              </text>
              <text
                x={54} y={HEADER_H + i * LANE_H + LANE_H / 2 + 10}
                textAnchor="middle"
                fill="#64748B"
                fontSize={8}
                fontFamily="JetBrains Mono, monospace"
              >
                {agent.role}
              </text>
              <line
                x1={0} y1={HEADER_H + (i + 1) * LANE_H}
                x2={SVG_W} y2={HEADER_H + (i + 1) * LANE_H}
                stroke="#1a2540" strokeWidth={1}
              />
            </g>
          ))}

          {/* Time markers */}
          {uniqueTimes.map((ts, i) => (
            <g key={ts}>
              <line
                x1={LABEL_W + i * STEP + STEP / 2} y1={HEADER_H}
                x2={LABEL_W + i * STEP + STEP / 2} y2={SVG_H}
                stroke="#1a2540" strokeWidth={1} strokeDasharray="3,3"
              />
              <text
                x={LABEL_W + i * STEP + STEP / 2} y={HEADER_H - 8}
                textAnchor="middle"
                fill="#64748B"
                fontSize={9}
                fontFamily="JetBrains Mono, monospace"
              >
                {ts}
              </text>
            </g>
          ))}

          {/* Header bg */}
          <rect x={0} y={0} width={SVG_W} height={HEADER_H} fill="#0F1729" />
          <line x1={0} y1={HEADER_H} x2={SVG_W} y2={HEADER_H} stroke="#1a2540" strokeWidth={1} />
          <text x={54} y={22} textAnchor="middle" fill="#64748B" fontSize={9} fontFamily="JetBrains Mono, monospace">
            AGENT
          </text>

          {/* Delegation connector lines */}
          {sorted.filter(e => e.triggeredBy).map(e => {
            const parent = sorted.find(p => p.id === e.triggeredBy);
            if (!parent) return null;
            const x1 = xFor(parent.timestamp);
            const y1 = yFor(parent.agent);
            const x2 = xFor(e.timestamp);
            const y2 = yFor(e.agent);
            const mx = (x1 + x2) / 2;
            return (
              <path
                key={e.id + '-conn'}
                d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke="#FFB80050"
                strokeWidth={1.5}
                strokeDasharray="4,2"
              />
            );
          })}

          {/* Event dots */}
          {sorted.map(event => {
            const cx = xFor(event.timestamp);
            const cy = yFor(event.agent);
            const color = TYPE_COLOR[event.type] || '#64748B';
            const agColor = AGENT_COLOR[event.agent] || '#64748B';
            const label = event.title.length > 13 ? event.title.slice(0, 13) + '...' : event.title;
            return (
              <g key={event.id}>
                <circle cx={cx} cy={cy} r={DOT_R + 6} fill={color + '10'} />
                <circle
                  cx={cx} cy={cy} r={DOT_R}
                  fill={color}
                  stroke={agColor}
                  strokeWidth={1.5}
                  style={{ filter: `drop-shadow(0 0 4px ${color}80)` }}
                />
                <text
                  x={cx} y={cy - DOT_R - 6}
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontSize={8}
                  fontFamily="JetBrains Mono, monospace"
                >
                  {label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex gap-5 flex-wrap">
        {Object.entries(TYPE_COLOR).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="mono text-xs text-textmuted capitalize">{type}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-2">
          <svg width="20" height="8"><line x1="0" y1="4" x2="20" y2="4" stroke="#FFB800" strokeWidth="1.5" strokeDasharray="4,2"/></svg>
          <span className="mono text-xs text-textmuted">delegation</span>
        </div>
      </div>
    </div>
  );
}
