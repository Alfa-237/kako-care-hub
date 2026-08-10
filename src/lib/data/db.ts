import { useCallback, useSyncExternalStore } from "react";
import { DB_KEY, storage } from "./storage";
import { buildSeedDatabase } from "./seed";
import type { Database } from "./types";

type Listener = () => void;

let db: Database | null = null;
let loading: Promise<Database> | null = null;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

export async function initDatabase(): Promise<Database> {
  if (db) return db;
  if (loading) return loading;
  loading = (async () => {
    const existing = await storage.read<Database>(DB_KEY);
    const next = existing ?? (await buildSeedDatabase());
    if (!existing) await storage.write(DB_KEY, next);
    db = next;
    emit();
    return next;
  })();
  return loading;
}

export function getDatabase(): Database | null {
  return db;
}

export async function mutate(fn: (draft: Database) => void): Promise<Database> {
  const current = await initDatabase();
  const draft: Database = JSON.parse(JSON.stringify(current));
  fn(draft);
  db = draft;
  await storage.write(DB_KEY, draft);
  emit();
  return draft;
}

export async function replaceDatabase(next: Database): Promise<void> {
  db = next;
  await storage.write(DB_KEY, next);
  emit();
}

export async function resetDemoData(): Promise<void> {
  await replaceDatabase(await buildSeedDatabase());
}

export async function clearDemoData(): Promise<void> {
  await mutate((d) => {
    d.children = d.children.filter((x) => !x.isDemo);
    d.parents = d.parents.filter((x) => !x.isDemo);
    d.childParents = d.childParents.filter((x) => !x.isDemo);
    d.attendance = d.attendance.filter((x) => !x.isDemo);
    d.invoices = d.invoices.filter((x) => !x.isDemo);
    d.payments = d.payments.filter((x) => !x.isDemo);
    d.activities = d.activities.filter((x) => !x.isDemo);
    d.employees = d.employees.filter((x) => !x.isDemo);
    d.sections = d.sections.filter((x) => !x.isDemo);
  });
}

export async function logAction(
  user: { id: string; fullName: string } | null,
  action: string,
  detail = "",
) {
  await mutate((d) => {
    d.auditLogs.unshift({
      id: `log-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
      at: new Date().toISOString(),
      userId: user?.id ?? null,
      userName: user?.fullName ?? "Système",
      action,
      detail,
    });
    d.auditLogs = d.auditLogs.slice(0, 300);
  });
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  void initDatabase();
  return () => listeners.delete(listener);
}

export function useDatabase(): Database | null {
  const getSnapshot = useCallback(() => db, []);
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}
