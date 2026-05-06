// Domain types for the Milestones Kanban board.
// Kept tiny and serializable so the same shape can come from Supabase later.

export type ColumnId =
  | "todo"
  | "in_progress"
  | "client_review"
  | "invoice_ready"
  | "invoice_sent"
  | "paid";

export interface KanbanColumnDef {
  id: ColumnId;
  title: string;
  /** Tailwind classes applied to the column's top accent bar. */
  accent: string;
  /** Short helper text shown in the empty state. */
  emptyHint: string;
}

export interface MilestoneTag {
  label: string;
  tone?: "default" | "priority" | "design" | "dev" | "research";
}

export interface Milestone {
  id: string;
  title: string;
  client: string;
  /** Initials used for the avatar fallback. */
  clientInitials: string;
  amount: number;
  currency: string;
  /** ISO date string. */
  dueDate: string;
  column: ColumnId;
  tags: MilestoneTag[];
  /** 0–100. Optional sub-task progress. */
  progress?: number;
  description?: string;
}

export const COLUMNS: KanbanColumnDef[] = [
  { id: "todo", title: "To Do", accent: "bg-slate-400", emptyHint: "New milestones land here" },
  { id: "in_progress", title: "In Progress", accent: "bg-primary", emptyHint: "Work currently underway" },
  { id: "client_review", title: "Client Review", accent: "bg-orange-500", emptyHint: "Waiting on client approval" },
  { id: "invoice_ready", title: "Invoice Ready", accent: "bg-amber-500", emptyHint: "Approved — ready to bill" },
  { id: "invoice_sent", title: "Invoice Sent", accent: "bg-cyan-500", emptyHint: "Out for payment" },
  { id: "paid", title: "Paid", accent: "bg-emerald-500", emptyHint: "Money in the bank" },
];
