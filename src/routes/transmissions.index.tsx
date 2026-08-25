// Module Transmissions — cahier de liaison quotidien (phase 3C).
// Liste des enfants accueillis ce jour ; un enfant absent n'apparaît pas.
import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, CalendarDays, Search } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDatabase } from "@/lib/data/db";
import { fullName } from "@/lib/business/stats";
import { localDateISO } from "@/lib/models/attendance";
import { useTodayAttendance } from "@/hooks/use-attendance";
import { useDailyTransmissionsByDate } from "@/hooks/use-daily-transmissions";
import { TransmissionMiniCard } from "@/components/transmissions/transmission-mini-card";

export const Route = createFileRoute("/transmissions/")({
  head: () => ({
    meta: [
      { title: "Transmissions — KAKO Manager" },
      { name: "description", content: "Cahier de liaison quotidien par enfant." },
      { property: "og:title", content: "Transmissions — KAKO Manager" },
      {
        property: "og:description",
        content: "Cahier de liaison quotidien : repas, siestes, changes, incidents.",
      },
    ],
  }),
  component: TransmissionsList,
});

function TransmissionsList() {
  const db = useDatabase();
  const [date, setDate] = useState(localDateISO());
  const [search, setSearch] = useState("");

  const attendanceQuery = useTodayAttendance(date);
  const transmissionsQuery = useDailyTransmissionsByDate(date);

  // Enfants accueillis ce jour : pointage existant et statut différent d'absent.
  const presentChildren = useMemo(() => {
    if (!db) return [];
    const records = new Map((attendanceQuery.data ?? []).map((r) => [r.childId, r]));
    return db.children
      .filter((c) => c.status === "Inscrit")
      .filter((c) => {
        const rec = records.get(c.id);
        return rec !== undefined && rec.status !== "absent";
      })
      .sort((a, b) => fullName(a).localeCompare(fullName(b), "fr"));
  }, [db, attendanceQuery.data]);

  const transmissionByChild = useMemo(
    () => new Map((transmissionsQuery.data ?? []).map((t) => [t.childId, t])),
    [transmissionsQuery.data],
  );

  const filtered = useMemo(() => {
    const q = search
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    if (!q) return presentChildren;
    return presentChildren.filter((c) =>
      `${c.firstName} ${c.lastName} ${c.fileNumber}`
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .includes(q),
    );
  }, [presentChildren, search]);

  const dateLabel = new Date(`${date}T12:00:00`).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Transmissions du jour"
        description={`${dateLabel.charAt(0).toUpperCase()}${dateLabel.slice(1)} — cahier de liaison des enfants accueillis`}
        actions={
          <label className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 shadow-sm">
            <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
            <input
              type="date"
              value={date}
              max={localDateISO()}
              onChange={(e) => e.target.value && setDate(e.target.value)}
              aria-label="Choisir la journée des transmissions"
              className="bg-transparent text-sm outline-none"
            />
          </label>
        }
      />

      <div className="relative max-w-md">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un enfant…"
          aria-label="Rechercher un enfant dans les transmissions du jour"
          className="pl-9"
        />
      </div>

      {attendanceQuery.isPending || transmissionsQuery.isPending || !db ? (
        <div className="space-y-3" aria-busy="true">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[92px] rounded-xl" />
          ))}
        </div>
      ) : presentChildren.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-muted/20 px-6 py-10 text-center">
          <BookOpen className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
          <h2 className="mt-3 text-sm font-semibold">Aucun enfant accueilli ce jour</h2>
          <p className="mx-auto mt-1 max-w-sm text-[13px] text-muted-foreground">
            Les transmissions ne concernent que les enfants pointés présents (ou en retard) dans le
            module Présences. Pointez d'abord les arrivées.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-muted/20 px-6 py-10 text-center">
          <h2 className="text-sm font-semibold">Aucun enfant ne correspond</h2>
          <p className="mx-auto mt-1 max-w-sm text-[13px] text-muted-foreground">
            Essayez de modifier la recherche.
          </p>
        </div>
      ) : (
        <ul className="space-y-3" aria-label="Liste des transmissions du jour">
          {filtered.map((child) => (
            <TransmissionMiniCard
              key={child.id}
              child={child}
              transmission={transmissionByChild.get(child.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
