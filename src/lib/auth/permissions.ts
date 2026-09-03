import type { RoleCode } from "../data/types";

/**
 * Permissions granulaires (phase 6).
 * Chaque permission suit la convention <module>.<action> ; les permissions
 * « * .view / * .edit » correspondant aux modules existants sont conservées
 * pour la rétro-compatibilité (phases 2B/3A/3B/3C), auxquelles s'ajoutent des
 * privilèges plus fins (create / update / delete / view_medical / salary /
 * export) et de nouveaux domaines (users, audit, backup, rapports.export).
 */
export type Permission =
  // Dashboard
  | "dashboard.view"
  // Enfants
  | "children.view"
  | "children.edit"
  | "children.create"
  | "children.update"
  | "children.delete"
  | "children.view_medical"
  // Familles
  | "families.view"
  | "families.edit"
  | "families.create"
  | "families.update"
  | "families.delete"
  // Inscriptions / planning / activités / soins (modules existants)
  | "enrollment.manage"
  | "planning.view"
  | "planning.update"
  | "attendance.view"
  | "attendance.edit"
  | "attendance.create"
  | "attendance.update"
  | "transmissions.view"
  | "transmissions.edit"
  | "transmissions.create"
  | "transmissions.update"
  | "activities.manage"
  | "care.manage"
  | "medical.view"
  // Facturation / paiements
  | "billing.view"
  | "billing.edit"
  | "billing.create"
  | "billing.update"
  | "billing.delete"
  | "payments.manage"
  | "payments.create"
  | "payments.update"
  // Personnel
  | "staff.view"
  | "staff.edit"
  | "staff.salary"
  // Rapports
  | "reports.view"
  | "reports.export"
  | "documents.view"
  // Système
  | "settings.manage"
  | "backup.manage"
  | "backup.create"
  | "backup.restore"
  | "audit.view"
  | "users.manage";

const ALL: Permission[] = [
  "dashboard.view",
  "children.view",
  "children.edit",
  "children.create",
  "children.update",
  "children.delete",
  "children.view_medical",
  "families.view",
  "families.edit",
  "families.create",
  "families.update",
  "families.delete",
  "enrollment.manage",
  "planning.view",
  "planning.update",
  "attendance.view",
  "attendance.edit",
  "attendance.create",
  "attendance.update",
  "transmissions.view",
  "transmissions.edit",
  "transmissions.create",
  "transmissions.update",
  "activities.manage",
  "care.manage",
  "medical.view",
  "billing.view",
  "billing.edit",
  "billing.create",
  "billing.update",
  "billing.delete",
  "payments.manage",
  "payments.create",
  "payments.update",
  "staff.view",
  "staff.edit",
  "staff.salary",
  "reports.view",
  "reports.export",
  "documents.view",
  "settings.manage",
  "backup.manage",
  "backup.create",
  "backup.restore",
  "audit.view",
  "users.manage",
];

/** Permissions héritées des privilèges « coarse » existants avant phase 6. */
const COARSE: Record<string, Permission[]> = {
  "children.edit": ["children.create", "children.update"],
  "families.edit": ["families.create", "families.update"],
  "attendance.edit": ["attendance.create", "attendance.update"],
  "transmissions.edit": ["transmissions.create", "transmissions.update"],
  "billing.edit": ["billing.create", "billing.update"],
  "payments.manage": ["payments.create", "payments.update"],
  "staff.edit": ["staff.salary"],
  "backup.manage": ["backup.create", "backup.restore"],
};

/** Étend une matrice par l'héritage des privilèges coarse (phase 6). */
function expand(perms: Permission[]): Permission[] {
  const out = [...perms];
  for (const p of perms) out.push(...(COARSE[p] ?? []));
  return [...new Set(out)];
}

export const ROLE_LABELS: Record<RoleCode, string> = {
  ADMINISTRATEUR: "Administrateur",
  DIRECTEUR: "Directeur",
  SECRETAIRE: "Secrétaire",
  EDUCATEUR: "Éducateur",
  COMPTABLE: "Comptable",
  CONSULTATION: "Consultation",
  PARENT: "Parent",
};

const _BASE: Record<RoleCode, Permission[]> = {
  ADMINISTRATEUR: ALL,
  DIRECTEUR: expand([
    "dashboard.view",
    "children.view",
    "children.create",
    "children.update",
    "children.delete",
    "children.view_medical",
    "families.view",
    "families.create",
    "families.update",
    "families.delete",
    "enrollment.manage",
    "planning.view",
    "planning.update",
    "attendance.view",
    "attendance.create",
    "attendance.update",
    "transmissions.view",
    "transmissions.create",
    "transmissions.update",
    "billing.view",
    "billing.create",
    "billing.update",
    "billing.delete",
    "payments.manage",
    "payments.create",
    "payments.update",
    "staff.view",
    "staff.edit",
    "staff.salary",
    "reports.view",
    "reports.export",
    "documents.view",
    "settings.manage",
    "backup.manage",
    "backup.create",
    "backup.restore",
    "audit.view",
  ]),
  SECRETAIRE: expand([
    "dashboard.view",
    "children.view",
    "children.create",
    "children.update",
    "families.view",
    "families.create",
    "families.update",
    "enrollment.manage",
    "planning.view",
    "attendance.view",
    "attendance.create",
    "attendance.update",
    "transmissions.view",
    "transmissions.create",
    "transmissions.update",
    "billing.view",
    "billing.create",
    "payments.manage",
    "payments.create",
    "staff.view",
    "reports.view",
    "documents.view",
  ]),
  EDUCATEUR: expand([
    "dashboard.view",
    "children.view",
    "families.view",
    "planning.view",
    "attendance.view",
    "attendance.create",
    "attendance.update",
    "transmissions.view",
    "transmissions.create",
    "transmissions.update",
    "activities.manage",
    "care.manage",
    "reports.view",
  ]),
  COMPTABLE: expand([
    "dashboard.view",
    "children.view",
    "families.view",
    "billing.view",
    "billing.create",
    "billing.update",
    "payments.manage",
    "payments.create",
    "payments.update",
    "reports.view",
    "reports.export",
    "documents.view",
  ]),
  CONSULTATION: [
    "dashboard.view",
    "children.view",
    "families.view",
    "planning.view",
    "attendance.view",
    "transmissions.view",
    "reports.view",
  ],
  PARENT: [
    "dashboard.view",
    "children.view",
    "families.view",
    "attendance.view",
    "transmissions.view",
  ],
};

/** Matrice publique : applique l'héritage coarse pour chaque rôle. */
export const ROLE_PERMISSIONS: Record<RoleCode, Permission[]> = Object.fromEntries(
  Object.entries(_BASE).map(([role, perms]) => [
    role,
    role === "ADMINISTRATEUR" ? perms : expand(perms),
  ]),
) as Record<RoleCode, Permission[]>;

export function roleHas(role: RoleCode, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
