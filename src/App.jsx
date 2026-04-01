import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity, Cpu, Database, GitBranch, LayoutGrid, MessageSquare,
  Monitor, Network, Play, Radio, Rocket, Settings, GitCommit,
  Zap, ChevronRight, Wifi, AlertCircle, CheckCircle, Info, XCircle, X
} from 'lucide-react';
import AgentHierarchy from './components/AgentHierarchy.jsx';
import LiveTaskFeed from './components/LiveTaskFeed.jsx';
import AgentStatusCards from './components/AgentStatusCards.jsx';
import TaskQueueManager from './components/TaskQueueManager.jsx';
import N8nCommsPanel from './components/N8nCommsPanel.jsx';
import MemoryInspector from './components/MemoryInspector.jsx';
import ResourceMonitor from './components/ResourceMonitor.jsx';
import OneClickControls from './components/OneClickControls.jsx';
import NotificationSystem from './components/NotificationSystem.jsx';
import DeploymentLaunchpad from './components/DeploymentLaunchpad.jsx';
import MissionTracker from './components/MissionTracker.jsx';
import AgentRoleDisplay from './components/AgentRoleDisplay.jsx';
import CrossAgentTimeline from './components/CrossAgentTimeline.jsx';

const NAV_ITEMS = [
  { id: 'hierarchy',    label: 'Agent Hierarchy',     Icon: GitBranch },
  { id: 'feed',         label: 'Live Task Feed',       Icon: Activity },
  { id: 'status',       label: 'Agent Status',         Icon: Monitor },
  { id: 'tasks',        label: 'Task Queue',           Icon: LayoutGrid },
  { id: 'n8n',          label: 'n8n Comms',            Icon: MessageSquare },
  { id: 'memory',       label: 'Memory Inspector',     Icon: Database },
  { id: 'resources',    label: 'Resource Monitor',     Icon: Cpu },
  { id: 'controls',     label: 'One-Click Controls',   Icon: Zap },
  { id: 'notifications',label: 'Notifications',        Icon: Radio },
  { id: 'deployment',   label: 'Deployment Launchpad', Icon: Rocket },
  { id: 'mission',      label: 'Mission Tracker',      Icon: Play },
  { id: 'roles',        label: 'Agent Roles',          Icon: Network },
  { id: 'timeline',     label: 'Cross-Agent Timeline', Icon: GitCommit },
];

function ToastIcon({ type }) {
  if (type === 'success') return <CheckCircle size={16} className="text-accent2" />;
  if (type === 'error')   return <XCircle size={16} className="text-danger" />;
  if (type === 'warning') return <AlertCircle size={16} className="text-warning" />;
  return <Info size={16} className="text-accent" />;
}

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [{ id, message, type }, ...prev]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  }, []);
  const removeToast = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);
  return { toasts, addToast, removeToast };
}

export default function App() {
  const [active, setActive] = useState('hierarchy');
  const [hovered, setHovered] = useState(null);
  const { toasts, addToast, removeToast } = useToast();

  const panels = {
    hierarchy:     <AgentHierarchy addToast={addToast} />,
    feed:          <LiveTaskFeed addToast={addToast} />,
    status:        <AgentStatusCards addToast={addToast} />,
    tasks:         <TaskQueueManager addToast={addToast} />,
    n8n:           <N8nCommsPanel addToast={addToast} />,
    memory:        <MemoryInspector addToast={addToast} />,
    resources:     <ResourceMonitor addToast={addToast} />,
    controls:      <OneClickControls addToast={addToast} />,
    notifications: <NotificationSystem addToast={addToast} />,
    deployment:    <DeploymentLaunchpad addToast={addToast} />,
    mission:       <MissionTracker addToast={addToast} />,
    roles:         <AgentRoleDisplay addToast={addToast} />,
    timeline:      <CrossAgentTimeline addToast={addToast} />,
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="flex flex-col w-[60px] h-full bg-surface border-r border-white/5 z-50 flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center justify-center h-14 border-b border-white/5 flex-shrink-0">
          <div className="node-pulse w-8 h-8 rounded-lg bg-accent/10 border border-accent/40 flex items-center justify-center">
            <span className="mono text-accent font-bold text-xs">NX</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-0.5 py-2 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <div key={id} className="relative group px-2">
              <button
                onClick={() => setActive(id)}
                onMouseEnter={() => setHovered(id)}
                onMouseLeave={() => setHovered(null)}
                className={`w-full flex items-center justify-center h-10 rounded-lg transition-all duration-150 ${
                  active === id
                    ? 'bg-accent/15 text-accent'
                    : 'text-textmuted hover:bg-white/5 hover:text-text'
                }`}
              >
                <Icon size={18} />
              </button>
              {/* Tooltip */}
              {hovered === id && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-surface2 border border-white/10 rounded text-xs mono text-text whitespace-nowrap z-50 pointer-events-none">
                  {label}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Connection status */}
        <div className="flex items-center justify-center h-12 border-t border-white/5 flex-shrink-0">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-accent2 animate-pulse" />
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between h-14 px-6 border-b border-white/5 bg-surface flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="mono text-accent font-bold tracking-widest text-sm">NEXUS</span>
            <span className="text-white/20">//</span>
            <span className="mono text-textmuted text-xs tracking-wider uppercase">
              {NAV_ITEMS.find(n => n.id === active)?.label}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 mono text-xs text-textmuted">
              <Wifi size={12} className="text-accent2" />
              <span>ONLINE</span>
            </div>
            <div className="mono text-xs text-textmuted">
              {new Date().toLocaleTimeString('en-US', { hour12: false })}
            </div>
          </div>
        </header>

        {/* Panel */}
        <div className="flex-1 overflow-auto p-4">
          {panels[active]}
        </div>
      </main>

      {/* Toast container */}
      <div className="fixed top-4 right-4 flex flex-col gap-2 z-[9999] pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="flex items-center gap-3 px-4 py-3 bg-surface2 border border-white/10 rounded-lg shadow-xl animate-slide-in-top pointer-events-auto min-w-[280px] max-w-sm"
          >
            <ToastIcon type={toast.type} />
            <span className="text-sm text-text flex-1">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="text-textmuted hover:text-text transition-colors">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
