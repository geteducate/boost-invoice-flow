import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";

export const Route = createFileRoute("/app/milestones")({
  head: () => ({ meta: [{ title: "Milestones — Boost Profits" }] }),
  component: MilestonesPage,
});

function MilestonesPage() {
  return (
    <AppShell
      title="Milestones"
      subtitle="Drag any milestone through the workflow — billing follows automatically."
      actions={
        <>
          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search milestones, clients…"
              className="h-9 w-64 rounded-lg border border-border bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <Button className="bg-cta text-primary-foreground">
            <Plus className="mr-1.5 h-4 w-4" /> New milestone
          </Button>
        </>
      }
    >
      <KanbanBoard />
    </AppShell>
  );
}
