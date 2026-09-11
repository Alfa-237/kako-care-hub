// Carte employé pour la liste /personnel (phase 8B).
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { CONTRACT_LABELS, STATUS_LABELS, employeeFullName, initials } from "@/lib/models/employee";
import type { Employee } from "@/lib/data/types";

export function EmployeeCard({ employee }: { employee: Employee }) {
  return (
    <Link
      to="/personnel/$employeeId"
      params={{ employeeId: employee.id }}
      aria-label="Employé"
      className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-card transition-shadow hover:shadow-md"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
        {initials(employee.firstName, employee.lastName)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{employeeFullName(employee)}</p>
        <p className="truncate text-xs text-muted-foreground">{employee.fonction}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <Badge variant={employee.status === "actif" ? "default" : "secondary"}>
          {STATUS_LABELS[employee.status]}
        </Badge>
        <span className="text-[11px] text-muted-foreground">
          {CONTRACT_LABELS[employee.contractType]}
        </span>
      </div>
    </Link>
  );
}
