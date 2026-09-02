// Hooks d'authentification fine (phase 6) — rôle, permission, délai de session.
import { useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { ROLE_LABELS, ROLE_PERMISSIONS, type Permission } from "@/lib/auth/permissions";
import type { RoleCode } from "@/lib/data/types";

export function useRequirePermission(...permissions: Permission[]): boolean {
  const { can } = useAuth();
  return permissions.every((p) => can(p));
}

export function useRequireRole(...roles: RoleCode[]): boolean {
  const { user } = useAuth();
  return !!user && roles.includes(user.role);
}

export function useSessionTimeout({ timeoutMs = 120 * 60_000 }: { timeoutMs?: number } = {}) {
  const { ready, locked } = useAuth();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const arm = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      window.dispatchEvent(new Event("kako:lock"));
    }, timeoutMs);
  }, [timeoutMs]);

  useEffect(() => {
    if (!ready || locked) return;
    const events = ["mousemove", "keydown", "click", "touchstart", "scroll"] as const;
    const handler = () => arm();
    events.forEach((e) => window.addEventListener(e, handler));
    arm();
    return () => {
      events.forEach((e) => window.removeEventListener(e, handler));
      if (timer.current) clearTimeout(timer.current);
    };
  }, [ready, locked, arm]);

  return { locked, remainingMs: timeoutMs };
}

export function useCanViewChild() {
  const { canViewChild } = useAuth();
  return canViewChild;
}

export { ROLE_LABELS, ROLE_PERMISSIONS };
export type { Permission, RoleCode };
