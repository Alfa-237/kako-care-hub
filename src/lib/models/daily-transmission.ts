// Modèles du cahier de liaison quotidien (phase 3C).
// Une transmission = un enfant × une journée (clé naturelle childId + date).
// Elle agrège l'état général et six familles de sous-événements.
import { z } from "zod";
import type { ID } from "./types";

// ---------------------------------------------------------------------------
// Sous-événements
// ---------------------------------------------------------------------------

export type MealType = "biberon" | "petit-dejeuner" | "dejeuner" | "gouter" | "diner";
export type MealQuantity = "tout" | "moitie" | "peu" | "refuse";

export interface MealRecord {
  id: string;
  time: string; // HH:mm
  type: MealType;
  description?: string;
  quantity?: MealQuantity;
  /** Pour les biberons. */
  quantityMl?: number;
  notes?: string;
}

export type NapQuality = "bonne" | "agitee" | "courte" | "longue";
export type WakeUpMood = "reposé" | "grognon" | "normal";

export interface NapRecord {
  id: string;
  startTime: string; // HH:mm
  endTime?: string; // HH:mm
  /** Calculé automatiquement si start + end fournis. */
  durationMinutes?: number;
  quality: NapQuality;
  wakeUpMood?: WakeUpMood;
  notes?: string;
}

export type DiaperChangeType = "propre" | "urine" | "selles" | "mixte";

export interface DiaperChangeRecord {
  id: string;
  time: string;
  type: DiaperChangeType;
  irritation: boolean;
  productUsed?: string;
  notes?: string;
}

export interface ActivityRecord {
  id: string;
  name: string;
  category?: string;
  observations?: string;
  skillsObserved?: string[];
}

export type IncidentType = "chute" | "morsure" | "griffure" | "pleurs" | "autre";
export type IncidentSeverity = "mineur" | "moyen" | "important";

export interface IncidentRecord {
  id: string;
  time: string;
  type: IncidentType;
  description: string;
  severity: IncidentSeverity;
  actionTaken?: string;
  parentsNotified: boolean;
}

export interface MedicationRecord {
  id: string;
  time: string;
  name: string;
  dosage: string;
  reason?: string;
  administeredBy?: string;
}

// ---------------------------------------------------------------------------
// Transmission quotidienne
// ---------------------------------------------------------------------------

export type Mood = "excellent" | "bon" | "moyen" | "difficile";

export interface DailyTransmission {
  id: ID; // tr-001, tr-002…
  childId: ID;
  familyId: ID | null;
  date: string; // YYYY-MM-DD

  // État général
  mood?: Mood;
  temperature?: number; // °C
  generalNotes?: string;

  // Sous-événements
  meals: MealRecord[];
  naps: NapRecord[];
  diaperChanges: DiaperChangeRecord[];
  activities: ActivityRecord[];
  incidents: IncidentRecord[];
  medications: MedicationRecord[];

  // Métadonnées
  recordedBy: string | null;
  createdAt: string;
  updatedAt: string;
  isDemo: boolean;
}

// ---------------------------------------------------------------------------
// Libellés français
// ---------------------------------------------------------------------------

export const MOOD_LABELS: Record<Mood, string> = {
  excellent: "Excellent",
  bon: "Bon",
  moyen: "Moyen",
  difficile: "Difficile",
};

export const MOOD_EMOJI: Record<Mood, string> = {
  excellent: "😄",
  bon: "🙂",
  moyen: "😐",
  difficile: "😣",
};

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  biberon: "Biberon",
  "petit-dejeuner": "Petit-déjeuner",
  dejeuner: "Déjeuner",
  gouter: "Goûter",
  diner: "Dîner",
};

export const QUANTITY_LABELS: Record<MealQuantity, string> = {
  tout: "Tout",
  moitie: "Moitié",
  peu: "Peu",
  refuse: "Refusé",
};

export const NAP_QUALITY_LABELS: Record<NapQuality, string> = {
  bonne: "Bonne",
  agitee: "Agitée",
  courte: "Courte",
  longue: "Longue",
};

export const WAKE_UP_MOOD_LABELS: Record<WakeUpMood, string> = {
  reposé: "Reposé",
  grognon: "Grognon",
  normal: "Normal",
};

export const DIAPER_TYPE_LABELS: Record<DiaperChangeType, string> = {
  propre: "Propre",
  urine: "Urine",
  selles: "Selles",
  mixte: "Mixte",
};

export const INCIDENT_TYPE_LABELS: Record<IncidentType, string> = {
  chute: "Chute",
  morsure: "Morsure",
  griffure: "Griffure",
  pleurs: "Pleurs",
  autre: "Autre",
};

export const SEVERITY_LABELS: Record<IncidentSeverity, string> = {
  mineur: "Mineur",
  moyen: "Moyen",
  important: "Important",
};

/** Durée en minutes entre deux heures HH:mm (indéfini si invalide). */
function parseHHmm(value: string): number | undefined {
  const match = /^([01]\d|2[0-3]):[0-5]\d$/.exec(value);
  return match ? Number(match[1]) * 60 + Number(match[2]) : undefined;
}

export function napDurationMinutes(startTime: string, endTime?: string): number | undefined {
  const start = parseHHmm(startTime);
  const end = endTime ? parseHHmm(endTime) : undefined;
  if (start === undefined || end === undefined) return undefined;
  const minutes = end - start;
  return minutes > 0 ? minutes : undefined;
}

/**
 * Retire les propriétés définies à undefined d'un enregistrement
 * (compatibilité exactOptionalPropertyTypes après un parse Zod).
 */
export function compactRecord<T>(record: unknown): T {
  return JSON.parse(JSON.stringify(record)) as T;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h${String(m).padStart(2, "0")}` : `${m} min`;
}

// ---------------------------------------------------------------------------
// Schémas Zod
// ---------------------------------------------------------------------------

const timeSchema = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Heure invalide (format attendu HH:mm).");

export const mealTypeSchema = z.enum(["biberon", "petit-dejeuner", "dejeuner", "gouter", "diner"]);
export const mealQuantitySchema = z.enum(["tout", "moitie", "peu", "refuse"]);
export const napQualitySchema = z.enum(["bonne", "agitee", "courte", "longue"]);
export const wakeUpMoodSchema = z.enum(["reposé", "grognon", "normal"]);
export const diaperTypeSchema = z.enum(["propre", "urine", "selles", "mixte"]);
export const incidentTypeSchema = z.enum(["chute", "morsure", "griffure", "pleurs", "autre"]);
export const incidentSeveritySchema = z.enum(["mineur", "moyen", "important"]);
export const moodSchema = z.enum(["excellent", "bon", "moyen", "difficile"]);

const optionalText = (max: number, label: string) =>
  z.string().trim().max(max, `${label} ne peut pas dépasser ${max} caractères.`).optional();

export const mealFormSchema = z
  .object({
    time: timeSchema,
    type: mealTypeSchema,
    description: z
      .string()
      .trim()
      .max(200, "La description ne peut pas dépasser 200 caractères.")
      .optional(),
    quantity: mealQuantitySchema.optional(),
    quantityMl: z.coerce
      .number()
      .int()
      .min(0, "Quantité invalide.")
      .max(500, "Maximum 500 ml.")
      .optional(),
    notes: optionalText(300, "Les notes"),
  })
  .refine((v) => v.type !== "biberon" || typeof v.quantityMl === "number", {
    message: "Indiquez la quantité en ml pour un biberon.",
    path: ["quantityMl"],
  });

export type MealFormInput = z.infer<typeof mealFormSchema>;

export const napFormSchema = z
  .object({
    startTime: timeSchema,
    endTime: timeSchema.or(z.literal("")).optional(),
    quality: napQualitySchema,
    wakeUpMood: wakeUpMoodSchema.optional(),
    notes: optionalText(300, "Les notes"),
  })
  .refine((v) => !v.endTime || v.endTime > v.startTime, {
    message: "L'heure de réveil doit être après le début de la sieste.",
    path: ["endTime"],
  });

export type NapFormInput = z.infer<typeof napFormSchema>;

export const diaperChangeFormSchema = z.object({
  time: timeSchema,
  type: diaperTypeSchema,
  irritation: z.boolean(),
  productUsed: z
    .string()
    .trim()
    .max(120, "Le produit ne peut pas dépasser 120 caractères.")
    .optional(),
  notes: optionalText(300, "Les notes"),
});

export type DiaperChangeFormInput = z.infer<typeof diaperChangeFormSchema>;

export const activityFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom de l'activité est obligatoire.")
    .max(120, "Le nom ne peut pas dépasser 120 caractères."),
  category: z
    .string()
    .trim()
    .max(80, "La catégorie ne peut pas dépasser 80 caractères.")
    .optional(),
  observations: optionalText(400, "Les observations"),
  skillsObserved: z.array(z.string().trim().min(1)).max(10, "10 compétences maximum."),
});

export type ActivityFormInput = z.infer<typeof activityFormSchema>;

export const incidentFormSchema = z
  .object({
    time: timeSchema,
    type: incidentTypeSchema,
    description: z
      .string()
      .trim()
      .min(5, "La description est obligatoire (5 caractères minimum).")
      .max(500, "La description ne peut pas dépasser 500 caractères."),
    severity: incidentSeveritySchema,
    actionTaken: z
      .string()
      .trim()
      .max(300, "L'action ne peut pas dépasser 300 caractères.")
      .optional(),
    parentsNotified: z.boolean(),
  })
  .refine((v) => v.severity !== "important" || v.parentsNotified, {
    message: "Pour un incident important, les parents doivent être informés.",
    path: ["parentsNotified"],
  });

export type IncidentFormInput = z.infer<typeof incidentFormSchema>;

export const medicationFormSchema = z.object({
  time: timeSchema,
  name: z
    .string()
    .trim()
    .min(2, "Le nom du médicament est obligatoire.")
    .max(120, "Le nom ne peut pas dépasser 120 caractères."),
  dosage: z
    .string()
    .trim()
    .min(1, "Le dosage est obligatoire.")
    .max(80, "Le dosage ne peut pas dépasser 80 caractères."),
  reason: optionalText(200, "La raison"),
  administeredBy: z
    .string()
    .trim()
    .max(120, "Le nom ne peut pas dépasser 120 caractères.")
    .optional(),
});

export type MedicationFormInput = z.infer<typeof medicationFormSchema>;

/** État général + notes du jour. */
export const dailyTransmissionFormSchema = z.object({
  mood: moodSchema.optional(),
  temperature: z.coerce
    .number()
    .min(30, "Température invraisemblable (minimum 30 °C).")
    .max(45, "Température invraisemblable (maximum 45 °C).")
    .optional(),
  generalNotes: z
    .string()
    .trim()
    .max(1000, "Les observations ne peuvent pas dépasser 1000 caractères."),
});

export type DailyTransmissionFormInput = z.infer<typeof dailyTransmissionFormSchema>;

/** Schéma complet (stockage) — validation de la conformité des données persistées. */
export const dailyTransmissionSchema = z.object({
  id: z.string(),
  childId: z.string(),
  familyId: z.string().nullable(),
  date: z.string(),
  mood: moodSchema.optional(),
  temperature: z.number().optional(),
  generalNotes: z.string().optional(),
  meals: z.array(
    z.object({
      id: z.string(),
      time: z.string(),
      type: mealTypeSchema,
      description: z.string().optional(),
      quantity: mealQuantitySchema.optional(),
      quantityMl: z.number().optional(),
      notes: z.string().optional(),
    }),
  ),
  naps: z.array(
    z.object({
      id: z.string(),
      startTime: z.string(),
      endTime: z.string().optional(),
      durationMinutes: z.number().optional(),
      quality: napQualitySchema,
      wakeUpMood: wakeUpMoodSchema.optional(),
      notes: z.string().optional(),
    }),
  ),
  diaperChanges: z.array(
    z.object({
      id: z.string(),
      time: z.string(),
      type: diaperTypeSchema,
      irritation: z.boolean(),
      productUsed: z.string().optional(),
      notes: z.string().optional(),
    }),
  ),
  activities: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      category: z.string().optional(),
      observations: z.string().optional(),
      skillsObserved: z.array(z.string()),
    }),
  ),
  incidents: z.array(
    z.object({
      id: z.string(),
      time: z.string(),
      type: incidentTypeSchema,
      description: z.string(),
      severity: incidentSeveritySchema,
      actionTaken: z.string().optional(),
      parentsNotified: z.boolean(),
    }),
  ),
  medications: z.array(
    z.object({
      id: z.string(),
      time: z.string(),
      name: z.string(),
      dosage: z.string(),
      reason: z.string().optional(),
      administeredBy: z.string().optional(),
    }),
  ),
  recordedBy: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isDemo: z.boolean(),
});
