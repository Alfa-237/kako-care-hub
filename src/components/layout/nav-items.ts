import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Baby,
  Users,
  ClipboardList,
  ClipboardCheck,
  CalendarDays,
  BookOpen,
  Palette,
  Utensils,
  ReceiptText,
  Wallet,
  Briefcase,
  BarChart3,
  FileText,
  Settings,
  DatabaseBackup,
  ShieldCheck,
  ScrollText,
} from "lucide-react";
import type { Permission } from "@/lib/auth/permissions";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  permission: Permission;
  group: "Pilotage" | "Vie de la crèche" | "Gestion" | "Système";
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Tableau de bord",
    to: "/",
    icon: LayoutDashboard,
    permission: "dashboard.view",
    group: "Pilotage",
  },
  { label: "Enfants", to: "/enfants", icon: Baby, permission: "children.view", group: "Pilotage" },
  {
    label: "Familles",
    to: "/familles",
    icon: Users,
    permission: "families.view",
    group: "Pilotage",
  },
  {
    label: "Présences",
    to: "/presences",
    icon: ClipboardCheck,
    permission: "attendance.view",
    group: "Pilotage",
  },
  {
    label: "Transmissions",
    to: "/transmissions",
    icon: BookOpen,
    permission: "transmissions.view",
    group: "Pilotage",
  },
  {
    label: "Inscriptions",
    to: "/inscriptions",
    icon: ClipboardList,
    permission: "enrollment.manage",
    group: "Pilotage",
  },
  {
    label: "Planning",
    to: "/planning",
    icon: CalendarDays,
    permission: "planning.view",
    group: "Vie de la crèche",
  },
  {
    label: "Activités",
    to: "/activites",
    icon: Palette,
    permission: "activities.manage",
    group: "Vie de la crèche",
  },
  {
    label: "Repas & Hygiène",
    to: "/repas-hygiene",
    icon: Utensils,
    permission: "care.manage",
    group: "Vie de la crèche",
  },
  {
    label: "Facturation",
    to: "/facturation",
    icon: ReceiptText,
    permission: "billing.view",
    group: "Gestion",
  },
  {
    label: "Paiements",
    to: "/paiements",
    icon: Wallet,
    permission: "payments.manage",
    group: "Gestion",
  },
  {
    label: "Personnel",
    to: "/personnel",
    icon: Briefcase,
    permission: "staff.view",
    group: "Gestion",
  },
  {
    label: "Rapports",
    to: "/rapports",
    icon: BarChart3,
    permission: "reports.view",
    group: "Gestion",
  },
  {
    label: "Documents",
    to: "/documents",
    icon: FileText,
    permission: "documents.view",
    group: "Gestion",
  },
  {
    label: "Paramètres",
    to: "/parametres",
    icon: Settings,
    permission: "settings.manage",
    group: "Système",
  },
  {
    label: "Sauvegarde",
    to: "/sauvegarde",
    icon: DatabaseBackup,
    permission: "backup.manage",
    group: "Système",
  },
  {
    label: "Utilisateurs",
    to: "/utilisateurs",
    icon: ShieldCheck,
    permission: "users.manage",
    group: "Système",
  },
  {
    label: "Journal d'audit",
    to: "/audit",
    icon: ScrollText,
    permission: "audit.view",
    group: "Système",
  },
];

export const NAV_GROUPS = ["Pilotage", "Vie de la crèche", "Gestion", "Système"] as const;
