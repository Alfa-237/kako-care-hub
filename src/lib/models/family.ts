// Modèle Family persisté : l'identité de la famille (nom, contact, statut, notes)
// est désormais stockée en base. Les responsables et enfants restent des RELATIONS
// résolues via primaryParentId + les liens childParents (une seule source de vérité).
import { z } from "zod";
import type { ID } from "./types";
import { familyStatusSchema } from "./types";

export interface FamilyRecord {
  id: ID;
  /** Nom affiché de la famille (ex : « Famille Mbarga »). */
  name: string;
  address: string;
  phone: string;
  email: string;
  status: "Active" | "Inactive" | "Archivée";
  /** Observations libres sur la famille. */
  notes: string;
  /** Responsable principal : ancre de résolution des relations (membres + enfants). */
  primaryParentId: ID | null;
  createdAt: string;
  updatedAt: string;
  isDemo: boolean;
}

export const familyFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Le nom de la famille est obligatoire.")
    .max(80, "Le nom ne peut pas dépasser 80 caractères."),
  address: z.string().trim().max(200, "L'adresse ne peut pas dépasser 200 caractères."),
  phone: z.string().trim().max(30, "Le téléphone ne peut pas dépasser 30 caractères."),
  email: z
    .string()
    .trim()
    .max(120, "L'email ne peut pas dépasser 120 caractères.")
    .refine((v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Adresse email invalide."),
  status: familyStatusSchema,
  notes: z.string().trim().max(1000, "Les observations ne peuvent pas dépasser 1000 caractères."),
});

export type FamilyFormInput = z.infer<typeof familyFormSchema>;

/** Schéma complet (stockage) — garantit à la compilation la conformité au type. */
export const familyRecordSchema: z.ZodType<FamilyRecord> = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  phone: z.string(),
  email: z.string(),
  status: familyStatusSchema,
  notes: z.string(),
  primaryParentId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isDemo: z.boolean(),
});
