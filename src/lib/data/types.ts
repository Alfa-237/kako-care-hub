// Modèles de données KAKO Manager (structure relationnelle locale)

export type ID = string;

export type RoleCode =
  | "ADMINISTRATEUR"
  | "DIRECTEUR"
  | "SECRETAIRE"
  | "EDUCATEUR"
  | "COMPTABLE"
  | "CONSULTATION"
  | "PARENT";

export interface User {
  id: ID;
  username: string;
  fullName: string;
  passwordHash: string;
  role: RoleCode;
  status: "actif" | "suspendu";
  createdAt: string;
  lastLoginAt: string | null;
  isDemo: boolean;
  /** Optionnel : renseigné pour les comptes créés via l'inscription. */
  email?: string;
  phone?: string;
  /** Renseigné pour le rôle PARENT : identifiant de la famille rattachée. */
  familyId?: ID | null;
}

export interface Establishment {
  id: ID;
  name: string;
  address: string;
  phone: string;
  email: string;
  currency: string;
  legalMentions: string;
  capacity: number;
  autoLockMinutes: number;
}

export interface Section {
  id: ID;
  name: string;
  ageMin: number;
  ageMax: number;
  capacity: number;
  color: string;
  isDemo: boolean;
}

export type ChildStatus = "Préinscrit" | "Inscrit" | "Suspendu" | "Sorti";

export interface Child {
  id: ID;
  fileNumber: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: "F" | "M";
  photo: string | null;
  address: string;
  registrationDate: string;
  startDate: string;
  sectionId: ID | null;
  status: ChildStatus;
  language: string;
  notes: string;
  medicalAlert: string | null;
  missingDocuments: string[];
  contractEndDate: string | null;
  isDemo: boolean;
}

export interface Parent {
  id: ID;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  job: string;
  idDocument: string;
  isDemo: boolean;
}

export interface ChildParent {
  id: ID;
  childId: ID;
  parentId: ID;
  relation: string;
  canPickUp: boolean;
  isEmergencyContact: boolean;
  receivesDocuments: boolean;
  canSign: boolean;
  isDemo: boolean;
}

/**
 * Pointage quotidien (phase 3B) — voir src/lib/models/attendance.ts.
 * Remplace l'ancien modèle « Attendance » (state attendu/present/parti/absent),
 * migré automatiquement au chargement par db.ts.
 */
export type { AttendanceRecord } from "../models/attendance";

/** Cahier de liaison quotidien (phase 3C) — voir src/lib/models/daily-transmission.ts. */
export type { DailyTransmission } from "../models/daily-transmission";

/** Contacts & autorisations par famille (phase 7) — voir src/lib/models/authorized-person.ts. */
export type { AuthorizedPerson } from "../models/authorized-person";

export interface Employee {
  id: ID;
  firstName: string;
  lastName: string;
  jobTitle: string;
  phone: string;
  sectionId: ID | null;
  hireDate: string;
  contractType: string;
  presentToday: boolean;
  isDemo: boolean;
}

export type InvoiceStatus =
  "Non payée" | "Partiellement payée" | "Payée" | "En retard" | "Annulée" | "Remboursée";

export interface Invoice {
  id: ID;
  number: string;
  date: string;
  dueDate: string;
  childId: ID;
  parentId: ID | null;
  total: number;
  discount: number;
  paidAmount: number;
  status: InvoiceStatus;
  isDemo: boolean;
}

export interface Payment {
  id: ID;
  invoiceId: ID;
  date: string;
  amount: number;
  method: "Espèces" | "Virement" | "Chèque" | "Carte" | "Mobile money" | "Autre";
  recordedBy: ID | null;
  isDemo: boolean;
}

export interface Activity {
  id: ID;
  date: string;
  title: string;
  category: string;
  description: string;
  childIds: ID[];
  isDemo: boolean;
}

export interface AuditLog {
  id: ID;
  at: string;
  userId: ID | null;
  userName: string;
  action: string;
  detail: string;
}

export interface Backup {
  id: ID;
  at: string;
  label: string;
  size: number;
  kind: "manuelle" | "automatique" | "sécurité";
}

export interface Database {
  version: number;
  establishment: Establishment;
  users: User[];
  sections: Section[];
  families: import("../models/family").FamilyRecord[];
  children: Child[];
  parents: Parent[];
  childParents: ChildParent[];
  authorizedPersons: import("../models/authorized-person").AuthorizedPerson[];
  attendance: import("../models/attendance").AttendanceRecord[];
  dailyTransmissions: import("../models/daily-transmission").DailyTransmission[];
  employees: Employee[];
  invoices: Invoice[];
  payments: Payment[];
  activities: Activity[];
  auditLogs: AuditLog[];
  backups: Backup[];
}

export type CollectionKey = {
  [K in keyof Database]: Database[K] extends Array<unknown> ? K : never;
}[keyof Database];
