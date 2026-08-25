// Module Présences — pointage quotidien ultra-rapide (phase 3B).
// Arrivées, départs et absences en 2 clics ; navigation par journée.
import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, CalendarDays } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useDatabase } from "@/lib/data/db";
import { fullName } from "@/lib/business/stats";
import { localDateISO } from "@/lib/models/attendance";
import type { AttendanceStatus } from "@/lib/models/attendance";
import { useTodayAttendance, useAttendanceSummary } from "@/hooks/use-attendance";
import type { AttendanceIntent } from "@/components/attendance/attendance-card";
import { AttendanceCard } from "@/components/attendance/attendance-card";
import { AttendanceStatsBar } from "@/components/attendance/attendance-stats-bar";
import { ArrivalDialog } from "@/components/attendance/arrival-dialog";
import { DepartureDialog } from "@/components/attendance/departure-dialog";
import { AbsenceDialog } from "@/components/attendance/absence-dialog";

export const Route = createFileRoute("/presences")({
  head: () => ({
    meta: [
      { title: "Présences — KAKO Manager" },
      { name: "description", content: "Pointage quotidien : arrivées, départs et absences." },
      { property: "og:title", content: "Présences — KAKO Manager" },
      {
        property: "og:description",
        content: "Pointage quotidien : arrivées, départs et absences.",
      },
    ],
  }),
  component: PresencesPage,
});

type StatusFilter = "tous" | AttendanceStatus;

const STATUS_FILTER_LABELS: Record<StatusFilter, string> = {
  tous: "Tous les statuts",
  attendu: "Attendus",
  present: "Présents",
  absent: "Absents",
  retard: "Retards",
  "depart-anticipe": "Départs anticipés",
};

function PresencesPage() {
  return (
    <AppShell permission="attendance.view">
      <Presences />
    </AppShell>
  );
}

interface DialogState {
  intent: AttendanceIntent;
  childId: string;
  childName: string;
}

function Presences() {
  const db = useDatabase();
  const [date, setDate] = useState(localDateISO());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("tous");
  const [dialog, setDialog] = useState<DialogState | null>(null);

  const attendanceQuery = useTodayAttendance(date);
  const summary = useAttendanceSummary(date);

  const rows = useMemo(() => {
    if (!db) return [];
    const enrolled = db.children
      .filter((c) => c.status === "Inscrit")
      .sort((a, b) => fullName(a).localeCompare(fullName(b), "fr"));
    const records = new Map((attendanceQuery.data ?? []).map((r) => [r.childId, r]));
    return enrolled.map((child) => ({
      child,
      sectionName: db.sections.find((s) => s.id === child.sectionId)?.name ?? "Sans section",
      record: records.get(child.id) ?? null,
    }));
  }, [db, attendanceQuery.data]);

  const filtered = useMemo(() => {
    const q = search
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    return rows.filter(({ child, record }) => {
      const status = record?.status ?? "attendu";
      if (statusFilter !== "tous" && status !== statusFilter) return false;
      if (!q) return true;
      const haystack = `${child.firstName} ${child.lastName} ${child.fileNumber}`
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [rows, search, statusFilter]);

  function handleAction(childId: string, childName: string, intent: AttendanceIntent) {
    setDialog({ intent, childId, childName });
  }

  const dateLabel = new Date(`${date}T12:00:00`).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Présences du jour"
        description={`${dateLabel.charAt(0).toUpperCase()}${dateLabel.slice(1)} — pointage des enfants inscrits`}
        actions={
          <label className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 shadow-sm">
            <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
            <input
              type="date"
              value={date}
              max={localDateISO()}
              onChange={(e) => e.target.value && setDate(e.target.value)}
              aria-label="Choisir la journée de pointage"
              className="bg-transparent text-sm outline-none"
            />
          </label>
        }
      />

      <AttendanceStatsBar summary={summary.data} isPending={summary.isPending} />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un enfant (nom, prénom, dossier)…"
            aria-label="Rechercher un enfant dans la liste de pointage"
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
          <SelectTrigger className="w-full sm:w-[200px]" aria-label="Filtrer par statut">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(STATUS_FILTER_LABELS) as StatusFilter[]).map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_FILTER_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {statusFilter !== "tous" || search ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch("");
              setStatusFilter("tous");
            }}
          >
            Réinitialiser les filtres
          </Button>
        ) : null}
      </div>

      {attendanceQuery.isPending || !db ? (
        <div className="space-y-3" aria-busy="true">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[92px] rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-muted/20 px-6 py-10 text-center">
          <h2 className="text-sm font-semibold">Aucun enfant ne correspond</h2>
          <p className="mx-auto mt-1 max-w-sm text-[13px] text-muted-foreground">
            {rows.length === 0
              ? "Aucun enfant inscrit pour cette période. Ajoutez des enfants depuis le module Enfants."
              : "Essayez de modifier la recherche ou le filtre de statut."}
          </p>
        </div>
      ) : (
        <ul className="space-y-3" aria-label="Liste de pointage du jour">
          {filtered.map(({ child, sectionName, record }) => (
            <AttendanceCard
              key={child.id}
              child={child}
              sectionName={sectionName}
              record={record}
              onAction={(intent) => handleAction(child.id, fullName(child), intent)}
            />
          ))}
        </ul>
      )}

      {dialog ? (
        <>
          <ArrivalDialog
            childId={dialog.childId}
            childName={dialog.childName}
            date={date}
            open={dialog.intent === "arrival"}
            onOpenChange={(open) => !open && setDialog(null)}
          />
          <DepartureDialog
            childId={dialog.childId}
            childName={dialog.childName}
            date={date}
            open={dialog.intent === "departure"}
            onOpenChange={(open) => !open && setDialog(null)}
          />
          <AbsenceDialog
            childId={dialog.childId}
            childName={dialog.childName}
            date={date}
            open={dialog.intent === "absence"}
            onOpenChange={(open) => !open && setDialog(null)}
          />
        </>
      ) : null}
    </div>
  );
}
