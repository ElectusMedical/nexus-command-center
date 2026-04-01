import React, { useState, useEffect, useRef } from 'react';
import { resources as initialResources } from '../data/mockData.js';

function CircularGauge({ label, value, size = 140 }) {
  const radius = 48;
  const stroke = 8;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - value / 100);

  let color = '#00FF94';
  if (value > 80) color = '#FF3B5C';
  else if (value > 50) color = '#FFB800';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          {/* Track */}
          <circle
            cx={cx} cy={cy} r={radius}
            fill="none"
            stroke="#1a2540"
            strokeWidth={stroke}
          />
          {/* Progress */}
          <circle
            cx={cx} cy={cy} r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{
              transition: "stroke-dashoffset 0.6s ease, stroke 0.6s ease",
              filter: `drop-shadow(0 0 6px ${color}80)`,
            }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="mono font-bold text-xl" style={{ color }}>{value}%</span>
        </div>
      </div>
      <span className="mono text-xs text-textmuted tracking-widest uppercase">{label}</span>
    </div>
  );
}

function MiniBar({ label, value }) {
  let color = '#00FF94';
  if (value > 80) color = '#FF3B5C';
  else if (value > 50) color = '#FFB800';
  return (
    <div className="flex items-center gap-3">
      <span className="mono text-xs text-textmuted w-20 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, backgroundColor: color, boxShadow: `0 0 6px ${color}80` }}
        />
      </div>
      <span className="mono text-xs w-8 text-right" style={{ color }}>{value}%</span>
    </div>
  );
}

export default function ResourceMonitor() {
  const [res, setRes] = useState(initialResources);
  const [history, setHistory] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      cpu: Math.round(20 + Math.random() * 40),
      ram: Math.round(50 + Math.random() * 20),
      disk: Math.round(40 + Math.random() * 20),
      network: Math.round(10 + Math.random() * 30),
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRes(prev => ({
        cpu:     Math.max(5,  Math.min(95, prev.cpu     + Math.round((Math.random() - 0.45) * 12))),
        ram:     Math.max(30, Math.min(95, prev.ram     + Math.round((Math.random() - 0.48) * 5))),
        disk:    Math.max(20, Math.min(90, prev.disk    + Math.round((Math.random() - 0.49) * 3))),
        network: Math.max(5,  Math.min(90, prev.network + Math.round((Math.random() - 0.45) * 10))),
      }));
      setHistory(prev => {
        const next = [...prev.slice(1)];
        next.push({ ...res });
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [res]);

  const gauges = [
    { label: 'CPU', value: res.cpu },
    { label: 'RAM', value: res.ram },
    { label: 'DISK I/O', value: res.disk },
    { label: 'NETWORK', value: res.network },
  ];

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 rounded bg-accent" />
        <h2 className="mono text-accent font-bold tracking-wider text-sm">RESOURCE MONITOR</h2>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-accent2 animate-pulse" />
          <span className="mono text-xs text-textmuted">LIVE · updates every 2s</span>
        </div>
      </div>

      {/* Gauges */}
      <div className="bg-surface rounded-xl border border-white/5 p-6 scan-overlay">
        <div className="grid grid-cols-4 gap-6 justify-items-center">
          {gauges.map(g => <CircularGauge key={g.label} label={g.label} value={g.value} />)}
        </div>
      </div>

      {/* Mini bars */}
      <div className="bg-surface rounded-xl border border-white/5 p-5 space-y-4">
        <div className="mono text-xs text-textmuted mb-2">UTILIZATION BREAKDOWN</div>
        {gauges.map(g => <MiniBar key={g.label} label={g.label} value={g.value} />)}
      </div>

      {/* Sparkline-style history */}
      <div className="bg-surface rounded-xl border border-white/5 p-5">
        <div className="mono text-xs text-textmuted mb-3">CPU HISTORY (last 20 samples)</div>
        <div className="flex items-end gap-0.5 h-12">
          {history.map((h, i) => {
            let color = '#00FF94';
            if (h.cpu > 80) color = '#FF3B5C';
            else if (h.cpu > 50) color = '#FFB800';
            return (
              <div
                key={i}
                className="flex-1 rounded-sm transition-all duration-500"
                style={{ height: `${h.cpu}%`, backgroundColor: color, opacity: 0.4 + (i / history.length) * 0.6 }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
