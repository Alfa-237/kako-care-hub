// Modèle Child consolidé : le type canonique reste celui de data/types.ts ;
// ce fichier ajoute la validation Zod et constitue le point d'entrée modèle.
import { z } from "zod";
import type { Child, ChildStatus } from "../data/types";
import { genderSchema } from "./types";

export type { Child, ChildStatus };

export const CHILD_STATUSES: readonly ChildStatus[] = [
  "Préinscrit",
  "Inscrit",
  "Suspendu",
  "Sorti",
] as const;

export const childStatusSchema = z.enum(["Préinscrit", "Inscrit", "Suspendu", "Sorti"]);

/** Formulaire enfant (champs saisissables uniquement). */
export const childFormSchema = z.object({
  firstName: z.string().trim().min(1, "Le prénom est obligatoire.").max(60),
  lastName: z.string().trim().min(1, "Le nom est obligatoire.").max(60),
  birthDate: z
    .string()
    .min(1, "La date de naissance est obligatoire.")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Date de naissance invalide."),
  gender: genderSchema,
  address: z.string().trim().max(200),
  language: z.string().trim().max(40),
  notes: z.string().trim().max(1000),
  medicalAlert: z.string().trim().max(500),
  sectionId: z.string().nullable(),
});

export type ChildFormInput = z.infer<typeof childFormSchema>;

/** Schéma complet (stockage) — conformité vérifiée à la compilation. */
export const childRecordSchema: z.ZodType<Child> = z.object({
  id: z.string(),
  fileNumber: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  birthDate: z.string(),
  gender: genderSchema,
  photo: z.string().nullable(),
  address: z.string(),
  registrationDate: z.string(),
  startDate: z.string(),
  sectionId: z.string().nullable(),
  status: childStatusSchema,
  language: z.string(),
  notes: z.string(),
  medicalAlert: z.string().nullable(),
  missingDocuments: z.array(z.string()),
  contractEndDate: z.string().nullable(),
  isDemo: z.boolean(),
});
