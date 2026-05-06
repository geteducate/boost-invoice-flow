import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { Plus, MoreHorizontal, Inbox } from "lucide-react";
import { toast } from "sonner";
import { MilestoneCard } from "./MilestoneCard";
import type { KanbanColumnDef, Milestone } from "./types";
import { cn } from "@/lib/utils";

interface Props {
  column: KanbanColumnDef;
  milestones: Milestone[];
  onOpenCard: (id: string) => void;
  onAddCard: (columnId: KanbanColumnDef["id"]) => void;
}

export function KanbanColumn({ column, milestones, onOpenCard, onAddCard }: Props) {
  const total = milestones.reduce((sum, m) => sum + m.amount, 0);
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column", columnId: column.id },
  });

  return (
    <section
      className={cn(
        "flex h-full w-[320px] shrink-0 flex-col rounded-2xl border border-border bg-muted/30 transition-colors",
        isOver && "border-primary/40 bg-primary/5"
      )}
      aria-label={`${column.title} column`}
    >
      {/* Column header */}
      <header className="flex items-center gap-2 border-b border-border/60 px-4 pt-4 pb-3">
        <span className={cn("h-2.5 w-2.5 rounded-full", column.accent)} aria-hidden />
        <h3 className="text-sm font-semibold tracking-tight">{column.title}</h3>
        <span className="rounded-full bg-background px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
          {milestones.length}
        </span>
        <span className="ml-auto text-[11px] font-semibold tabular-nums text-muted-foreground">
          {total > 0 ? `$${total.toLocaleString()}` : ""}
        </span>
        <button
          type="button"
          aria-label="Column options"
          onClick={() => toast("Column settings coming soon")}
          className="rounded-md p-1 text-muted-foreground hover:bg-background hover:text-foreground"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </header>

      {/* Cards */}
      <div
        ref={setNodeRef}
        className={cn(
          "relative flex-1 space-y-3 overflow-y-auto px-3 py-3 transition-colors",
          isOver && "ring-2 ring-inset ring-primary/30 ring-dashed rounded-b-2xl"
        )}
      >
        <SortableContext items={milestones.map((m) => m.id)} strategy={verticalListSortingStrategy}>
          {milestones.map((m) => (
            <MilestoneCard key={m.id} milestone={m} onOpen={onOpenCard} />
          ))}
        </SortableContext>

        {milestones.length === 0 && (
          <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border/70 text-center text-xs text-muted-foreground">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background">
              <Inbox className="h-4 w-4" />
            </span>
            <p className="px-4">{column.emptyHint}</p>
            <button
              type="button"
              onClick={() => onAddCard(column.id)}
              className="text-xs font-semibold text-primary hover:underline"
            >
              + Add milestone
            </button>
          </div>
        )}
      </div>

      {/* Footer add */}
      <button
        type="button"
        onClick={() => onAddCard(column.id)}
        className="m-2 flex items-center justify-center gap-1.5 rounded-xl border border-transparent px-3 py-2 text-xs font-semibold text-muted-foreground hover:border-border hover:bg-background hover:text-foreground"
      >
        <Plus className="h-3.5 w-3.5" /> Add milestone
      </button>
    </section>
  );
}
