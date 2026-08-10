import type { RoleCode } from "../data/types";

export type Permission =
  | "dashboard.view"
  | "children.view"
  | "children.edit"
  | "families.view"
  | "families.edit"
  | "enrollment.manage"
  | "planning.view"
  | "attendance.view"
  | "attendance.edit"
  | "transmissions.view"
  | "transmissions.edit"
  | "activities.manage"
  | "care.manage"
  | "medical.view"
  | "billing.view"
  | "billing.edit"
  | "payments.manage"
  | "staff.view"
  | "staff.edit"
  | "reports.view"
  | "documents.view"
  | "settings.manage"
  | "backup.manage"
  | "users.manage";

const ALL: Permission[] = [
  "dashboard.view",
  "children.view",
  "children.edit",
  "families.view",
  "families.edit",
  "enrollment.manage",
  "planning.view",
  "attendance.view",
  "attendance.edit",
  "transmissions.view",
  "transmissions.edit",
  "activities.manage",
  "care.manage",
  "medical.view",
  "billing.view",
  "billing.edit",
  "payments.manage",
  "staff.view",
  "staff.edit",
  "reports.view",
  "documents.view",
  "settings.manage",
  "backup.manage",
  "users.manage",
];

export const ROLE_LABELS: Record<RoleCode, string> = {
  ADMINISTRATEUR: "Administrateur",
  DIRECTEUR: "Directeur",
  SECRETAIRE: "Secrétaire",
  EDUCATEUR: "Éducateur",
  COMPTABLE: "Comptable",
  CONSULTATION: "Consultation",
};

export const ROLE_PERMISSIONS: Record<RoleCode, Permission[]> = {
  ADMINISTRATEUR: ALL,
  DIRECTEUR: ALL.filter((p) => p !== "users.manage"),
  SECRETAIRE: [
    "dashboard.view",
    "children.view",
    "children.edit",
    "families.view",
    "families.edit",
    "enrollment.manage",
    "planning.view",
    "attendance.view",
    "attendance.edit",
    "transmissions.view",
    "documents.view",
    "reports.view",
    "staff.view",
  ],
  EDUCATEUR: [
    "dashboard.view",
    "children.view",
    "families.view",
    "planning.view",
    "attendance.view",
    "attendance.edit",
    "transmissions.view",
    "transmissions.edit",
    "activities.manage",
    "care.manage",
  ],
  COMPTABLE: [
    "dashboard.view",
    "children.view",
    "families.view",
    "billing.view",
    "billing.edit",
    "payments.manage",
    "reports.view",
    "documents.view",
  ],
  CONSULTATION: [
    "dashboard.view",
    "children.view",
    "families.view",
    "planning.view",
    "attendance.view",
    "reports.view",
  ],
};

export function roleHas(role: RoleCode, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
