import { StatusPill } from "@/components/common/status-pill";
import { ROLE_LABELS } from "@/lib/auth/permissions";
import type { RoleCode } from "@/lib/data/types";

const ROLE_TONE: Record<RoleCode, "info" | "success" | "warning" | "neutral" | "danger"> = {
  ADMINISTRATEUR: "danger",
  DIRECTEUR: "success",
  SECRETAIRE: "info",
  EDUCATEUR: "warning",
  COMPTABLE: "neutral",
  CONSULTATION: "neutral",
  PARENT: "info",
};

export function RoleBadge({ role }: { role: RoleCode }) {
  return <StatusPill tone={ROLE_TONE[role] ?? "neutral"}>{ROLE_LABELS[role]}</StatusPill>;
}
