// Bandeau d'alertes ratio personnel + conflits horaires (phase 8B).
import { AlertTriangle } from "lucide-react";
import type { StaffingAlert, ScheduleConflict } from "@/lib/business/staffing";

export function StaffingAlertBanner({
  staffingAlerts,
  conflicts,
}: {
  staffingAlerts: StaffingAlert[];
  conflicts: ScheduleConflict[];
}) {
  if (staffingAlerts.length === 0 && conflicts.length === 0) return null;
  return (
    <div className="space-y-2">
      {staffingAlerts.map((a) => (
        <div
          key={a.sectionId}
          className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Personnel insuffisant : <strong>{a.section}</strong> ({a.actual} présent
            {a.actual > 1 ? "s" : ""} / {a.needed} requis)
          </span>
        </div>
      ))}
      {conflicts.map((c, i) => (
        <div
          key={`${c.employeeId}-${c.day}-${i}`}
          className="flex items-start gap-2 rounded-lg border border-orange-300 bg-orange-50 px-3 py-2 text-sm text-orange-700"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Horaires incompatibles : <strong>{c.employeeName}</strong> — {c.label}
          </span>
        </div>
      ))}
    </div>
  );
}
