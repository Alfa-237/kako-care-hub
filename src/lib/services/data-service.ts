// Contrat de la couche d'accès aux données.
// L'implémentation actuelle est localStorage ; le passage à SQLite/IndexedDB
// (application Windows offline-first) se fera sans toucher aux composants.
import type { Child, Parent } from "../data/types";
import type { CollectionKey } from "../data/types";
import type { FamilyRecord } from "../models/family";
import type { Family as FamilyView } from "../business/families";

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
}
