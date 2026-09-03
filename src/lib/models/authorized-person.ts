// Modèle AuthorizedPerson (phase 7) : contact + autorisations par famille
// (récupération, urgence, documents, signature).
import { z } from "zod";
import type { ID } from "./types";

export interface AuthorizedPerson {
  id: ID; // ap-001…
  familyId: ID;
  firstName: string;
  lastName: string;
  /** Lien avec la famille : « Mère », « Oncle », « Voisine »… */
  relation: string;
  phone: string;
  address?: string;
  profession?: string;
  /** Pièce d'identité (type + n°). */
  idDocument?: string;
  // ---- Autorisations (toutes optionnelles, au moins une cochée au formulaire)
  canPickup: boolean;
  emergencyContact: boolean;
  receivesDocuments: boolean;
  canSign: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  /** Donnée de démonstration (nettoyable via « réinitialiser les données »). */
  isDemo?: boolean;
}

const phoneSchema = z
  .string()
  .trim()
  .min(1, "Le téléphone est obligatoire.")
  .max(30, "Le téléphone ne peut pas dépasser 30 caractères.")
  .regex(/^[+0-9 ().-]+$/, "Numéro de téléphone invalide.");

/** Schéma de saisie du formulaire contact. */
export const authorizedPersonFormSchema = z
  .object({
    firstName: z.string().trim().min(1, "Le prénom est obligatoire.").max(60),
    lastName: z.string().trim().min(1, "Le nom est obligatoire.").max(60),
    relation: z.string().trim().min(1, "Le lien avec la famille est obligatoire.").max(60),
    phone: phoneSchema,
    address: z.string().trim().max(200, "L'adresse ne peut pas dépasser 200 caractères."),
    profession: z.string().trim().max(80, "La profession ne peut pas dépasser 80 caractères."),
    idDocument: z
      .string()
      .trim()
      .max(60, "La pièce d'identité ne peut pas dépasser 60 caractères."),
    canPickup: z.boolean(),
    emergencyContact: z.boolean(),
    receivesDocuments: z.boolean(),
    canSign: z.boolean(),
    notes: z.string().trim().max(500, "Les notes ne peuvent pas dépasser 500 caractères."),
  })
  .refine(
    (v) => v.canPickup || v.emergencyContact || v.receivesDocuments || v.canSign,
    "Au moins une autorisation doit être cochée.",
  );

export type AuthorizedPersonFormInput = z.infer<typeof authorizedPersonFormSchema>;

/** Schéma complet (stockage) — validation des données persistées. */
export const authorizedPersonRecordSchema = z.object({
  id: z.string(),
  familyId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  relation: z.string(),
  phone: z.string(),
  address: z.string().optional(),
  profession: z.string().optional(),
  idDocument: z.string().optional(),
  canPickup: z.boolean(),
  emergencyContact: z.boolean(),
  receivesDocuments: z.boolean(),
  canSign: z.boolean(),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  isDemo: z.boolean().optional(),
});

/** Initiales utilisées pour l'avatar du contact. */
export function authorizedPersonInitials(p: { firstName: string; lastName: string }): string {
  return `${p.firstName.charAt(0)}${p.lastName.charAt(0)}`.toUpperCase();
}
