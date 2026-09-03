// Contrat de la couche d'accès aux données.
// L'implémentation actuelle est localStorage ; le passage à SQLite/IndexedDB
// (application Windows offline-first) se fera sans toucher aux composants.
import type { Child, Parent } from "../data/types";
import type { CollectionKey } from "../data/types";
import type { FamilyRecord } from "../models/family";
import type { AuthorizedPerson } from "../models/authorized-person";
import type { Family as FamilyView } from "../business/families";
import type { AttendanceRecord } from "../models/attendance";
import type {
  ActivityRecord,
  DailyTransmission,
  DiaperChangeRecord,
  IncidentRecord,
  MealRecord,
  MedicationRecord,
  NapRecord,
} from "../models/daily-transmission";

/** Sections de sous-événements d'une transmission quotidienne. */
export type TransmissionSectionKey =
  "meals" | "naps" | "diaperChanges" | "activities" | "incidents" | "medications";

/** Statistiques de pointage d'une journée. */
export interface AttendanceSummary {
  totalAttendu: number;
  totalPresent: number;
  totalAbsent: number;
  totalRetard: number;
  totalDepartAnticipe: number;
  /** present / attendu * 100 (arrondi). */
  tauxOccupation: number;
}

export interface IDataService {
  /** Charge/initialise la base (migration éventuelle comprise). */
  init(): Promise<void>;

  // ---- CRUD génériques
  getAll<T>(collection: CollectionKey): Promise<T[]>;
  getById<T extends { id: string }>(collection: CollectionKey, id: string): Promise<T | null>;
  create<T extends { id: string }>(collection: CollectionKey, entity: T): Promise<T>;
  update<T extends { id: string }>(
    collection: CollectionKey,
    id: string,
    patch: Partial<T>,
  ): Promise<T>;
  delete(collection: CollectionKey, id: string): Promise<boolean>;

  /** Identifiant auto-incrémenté pour la collection (préfixe + numéro). */
  nextId(collection: CollectionKey, prefix?: string): string;

  // ---- Requêtes relationnelles spécifiques
  getChildrenByFamily(familyId: string): Promise<Child[]>;
  getFamilyByChild(childId: string): Promise<FamilyRecord | null>;
  getParentsByFamily(familyId: string): Promise<Parent[]>;
  searchChildren(query: string): Promise<Child[]>;
  searchFamilies(query: string): Promise<FamilyRecord[]>;

  // ---- Vues jointes famille (entité + responsable + membres + enfants)
  getFamilyViews(): Promise<FamilyView[]>;
  getFamilyView(familyId: string): Promise<FamilyView | null>;

  // ---- Contacts & autorisations par famille (phase 7)
  getContactsByFamily(familyId: string): Promise<AuthorizedPerson[]>;
  /** Personnes autorisées à récupérer l'enfant (canPickup === true). */
  getPickupPersons(familyId: string): Promise<AuthorizedPerson[]>;
  createContact(contact: AuthorizedPerson): Promise<AuthorizedPerson>;
  updateContact(id: string, patch: Partial<AuthorizedPerson>): Promise<AuthorizedPerson>;
  deleteContact(id: string): Promise<boolean>;

  // ---- Présences / pointage quotidien (phase 3B)
  getAttendanceByDate(date: string): Promise<AttendanceRecord[]>;
  getAttendanceByChild(childId: string): Promise<AttendanceRecord[]>;
  getAttendanceByFamily(familyId: string): Promise<AttendanceRecord[]>;
  /**
   * Crée OU met à jour le pointage d'un enfant pour une journée
   * (clé naturelle childId + date).
   */
  upsertAttendance(
    input: { childId: string; date: string } & Partial<AttendanceRecord>,
  ): Promise<AttendanceRecord>;
  getTodayAttendanceSummary(date?: string): Promise<AttendanceSummary>;

  // ---- Transmissions quotidiennes / cahier de liaison (phase 3C)
  getDailyTransmission(childId: string, date: string): Promise<DailyTransmission | null>;
  getDailyTransmissionsByChild(childId: string): Promise<DailyTransmission[]>;
  getDailyTransmissionsByDate(date: string): Promise<DailyTransmission[]>;
  /**
   * Crée OU met à jour la transmission d'un enfant pour une journée
   * (clé naturelle childId + date).
   */
  upsertDailyTransmission(
    input: { childId: string; date: string } & Partial<DailyTransmission>,
  ): Promise<DailyTransmission>;
  addMealToTransmission(transmissionId: string, meal: MealRecord): Promise<DailyTransmission>;
  addNapToTransmission(transmissionId: string, nap: NapRecord): Promise<DailyTransmission>;
  addDiaperChangeToTransmission(
    transmissionId: string,
    change: DiaperChangeRecord,
  ): Promise<DailyTransmission>;
  addActivityToTransmission(
    transmissionId: string,
    activity: ActivityRecord,
  ): Promise<DailyTransmission>;
  addIncidentToTransmission(
    transmissionId: string,
    incident: IncidentRecord,
  ): Promise<DailyTransmission>;
  addMedicationToTransmission(
    transmissionId: string,
    medication: MedicationRecord,
  ): Promise<DailyTransmission>;
  /** Remplace un sous-événement existant (édition) ou l'ajoute s'il est inconnu. */
  upsertTransmissionItem(
    transmissionId: string,
    key: TransmissionSectionKey,
    item: { id: string },
  ): Promise<DailyTransmission>;
  /** Supprime un sous-événement par son identifiant. */
  removeTransmissionItem(
    transmissionId: string,
    key: TransmissionSectionKey,
    itemId: string,
  ): Promise<DailyTransmission>;
}
