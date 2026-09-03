// Modèle ChildSchedule — rythme hebdomadaire prévisionnel d'un enfant (phase 8A).
// Décrit les jours et plages horaires de présence prévue ; les exceptions
// (ScheduleException) en dérogent jour par jour.
import { z } from "zod";
import type { ID } from "./types";

/**
 * Type d'exception de planning. Une dérogation ponctuelle à la présence prévue.
 */
export type ScheduleExceptionType = "depart-avance" | "absence" | "activite" | "autre";

export const SCHEDULE_EXCEPTION_LABELS: Record<ScheduleExceptionType, string> = {
  "depart-avance": "Départ anticipé",
  absence: "Absence",
  activite: "Activité exceptionnelle",
  autre: "Autre",
};

/** Horaires de présence hebdomadaires d'un enfant. */
export interface ChildSchedule {
  id: ID; // sch-001…
  childId: ID;
  /**
   * Jours de présence prévue (index JS : 0=Dimanche … 6=Samedi).
   * Au moins un jour doit être coché.
   */
  days: number[];
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  notes?: string;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
}

/** Dérogation ponctuelle à la présence prévue d'un enfant pour une journée. */
export interface ScheduleException {
  id: ID; // exc-001…
  childId: ID;
  /** Journée concernée au format YYYY-MM-DD. */
  date: string;
  type: ScheduleExceptionType;
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
  reason?: string;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
}

/** Jours de la semaine (index 1..7) affichés par la vue planning. */
export const WEEKDAY_SHORT = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"] as const;

const timeSchema = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Heure invalide (format attendu HH:mm).");

/** Schéma de saisie d'un planning hebdomadaire. */
export const childScheduleFormSchema = z
  .object({
    childId: z.string().min(1, "L'enfant est obligatoire."),
    days: z
      .array(z.number().int().min(0).max(6))
      .min(1, "Au moins un jour de présence doit être coché."),
    startTime: timeSchema,
    endTime: timeSchema,
    notes: z.string().trim().max(300, "Les notes ne peuvent pas dépasser 300 caractères."),
  })
  .refine((v) => v.startTime < v.endTime, "L'heure de départ doit être après l'heure d'arrivée.");

export type ChildScheduleFormInput = z.infer<typeof childScheduleFormSchema>;

/** Schéma de saisie d'une exception de planning. */
export const scheduleExceptionFormSchema = z.object({
  childId: z.string().min(1, "L'enfant est obligatoire."),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide."),
  type: z.enum(["depart-avance", "absence", "activite", "autre"]),
  startTime: timeSchema.optional(),
  endTime: timeSchema.optional(),
  reason: z.string().trim().max(300, "Le motif ne peut pas dépasser 300 caractères."),
});

export type ScheduleExceptionFormInput = z.infer<typeof scheduleExceptionFormSchema>;

/** Schéma complet (stockage) d'un planning. */
export const childScheduleRecordSchema = z.object({
  id: z.string(),
  childId: z.string(),
  days: z.array(z.number().int().min(0).max(6)),
  startTime: z.string(),
  endTime: z.string(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isDemo: z.boolean().optional(),
});

/** Schéma complet (stockage) d'une exception. */
export const scheduleExceptionRecordSchema = z.object({
  id: z.string(),
  childId: z.string(),
  date: z.string(),
  type: z.enum(["depart-avance", "absence", "activite", "autre"]),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  reason: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isDemo: z.boolean().optional(),
});
