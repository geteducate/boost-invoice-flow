// Server-side admin guard. Chains the auth middleware, then verifies the
// caller has the `admin` role in `public.user_roles`. Use on any server
// function or server route that must be admin-only.
import { createMiddleware } from "@tanstack/react-start";
import { requireSupabaseAuth } from "./auth-middleware";

export const requireAdmin = createMiddleware({ type: "function" })
  .middleware([requireSupabaseAuth])
  .server(async ({ next, context }) => {
    const { supabase, userId } = context as { supabase: any; userId: string };
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (error || !data) {
      throw new Response("Forbidden: admin role required", { status: 403 });
    }

    return next({ context: { isAdmin: true } });
  });
