// Opérations CRUD utilisateurs via la couche base (phase 6).
import { mutate } from "./db";
import type { RoleCode, User } from "./types";

export interface NewUserInput {
  username: string;
  fullName: string;
  passwordHash: string;
  role: RoleCode;
  status: "actif" | "suspendu";
  email?: string;
  phone?: string;
  familyId?: string | null;
}

export async function createUser(input: NewUserInput): Promise<User> {
  const now = new Date().toISOString();
  const record: User = {
    id: `usr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    username: input.username.trim(),
    fullName: input.fullName.trim(),
    passwordHash: input.passwordHash,
    role: input.role,
    status: input.status,
    createdAt: now,
    lastLoginAt: null,
    isDemo: false,
    ...(input.email ? { email: input.email } : {}),
    ...(input.phone ? { phone: input.phone } : {}),
    ...(input.familyId !== undefined ? { familyId: input.familyId } : {}),
  };
  const out = await mutate((d) => {
    d.users.push(record);
  });
  return out.users.find((u) => u.id === record.id) ?? record;
}

export async function updateUser(
  id: string,
  patch: Partial<Omit<User, "id" | "createdAt" | "isDemo">>,
): Promise<User | null> {
  const out = await mutate((d) => {
    const idx = d.users.findIndex((u) => u.id === id);
    if (idx >= 0) d.users[idx] = { ...d.users[idx]!, ...patch };
  });
  return out.users.find((u) => u.id === id) ?? null;
}

export async function deleteUser(id: string): Promise<boolean> {
  const out = await mutate((d) => {
    d.users = d.users.filter((u) => u.id !== id);
  });
  return !out.users.some((u) => u.id === id);
}

export async function setUserStatus(id: string, status: "actif" | "suspendu"): Promise<boolean> {
  const out = await mutate((d) => {
    const u = d.users.find((x) => x.id === id);
    if (u) u.status = status;
  });
  return out.users.find((u) => u.id === id)?.status === status;
}
