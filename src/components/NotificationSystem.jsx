import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, Bell, Trash2 } from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  { id: 1, type: 'success', title: 'Memory Sweep Complete', message: '34 memories pruned, 12 consolidated.', time: '17:57:44' },
  { id: 2, type: 'error',   title: 'Login Flow Failed',     message: 'CAPTCHA detected on staging.auth.example.com', time: '18:05:11' },
  { id: 3, type: 'warning', title: 'n8n Message Held',      message: 'Email attachment exceeds size limit (2.4MB)', time: '17:30:00' },
  { id: 4, type: 'info',    title: 'New Task Queued',        message: 'Deploy NEXUS to Cloudflare Pages created', time: '17:54:33' },
  { id: 5, type: 'success', title: 'Amazon Extract Done',   message: '1,247 products extracted and saved to disk', time: '18:02:44' },
  { id: 6, type: 'warning', title: 'Discord Webhook Missing','message': 'Discord webhook URL not configured in n8n', time: '15:45:33' },
  { id: 7, type: 'success', title: 'Daily Digest Sent',     message: 'Message delivered to @nexus_ops channel', time: '18:10:20' },
  { id: 8, type: 'error',   title: 'Webhook Timeout',       message: 'n8n webhook endpoint failed after 30s', time: '18:00:15' },
  { id: 9, type: 'info',    title: 'GitHub PRs Pending',    message: '2 pull requests awaiting review', time: '17:56:22' },
  { id: 10,'type': 'success','title': 'CPU Alert Resolved', message: 'srv849550 CPU returned to normal levels', time: '17:58:00' },
];

const TYPE_CONFIG = {
  success: { Icon: CheckCircle, color: '#00FF94', bg: '#00FF9415', border: '#00FF9430', label: 'SUCCESS' },
  error:   { Icon: XCircle,     color: '#FF3B5C', bg: '#FF3B5C15', border: '#FF3B5C30', label: 'ERROR'   },
  warning: { Icon: AlertCircle, color: '#FFB800', bg: '#FFB80015', border: '#FFB80030', label: 'WARN'    },
  info:    { Icon: Info,        color: '#00D4FF', bg: '#00D4FF15', border: '#00D4FF30', label: 'INFO'    },
};

export default function NotificationSystem({ addToast }) {
  const [notifs, setNotifs] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? notifs : notifs.filter(n => n.type === filter);

  const dismiss = (id) => setNotifs(prev => prev.filter(n => n.id !== id));
  const clearAll = () => setNotifs([]);

  const testToast = (type) => {
    if (addToast) addToast(`Test ${type} notification fired at ${new Date().toLocaleTimeString()}`, type);
  };

  const counts = { all: notifs.length, success: 0, error: 0, warning: 0, info: 0 };
  notifs.forEach(n => { if (counts[n.type] !== undefined) counts[n.type]++; });

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 rounded bg-accent" />
        <h2 className="mono text-accent font-bold tracking-wider text-sm">NOTIFICATION SYSTEM</h2>
        <div className="flex items-center gap-1.5 ml-2">
          <Bell size={12} className="text-textmuted" />
          <span className="mono text-xs text-textmuted">{notifs.length} total</span>
        </div>
        {notifs.length > 0 && (
          <button
            onClick={clearAll}
            className="ml-auto flex items-center gap-1.5 mono text-xs text-textmuted hover:text-danger transition-colors"
          >
            <Trash2 size={12} />
            Clear all
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {Object.entries(counts).map(([type, count]) => {
          const cfg = TYPE_CONFIG[type];
          const isActive = filter === type;
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg mono text-xs transition-all ${
                isActive ? 'bg-white/10 text-text' : 'text-textmuted hover:text-text hover:bg-white/5'
              }`}
            >
              <span className="capitalize">{type}</span>
              <span
                className="px-1.5 py-0.5 rounded-full text-xs"
                style={cfg ? { backgroundColor: cfg.color + '20', color: cfg.color } : { backgroundColor: '#ffffff15', color: '#64748B' }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Test buttons */}
      <div className="flex gap-2">
        {['success','error','warning','info'].map(type => {
          const cfg = TYPE_CONFIG[type];
          return (
            <button
              key={type}
              onClick={() => testToast(type)}
              className="flex-1 py-1.5 rounded-lg mono text-xs transition-all border"
              style={{ color: cfg.color, borderColor: cfg.border, backgroundColor: cfg.bg }}
            >
              Test {type}
            </button>
          );
        })}
      </div>

      {/* Notification list */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filtered.length === 0 && (
          <div className="flex items-center justify-center h-32 mono text-xs text-textmuted">
            No notifications
          </div>
        )}
        {filtered.map(notif => {
          const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.info;
          const { Icon } = cfg;
          return (
            <div
              key={notif.id}
              className="flex items-start gap-3 bg-surface rounded-xl border p-4 animate-fade-in group"
              style={{ borderColor: cfg.border }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: cfg.bg }}
              >
                <Icon size={15} style={{ color: cfg.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="mono text-xs font-bold text-text">{notif.title}</span>
                  <span
                    className="mono text-xs px-1.5 py-0.5 rounded border"
                    style={{ color: cfg.color, borderColor: cfg.border, backgroundColor: cfg.bg }}
                  >
                    {cfg.label}
                  </span>
                  <span className="mono text-xs text-textmuted ml-auto">{notif.time}</span>
                </div>
                <p className="mono text-xs text-textmuted">{notif.message}</p>
              </div>
              <button
                onClick={() => dismiss(notif.id)}
                className="text-textmuted hover:text-danger transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
              >
                <XCircle size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
