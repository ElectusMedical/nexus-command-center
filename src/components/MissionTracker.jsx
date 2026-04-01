import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { missionCards } from '../data/mockData.js';
import { GripVertical } from 'lucide-react';

const COLUMNS = [
  { id: 'briefed',     label: 'BRIEFED',     color: '#64748B' },
  { id: 'in-progress', label: 'IN PROGRESS', color: '#FFB800' },
  { id: 'review',      label: 'REVIEW',      color: '#00D4FF' },
  { id: 'done',        label: 'DONE',        color: '#00FF94' },
];

const PRIORITY_STYLE = {
  critical: { color: '#FF3B5C', label: 'CRIT' },
  high:     { color: '#FFB800', label: 'HIGH' },
  medium:   { color: '#00D4FF', label: 'MED'  },
  low:      { color: '#64748B', label: 'LOW'  },
};

const AGENT_COLOR = {
  'agent-zero': '#00D4FF',
  'moltis':     '#00FF94',
  'n8n-bridge': '#FFB800',
};
const AGENT_LABEL = {
  'agent-zero': 'Agent Zero',
  'moltis':     'Moltis',
  'n8n-bridge': 'n8n Bridge',
};

function KanbanCard({ card, isDragging }) {
  const pr = PRIORITY_STYLE[card.priority] || PRIORITY_STYLE.medium;
  const agColor = AGENT_COLOR[card.agent] || '#64748B';
  return (
    <div
      className="bg-surface2 rounded-xl border border-white/5 p-3 select-none"
      style={{
        opacity: isDragging ? 0.4 : 1,
        boxShadow: isDragging ? `0 0 20px ${agColor}30` : undefined,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: agColor }} />
        <span className="mono text-xs" style={{ color: agColor }}>{AGENT_LABEL[card.agent]}</span>
        <div
          className="ml-auto mono text-xs px-1.5 py-0.5 rounded border"
          style={{ color: pr.color, borderColor: pr.color + '50', backgroundColor: pr.color + '15' }}
        >
          {pr.label}
        </div>
      </div>
      <p className="mono text-xs text-text leading-snug">{card.title}</p>
    </div>
  );
}

function SortableCard({ card }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} className="flex items-start gap-1 group">
      <button
        {...attributes}
        {...listeners}
        className="mt-3 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing text-textmuted"
      >
        <GripVertical size={12} />
      </button>
      <div className="flex-1">
        <KanbanCard card={card} isDragging={isDragging} />
      </div>
    </div>
  );
}

export default function MissionTracker() {
  const [cards, setCards] = useState(missionCards);
  const [activeCard, setActiveCard] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = ({ active }) => {
    setActiveCard(cards.find(c => c.id === active.id));
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveCard(null);
    if (!over || active.id === over.id) return;
    // Check if dropped on a column
    const targetCol = COLUMNS.find(c => c.id === over.id);
    if (targetCol) {
      setCards(prev => prev.map(c => c.id === active.id ? { ...c, column: targetCol.id } : c));
    } else {
      // Dropped on another card - move within same column
      const overCard = cards.find(c => c.id === over.id);
      if (overCard && overCard.column !== cards.find(c => c.id === active.id)?.column) {
        setCards(prev => prev.map(c => c.id === active.id ? { ...c, column: overCard.column } : c));
      }
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 rounded bg-accent" />
        <h2 className="mono text-accent font-bold tracking-wider text-sm">MISSION TRACKER</h2>
        <span className="mono text-xs text-textmuted ml-auto">{cards.length} cards · drag to move</span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-4 gap-3 flex-1 overflow-hidden">
          {COLUMNS.map(col => {
            const colCards = cards.filter(c => c.column === col.id);
            return (
              <div key={col.id} className="flex flex-col gap-2 min-h-0">
                <div className="flex items-center justify-between px-1">
                  <span className="mono text-xs font-bold" style={{ color: col.color }}>{col.label}</span>
                  <div
                    className="mono text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{ backgroundColor: col.color + '20', color: col.color }}
                  >
                    {colCards.length}
                  </div>
                </div>
                <div
                  id={col.id}
                  className="flex-1 bg-surface rounded-xl border border-white/5 p-2 overflow-y-auto min-h-[100px] space-y-2"
                  style={{ borderColor: col.color + '20' }}
                >
                  <SortableContext items={colCards.map(c => c.id)} strategy={verticalListSortingStrategy}>
                    {colCards.map(card => <SortableCard key={card.id} card={card} />)}
                  </SortableContext>
                  {colCards.length === 0 && (
                    <div className="flex items-center justify-center h-20 mono text-xs text-textmuted/40">
                      Drop here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <DragOverlay>
          {activeCard ? <KanbanCard card={activeCard} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
