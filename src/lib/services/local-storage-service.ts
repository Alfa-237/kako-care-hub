// Implémentation localStorage de IDataService.
// Toutes les écritures passent par le même conteneur versionné `kako.db.v1`
// que la couche historique (db.ts) et déclenchent sa notification, afin que
// les composants legacy (useDatabase) restent réactifs.
import { initDatabase, mutate, onDatabaseChanged } from "../data/db";
import type { ChildParent, CollectionKey, Database } from "../data/types";
import { getFamilyViewById, listFamilies } from "../business/families";
import type { FamilyRecord } from "../models/family";
import type { Child, Parent } from "../data/types";
import type { IDataService } from "./data-service";

/** Préfixes d'identifiants par collection pour la numérotation auto-incrémentée. */
export const ID_PREFIXES: Partial<Record<CollectionKey, string>> = {
  families: "fam",
  children: "enf",
  parents: "par",
  sections: "sec",
  employees: "emp",
  activities: "act",
};

function collectionOf(db: Database, key: CollectionKey): Array<{ id: string }> {
  const value = db[key] as unknown;
  return Array.isArray(value) ? (value as Array<{ id: string }>) : [];
}

function stripDiacritics(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

class LocalStorageDataService implements IDataService {
  async init(): Promise<void> {
    await initDatabase();
  }

  async getAll<T>(collection: CollectionKey): Promise<T[]> {
    const db = await initDatabase();
    return structuredClone(collectionOf(db, collection)) as T[];
  }

  async getById<T extends { id: string }>(
    collection: CollectionKey,
    id: string,
  ): Promise<T | null> {
    const db = await initDatabase();
    const found = collectionOf(db, collection).find((x) => x.id === id);
    return found ? (structuredClone(found) as T) : null;
  }

  async create<T extends { id: string }>(collection: CollectionKey, entity: T): Promise<T> {
    await mutate((d) => {
      (d[collection] as unknown as T[]).push(structuredClone(entity));
    });
    return structuredClone(entity);
  }

  async update<T extends { id: string }>(
    collection: CollectionKey,
    id: string,
    patch: Partial<T>,
  ): Promise<T> {
    let updated: T | null = null;
    await mutate((d) => {
      const arr = d[collection] as unknown as T[];
      const idx = arr.findIndex((x) => x.id === id);
      if (idx >= 0) {
        arr[idx] = { ...arr[idx]!, ...structuredClone(patch) };
        updated = arr[idx];
      }
    });
    if (!updated) throw new Error(`Élément ${id} introuvable dans « ${collection} ».`);
    return structuredClone(updated);
  }

  async delete(collection: CollectionKey, id: string): Promise<boolean> {
    let removed = false;
    await mutate((d) => {
      const arr = d[collection] as unknown as Array<{ id: string }>;
      const idx = arr.findIndex((x) => x.id === id);
      if (idx >= 0) {
        arr.splice(idx, 1);
        removed = true;
      }
    });
    return removed;
  }

  nextId(collection: CollectionKey, prefix?: string): string {
    // Synchrone impossible sur storage async : calcule depuis l'état courant en mémoire.
    const p = prefix ?? ID_PREFIXES[collection] ?? collection.slice(0, 3);
    const db = this.peek();
    let max = 0;
    if (db) {
      for (const item of collectionOf(db, collection)) {
        const m = new RegExp(`^${p}-(\\d+)$`).exec(item.id);
        if (m) max = Math.max(max, Number(m[1]));
      }
    }
    return `${p}-${String(max + 1).padStart(3, "0")}`;
  }

  private peek(): Database | null {
    try {
      const raw = typeof window === "undefined" ? null : window.localStorage.getItem("kako.db.v1");
      return raw ? (JSON.parse(raw) as Database) : null;
    } catch {
      return null;
    }
  }

  async getChildrenByFamily(familyId: string): Promise<Child[]> {
    const db = await initDatabase();
    const view = getFamilyViewById(db, familyId);
    return view?.children ?? [];
  }

  async getFamilyByChild(childId: string): Promise<FamilyRecord | null> {
    const db = await initDatabase();
    const link = (db.childParents ?? []).find((cp: ChildParent) => cp.childId === childId);
    if (!link) return null;
    const record = (db.families ?? []).find(
      (f: FamilyRecord) => f.primaryParentId === link.parentId,
    );
    return record ?? null;
  }

  async getParentsByFamily(familyId: string): Promise<Parent[]> {
    const db = await initDatabase();
    const view = getFamilyViewById(db, familyId);
    if (!view) return [];
    const ids = new Set(view.members.map((m) => m.parentId));
    return (db.parents ?? []).filter((p) => ids.has(p.id));
  }

  async searchChildren(query: string): Promise<Child[]> {
    const q = stripDiacritics(query.trim().toLowerCase());
    if (!q) return this.getAll<Child>("children");
    const all = await this.getAll<Child>("children");
    return all.filter((c) =>
      stripDiacritics(`${c.firstName} ${c.lastName}`.toLowerCase()).includes(q),
    );
  }

  async searchFamilies(query: string): Promise<FamilyRecord[]> {
    const q = stripDiacritics(query.trim().toLowerCase());
    const db = await initDatabase();
    const records = db.families ?? [];
    if (!q) return structuredClone(records);
    return records.filter((f) => {
      const parent = f.primaryParentId
        ? (db.parents ?? []).find((p) => p.id === f.primaryParentId)
        : null;
      const haystack = stripDiacritics(
        [f.name, f.phone, f.email, parent ? `${parent.firstName} ${parent.lastName}` : ""]
          .join(" ")
          .toLowerCase(),
      );
      return haystack.includes(q);
    });
  }

  async getFamilyViews() {
    const db = await initDatabase();
    return listFamilies(db);
  }

  async getFamilyView(familyId: string) {
    const db = await initDatabase();
    return getFamilyViewById(db, familyId);
  }
}

/**
 * Pont héritage → React Query : toute écriture effectuée par la couche
 * historique (mutate direct dans les dialogs existants) invalide les caches
 * du service afin que les vues famille restent fraîches.
 */
export function bindLegacyWrites(callback: () => void): () => void {
  return onDatabaseChanged(() => callback());
}

export const localStorageService: IDataService = new LocalStorageDataService();
