// Modèle Employee (phase 8B) — employés, plannings hebdo et alertes ratio.
import { z } from "zod";
import type { Employee } from "../data/types";

export type { Employee } from "../data/types";

export const FONCTIONS = [
  "Directrice",
  "Éducatrice",
  "Auxiliaire",
  "Secrétaire",
  "Cuisinière",
  "Agent d'entretien",
] as const;
export type Fonction = (typeof FONCTIONS)[number];

export const FONCTION_LABELS: Record<Fonction, string> = {
  Directrice: "Directrice",
  Éducatrice: "Éducatrice",
  Auxiliaire: "Auxiliaire",
  Secrétaire: "Secrétaire",
  Cuisinière: "Cuisinière",
  "Agent d'entretien": "Agent d'entretien",
};

export const CONTRACT_TYPES = ["cdi", "cdd", "stage", "vacation"] as const;
export type ContractType = (typeof CONTRACT_TYPES)[number];

export const CONTRACT_LABELS: Record<ContractType, string> = {
  cdi: "CDI",
  cdd: "CDD",
  stage: "Stage",
  vacation: "Vacation",
};

export const STATUS_EMPLOYEE = ["actif", "inactif"] as const;
export type EmployeeStatus = (typeof STATUS_EMPLOYEE)[number];

export const STATUS_LABELS: Record<EmployeeStatus, string> = {
  actif: "Actif",
  inactif: "Inactif",
};

// ---- Schéma Zod de validation (formulaires, messages FR)

export const employeeFormSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis."),
  lastName: z.string().min(1, "Le nom est requis."),
  fonction: z.enum(FONCTIONS, { message: "Fonction requise." }),
  phone: z.string().min(1, "Le téléphone est requis."),
  address: z.string().optional(),
  qualification: z.string().optional(),
  hireDate: z.string().min(1, "La date d'embauche est requise."),
  contractType: z.enum(CONTRACT_TYPES, { message: "Type de contrat requis." }),
  status: z.enum(STATUS_EMPLOYEE),
  notes: z.string().optional(),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

// ---- Schéma EmployeeSchedule (Zod FR)

export const employeeScheduleSchema = z.object({
  weekdays: z.array(z.number().int().min(0).max(6)).min(1, "Sélectionnez au moins un jour."),
  startTime: z.string().min(1, "L'heure de début est requise."),
  endTime: z.string().min(1, "L'heure de fin est requise."),
  section: z.string().optional(),
});

export type EmployeeScheduleFormValues = z.infer<typeof employeeScheduleSchema>;

// ---- Helpers

export function employeeFullName(e: Employee): string {
  return `${e.firstName} ${e.lastName}`;
}

export function initials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}
