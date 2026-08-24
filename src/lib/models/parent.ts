// Modèle Parent (responsable légal) : type canonique de data/types.ts + validation Zod.
import { z } from "zod";
import type { Parent } from "../data/types";

export type { Parent };

/** Formulaire responsable (champs saisissables uniquement). */
export const parentFormSchema = z.object({
  firstName: z.string().trim().min(1, "Le prénom est obligatoire.").max(60),
  lastName: z.string().trim().min(1, "Le nom est obligatoire.").max(60),
  phone: z.string().trim().min(1, "Le téléphone est obligatoire.").max(30),
  email: z
    .string()
    .trim()
    .min(1, "L'email est obligatoire.")
    .refine((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Adresse email invalide."),
  address: z.string().trim().max(200),
  job: z.string().trim().max(80),
  idDocument: z.string().trim().max(60),
});

export type ParentFormInput = z.infer<typeof parentFormSchema>;

/** Schéma complet (stockage) — conformité vérifiée à la compilation. */
export const parentRecordSchema: z.ZodType<Parent> = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  email: z.string(),
  address: z.string(),
  job: z.string(),
  idDocument: z.string(),
  isDemo: z.boolean(),
});
