import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { KanbanColumn } from "./KanbanColumn";
import { MilestoneCard } from "./MilestoneCard";
import { DetailPanel } from "./DetailPanel";
import { COLUMNS, type ColumnId, type Milestone } from "./types";
import { SAMPLE_MILESTONES } from "./sampleData";

/**
 * KanbanBoard — the heart of the Boost Profits workspace.
 * Manages drag/drop, optimistic state updates, and the side detail panel.
 *
 * Data is local-only for now; wire it to Supabase by replacing
 * `useState(SAMPLE_MILESTONES)` with a query + mutation hook.
 */
export function KanbanBoard() {
  const [items, setItems] = useState<Milestone[]>(SAMPLE_MILESTONES);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const byColumn = useMemo(() => {
    const map: Record<ColumnId, Milestone[]> = {
      todo: [], in_progress: [], client_review: [], invoice_ready: [], invoice_sent: [], paid: [],
    };
    for (const m of items) map[m.column].push(m);
    return map;
  }, [items]);

  const activeMilestone = activeId ? items.find((m) => m.id === activeId) ?? null : null;
  const openMilestone = openId ? items.find((m) => m.id === openId) ?? null : null;

  function findColumn(id: string): ColumnId | null {
    if ((COLUMNS as { id: string }[]).some((c) => c.id === id)) return id as ColumnId;
    return items.find((m) => m.id === id)?.column ?? null;
  }

  function handleDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  // While dragging, optimistically reflect column changes so the user sees
  // the card slot in the new column before they release.
  function handleDragOver(e: DragOverEvent) {
    const { active, over } = e;
    if (!over) return;
    const fromCol = findColumn(String(active.id));
    const toCol = findColumn(String(over.id));
    if (!fromCol || !toCol || fromCol === toCol) return;

    setItems((prev) => prev.map((m) => (m.id === active.id ? { ...m, column: toCol } : m)));
  }

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;

    const activeIdStr = String(active.id);
    const overIdStr = String(over.id);
    if (activeIdStr === overIdStr) return;

    setItems((prev) => {
      const fromIndex = prev.findIndex((m) => m.id === activeIdStr);
      if (fromIndex < 0) return prev;

      // Reorder within / across columns.
      const overIsColumn = (COLUMNS as { id: string }[]).some((c) => c.id === overIdStr);
      const overIndex = overIsColumn
        ? prev.findIndex((m) => m.column === (overIdStr as ColumnId))
        : prev.findIndex((m) => m.id === overIdStr);

      const targetCol = overIsColumn ? (overIdStr as ColumnId) : prev[overIndex]?.column;
      const next = prev.map((m) =>
        m.id === activeIdStr && targetCol ? { ...m, column: targetCol } : m
      );
      if (overIndex < 0 || fromIndex === overIndex) return next;
      return arrayMove(next, fromIndex, overIndex);
    });

    toast.success("Milestone moved", { duration: 1500 });
  }

  function handleAddCard(column: ColumnId) {
    const id = `m_${Date.now()}`;
    const fresh: Milestone = {
      id,
      title: "Untitled milestone",
      client: "New client",
      clientInitials: "NC",
      amount: 0,
      currency: "USD",
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      column,
      tags: [],
    };
    setItems((p) => [fresh, ...p]);
    setOpenId(id);
  }

  function handleChangeColumn(id: string, column: ColumnId) {
    setItems((prev) => prev.map((m) => (m.id === id ? { ...m, column } : m)));
    toast.success("Status updated");
  }

  return (
    <div className="relative">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div className="-mx-4 overflow-x-auto px-4 pb-4 md:-mx-8 md:px-8">
          <div className="flex min-h-[70vh] gap-4">
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col.id}
                column={col}
                milestones={byColumn[col.id]}
                onOpenCard={setOpenId}
                onAddCard={handleAddCard}
              />
            ))}
          </div>
        </div>

        <DragOverlay dropAnimation={{ duration: 200, easing: "cubic-bezier(0.4, 0, 0.2, 1)" }}>
          {activeMilestone ? (
            <div className="w-[296px]">
              <MilestoneCard milestone={activeMilestone} onOpen={() => {}} overlay />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <DetailPanel
        milestone={openMilestone}
        onClose={() => setOpenId(null)}
        onChangeColumn={handleChangeColumn}
      />
    </div>
  );
}
