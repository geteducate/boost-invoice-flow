import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Archive, Bell, FileText, Pencil } from "lucide-react";
import { memo } from "react";
import { toast } from "sonner";
import type { Milestone } from "./types";
import { cn } from "@/lib/utils";

interface Props {
  milestone: Milestone;
  onOpen: (id: string) => void;
  /** When true, render a static (non-sortable) ghost — used for the drag overlay. */
  overlay?: boolean;
}

const tagToneClass: Record<string, string> = {
  priority: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  design: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20",
  dev: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  research: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  default: "bg-muted text-muted-foreground border-border",
};

function formatDue(iso: string) {
  const due = new Date(iso);
  const now = new Date();
  const diff = Math.round((due.getTime() - now.setHours(0, 0, 0, 0)) / 86400000);
  const label = due.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  if (diff < 0) return { label: `${label} · ${Math.abs(diff)}d overdue`, tone: "overdue" as const };
  if (diff <= 3) return { label: `${label} · due in ${diff}d`, tone: "soon" as const };
  return { label, tone: "ok" as const };
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function MilestoneCardImpl({ milestone, onOpen, overlay }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: milestone.id,
    data: { type: "milestone", milestone },
    disabled: overlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const due = formatDue(milestone.dueDate);

  return (
    <article
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        // Don't open the panel when the click came from a quick action.
        if ((e.target as HTMLElement).closest("[data-quick-action]")) return;
        onOpen(milestone.id);
      }}
      className={cn(
        "group relative cursor-grab touch-none rounded-2xl border border-border bg-card p-4 text-left shadow-sm",
        "transition-all duration-200 ease-out hover:-translate-y-1.5 hover:shadow-lg hover:border-primary/30",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        isDragging && !overlay && "opacity-40",
        overlay && "rotate-2 scale-[1.03] shadow-2xl ring-2 ring-primary/30 cursor-grabbing"
      )}
      tabIndex={0}
    >
      {/* Header: title + amount */}
      <div className="flex items-start justify-between gap-3">
        <h4 className="line-clamp-1 text-sm font-semibold tracking-tight text-foreground">{milestone.title}</h4>
        <span className="shrink-0 text-base font-bold tabular-nums text-foreground">
          {formatMoney(milestone.amount, milestone.currency)}
        </span>
      </div>

      {/* Client */}
      <div className="mt-3 flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
          {milestone.clientInitials}
        </span>
        <span className="truncate text-xs text-muted-foreground">{milestone.client}</span>
      </div>

      {/* Progress */}
      {typeof milestone.progress === "number" && (
        <div className="mt-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-500 transition-[width] duration-500"
              style={{ width: `${milestone.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer: tags + due */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {milestone.tags.slice(0, 3).map((t) => (
          <span
            key={t.label}
            className={cn(
              "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold",
              tagToneClass[t.tone ?? "default"]
            )}
          >
            {t.label}
          </span>
        ))}
        <span
          className={cn(
            "ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
            due.tone === "overdue" && "bg-destructive/10 text-destructive",
            due.tone === "soon" && "bg-orange-500/10 text-orange-600 dark:text-orange-400",
            due.tone === "ok" && "text-muted-foreground"
          )}
        >
          {due.label}
        </span>
      </div>

      {/* Quick actions (fade in on hover) */}
      {!overlay && (
        <div
          data-quick-action
          className="pointer-events-none absolute right-3 top-3 flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100"
        >
          <QuickAction icon={Pencil} label="Edit" onClick={() => onOpen(milestone.id)} />
          <QuickAction
            icon={FileText}
            label="Create invoice"
            onClick={() => toast.success(`Invoice drafted for ${milestone.client}`)}
          />
          <QuickAction
            icon={Bell}
            label="Send reminder"
            onClick={() => toast.success("Reminder sent")}
          />
          <QuickAction
            icon={Archive}
            label="Archive"
            onClick={() => toast("Archived", { description: milestone.title })}
          />
        </div>
      )}
    </article>
  );
}

function QuickAction({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Pencil;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      data-quick-action
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="rounded-md border border-border bg-background/95 p-1.5 text-muted-foreground shadow-sm hover:bg-primary hover:text-primary-foreground hover:border-primary"
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

export const MilestoneCard = memo(MilestoneCardImpl);
