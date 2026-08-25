// Badge coloré du statut de pointage d'un enfant pour une journée.
import { cn } from "@/lib/utils";
import type { AttendanceStatus } from "@/lib/models/attendance";

const STATUS_STYLES: Record<AttendanceStatus, { label: string; className: string }> = {
  attendu: { label: "Attendu", className: "bg-info/12 text-info" },
  present: { label: "Présent", className: "bg-success/15 text-success" },
  absent: { label: "Absent", className: "bg-destructive/12 text-destructive" },
  retard: { label: "Retard", className: "bg-warning/20 text-warning-foreground" },
  "depart-anticipe": {
    label: "Départ anticipé",
    className: "bg-yellow-500/18 text-yellow-700 dark:text-yellow-400",
  },
};

export function AttendanceStatusBadge({
  status,
  className,
}: {
  status: AttendanceStatus;
  className?: string;
}) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        style.className,
        className,
      )}
    >
      {style.label}
    </span>
  );
}

export function attendanceStatusLabel(status: AttendanceStatus): string {
  return STATUS_STYLES[status].label;
}
