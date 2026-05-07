import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

/**
 * Mobile-only sticky CTA bar. Appears once the user scrolls past ~600px on
 * marketing pages so the trial offer stays one tap away.
 */
export function MobileStickyCTA() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [visible, setVisible] = useState(false);

  // Hide on app/admin/auth surfaces — only useful on marketing pages.
  const hidden =
    path.startsWith("/app") ||
    path.startsWith("/admin") ||
    path === "/login" ||
    path === "/signup" ||
    path === "/forgot-password" ||
    path === "/reset-password";

  useEffect(() => {
    if (hidden) return;
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hidden]);

  if (hidden || !visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[1000] flex h-16 items-center gap-3 border-t border-border bg-background/95 px-5 backdrop-blur md:hidden"
      style={{ paddingBottom: "max(0px, env(safe-area-inset-bottom))" }}
    >
      <Link
        to="/signup"
        className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-success px-5 text-sm font-bold text-success-foreground shadow-elegant transition-transform active:scale-[0.98]"
      >
        Start Free Trial <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
