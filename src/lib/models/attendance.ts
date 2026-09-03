// Modèle AttendanceRecord — pointage quotidien d'un enfant (phase 3B).
// Une ligne = un enfant × une journée. Le statut porte l'état courant du
// pointage ; arrivée/départ/absence détaillent ce statut.
import { z } from "zod";
import type { ID } from "./types";

export type AttendanceStatus = "attendu" | "present" | "absent" | "retard" | "depart-anticipe";

export type AbsenceType = "maladie" | "vacances" | "absence-non-justifiee" | "autre";

export interface AttendanceRecord {
  id: ID; // att-001, att-002…
  childId: ID;
  /** Référence famille (copie de recherche rapide, résolue via getFamilyByChild). */
  familyId: ID | null;
  /** Journée de référence au format YYYY-MM-DD (heure locale). */
  date: string; // YYYY-MM-DD

  status: AttendanceStatus;

  // ---- Arrivée
  arrivalTime: string | null; // HH:mm
  arrivalAccompaniedBy: string | null;

  // ---- Départ
  departureTime: string | null; // HH:mm
  departurePickedUpBy: string | null;
  /**
   * Phase 7 : true si le départ a été effectué par une personne autorisée à
   * récupérer l'enfant (canPickup), false sinon (« Autre personne », alerte
   * levée). Absent (undefined) pour les anciens pointages.
   */
  pickupAuthorized?: boolean;

  // ---- Absence
  absenceReason: string | null;
  absenceType: AbsenceType | null;

  // ---- Métadonnées
  notes: string;
  recordedBy: ID | null;
  createdAt: string;
  updatedAt: string;
  isDemo: boolean;
}

/** Date du jour en heure locale au format YYYY-MM-DD. */
export function localDateISO(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Heure courante au format HH:mm. */
export function nowHHmm(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/** Un départ enregistré avant 16h00 est considéré comme anticipé. */
export function isEarlyDeparture(departureTime: string): boolean {
  return departureTime < "16:00";
}

export const attendanceStatusSchema = z.enum([
  "attendu",
  "present",
  "absent",
  "retard",
  "depart-anticipe",
]);

export const absenceTypeSchema = z.enum(["maladie", "vacances", "absence-non-justifiee", "autre"]);

export const ABSENCE_TYPE_LABELS: Record<AbsenceType, string> = {
  maladie: "Maladie",
  vacances: "Vacances",
  "absence-non-justifiee": "Absence non justifiée",
  autre: "Autre",
};

const timeSchema = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Heure invalide (format attendu HH:mm).");

/** Validation d'un pointage complet (correction manuelle). */
export const attendanceFormSchema = z
  .object({
    status: attendanceStatusSchema,
    arrivalTime: timeSchema.or(z.literal("")).optional(),
    departureTime: timeSchema.or(z.literal("")).optional(),
    notes: z.string().trim().max(500, "Les notes ne peuvent pas dépasser 500 caractères."),
  })
  .refine(
    (v) => !(v.status === "attendu") || (!v.arrivalTime && !v.departureTime),
    "Un enfant attendu ne peut pas avoir d'heure d'arrivée ou de départ.",
  );

export type AttendanceFormInput = z.infer<typeof attendanceFormSchema>;

/** Validation rapide à l'arrivée. */
export const arrivalFormSchema = z.object({
  arrivalTime: timeSchema,
  accompaniedBy: z
    .string()
    .trim()
    .max(120, "Le nom ne peut pas dépasser 120 caractères.")
    .optional(),
});

export type ArrivalFormInput = z.infer<typeof arrivalFormSchema>;

/** Validation rapide au départ — qui récupère l'enfant est obligatoire. */
export const departureFormSchema = z.object({
  departureTime: timeSchema,
  pickedUpBy: z
    .string()
    .trim()
    .min(2, "Merci d'indiquer qui récupère l'enfant.")
    .max(120, "Le nom ne peut pas dépasser 120 caractères."),
});

export type DepartureFormInput = z.infer<typeof departureFormSchema>;

/** Validation d'une absence. */
export const absenceFormSchema = z.object({
  absenceType: absenceTypeSchema,
  reason: z.string().trim().max(300, "Le motif ne peut pas dépasser 300 caractères."),
});

export type AbsenceFormInput = z.infer<typeof absenceFormSchema>;

/** Schéma complet (stockage) — validation des données persistées. */
export const attendanceRecordSchema = z.object({
  id: z.string(),
  childId: z.string(),
  familyId: z.string().nullable(),
  date: z.string(),
  status: attendanceStatusSchema,
  arrivalTime: z.string().nullable(),
  arrivalAccompaniedBy: z.string().nullable(),
  departureTime: z.string().nullable(),
  departurePickedUpBy: z.string().nullable(),
  pickupAuthorized: z.boolean().optional(),
  absenceReason: z.string().nullable(),
  absenceType: absenceTypeSchema.nullable(),
  notes: z.string(),
  recordedBy: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isDemo: z.boolean(),
});
