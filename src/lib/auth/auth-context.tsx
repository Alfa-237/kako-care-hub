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

export interface SignUpInput {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  crecheName: string;
  crechePhone: string;
  city: string;
  address: string;
  password: string;
}

interface AuthValue {
  user: User | null;
  ready: boolean;
  locked: boolean;
  signIn: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signUp: (input: SignUpInput) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => Promise<void>;
  unlock: (password: string) => Promise<boolean>;
  can: (permission: Permission) => boolean;
  /** Vrai si l'utilisateur peut consulter l'enfant (filtré pour le rôle PARENT). */
  canViewChild: (childId: string | null | undefined) => boolean;
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
    const found = data.users.find(
      (u) => u.username.toLowerCase() === key || (u.email ?? "").toLowerCase() === key,
    );

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

  const signUp = useCallback<AuthValue["signUp"]>(async (input) => {
    const data = await initDatabase();
    const email = input.email.trim().toLowerCase();
    const exists = data.users.some(
      (u) => (u.email ?? "").toLowerCase() === email || u.username.toLowerCase() === email,
    );
    if (exists) return { ok: false, error: "Un compte existe déjà avec cette adresse e-mail." };

    const id = `usr-${Date.now().toString(36)}`;
    const newUser: User = {
      id,
      username: email,
      email,
      phone: input.phone.trim(),
      fullName: `${input.firstName.trim()} ${input.lastName.trim()}`.trim(),
      passwordHash: await hashPassword(input.password),
      role: "DIRECTEUR",
      status: "actif",
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      isDemo: false,
    };

    const firstRealAccount = !data.users.some((u) => !u.isDemo);
    await mutate((d) => {
      d.users.push(newUser);
      if (firstRealAccount) {
        d.establishment.name = input.crecheName.trim() || d.establishment.name;
        d.establishment.phone = input.crechePhone.trim() || d.establishment.phone;
        d.establishment.address =
          [input.address.trim(), input.city.trim()].filter(Boolean).join(", ") ||
          d.establishment.address;
        d.establishment.email = email;
      }
    });

    const next: Session = { userId: id, startedAt: new Date().toISOString() };
    await storage.write(SESSION_KEY, next);
    setSession(next);
    setLocked(false);
    await logAction(newUser, "Création de compte", `Crèche ${input.crecheName}`);
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
    (permission: Permission) => !!user && (ROLE_PERMISSIONS[user.role] ?? []).includes(permission),
    [user],
  );

  // Résolution des enfants d'une famille (pour le rôle PARENT).
  const familyChildIds = useMemo(() => {
    if (!db || !user || user.role !== "PARENT" || !user.familyId) return null;
    const family = db.families.find((f) => f.id === user.familyId);
    if (!family) return null;
    const parentIds = new Set(
      db.childParents
        .filter((cp) => cp.parentId === family.primaryParentId)
        .map((cp) => cp.parentId),
    );
    if (family.primaryParentId) parentIds.add(family.primaryParentId);
    const childIds = new Set(
      db.childParents.filter((cp) => parentIds.has(cp.parentId)).map((cp) => cp.childId),
    );
    return childIds;
  }, [db, user]);

  const canViewChild = useCallback(
    (childId: string | null | undefined) => {
      if (!childId) return false;
      if (!user) return false;
      if (user.role !== "PARENT") return true;
      return familyChildIds?.has(childId) ?? false;
    },
    [user, familyChildIds],
  );

  const value = useMemo<AuthValue>(
    () => ({
      user,
      ready: ready && !!db,
      locked,
      signIn,
      signUp,
      signOut,
      unlock,
      can,
      canViewChild,
    }),
    [user, ready, db, locked, signIn, signUp, signOut, unlock, can, canViewChild],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return ctx;
}
