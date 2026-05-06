import { Children, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Lightweight scroll-reveal using IntersectionObserver.
 * Fade + slide (translateY 28px → 0). 480ms ease-out cubic.
 * Respects prefers-reduced-motion. Quieter on small screens.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setReduced(true);
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style = reduced
    ? undefined
    : {
        transitionDelay: `${delay}ms`,
        transform: visible ? "translate3d(0,0,0)" : "translate3d(0,28px,0)",
        opacity: visible ? 1 : 0,
        transition:
          "opacity 520ms cubic-bezier(.22,.61,.36,1), transform 520ms cubic-bezier(.22,.61,.36,1)",
        willChange: "opacity, transform",
      };

  // @ts-expect-error dynamic tag
  return <Tag ref={ref} className={className} style={style}>{children}</Tag>;
}

/**
 * Staggers direct children with incremental Reveal delays.
 * Usage: <Stagger className="grid ...">{items.map(...)}</Stagger>
 */
export function Stagger({
  children,
  step = 90,
  start = 0,
  className = "",
  childClassName = "",
}: {
  children: ReactNode;
  step?: number;
  start?: number;
  className?: string;
  childClassName?: string;
}) {
  const items = Children.toArray(children);
  return (
    <div className={className}>
      {items.map((child, i) => (
        <Reveal key={i} delay={start + i * step} className={childClassName}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
