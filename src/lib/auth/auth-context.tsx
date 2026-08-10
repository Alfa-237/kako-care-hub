import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { SESSION_KEY, storage } from "../data/storage";
import { initDatabase, logAction, mutate, useDatabase } from "../data/db";
import { hashPassword } from "../data/seed";
import type { User } from "../data/types";
import { ROLE_PERMISSIONS, type Permission } from "./permissions";

interface Session {
  userId: string;
  startedAt: string;
}

interface AuthValue {
  user: User | null;
  ready: boolean;
  locked: boolean;
  signIn: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => Promise<void>;
  unlock: (password: string) => Promise<boolean>;
  can: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthValue | null>(null);

const MAX_ATTEMPTS = 5;
const attempts = new Map<string, { count: number; until: number }>();

export function AuthProvider({ children }: { children: ReactNode }) {
  const db = useDatabase();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [locked, setLocked] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    void (async () => {
      await initDatabase();
      setSession(await storage.read<Session>(SESSION_KEY));
      setReady(true);
    })();
  }, []);

  const user = useMemo(
    () => db?.users.find((u) => u.id === session?.userId) ?? null,
    [db, session],
  );

  const lockDelay = (db?.establishment.autoLockMinutes ?? 15) * 60_000;

  const resetTimer = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    if (!session) return;
    timer.current = setTimeout(() => setLocked(true), lockDelay);
  }, [session, lockDelay]);

  useEffect(() => {
    if (!session) return;
    const events = ["mousemove", "keydown", "click", "touchstart"];
    const handler = () => {
      if (!locked) resetTimer();
    };
    events.forEach((e) => window.addEventListener(e, handler));
    resetTimer();
    return () => {
      events.forEach((e) => window.removeEventListener(e, handler));
      if (timer.current) clearTimeout(timer.current);
    };
  }, [session, locked, resetTimer]);

  useEffect(() => {
    const handler = () => setLocked(true);
    window.addEventListener("kako:lock", handler);
    return () => window.removeEventListener("kako:lock", handler);
  }, []);

  const signIn = useCallback<AuthValue["signIn"]>(async (username, password) => {
    const data = await initDatabase();
    const key = username.trim().toLowerCase();
    const record = attempts.get(key);
    if (record && record.count >= MAX_ATTEMPTS && Date.now() < record.until) {
      const secs = Math.ceil((record.until - Date.now()) / 1000);
      return { ok: false, error: `Trop de tentatives. Réessayez dans ${secs} s.` };
    }
    const found = data.users.find((u) => u.username.toLowerCase() === key);
    const hash = await hashPassword(password);
    if (!found || found.passwordHash !== hash) {
      const count = (record?.count ?? 0) + 1;
      attempts.set(key, { count, until: Date.now() + 60_000 });
      return { ok: false, error: "Identifiant ou mot de passe incorrect." };
    }
    if (found.status !== "actif") {
      return { ok: false, error: "Ce compte est suspendu." };
    }
    attempts.delete(key);
    await mutate((d) => {
      const u = d.users.find((x) => x.id === found.id);
      if (u) u.lastLoginAt = new Date().toISOString();
    });
    const next: Session = { userId: found.id, startedAt: new Date().toISOString() };
    await storage.write(SESSION_KEY, next);
    setSession(next);
    setLocked(false);
    await logAction(found, "Connexion", `Rôle ${found.role}`);
    return { ok: true };
  }, []);

  const signOut = useCallback(async () => {
    if (user) await logAction(user, "Déconnexion");
    await storage.remove(SESSION_KEY);
    setSession(null);
    setLocked(false);
  }, [user]);

  const unlock = useCallback(
    async (password: string) => {
      if (!user) return false;
      const hash = await hashPassword(password);
      if (hash !== user.passwordHash) return false;
      setLocked(false);
      return true;
    },
    [user],
  );

  const can = useCallback(
    (permission: Permission) =>
      !!user && (ROLE_PERMISSIONS[user.role] ?? []).includes(permission),
    [user],
  );

  const value = useMemo<AuthValue>(
    () => ({ user, ready: ready && !!db, locked, signIn, signOut, unlock, can }),
    [user, ready, db, locked, signIn, signOut, unlock, can],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return ctx;
}
