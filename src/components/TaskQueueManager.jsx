import React, { useState } from 'react';
import { tasks as initialTasks } from '../data/mockData.js';
import { Plus, Clock, AlertTriangle } from 'lucide-react';

const PRIORITY_STYLE = {
  critical: { color: '#FF3B5C', label: 'CRIT' },
  high:     { color: '#FFB800', label: 'HIGH' },
  medium:   { color: '#00D4FF', label: 'MED'  },
  low:      { color: '#64748B', label: 'LOW'  },
};

const AGENT_COLOR = { 'agent-zero': '#00D4FF', 'moltis': '#00FF94', 'n8n-bridge': '#FFB800' };
const AGENT_LABEL = { 'agent-zero': 'AZ', 'moltis': 'ML', 'n8n-bridge': 'N8' };

const COLUMNS = [
  { id: 'pending',     label: 'PENDING',     color: '#00D4FF' },
  { id: 'in-progress', label: 'IN PROGRESS', color: '#FFB800' },
  { id: 'done',        label: 'DONE',        color: '#00FF94' },
  { id: 'failed',      label: 'FAILED',      color: '#FF3B5C' },
];

export default function TaskQueueManager() {
  const [tasks, setTasks] = useState(initialTasks);
  const [input, setInput] = useState('');

  const handleAdd = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      setTasks(prev => [{
        id: `t-${Date.now()}`,
        title: input.trim(),
        agent: 'agent-zero',
        status: 'pending',
        created: new Date().toLocaleTimeString('en-US', { hour12: false }).slice(0, 5),
        elapsed: '0m',
        priority: 'medium',
      }, ...prev]);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 rounded bg-accent" />
        <h2 className="mono text-accent font-bold tracking-wider text-sm">TASK QUEUE MANAGER</h2>
        <span className="mono text-xs text-textmuted ml-auto">{tasks.length} total tasks</span>
      </div>

      <div className="flex items-center gap-2 bg-surface rounded-xl border border-white/5 px-4 py-2.5">
        <Plus size={14} className="text-textmuted" />
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleAdd}
          placeholder="Inject new task... (press Enter)"
          className="flex-1 bg-transparent mono text-sm text-text placeholder-textmuted outline-none"
        />
      </div>

      <div className="grid grid-cols-4 gap-3 flex-1 overflow-hidden">
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} className="flex flex-col gap-2 min-h-0">
              <div className="flex items-center justify-between px-1">
                <span className="mono text-xs font-bold" style={{ color: col.color }}>{col.label}</span>
                <div
                  className="mono text-xs px-2 py-0.5 rounded-full font-bold"
                  style={{ backgroundColor: col.color + '20', color: col.color }}
                >
                  {colTasks.length}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2">
                {colTasks.map(task => {
                  const pr = PRIORITY_STYLE[task.priority] || PRIORITY_STYLE.medium;
                  const agColor = AGENT_COLOR[task.agent] || '#64748B';
                  return (
                    <div
                      key={task.id}
                      className="bg-surface rounded-lg border border-white/5 p-3 hover:border-white/10 transition-all"
                    >
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: agColor }} />
                        <span className="mono text-xs font-bold" style={{ color: agColor }}>
                          {AGENT_LABEL[task.agent]}
                        </span>
                        <div
                          className="ml-auto mono text-xs px-1.5 py-0.5 rounded border"
                          style={{ color: pr.color, borderColor: pr.color + '50', backgroundColor: pr.color + '15' }}
                        >
                          {pr.label}
                        </div>
                      </div>
                      <div className="mono text-xs text-text mb-2 leading-snug">{task.title}</div>
                      <div className="flex items-center gap-2">
                        <Clock size={10} className="text-textmuted" />
                        <span className="mono text-xs text-textmuted">{task.elapsed || task.created}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
