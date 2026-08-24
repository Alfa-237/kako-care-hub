// Types partagés entre tous les modèles KAKO Manager.
import { z } from "zod";

export type ID = string;

/** Statut du dossier famille. */
export type FamilyStatus = "Active" | "Inactive" | "Archivée";

export const FAMILY_STATUSES: readonly FamilyStatus[] = ["Active", "Inactive", "Archivée"] as const;

export const familyStatusSchema = z.enum(["Active", "Inactive", "Archivée"]);

export type Gender = "F" | "M";

export const genderSchema = z.enum(["F", "M"]);

/** Horodatage ISO 8601 courant (utilisé par createdAt / updatedAt). */
export function nowIso(): string {
  return new Date().toISOString();
}

/**
 * Génère un identifiant unique lisible : `${prefix}-${base36}-${random}`.
 * Utilisé lorsque la numérotation auto-incrémentée n'est pas nécessaire.
 */
export function randomId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
