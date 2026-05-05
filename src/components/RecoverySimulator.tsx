import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight, BadgeCheck, Bell, CalendarClock, CheckCircle2, Clock, FileText,
  Info, Lock, Radio, ShieldCheck, Sparkles, TrendingUp, Wallet, Workflow, Zap,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

/* Animated counter */
function useCountUp(value: number, duration = 900) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const startRef = useRef<number | null>(null);
  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    startRef.current = null;
    let raf = 0;
    const tick = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const p = Math.min(1, (t - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return display;
}

const fmt = (n: number) => `$${Math.round(n).toLocaleString()}`;
const fmtCompact = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${Math.round(n)}`;
};

const CLIENTS = ["Northwind Studio", "Lumen Group", "Atrium Co", "Halo Labs", "Vertex Media", "Foxglove", "Polaris Co", "Bright & Co"];

export function RecoverySimulator() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [volume, setVolume] = useState(24);
  const [avgValue, setAvgValue] = useState(1800);
  const [latePct, setLatePct] = useState(38);
  const [daysLate, setDaysLate] = useState(18);
  const [reminders, setReminders] = useState(true);
  const [milestones, setMilestones] = useState(true);
  const [scope, setScope] = useState(false);

  const result = useMemo(() => {
    const monthlyBilled = volume * avgValue;
    const lateAmount = monthlyBilled * (latePct / 100);
    let lift = 0;
    if (reminders) lift += 0.34;
    if (milestones) lift += 0.22;
    if (scope) lift += 0.11;
    lift = Math.min(lift, 0.72);
    const recovered = lateAmount * lift;
    const overdueReductionPct = Math.round(lift * 100 * 0.78);
    const hoursSaved = Math.round(volume * (reminders ? 0.55 : 0.18) + (milestones ? 4 : 0));
    const newDaysLate = Math.max(2, Math.round(daysLate * (1 - lift * 0.7)));
    const annualRecovery = recovered * 12;
    // "score" 0-100 based on adoption + lift quality
    const score = Math.round(
      Math.min(100, lift * 100 + (reminders ? 4 : 0) + (milestones ? 4 : 0) + (scope ? 3 : 0)),
    );
    return { monthlyBilled, lateAmount, recovered, overdueReductionPct, hoursSaved, newDaysLate, annualRecovery, lift, score };
  }, [volume, avgValue, latePct, daysLate, reminders, milestones, scope]);

  const recoveredAnim = useCountUp(result.recovered);
  const annualAnim = useCountUp(result.annualRecovery);
  const reduceAnim = useCountUp(result.overdueReductionPct);
  const hoursAnim = useCountUp(result.hoursSaved);
  const scoreAnim = useCountUp(result.score, 700);

  const months = 12;
  const series = useMemo(() => {
    const current: number[] = [];
    const improved: number[] = [];
    for (let i = 0; i < months; i++) {
      const seasonal = 1 + Math.sin((i / months) * Math.PI * 2) * 0.06;
      const baseLate = result.lateAmount * seasonal;
      current.push(baseLate);
      const monthRecover = result.recovered * seasonal;
      improved.push(Math.max(0, baseLate - monthRecover));
    }
    return { current, improved };
  }, [result.lateAmount, result.recovered]);

  /* Live "invoice paid" ticker */
  type Tick = { id: number; client: string; amount: number };
  const [ticks, setTicks] = useState<Tick[]>([]);
  const idRef = useRef(0);
  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => {
      const amount = Math.round(avgValue * (0.5 + Math.random() * 1.5));
      const client = CLIENTS[Math.floor(Math.random() * CLIENTS.length)];
      idRef.current += 1;
      setTicks((prev) => [{ id: idRef.current, client, amount }, ...prev].slice(0, 5));
    }, 1800);
    return () => clearInterval(interval);
  }, [inView, avgValue]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-[oklch(0.14_0.04_265)] text-white">
      {/* atmospheric backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/3 h-[560px] w-[560px] rounded-full bg-[oklch(0.62_0.18_250/0.35)] blur-[120px]" />
        <div className="absolute bottom-[-200px] right-[-100px] h-[600px] w-[600px] rounded-full bg-[oklch(0.55_0.22_300/0.28)] blur-[140px]" />
        <div className="absolute top-1/3 left-0 h-[300px] w-[300px] rounded-full bg-[oklch(0.7_0.18_180/0.18)] blur-[100px]" />
        {/* grid */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="rs-grid" width="44" height="44" patternUnits="userSpaceOnUse">
              <path d="M 44 0 L 0 0 0 44" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#rs-grid)" />
        </svg>
      </div>

      <div className="container-page relative py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80 backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            Live simulation
          </span>
          <h2 className="mt-5 font-serif text-[40px] leading-[1.05] tracking-tight md:text-[56px]">
            Simulate your{" "}
            <span className="bg-gradient-to-r from-[oklch(0.85_0.14_220)] via-[oklch(0.78_0.16_270)] to-[oklch(0.78_0.18_320)] bg-clip-text text-transparent">
              revenue recovery
            </span>
          </h2>
          <p className="mt-4 text-base text-white/65">
            Drag, toggle, watch invoices clear in real time. This is the cash your agency
            is leaving on the table — and exactly how much you'd reclaim.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          {/* LEFT — CONTROL DECK */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-6 shadow-[0_20px_70px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl md:p-7">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white/10 ring-1 ring-white/15">
                    <Workflow className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">Control deck</p>
                </div>
                <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-white/40">
                  <Radio className="h-3 w-3" /> Tuned
                </span>
              </div>

              <div className="space-y-5">
                <SliderRow label="Monthly invoices" value={volume} suffix=" / mo" min={4} max={120} step={1} onChange={setVolume} />
                <SliderRow label="Average invoice value" value={avgValue} prefix="$" min={250} max={12000} step={50} onChange={setAvgValue} />
                <SliderRow label="Currently paid late" value={latePct} suffix="%" min={5} max={75} step={1} onChange={setLatePct} />
                <SliderRow label="Average days late" value={daysLate} suffix=" days" min={3} max={60} step={1} onChange={setDaysLate} />
              </div>

              <div className="mt-7 space-y-2.5 border-t border-white/10 pt-6">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">Automations</p>
                <ToggleRow icon={Bell} label="Automated reminders" hint="Polite, on-brand cadence" checked={reminders} onChange={setReminders} />
                <ToggleRow icon={Workflow} label="Milestone billing" hint="Lock approvals before next phase" checked={milestones} onChange={setMilestones} />
                <ToggleRow icon={ShieldCheck} label="Scope creep protection" hint="Auto change-orders on new asks" checked={scope} onChange={setScope} />
              </div>

              {/* Recovery score gauge */}
              <div className="mt-6 rounded-xl border border-white/10 bg-black/30 p-4">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
                  <span>Recovery score</span>
                  <span className="text-white/85 tabular-nums">{Math.round(scoreAnim)} / 100</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[oklch(0.78_0.16_220)] via-[oklch(0.74_0.18_270)] to-[oklch(0.78_0.18_320)] shadow-[0_0_18px_rgba(120,160,255,0.55)]"
                    animate={{ width: `${result.score}%` }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
                <p className="mt-2 inline-flex items-center gap-1 text-[10px] text-white/45">
                  <Info className="h-2.5 w-2.5" /> Demo data — real lift varies by workflow.
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT — RESULT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5 lg:col-span-7"
          >
            {/* Headline result */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-transparent p-6 backdrop-blur-xl md:p-8">
              {/* glow */}
              <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[oklch(0.62_0.2_270/0.4)] blur-3xl" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">Potential recovered this month</p>
                  <div className="mt-2 flex items-end gap-3">
                    <p className="font-serif text-[56px] leading-none tracking-tight tabular-nums md:text-[76px]">
                      <AnimatedDigits value={recoveredAnim} />
                    </p>
                  </div>
                  <p className="mt-3 text-sm text-white/60">
                    On <span className="font-semibold text-white tabular-nums">{fmt(result.monthlyBilled)}</span> billed monthly • new days-late{" "}
                    <span className="font-semibold text-white tabular-nums">{result.newDaysLate}d</span>
                  </p>
                </div>
                <span className="hidden shrink-0 sm:inline-flex items-center gap-1 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                  <TrendingUp className="h-3.5 w-3.5" /> Projected lift {Math.round(result.lift * 100)}%
                </span>
              </div>

              <div className="relative mt-6 grid grid-cols-3 gap-3">
                <Metric icon={FileText} label="Overdue reduced" value={`${Math.round(reduceAnim)}%`} />
                <Metric icon={Clock} label="Hours saved" value={`${Math.round(hoursAnim)} hrs`} />
                <Metric icon={Wallet} label="Annual recovery" value={fmtCompact(annualAnim)} />
              </div>

              <div className="relative mt-6 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="group h-11 bg-white px-5 text-[oklch(0.18_0.04_260)] shadow-[0_10px_40px_-10px_rgba(255,255,255,0.4)] hover:bg-white/95">
                  <Link to="/signup">
                    Lock in my recovery
                    <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-11 border-white/20 bg-white/5 px-5 text-white hover:bg-white/10 hover:text-white">
                  <Link to="/contact">Book demo</Link>
                </Button>
              </div>
            </div>

            {/* Arena + ticker */}
            <div className="grid gap-5 md:grid-cols-5">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl md:col-span-3">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-white/70" />
                    <p className="text-sm font-semibold tracking-tight">Invoice Race · Live</p>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <LegendDot color="oklch(0.7 0.2 25)" label="Late zone" />
                    <LegendDot color="oklch(0.78 0.16 250)" label="Paid" />
                  </div>
                </div>
                <RecoveryArena lift={result.lift} avgValue={avgValue} active={inView} />
              </div>

              {/* Live paid feed */}
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl md:col-span-2">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-emerald-300" />
                    <p className="text-sm font-semibold">Live paid feed</p>
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-widest text-white/40">Streaming</span>
                </div>
                <ul className="relative h-[210px] overflow-hidden px-2 py-2">
                  <AnimatePresence initial={false}>
                    {ticks.map((t) => (
                      <motion.li
                        key={t.id}
                        layout
                        initial={{ opacity: 0, y: -10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="mx-1 my-1 flex items-center justify-between rounded-lg border border-white/5 bg-gradient-to-r from-white/[0.06] to-transparent px-3 py-2"
                      >
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                          <span>
                            <span className="block text-[12px] font-semibold leading-tight">{t.client}</span>
                            <span className="block text-[10px] text-white/45">Invoice cleared</span>
                          </span>
                        </span>
                        <span className="font-serif text-[15px] font-semibold tabular-nums text-emerald-200">
                          +{fmt(t.amount)}
                        </span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                  {ticks.length === 0 && (
                    <li className="mx-1 my-1 flex items-center gap-2 rounded-lg border border-dashed border-white/10 px-3 py-2 text-[12px] text-white/40">
                      <Radio className="h-3.5 w-3.5" /> Listening for paid invoices…
                    </li>
                  )}
                  {/* fade bottom */}
                  <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[oklch(0.14_0.04_265)] to-transparent" />
                </ul>
              </div>
            </div>

            {/* trust strip */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[11px] font-medium text-white/55 backdrop-blur">
              <span className="inline-flex items-center gap-1.5"><Lock className="h-3 w-3" /> SOC2-aligned</span>
              <span className="inline-flex items-center gap-1.5"><BadgeCheck className="h-3 w-3" /> Built for agencies</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> Privacy-safe</span>
              <span className="inline-flex items-center gap-1.5"><Sparkles className="h-3 w-3" /> No credit card</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function AnimatedDigits({ value }: { value: number }) {
  return <>{fmt(value)}</>;
}

function SliderRow({
  label, value, min, max, step, onChange, prefix = "", suffix = "",
}: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; prefix?: string; suffix?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-[12px] font-medium uppercase tracking-wider text-white/60">{label}</label>
        <span className="font-serif text-[18px] font-semibold tabular-nums text-white">
          {prefix}{value.toLocaleString()}<span className="text-white/40">{suffix}</span>
        </span>
      </div>
      <Slider
        className="mt-3 [&_[data-slot=slider-track]]:bg-white/10 [&_[data-slot=slider-range]]:bg-gradient-to-r [&_[data-slot=slider-range]]:from-[oklch(0.78_0.14_220)] [&_[data-slot=slider-range]]:to-[oklch(0.78_0.18_300)] [&_[data-slot=slider-thumb]]:border-white [&_[data-slot=slider-thumb]]:bg-white [&_[data-slot=slider-thumb]]:shadow-[0_0_0_4px_rgba(255,255,255,0.12)]"
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0])}
      />
    </div>
  );
}

function ToggleRow({
  icon: Icon, label, hint, checked, onChange,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string; hint: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-3 py-2.5 transition ${
        checked
          ? "border-white/20 bg-gradient-to-r from-white/[0.08] to-white/[0.02] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
          : "border-white/8 bg-white/[0.02] hover:bg-white/[0.04]"
      }`}
    >
      <span className="flex items-center gap-3">
        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition ${checked ? "bg-white/15 text-white shadow-[0_0_18px_rgba(160,180,255,0.4)]" : "bg-white/5 text-white/60"}`}>
          <Icon className="h-4 w-4" />
        </span>
        <span>
          <span className="block text-[13px] font-semibold">{label}</span>
          <span className="block text-[11px] text-white/45">{hint}</span>
        </span>
      </span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}

function Metric({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3 backdrop-blur">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <p className="mt-1 font-serif text-[22px] font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-white/55">
      <span className="h-2 w-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />{label}
    </span>
  );
}

function RecoveryChart({ current, improved, animate }: { current: number[]; improved: number[]; animate: boolean }) {
  const w = 640, h = 240, padX = 28, padTop = 22, padBot = 30;
  const innerH = h - padTop - padBot;
  const max = Math.max(...current, ...improved, 1);
  const n = current.length;
  const labels = ["J","F","M","A","M","J","J","A","S","O","N","D"];
  const xAt = (i: number) => padX + (i * (w - padX * 2)) / (n - 1);
  const yAt = (v: number) => padTop + innerH - (v / max) * innerH;

  const toPath = (arr: number[]) => {
    const pts = arr.map((v, i) => [xAt(i), yAt(v)] as const);
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i];
      const [x1, y1] = pts[i + 1];
      const cx = (x0 + x1) / 2;
      d += ` C ${cx} ${y0}, ${cx} ${y1}, ${x1} ${y1}`;
    }
    return d;
  };
  const curPath = toPath(current);
  const impPath = toPath(improved);
  const areaPath = `${impPath} L ${xAt(n - 1)} ${yAt(0)} L ${xAt(0)} ${yAt(0)} Z`;

  const paidMarkers = improved
    .map((v, i) => ({ i, drop: (current[i] - v) / max }))
    .filter((m) => m.drop > 0.04 && m.i > 0);

  return (
    <div className="px-3 py-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="block h-56 w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="rc-area2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.78 0.16 250 / 0.45)" />
            <stop offset="100%" stopColor="oklch(0.78 0.16 250 / 0)" />
          </linearGradient>
          <linearGradient id="rc-imp-stroke2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.85 0.14 220)" />
            <stop offset="50%" stopColor="oklch(0.78 0.18 270)" />
            <stop offset="100%" stopColor="oklch(0.78 0.18 320)" />
          </linearGradient>
          <filter id="rc-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1={padX} x2={w - padX} y1={padTop + innerH * g} y2={padTop + innerH * g} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 4" />
        ))}
        <text x={padX} y={padTop - 8} fontSize="9" fill="rgba(255,255,255,0.4)" letterSpacing="2">OUTSTANDING A/R</text>

        {/* current dashed */}
        <motion.path
          d={curPath}
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={1.5}
          strokeDasharray="4 5"
          initial={{ pathLength: 0 }}
          animate={animate ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* improved area + line */}
        <motion.path
          d={areaPath}
          fill="url(#rc-area2)"
          initial={{ opacity: 0 }}
          animate={animate ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        <motion.path
          d={impPath}
          fill="none"
          stroke="url(#rc-imp-stroke2)"
          strokeWidth={2.75}
          strokeLinecap="round"
          filter="url(#rc-glow)"
          initial={{ pathLength: 0 }}
          animate={animate ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.3, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        />

        {paidMarkers.map(({ i }, k) => {
          const x = xAt(i);
          const y = yAt(improved[i]);
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={animate ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.35, delay: 0.6 + k * 0.06, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: `${x}px ${y}px` }}
            >
              <circle cx={x} cy={y} r={7} fill="oklch(0.14 0.04 265)" stroke="oklch(0.78 0.16 250)" strokeWidth={1.5} />
              <path d={`M ${x - 2.4} ${y - 0.4} L ${x - 0.6} ${y + 1.6} L ${x + 2.6} ${y - 1.8}`} stroke="oklch(0.85 0.14 220)" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </motion.g>
          );
        })}

        {labels.map((l, i) => (
          <text key={i} x={xAt(i)} y={h - 12} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.4)">{l}</text>
        ))}

        <g>
          <circle cx={xAt(n - 1)} cy={yAt(current[n - 1])} r={3} fill="rgba(255,255,255,0.5)" />
          <circle cx={xAt(n - 1)} cy={yAt(improved[n - 1])} r={4} fill="oklch(0.85 0.14 220)" filter="url(#rc-glow)" />
        </g>
      </svg>
    </div>
  );
}
