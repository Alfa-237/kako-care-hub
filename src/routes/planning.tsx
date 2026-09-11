import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CalendarClock,
  CalendarX2,
  Users,
  CheckCircle2,
  TriangleAlert,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDatabase } from "@/lib/data/db";
import { useAuth } from "@/lib/auth/auth-context";
import { fullName, initials } from "@/lib/business/stats";
import { localDateISO } from "@/lib/models/attendance";
import { sectionInitials } from "@/lib/models/section";
import { getExpectedSlots, getSectionLoads } from "@/lib/business/planning";
import {
  useChildSchedules,
  useScheduleExceptions,
  useSections,
  formatDateFr,
  sectionColorClass,
} from "@/hooks/use-planning";
import { ChildScheduleDialog } from "@/components/planning/child-schedule-dialog";
import { ScheduleExceptionDialog } from "@/components/planning/schedule-exception-dialog";
import { useEmployees, useAllEmployeeSchedules } from "@/hooks/use-employees";
import { StaffingAlertBanner } from "@/components/staff/staffing-alert-banner";
import { getStaffingAlerts, getScheduleConflicts } from "@/lib/business/staffing";

export const Route = createFileRoute("/planning")({
  head: () => ({
    meta: [
      { title: "Planning — KAKO Manager" },
      {
        name: "description",
        content: "Planning prévisionnel des enfants par jour et par semaine.",
      },
      { property: "og:title", content: "Planning — KAKO Manager" },
      { property: "og:description", content: "Planning des enfants : vues jour et semaine." },
    ],
  }),
  component: PlanningPage,
});

function PlanningPage() {
  return (
    <AppShell permission="planning.view">
      <Planning />
    </AppShell>
  );
}

type ViewMode = "jour" | "semaine";

function shiftDate(dateISO: string, days: number): string {
  const d = new Date(`${dateISO}T12:00:00`);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(dateStr: string, offset: number): string {
  const d = new Date(`${dateStr}T12:00:00`);
  d.setDate(d.getDate() + offset);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function weekDates(anchor: string): string[] {
  const dow = new Date(`${anchor}T12:00:00`).getDay();
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const monday = addDays(anchor, mondayOffset);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

function Planning() {
  const db = useDatabase();
  const { can } = useAuth();
  const [view, setView] = useState<ViewMode>("jour");
  const [date, setDate] = useState(localDateISO());
  const [scheduleDialog, setScheduleDialog] = useState<{ childId?: string } | null>(null);
  const [exceptionDialog, setExceptionDialog] = useState<{
    childId?: string;
    childName?: string;
    date?: string;
  } | null>(null);

  const childrenQuery = useChildSchedules();
  const exceptionsQuery = useScheduleExceptions();
  const sectionsQuery = useSections();
  const employeesQuery = useEmployees();
  const empSchedulesQuery = useAllEmployeeSchedules();

  const children = useMemo(() => db?.children ?? [], [db]);
  const schedules = useMemo(() => childrenQuery.data ?? [], [childrenQuery.data]);
  const exceptions = useMemo(() => exceptionsQuery.data ?? [], [exceptionsQuery.data]);
  const sections = useMemo(() => sectionsQuery.data ?? [], [sectionsQuery.data]);

  // Jour : créneaux attendus + jauges par section.
  const daySlots = useMemo(
    () => getExpectedSlots({ children, schedules, exceptions, date }),
    [children, schedules, exceptions, date],
  );
  const loads = useMemo(
    () => getSectionLoads({ children, sections, schedules, exceptions, date }),
    [children, sections, schedules, exceptions, date],
  );
  const overAny = loads.some((l) => l.overCapacity);

  // Semaine : groupes par jour.
  const weekDays = useMemo(() => weekDates(date), [date]);
  const weekCounts = useMemo(
    () =>
      weekDays.map((d) => getExpectedSlots({ children, schedules, exceptions, date: d }).length),
    [weekDays, children, schedules, exceptions],
  );

  const pending =
    !db || childrenQuery.isPending || exceptionsQuery.isPending || sectionsQuery.isPending;
  const enableEdit = can("planning.update");

  const sortedLoads = [...loads].sort((a, b) => b.expected - a.expected);

  const staffingAlerts = useMemo(() => {
    if (!empSchedulesQuery.data) return [];
    return getStaffingAlerts(
      children,
      schedules,
      exceptions,
      sections,
      db?.employees ?? [],
      empSchedulesQuery.data,
      date,
    );
  }, [children, schedules, exceptions, sections, empSchedulesQuery.data, db?.employees, date]);

  const staffingConflicts = useMemo(() => {
    if (!empSchedulesQuery.data) return [];
    return getScheduleConflicts(db?.employees ?? [], empSchedulesQuery.data);
  }, [empSchedulesQuery.data, db?.employees]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Planning des enfants"
        description={
          view === "jour"
            ? `${formatDateFr(date).charAt(0).toUpperCase()}${formatDateFr(date).slice(1)} — ${daySlots.length} enfant(s) attendu(s)`
            : "Vue semaine — effectifs prévus par jour"
        }
        actions={
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg border bg-card p-0.5 shadow-sm">
              {(["jour", "semaine"] as ViewMode[]).map((m) => (
                <Button
                  key={m}
                  size="sm"
                  variant={view === m ? "default" : "ghost"}
                  className="capitalize"
                  onClick={() => setView(m)}
                >
                  {m}
                </Button>
              ))}
            </div>
            {enableEdit ? (
              <Button onClick={() => setScheduleDialog({})}>
                <CalendarClock className="mr-2 size-4" aria-hidden="true" />
                Planning hebdo
              </Button>
            ) : null}
          </div>
        }
      />

      <StaffingAlertBanner staffingAlerts={staffingAlerts} conflicts={staffingConflicts} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            aria-label="Jour précédent"
            onClick={() => setDate(shiftDate(date, view === "jour" ? -1 : -7))}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </Button>
          <label className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 shadow-sm">
            <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
            <input
              type="date"
              value={date}
              onChange={(e) => e.target.value && setDate(e.target.value)}
              aria-label="Choisir une date"
              className="bg-transparent text-sm outline-none"
            />
          </label>
          <Button
            variant="outline"
            size="icon"
            aria-label="Jour suivant"
            onClick={() => setDate(shiftDate(date, view === "jour" ? 1 : 7))}
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
        {enableEdit ? (
          <Button
            variant={overAny ? "default" : "outline"}
            className={overAny ? "bg-warning text-warning-foreground hover:bg-warning/90" : ""}
            onClick={() => setExceptionDialog({ date })}
          >
            <CalendarX2 className="mr-2 size-4" aria-hidden="true" />
            Ajouter une exception
          </Button>
        ) : null}
      </div>

      {pending ? (
        <div className="space-y-3" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : view === "jour" ? (
        <>
          {/* Jauges de capacité par section */}
          <section
            className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
            aria-label="Capacités par section"
          >
            {sortedLoads.map((l) => (
              <div
                key={l.sectionId}
                className={`rounded-xl border bg-card p-4 shadow-card ${
                  l.overCapacity
                    ? "border-destructive/50"
                    : l.nearCapacity
                      ? "border-warning/50"
                      : ""
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold ${sectionColorClass(l.color)}`}
                    >
                      {sectionInitials(l.name)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{l.name}</p>
                      <p className="text-xs text-muted-foreground tabular-nums">
                        {l.expected} attendu(s) / {l.capacity} places
                      </p>
                    </div>
                  </div>
                  <span className="text-xl font-bold tabular-nums text-primary">
                    {l.loadPercent}%
                  </span>
                </div>
                <Progress
                  value={Math.min(100, l.loadPercent)}
                  className={`mt-3 h-2 ${
                    l.overCapacity ? "bg-destructive/20 [&>div]:bg-destructive" : ""
                  }`}
                />
                {l.overCapacity ? (
                  <p className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-destructive">
                    <TriangleAlert className="size-3.5" aria-hidden="true" />
                    Capacité dépassée
                  </p>
                ) : l.nearCapacity ? (
                  <p className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-warning-foreground">
                    <TriangleAlert className="size-3.5" aria-hidden="true" />
                    Bientôt saturé
                  </p>
                ) : null}
              </div>
            ))}
            {sortedLoads.length === 0 && (
              <div className="rounded-xl border border-dashed bg-muted/20 px-6 py-8 text-center text-sm text-muted-foreground sm:col-span-2 xl:col-span-3">
                Aucune section configurée.
              </div>
            )}
          </section>

          {/* Liste des enfants attendus */}
          <section className="overflow-hidden rounded-xl border bg-card shadow-card">
            <div className="flex items-center justify-between gap-3 border-b bg-muted/25 px-5 py-3">
              <h2 className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
                <Users className="size-4 text-primary" aria-hidden="true" />
                Enfants attendus · {daySlots.length}
              </h2>
              {enableEdit ? (
                <Button variant="ghost" size="sm" onClick={() => setExceptionDialog({ date })}>
                  <CalendarX2 className="mr-1.5 size-4" aria-hidden="true" /> Exception
                </Button>
              ) : null}
            </div>
            <ul className="divide-y">
              {[...daySlots]
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((slot) => {
                  const child = children.find((c) => c.id === slot.childId);
                  const section = sections.find((s) => s.id === slot.sectionId);
                  return (
                    <li
                      key={slot.childId}
                      className="flex items-center gap-3 px-5 py-2.5 transition-colors hover:bg-muted/40"
                    >
                      <span
                        className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold ${sectionColorClass(section?.color ?? "")}`}
                      >
                        {child ? initials(child) : "?"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] font-medium">
                          {child ? fullName(child) : slot.childName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {section?.name ?? "Sans section"}
                        </p>
                      </div>
                      <span className="hidden shrink-0 text-xs tabular-nums text-muted-foreground sm:block">
                        {slot.startTime} – {slot.endTime}
                      </span>
                      {slot.type !== "regulier" ? (
                        <Badge
                          variant={
                            slot.type === "absence"
                              ? "destructive"
                              : slot.type === "activite"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {slot.type === "depart-avance"
                            ? "Départ anticipé"
                            : slot.type === "absence"
                              ? "Absence"
                              : slot.type === "activite"
                                ? "Activité"
                                : "Exception"}
                        </Badge>
                      ) : null}
                      {enableEdit && child ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Exception pour ${fullName(child)}`}
                          onClick={() =>
                            setExceptionDialog({
                              childId: child.id,
                              childName: fullName(child),
                              date,
                            })
                          }
                        >
                          <CalendarX2 className="size-4" aria-hidden="true" />
                        </Button>
                      ) : null}
                    </li>
                  );
                })}
              {daySlots.length === 0 && (
                <li className="px-5 py-8 text-center text-sm text-muted-foreground">
                  Aucun enfant prévu ce jour. Ajoutez des plannings hebdomadaires ou consultez une
                  autre date.
                </li>
              )}
            </ul>
          </section>
        </>
      ) : (
        /* Vue semaine : tableau 7 jours × sections */
        <section className="overflow-hidden rounded-xl border bg-card shadow-card">
          <div className="border-b bg-muted/25 px-5 py-3">
            <h2 className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
              <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
              Effectifs prévus par jour
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="w-40 px-3 py-2.5"></th>
                  {weekDays.map((d) => {
                    const label = new Date(`${d}T12:00:00`).toLocaleDateString("fr-FR", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                    });
                    const count = weekCounts[weekDays.indexOf(d)] ?? 0;
                    return (
                      <th key={d} className="px-3 py-2.5 text-left font-medium">
                        <span className="capitalize">{label}</span>
                        <span
                          className={`ml-1.5 text-xs tabular-nums ${count === 0 ? "text-muted-foreground" : "text-primary"}`}
                        >
                          · {count}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {sections.map((sec) => {
                  const perDay = weekDays.map((d) =>
                    getExpectedSlots({ children, schedules, exceptions, date: d }).filter(
                      (s) => s.sectionId === sec.id,
                    ),
                  );
                  return (
                    <tr key={sec.id} className="border-b last:border-0">
                      <td className="w-40 px-3 py-2 font-medium text-muted-foreground">
                        {sec.name}
                      </td>
                      {perDay.map((slots, i) => {
                        const day = weekDays[i]!;
                        const load = Math.round((slots.length / sec.capacity) * 100);
                        return (
                          <td key={day} className="px-3 py-2 align-top">
                            {slots.length === 0 ? (
                              <span className="text-xs text-muted-foreground/60">—</span>
                            ) : (
                              <div
                                className={`space-y-0.5 rounded-lg border p-2 ${
                                  slots.length > sec.capacity
                                    ? "border-destructive/50 bg-destructive/5"
                                    : "bg-muted/30"
                                }`}
                              >
                                <p className="text-xs font-medium tabular-nums">
                                  {slots.length}/{sec.capacity}
                                  {load >= 90 ? (
                                    <TriangleAlert
                                      className="ml-1 inline size-3 text-warning-foreground"
                                      aria-hidden="true"
                                    />
                                  ) : null}
                                </p>
                                <Progress value={Math.min(100, load)} className="h-1.5" />
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {scheduleDialog ? (
        <ChildScheduleDialog
          childId={scheduleDialog.childId}
          open={Boolean(scheduleDialog)}
          onOpenChange={(open) => {
            if (!open) setScheduleDialog(null);
          }}
        />
      ) : null}
      {exceptionDialog ? (
        <ScheduleExceptionDialog
          childId={exceptionDialog.childId}
          childName={exceptionDialog.childName}
          date={exceptionDialog.date}
          open={Boolean(exceptionDialog)}
          onOpenChange={(open) => {
            if (!open) setExceptionDialog(null);
          }}
        />
      ) : null}
    </div>
  );
}
