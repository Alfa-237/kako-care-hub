// Filtre des ressources selon le rôle : les PARENT ne voient que leurs enfants.
import { useMemo } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import { useDatabase } from "@/lib/data/db";
import type { Child } from "@/lib/data/types";

/**
 * Retourne les enfants visibles par l'utilisateur courant.
 * Pour le rôle PARENT : uniquement les enfants rattachés à sa famille.
 * Pour tous les autres rôles : l'ensemble des enfants.
 */
export function useVisibleChildren(): Child[] | undefined {
  const db = useDatabase();
  const { user, canViewChild } = useAuth();

  return useMemo(() => {
    if (!db) return undefined;
    if (!user || user.role !== "PARENT") return db.children;
    if (!user.familyId) return [];
    return db.children.filter((c) => canViewChild(c.id));
  }, [db, user, canViewChild]);
}

/** Vrai si l'utilisateur courant est restreint à une famille (rôle PARENT). */
export function useIsFamilyRestricted(): boolean {
  const { user } = useAuth();
  return user?.role === "PARENT";
}
