// Hooks utilisateurs — lecture réactive directement depuis la base.
import { useCallback } from "react";
import { useDatabase } from "@/lib/data/db";
import type { User } from "@/lib/data/types";

export function useUsers(): { data: User[]; refetch: () => Promise<void> } {
  const db = useDatabase();
  const refetch = useCallback(async () => {}, []);
  return { data: db?.users ?? [], refetch };
}

export function useUser(id: string | undefined): User | null {
  const db = useDatabase();
  return id ? (db?.users.find((u) => u.id === id) ?? null) : null;
}
