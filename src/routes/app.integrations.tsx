import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Cloud, Mail, CreditCard, Webhook, BarChart3, Database, Check, Settings2, Plug } from "lucide-react";

export const Route = createFileRoute("/app/integrations")({
  head: () => ({ meta: [{ title: "Integrations — Boost Profits" }] }),
  component: IntegrationsPage,
});

type Integration = {
  i: typeof Cloud;
  n: string;
  d: string;
  c: boolean;
  hint?: string;
};

const initial: Integration[] = [
  { i: Cloud, n: "Google Sheets", d: "Sync leads, invoices and payments to a sheet.", c: true, hint: "Connected to billing-2026.xlsx" },
  { i: Mail, n: "Email (SMTP)", d: "Send branded reminders from your domain.", c: true, hint: "smtp.boostprofits.app" },
  { i: CreditCard, n: "Stripe", d: "Collect card and ACH payments instantly.", c: false },
  { i: Webhook, n: "Webhooks", d: "Trigger external workflows on payment events.", c: false },
  { i: BarChart3, n: "Plausible / GA4", d: "Forward signup conversions to analytics.", c: false },
  { i: Database, n: "HubSpot CRM", d: "Two-way sync clients and pipeline stage.", c: false },
];

function IntegrationsPage() {
  const [items, setItems] = useState<Integration[]>(initial);
  const [pending, setPending] = useState<string | null>(null);
  const [managing, setManaging] = useState<Integration | null>(null);

  const connect = async (name: string) => {
    setPending(name);
    await new Promise((r) => setTimeout(r, 700));
    setItems((arr) => arr.map((x) => (x.n === name ? { ...x, c: true, hint: "Connected just now" } : x)));
    setPending(null);
    toast.success(`${name} connected`, { description: "You'll start seeing data within a minute." });
  };

  const disconnect = (name: string) => {
    setItems((arr) => arr.map((x) => (x.n === name ? { ...x, c: false, hint: undefined } : x)));
    setManaging(null);
    toast(`${name} disconnected`, { description: "You can reconnect at any time." });
  };

  return (
    <AppShell title="Integrations" subtitle="Connect Boost Profits to the tools you already use.">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <div key={it.n} className="card-premium lift p-6">
            <div className="flex items-start justify-between">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/8 text-primary"><it.i className="h-5 w-5" /></span>
              {it.c && <span className="inline-flex items-center gap-1 rounded-full bg-success/12 px-2 py-0.5 text-[11px] font-semibold text-success"><Check className="h-3 w-3" />Connected</span>}
            </div>
            <h3 className="mt-5 text-base font-bold">{it.n}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{it.d}</p>
            {it.hint && <p className="mt-2 text-xs text-muted-foreground/80">{it.hint}</p>}
            <Button
              className={`mt-5 w-full ${it.c ? "" : "bg-cta text-primary-foreground"}`}
              variant={it.c ? "outline" : "default"}
              disabled={pending === it.n}
              onClick={() => (it.c ? setManaging(it) : connect(it.n))}
            >
              {pending === it.n ? (
                "Connecting…"
              ) : it.c ? (
                <><Settings2 className="mr-1.5 h-4 w-4" /> Manage</>
              ) : (
                <><Plug className="mr-1.5 h-4 w-4" /> Connect</>
              )}
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={!!managing} onOpenChange={(o) => !o && setManaging(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage {managing?.n}</DialogTitle>
            <DialogDescription>{managing?.hint || "Active integration."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">{managing?.d}</p>
          </div>
          <DialogFooter className="gap-2 sm:justify-between">
            <Button variant="outline" onClick={() => setManaging(null)}>Close</Button>
            <Button variant="destructive" onClick={() => managing && disconnect(managing.n)}>Disconnect</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
