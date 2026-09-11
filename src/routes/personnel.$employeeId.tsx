import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Pencil, CalendarClock, UserX } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth/auth-context";
import { useDatabase } from "@/lib/data/db";
import { useEmployee, useEmployeeSchedule, useUpdateEmployee } from "@/hooks/use-employees";
import { useSections } from "@/hooks/use-planning";
import { EmployeeFormDialog } from "@/components/staff/employee-form-dialog";
import { EmployeeScheduleDialog } from "@/components/staff/employee-schedule-dialog";
import { CONTRACT_LABELS, STATUS_LABELS, employeeFullName, initials } from "@/lib/models/employee";
import type { Employee } from "@/lib/data/types";
import { toast } from "sonner";

const WEEKDAY_LABELS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

export const Route = createFileRoute("/personnel/$employeeId")({
  head: () => ({
    meta: [
      { title: "Fiche employé — KAKO Manager" },
      { name: "description", content: "Détail d'un employé." },
    ],
  }),
  component: EmployeeDetailPage,
});

function EmployeeDetailPage() {
  const { employeeId } = Route.useParams();
  const { can } = useAuth();
  const db = useDatabase();
  const updateEmployee = useUpdateEmployee();
  const { data: employee, isLoading } = useEmployee(employeeId);
  const { data: schedule } = useEmployeeSchedule(employeeId);
  const { data: sections } = useSections();
  const [editOpen, setEditOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const sectionName = (id?: string) => {
    if (!id) return "Volant";
    return sections?.find((s) => s.id === id)?.name ?? id;
  };

  if (isLoading) {
    return (
      <AppShell permission="staff.view">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </AppShell>
    );
  }

  if (!employee) {
    return (
      <AppShell permission="staff.view">
        <p className="text-sm text-muted-foreground">Employé introuvable.</p>
      </AppShell>
    );
  }

  const daysActive = schedule ? schedule.weekdays.length : 0;

  return (
    <AppShell permission="staff.view">
      <Link
        to="/personnel"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Retour au personnel
      </Link>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
          {initials(employee.firstName, employee.lastName)}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-bold">{employeeFullName(employee)}</h1>
          <p className="text-sm text-muted-foreground">{employee.fonction}</p>
        </div>
        <div className="flex gap-2">
          {can("personnel.manage") && (
            <>
              <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                <Pencil className="mr-1 h-4 w-4" /> Modifier
              </Button>
              <Button variant="outline" size="sm" onClick={() => setScheduleOpen(true)}>
                <CalendarClock className="mr-1 h-4 w-4" /> Planning hebdo
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-card p-4 shadow-card space-y-2">
          <h3 className="text-sm font-semibold">Informations</h3>
          <Info label="Téléphone" value={employee.phone} />
          <Info label="Adresse" value={employee.address} />
          <Info label="Qualification" value={employee.qualification} />
          <Info label="Date d'embauche" value={employee.hireDate} />
          <Info label="Contrat" value={CONTRACT_LABELS[employee.contractType]} />
          <Info
            label="Statut"
            badge={
              <Badge variant={employee.status === "actif" ? "default" : "secondary"}>
                {STATUS_LABELS[employee.status]}
              </Badge>
            }
          />
          {employee.notes && <Info label="Notes" value={employee.notes} />}
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-card space-y-2">
          <h3 className="text-sm font-semibold">Planning hebdomadaire</h3>
          {schedule ? (
            <>
              <Info label="Jours" value={`${daysActive} jour(s) / semaine`} />
              <Info label="Horaires" value={`${schedule.startTime} – ${schedule.endTime}`} />
              <Info label="Section" value={sectionName(schedule.section)} />
              <div className="mt-2 flex flex-wrap gap-1">
                {WEEKDAY_LABELS.map((label, idx) => (
                  <Badge
                    key={idx}
                    variant={schedule.weekdays.includes(idx) ? "default" : "outline"}
                    className="text-xs"
                  >
                    {label}
                  </Badge>
                ))}
              </div>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">
              Aucun planning défini.{" "}
              {can("personnel.manage") && (
                <button className="underline text-primary" onClick={() => setScheduleOpen(true)}>
                  Configurer
                </button>
              )}
            </p>
          )}
        </div>
      </div>

      <EmployeeFormDialog open={editOpen} onOpenChange={setEditOpen} existing={employee} />
      <EmployeeScheduleDialog
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        employee={employee}
        existing={schedule ?? null}
        sections={sections ?? []}
      />
    </AppShell>
  );
}

function Info({
  label,
  value,
  badge,
}: {
  label: string;
  value?: string | null | undefined;
  badge?: React.ReactNode | undefined;
}) {
  if (!value && !badge) return null;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-28 shrink-0 text-muted-foreground">{label}</span>
      {badge ?? <span className="font-medium">{value}</span>}
    </div>
  );
}
