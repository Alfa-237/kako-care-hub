// Implémentation localStorage de IDataService.
// Toutes les écritures passent par le même conteneur versionné `kako.db.v1`
// que la couche historique (db.ts) et déclenchent sa notification, afin que
// les composants legacy (useDatabase) restent réactifs.
import { initDatabase, mutate, onDatabaseChanged } from "../data/db";
import type { Child, ChildParent, CollectionKey, Database, Parent } from "../data/types";
import { getFamilyViewById, listFamilies } from "../business/families";
import type { FamilyRecord } from "../models/family";
import type { AttendanceRecord } from "../models/attendance";
import type { AuthorizedPerson } from "../models/authorized-person";
import { localDateISO } from "../models/attendance";
import type { IDataService, AttendanceSummary, TransmissionSectionKey } from "./data-service";
import type {
  ActivityRecord,
  DailyTransmission,
  DiaperChangeRecord,
  IncidentRecord,
  MealRecord,
  MedicationRecord,
  NapRecord,
} from "../models/daily-transmission";

/** Préfixes d'identifiants par collection pour la numérotation auto-incrémentée. */
export const ID_PREFIXES: Partial<Record<CollectionKey, string>> = {
  families: "fam",
  children: "enf",
  parents: "par",
  sections: "sec",
  employees: "emp",
  activities: "act",
  attendance: "att",
  dailyTransmissions: "tr",
  authorizedPersons: "ap",
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

  // ---- Contacts & autorisations par famille (phase 7)

  async getContactsByFamily(familyId: string): Promise<AuthorizedPerson[]> {
    const db = await initDatabase();
    return structuredClone((db.authorizedPersons ?? []).filter((c) => c.familyId === familyId));
  }

  async getPickupPersons(familyId: string): Promise<AuthorizedPerson[]> {
    const db = await initDatabase();
    return structuredClone(
      (db.authorizedPersons ?? []).filter((c) => c.familyId === familyId && c.canPickup),
    );
  }

  async createContact(contact: AuthorizedPerson): Promise<AuthorizedPerson> {
    const created = await this.create<AuthorizedPerson>("authorizedPersons", contact);
    return created;
  }

  async updateContact(id: string, patch: Partial<AuthorizedPerson>): Promise<AuthorizedPerson> {
    const updated = await this.update<AuthorizedPerson>("authorizedPersons", id, {
      ...patch,
      updatedAt: new Date().toISOString(),
    });
    return updated;
  }

  async deleteContact(id: string): Promise<boolean> {
    return this.delete("authorizedPersons", id);
  }

  // ---- Présences / pointage quotidien (phase 3B)

  private familyIdForChild(db: Database, childId: string): string | null {
    const link = (db.childParents ?? []).find((cp: ChildParent) => cp.childId === childId);
    if (!link) return null;
    const record = (db.families ?? []).find(
      (f: FamilyRecord) => f.primaryParentId === link.parentId,
    );
    return record?.id ?? null;
  }

  async getAttendanceByDate(date: string): Promise<AttendanceRecord[]> {
    const db = await initDatabase();
    return structuredClone((db.attendance ?? []).filter((a) => a.date === date));
  }

  async getAttendanceByChild(childId: string): Promise<AttendanceRecord[]> {
    const db = await initDatabase();
    return structuredClone(
      (db.attendance ?? [])
        .filter((a) => a.childId === childId)
        .sort((a, b) => b.date.localeCompare(a.date)),
    );
  }

  async getAttendanceByFamily(familyId: string): Promise<AttendanceRecord[]> {
    const db = await initDatabase();
    const linked = new Set(
      (db.childParents ?? [])
        .filter((cp: ChildParent) => {
          const fam = (db.families ?? []).find(
            (f: FamilyRecord) => f.primaryParentId === cp.parentId,
          );
          return fam?.id === familyId;
        })
        .map((cp: ChildParent) => cp.childId),
    );
    return structuredClone(
      (db.attendance ?? [])
        .filter((a) => a.familyId === familyId || linked.has(a.childId))
        .sort((a, b) => b.date.localeCompare(a.date)),
    );
  }

  async upsertAttendance(
    input: { childId: string; date: string } & Partial<AttendanceRecord>,
  ): Promise<AttendanceRecord> {
    let result: AttendanceRecord | null = null;
    await mutate((d) => {
      d.attendance = d.attendance ?? [];
      const idx = d.attendance.findIndex(
        (a) => a.childId === input.childId && a.date === input.date,
      );
      if (idx >= 0) {
        d.attendance[idx] = {
          ...d.attendance[idx]!,
          ...input,
          updatedAt: new Date().toISOString(),
        };
        result = structuredClone(d.attendance[idx]);
      } else {
        const now = new Date().toISOString();
        const created: AttendanceRecord = {
          id: this.nextId("attendance", "att"),
          childId: input.childId,
          familyId: input.familyId ?? this.familyIdForChild(d, input.childId),
          date: input.date,
          status: input.status ?? "attendu",
          arrivalTime: input.arrivalTime ?? null,
          arrivalAccompaniedBy: input.arrivalAccompaniedBy ?? null,
          departureTime: input.departureTime ?? null,
          departurePickedUpBy: input.departurePickedUpBy ?? null,
          absenceReason: input.absenceReason ?? null,
          absenceType: input.absenceType ?? null,
          notes: input.notes ?? "",
          recordedBy: input.recordedBy ?? null,
          createdAt: now,
          updatedAt: now,
          isDemo: false,
        };
        d.attendance.push(created);
        result = structuredClone(created);
      }
    });
    if (!result) throw new Error("Échec de l'enregistrement du pointage.");
    return result;
  }

  // ---- Transmissions quotidiennes / cahier de liaison (phase 3C)

  async getDailyTransmission(childId: string, date: string): Promise<DailyTransmission | null> {
    const db = await initDatabase();
    const found = (db.dailyTransmissions ?? []).find(
      (t) => t.childId === childId && t.date === date,
    );
    return found ? structuredClone(found) : null;
  }

  async getDailyTransmissionsByChild(childId: string): Promise<DailyTransmission[]> {
    const db = await initDatabase();
    return structuredClone(
      (db.dailyTransmissions ?? [])
        .filter((t) => t.childId === childId)
        .sort((a, b) => b.date.localeCompare(a.date)),
    );
  }

  async getDailyTransmissionsByDate(date: string): Promise<DailyTransmission[]> {
    const db = await initDatabase();
    return structuredClone((db.dailyTransmissions ?? []).filter((t) => t.date === date));
  }

  async upsertDailyTransmission(
    input: { childId: string; date: string } & Partial<DailyTransmission>,
  ): Promise<DailyTransmission> {
    let result: DailyTransmission | null = null;
    await mutate((d) => {
      d.dailyTransmissions = d.dailyTransmissions ?? [];
      const idx = d.dailyTransmissions.findIndex(
        (t) => t.childId === input.childId && t.date === input.date,
      );
      if (idx >= 0) {
        d.dailyTransmissions[idx] = {
          ...d.dailyTransmissions[idx]!,
          ...input,
          childId: input.childId,
          date: input.date,
          updatedAt: new Date().toISOString(),
        };
        result = structuredClone(d.dailyTransmissions[idx]);
      } else {
        const now = new Date().toISOString();
        const created: DailyTransmission = {
          id: this.nextId("dailyTransmissions", "tr"),
          childId: input.childId,
          familyId: input.familyId ?? this.familyIdForChild(d, input.childId),
          date: input.date,
          generalNotes: input.generalNotes ?? "",
          meals: input.meals ?? [],
          naps: input.naps ?? [],
          diaperChanges: input.diaperChanges ?? [],
          activities: input.activities ?? [],
          incidents: input.incidents ?? [],
          medications: input.medications ?? [],
          recordedBy: input.recordedBy ?? null,
          createdAt: now,
          updatedAt: now,
          isDemo: false,
        };
        if (input.mood !== undefined) created.mood = input.mood;
        if (input.temperature !== undefined) created.temperature = input.temperature;
        d.dailyTransmissions.push(created);
        result = structuredClone(created);
      }
    });
    if (!result) throw new Error("Échec de l'enregistrement de la transmission.");
    return result;
  }

  /**
   * Modifie la liste `key` d'une transmission via une fonction pure
   * (base commune des ajouts/éditions/suppressions de sous-événements).
   */
  private async mutateSection(
    transmissionId: string,
    key: TransmissionSectionKey,
    transform: (items: Array<{ id: string }>) => Array<{ id: string }>,
  ): Promise<DailyTransmission> {
    let result: DailyTransmission | null = null;
    await mutate((d) => {
      const list = d.dailyTransmissions ?? [];
      const idx = list.findIndex((t) => t.id === transmissionId);
      if (idx < 0) return;
      const section = list[idx]![key] as unknown as Array<{ id: string }>;
      list[idx] = {
        ...list[idx]!,
        [key]: transform([...section]),
        updatedAt: new Date().toISOString(),
      };
      result = structuredClone(list[idx]!);
    });
    if (!result) throw new Error(`Transmission « ${transmissionId} » introuvable.`);
    return result;
  }

  async upsertTransmissionItem(
    transmissionId: string,
    key: TransmissionSectionKey,
    item: { id: string },
  ): Promise<DailyTransmission> {
    return this.mutateSection(transmissionId, key, (items) => {
      const idx = items.findIndex((x) => x.id === item.id);
      if (idx >= 0) items[idx] = item;
      else items.push(item);
      return items;
    });
  }

  async removeTransmissionItem(
    transmissionId: string,
    key: TransmissionSectionKey,
    itemId: string,
  ): Promise<DailyTransmission> {
    return this.mutateSection(transmissionId, key, (items) => items.filter((x) => x.id !== itemId));
  }

  async addMealToTransmission(
    transmissionId: string,
    meal: MealRecord,
  ): Promise<DailyTransmission> {
    const updated = await this.upsertTransmissionItem(transmissionId, "meals", meal);
    return this.sortSection(updated, "meals");
  }

  async addNapToTransmission(transmissionId: string, nap: NapRecord): Promise<DailyTransmission> {
    const updated = await this.upsertTransmissionItem(transmissionId, "naps", nap);
    return this.sortSection(updated, "naps", (a, b) =>
      (a as NapRecord).startTime.localeCompare((b as NapRecord).startTime),
    );
  }

  async addDiaperChangeToTransmission(
    transmissionId: string,
    change: DiaperChangeRecord,
  ): Promise<DailyTransmission> {
    const updated = await this.upsertTransmissionItem(transmissionId, "diaperChanges", change);
    return this.sortSection(updated, "diaperChanges");
  }

  async addActivityToTransmission(
    transmissionId: string,
    activity: ActivityRecord,
  ): Promise<DailyTransmission> {
    // Ordre d'insertion conservé pour les activités.
    return this.upsertTransmissionItem(transmissionId, "activities", activity);
  }

  async addIncidentToTransmission(
    transmissionId: string,
    incident: IncidentRecord,
  ): Promise<DailyTransmission> {
    const updated = await this.upsertTransmissionItem(transmissionId, "incidents", incident);
    return this.sortSection(updated, "incidents");
  }

  async addMedicationToTransmission(
    transmissionId: string,
    medication: MedicationRecord,
  ): Promise<DailyTransmission> {
    const updated = await this.upsertTransmissionItem(transmissionId, "medications", medication);
    return this.sortSection(updated, "medications");
  }

  /** Re-tri chronologique d'une section après ajout/édition (retourne un clone). */
  private sortSection(
    transmission: DailyTransmission,
    key: TransmissionSectionKey,
    compare?: (a: { id: string }, b: { id: string }) => number,
  ): DailyTransmission {
    const clone = structuredClone(transmission);
    const section = clone[key] as unknown as Array<{
      id: string;
      time?: string;
      startTime?: string;
    }>;
    section.sort((a, b) => {
      if (compare) return compare(a, b);
      const ta = a.time ?? a.startTime ?? "";
      const tb = b.time ?? b.startTime ?? "";
      return ta.localeCompare(tb);
    });
    clone[key] = section as never;
    return clone;
  }

  async getTodayAttendanceSummary(date?: string): Promise<AttendanceSummary> {
    const day = date ?? localDateISO();
    const db = await initDatabase();
    const enrolled = (db.children ?? []).filter((c) => c.status === "Inscrit");
    const byChild = new Map(
      (db.attendance ?? []).filter((a) => a.date === day).map((a) => [a.childId, a]),
    );
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalRetard = 0;
    let totalDepartAnticipe = 0;
    for (const child of enrolled) {
      const rec = byChild.get(child.id);
      if (!rec) continue;
      if (rec.status === "present") totalPresent += 1;
      else if (rec.status === "absent") totalAbsent += 1;
      else if (rec.status === "retard") totalRetard += 1;
      else if (rec.status === "depart-anticipe") totalDepartAnticipe += 1;
    }
    const totalAttendu = enrolled.length;
    return {
      totalAttendu,
      totalPresent,
      totalAbsent,
      totalRetard,
      totalDepartAnticipe,
      tauxOccupation:
        totalAttendu > 0
          ? Math.round(((totalPresent + totalDepartAnticipe) / totalAttendu) * 100)
          : 0,
    };
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
