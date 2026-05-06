import { Bell, FileText, Wallet, X } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import type { Milestone } from "./types";
import { COLUMNS } from "./types";

interface Props {
  milestone: Milestone | null;
  onClose: () => void;
  onChangeColumn: (id: string, column: Milestone["column"]) => void;
}

export function DetailPanel({ milestone, onClose, onChangeColumn }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const open = !!milestone;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden
      />

      <aside
        role="dialog"
        aria-label="Milestone details"
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {milestone && (
          <>
            <header className="flex items-start justify-between gap-3 border-b border-border px-6 py-5">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {milestone.client}
                </p>
                <h2 className="mt-1 text-xl font-bold tracking-tight">{milestone.title}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Amount" value={`$${milestone.amount.toLocaleString()}`} />
                <Field
                  label="Due"
                  value={new Date(milestone.dueDate).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </label>
                <select
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium"
                  value={milestone.column}
                  onChange={(e) =>
                    onChangeColumn(milestone.id, e.target.value as Milestone["column"])
                  }
                >
                  {COLUMNS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {typeof milestone.progress === "number" && (
                <div>
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-semibold text-muted-foreground">Progress</span>
                    <span className="tabular-nums font-semibold">{milestone.progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-500"
                      style={{ width: `${milestone.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {milestone.description && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Description
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                    {milestone.description}
                  </p>
                </div>
              )}

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Activity
                </p>
                <ul className="mt-3 space-y-3 text-xs text-muted-foreground">
                  <li>· Milestone created 6 days ago</li>
                  <li>· Moved to {COLUMNS.find((c) => c.id === milestone.column)?.title} today</li>
                  <li>· Last reminder sent 2 days ago</li>
                </ul>
              </div>
            </div>

            <footer className="grid grid-cols-3 gap-2 border-t border-border bg-muted/30 px-6 py-4">
              <PanelButton
                icon={FileText}
                label="Invoice"
                onClick={() => toast.success("Invoice drafted")}
              />
              <PanelButton
                icon={Bell}
                label="Remind"
                onClick={() => toast.success("Reminder sent")}
              />
              <PanelButton
                icon={Wallet}
                label="Mark paid"
                primary
                onClick={() => onChangeColumn(milestone.id, "paid")}
              />
            </footer>
          </>
        )}
      </aside>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-bold tabular-nums">{value}</p>
    </div>
  );
}

function PanelButton({
  icon: Icon,
  label,
  onClick,
  primary,
}: {
  icon: typeof Bell;
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
        primary
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "border border-border bg-background hover:bg-muted"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
