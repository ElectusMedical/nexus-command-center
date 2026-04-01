import React, { useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Handle,
  Position,
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { agents } from '../data/mockData.js';

const STATUS_COLOR = { active: '#00FF94', idle: '#FFB800', error: '#FF3B5C' };

function AgentNode({ data }) {
  const ag = data.agent;
  const statusColor = STATUS_COLOR[ag.status] || '#64748B';
  return (
    <div
      className="bg-surface2 border rounded-xl px-4 py-3 w-52 relative"
      style={{ borderColor: ag.color + '60', boxShadow: `0 0 18px ${ag.color}25` }}
    >
      <Handle type="target" position={Position.Top} style={{ background: ag.color, border: 'none', width: 8, height: 8 }} />
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm mono flex-shrink-0"
          style={{ backgroundColor: ag.color + '20', color: ag.color }}
        >
          {ag.avatar}
        </div>
        <div>
          <div className="text-text text-sm font-semibold leading-tight">{ag.name}</div>
          <div className="mono text-textmuted text-xs">{ag.role}</div>
        </div>
      </div>
      <div className="flex items-center justify-between mb-1">
        <span className="mono text-xs" style={{ color: statusColor }}>
          ● {ag.status.toUpperCase()}
        </span>
        <span className="mono text-xs text-textmuted">{ag.uptime}</span>
      </div>
      <div className="mono text-xs text-textmuted truncate" title={ag.currentTask}>
        {ag.currentTask}
      </div>
      <div className="mt-2 flex gap-2">
        <div className="bg-background rounded px-1.5 py-0.5">
          <span className="mono text-xs text-textmuted">{ag.tasksCompleted} done</span>
        </div>
        <div className="bg-background rounded px-1.5 py-0.5">
          <span className="mono text-xs" style={{ color: ag.color }}>{ag.tasksActive} active</span>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: ag.color, border: 'none', width: 8, height: 8 }} />
    </div>
  );
}

function AnimatedEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }) {
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  return (
    <>
      <BaseEdge id={id} path={edgePath} style={{ stroke: data?.color || '#00D4FF', strokeWidth: 1.5, strokeOpacity: 0.6 }} />
      <path d={edgePath} fill="none" stroke={data?.color || '#00D4FF'} strokeWidth={1.5}
        strokeDasharray="6 3" style={{ strokeOpacity: 0.9 }}>
        <animate attributeName="stroke-dashoffset" from="36" to="0" dur="1.5s" repeatCount="indefinite" />
      </path>
    </>
  );
}

const nodeTypes = { agentNode: AgentNode };
const edgeTypes = { animated: AnimatedEdge };

const initialNodes = [
  { id: 'agent-zero', type: 'agentNode', position: { x: 200, y: 40 },  data: { agent: agents[0] } },
  { id: 'moltis',     type: 'agentNode', position: { x: 30,  y: 230 }, data: { agent: agents[1] } },
  { id: 'n8n-bridge', type: 'agentNode', position: { x: 370, y: 230 }, data: { agent: agents[2] } },
];

const initialEdges = [
  { id: 'e1', source: 'agent-zero', target: 'moltis',     type: 'animated', data: { color: '#00FF94' } },
  { id: 'e2', source: 'agent-zero', target: 'n8n-bridge', type: 'animated', data: { color: '#FFB800' } },
];

function Flow() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      fitViewOptions={{ padding: 0.3 }}
      proOptions={{ hideAttribution: true }}
    >
      <Background color="#1a2540" gap={24} size={1} />
      <Controls style={{ bottom: 8, right: 8, left: 'unset' }} />
    </ReactFlow>
  );
}

export default function AgentHierarchy() {
  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 rounded bg-accent" />
        <h2 className="mono text-accent font-bold tracking-wider text-sm">AGENT HIERARCHY</h2>
        <span className="mono text-xs text-textmuted ml-auto">{agents.length} nodes active</span>
      </div>
      <div className="flex-1 bg-surface rounded-xl border border-white/5 overflow-hidden scan-overlay" style={{ minHeight: 400 }}>
        <ReactFlowProvider>
          <Flow />
        </ReactFlowProvider>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {agents.map(ag => (
          <div key={ag.id} className="bg-surface rounded-lg border border-white/5 p-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLOR[ag.status] }} />
            <span className="mono text-xs text-text">{ag.name}</span>
            <span className="mono text-xs text-textmuted ml-auto">{ag.model}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
