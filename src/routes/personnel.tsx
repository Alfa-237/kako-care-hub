import { useMemo, useState } from "react";
import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth/auth-context";
import { useDatabase } from "@/lib/data/db";
import { useEmployees, useAllEmployeeSchedules } from "@/hooks/use-employees";
import { EmployeeCard } from "@/components/staff/employee-card";
import { EmployeeFormDialog } from "@/components/staff/employee-form-dialog";
import { StaffingAlertBanner } from "@/components/staff/staffing-alert-banner";
import { getStaffingAlerts, getScheduleConflicts } from "@/lib/business/staffing";
import { useChildSchedules, useScheduleExceptions, useSections } from "@/hooks/use-planning";
import { localDateISO } from "@/lib/models/attendance";
import { FONCTIONS, FONCTION_LABELS, type Fonction } from "@/lib/models/employee";

export const Route = createFileRoute("/personnel")({
  head: () => ({
    meta: [
      { title: "Personnel — KAKO Manager" },
      { name: "description", content: "Employés, plannings et alertes ratio." },
      { property: "og:title", content: "Personnel — KAKO Manager" },
      { property: "og:description", content: "Employés, plannings et alertes ratio." },
    ],
  }),
  component: PersonnelLayout,
});

function PersonnelLayout() {
  const { pathname } = useRouterState().location;
  if (pathname !== "/personnel") return <Outlet />;
  return <Page />;
}

function Page() {
  const { can } = useAuth();
  const db = useDatabase();
  const { data: employees, isLoading } = useEmployees();
  const { data: empSchedules } = useAllEmployeeSchedules();
  const { data: sections } = useSections();
  const { data: childSchedules } = useChildSchedules();
  const { data: exceptions } = useScheduleExceptions();
  const [search, setSearch] = useState("");
  const [filterFonction, setFilterFonction] = useState<Fonction | "">("");
  const [formOpen, setFormOpen] = useState(false);

  const staffingAlerts = useMemo(() => {
    if (!db || !empSchedules || !sections || !childSchedules || !exceptions) return [];
    return getStaffingAlerts(
      db.children,
      childSchedules,
      exceptions,
      sections,
      db.employees,
      empSchedules,
      localDateISO(),
    );
  }, [db, empSchedules, sections, childSchedules, exceptions]);

  const conflicts = useMemo(() => {
    if (!empSchedules) return [];
    return getScheduleConflicts(db?.employees ?? [], empSchedules);
  }, [empSchedules, db?.employees]);

  const filtered = useMemo(() => {
    if (!employees) return [];
    return employees.filter((e) => {
      const matchSearch =
        !search ||
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        e.phone.includes(search);
      const matchFonction = !filterFonction || e.fonction === filterFonction;
      return matchSearch && matchFonction;
    });
  }, [employees, search, filterFonction]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const f of FONCTIONS) map[f] = 0;
    for (const e of employees ?? []) map[e.fonction] = (map[e.fonction] ?? 0) + 1;
    return map;
  }, [employees]);

  return (
    <AppShell permission="staff.view">
      <PageHeader
        title="Personnel"
        description={`${employees?.length ?? 0} employés · ${staffingAlerts.length} alerte(s) ratio`}
        actions={
          can("personnel.manage") ? (
            <Button size="sm" onClick={() => setFormOpen(true)}>
              <Plus className="mr-1 h-4 w-4" /> Ajouter
            </Button>
          ) : null
        }
      />

      <StaffingAlertBanner staffingAlerts={staffingAlerts} conflicts={conflicts} />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={!filterFonction ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilterFonction("")}
          >
            Tous ({employees?.length ?? 0})
          </Badge>
          {FONCTIONS.map((f) => (
            <Badge
              key={f}
              variant={filterFonction === f ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilterFonction(f === filterFonction ? "" : f)}
            >
              {FONCTION_LABELS[f]} ({counts[f] ?? 0})
            </Badge>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[72px] rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun employé trouvé.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((e) => (
            <EmployeeCard key={e.id} employee={e} />
          ))}
        </div>
      )}

      <EmployeeFormDialog open={formOpen} onOpenChange={setFormOpen} />
    </AppShell>
  );
}
