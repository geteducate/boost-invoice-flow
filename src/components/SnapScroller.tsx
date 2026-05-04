import { useEffect, useRef, useState, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type SnapSection = { id: string; label: string };

const ScrollerCtx = createContext<{ active: string; go: (id: string) => void } | null>(null);
export const useScroller = () => useContext(ScrollerCtx);

export function SnapScroller({
  sections,
  children,
}: {
  sections: SnapSection[];
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(sections[0]?.id ?? "");

  const go = (id: string) => {
    const el = document.getElementById(`snap-${id}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.55) {
            const id = (e.target as HTMLElement).dataset.snapId;
            if (id) setActive(id);
          }
        });
      },
      { root, threshold: [0.55, 0.75] }
    );
    sections.forEach((s) => {
      const el = document.getElementById(`snap-${s.id}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <ScrollerCtx.Provider value={{ active, go }}>
      {/* Top anchor pills */}
      <div className="sticky top-16 z-30 hidden border-b border-border/60 bg-background/70 backdrop-blur-xl lg:block">
        <div className="container-page flex items-center gap-1 overflow-x-auto py-2.5">
          {sections.map((s) => {
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => go(s.id)}
                className={`group relative whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-primary/8"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="navPill"
                    className="absolute inset-0 -z-0 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-glow)] shadow-elegant"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Side dots */}
      <div className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex">
        {sections.map((s) => {
          const isActive = active === s.id;
          return (
            <button
              key={s.id}
              onClick={() => go(s.id)}
              aria-label={`Go to ${s.label}`}
              className="group relative flex items-center"
            >
              <span
                className={`absolute right-6 whitespace-nowrap rounded-full border border-border bg-background/90 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md transition-all ${
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                {s.label}
              </span>
              <span
                className={`block rounded-full transition-all duration-300 ${
                  isActive
                    ? "h-7 w-2.5 bg-gradient-to-b from-[var(--primary)] to-[var(--primary-glow)] shadow-glow"
                    : "h-2.5 w-2.5 bg-border hover:bg-primary/50"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div
        ref={containerRef}
        className="snap-scroller h-[calc(100vh-4rem)] snap-y snap-mandatory overflow-y-auto scroll-smooth"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {children}
      </div>
    </ScrollerCtx.Provider>
  );
}

export function SnapSectionWrap({ id, children }: { id: string; children: React.ReactNode }) {
  const { active } = useScroller() ?? { active: "" };
  const isActive = active === id;
  return (
    <section
      id={`snap-${id}`}
      data-snap-id={id}
      className="relative flex min-h-[calc(100vh-4rem)] w-full snap-start snap-always items-center"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isActive ? "on" : "off"}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
