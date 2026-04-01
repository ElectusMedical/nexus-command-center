import React, { useState } from 'react';
import { Rocket, ExternalLink, RefreshCw } from 'lucide-react';
import { deploymentServices } from '../data/mockData.js';

const STATUS_CONFIG = {
  running:   { color: '#00FF94', label: 'RUNNING',   pulse: true },
  deploying: { color: '#FFB800', label: 'DEPLOYING', pulse: true },
  down:      { color: '#FF3B5C', label: 'DOWN',      pulse: false },
};

export default function DeploymentLaunchpad({ addToast }) {
  const [lastRefresh, setLastRefresh] = useState(new Date().toLocaleTimeString());

  const handleRefresh = () => {
    setLastRefresh(new Date().toLocaleTimeString());
    addToast && addToast('Service status refreshed', 'info');
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Rocket size={16} className="text-accent" />
          <span className="panel-header">Deployment Launchpad // Service Registry</span>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-surface2 rounded-lg font-mono text-xs text-textmuted hover:text-accent hover:border-accent transition-colors"
        >
          <RefreshCw size={11} /> REFRESH
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="flex flex-col gap-3">
          {deploymentServices.map(svc => {
            const sc = STATUS_CONFIG[svc.status] || STATUS_CONFIG.down;
            return (
              <div
                key={svc.id}
                className="bg-surface rounded-xl border border-surface2 px-5 py-4 flex items-center gap-4 transition-all duration-200"
                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 16px ${sc.color}15`}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <div className="flex-shrink-0">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${sc.pulse ? 'animate-pulse' : ''}`}
                    style={{ backgroundColor: sc.color, boxShadow: `0 0 6px ${sc.color}` }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-sm font-semibold text-textmain">{svc.name}</span>
                    <span className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ color: '#64748B', backgroundColor: '#64748B15' }}>{svc.type}</span>
                    <span className="font-mono text-xs text-textmuted">{svc.version}</span>
                  </div>
                  <div className="font-mono text-xs text-textmuted">Checked: {svc.lastChecked}</div>
                </div>
                <span
                  className="font-mono text-xs px-2 py-1 rounded border flex-shrink-0"
                  style={{ color: sc.color, borderColor: sc.color + '40', backgroundColor: sc.color + '10' }}
                >
                  {sc.label}
                </span>
                {svc.url && (
                  <a
                    href={svc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 font-mono text-xs text-accent hover:text-textmain transition-colors flex-shrink-0"
                  >
                    <ExternalLink size={11} /> OPEN
                  </a>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex gap-4 p-4 bg-surface rounded-xl border border-surface2">
          <span className="font-mono text-xs text-accent2">{deploymentServices.filter(s => s.status === 'running').length} RUNNING</span>
          <span className="font-mono text-xs text-warning">{deploymentServices.filter(s => s.status === 'deploying').length} DEPLOYING</span>
          <span className="font-mono text-xs text-danger">{deploymentServices.filter(s => s.status === 'down').length} DOWN</span>
          <span className="ml-auto font-mono text-xs text-textmuted">Last refresh: {lastRefresh}</span>
        </div>
      </div>
    </div>
  );
}
