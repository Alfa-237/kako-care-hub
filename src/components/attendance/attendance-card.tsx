// Carte enfant du pointage quotidien : statut, horaires et actions contextuelles.
// Objectif : pointer en 2 clics maximum, avec des boutons larges et accessibles.
import { BookOpen, CalendarX, LogIn, LogOut, Pencil } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fullName, initials } from "@/lib/business/stats";
import { ABSENCE_TYPE_LABELS } from "@/lib/models/attendance";
import type { AttendanceRecord } from "@/lib/models/attendance";
import type { Child as ChildData } from "@/lib/data/types";
import { AttendanceStatusBadge } from "./attendance-status-badge";

export type AttendanceIntent = "arrival" | "departure" | "absence";

export function AttendanceCard({
  child,
  sectionName,
  record,
  onAction,
}: {
  child: ChildData;
  sectionName: string;
  record: AttendanceRecord | null;
  onAction: (intent: AttendanceIntent) => void;
}) {
  const status = record?.status ?? "attendu";

  return (
    <li
      className={cn(
        "flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl border bg-card p-4 shadow-card transition-colors sm:p-5",
        status === "absent" && "opacity-90",
      )}
      data-testid={`attendance-${child.id}`}
      data-status={status}
    >
      <Link
        to="/enfants/$id"
        params={{ id: child.id }}
        className="grid size-12 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary transition-colors hover:bg-primary/20"
        title={`Voir la fiche de ${fullName(child)}`}
      >
        {initials(child)}
      </Link>

      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 truncate text-[14.5px] font-semibold">
          {fullName(child)}
          <AttendanceStatusBadge status={status} />
        </p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{sectionName}</p>
        <AttendanceTimes record={record} />
      </div>

      <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
        {(status === "attendu" || status === "absent") && (
          <Button
            size="lg"
            onClick={() => onAction("arrival")}
            aria-label={`Pointer l'arrivée de ${fullName(child)}`}
            className={
              status === "attendu"
                ? "min-w-[120px] bg-success text-success-foreground hover:bg-success/90"
                : "min-w-[120px] border-success/40 text-success hover:bg-success/10"
            }
            variant={status === "attendu" ? "default" : "outline"}
          >
            <LogIn className="mr-1.5 size-4" aria-hidden="true" />
            Arrivée
          </Button>
        )}
        {(status === "attendu" || status === "absent") && (
          <Button
            size="lg"
            variant={status === "attendu" ? "destructive" : "outline"}
            onClick={() => onAction("absence")}
            aria-label={`Enregistrer l'absence de ${fullName(child)}`}
            className={
              status === "attendu"
                ? "min-w-[110px]"
                : "min-w-[110px] border-destructive/40 text-destructive hover:bg-destructive/10"
            }
          >
            <CalendarX className="mr-1.5 size-4" aria-hidden="true" />
            {status === "attendu" ? "Absent" : "Absence"}
          </Button>
        )}
        {(status === "present" || status === "retard") && (
          <Button
            size="lg"
            onClick={() => onAction("departure")}
            aria-label={`Pointer le départ de ${fullName(child)}`}
            className="min-w-[120px] bg-warning text-warning-foreground hover:bg-warning/90"
          >
            <LogOut className="mr-1.5 size-4" aria-hidden="true" />
            Départ
          </Button>
        )}
        {status === "depart-anticipe" && (
          <Button
            size="lg"
            variant="outline"
            onClick={() => onAction("departure")}
            aria-label={`Modifier le départ de ${fullName(child)}`}
            className="min-w-[140px]"
          >
            <Pencil className="mr-1.5 size-4" aria-hidden="true" />
            Modifier le départ
          </Button>
        )}
        {(status === "present" || status === "retard" || status === "depart-anticipe") && (
          <Button asChild size="lg" variant="ghost" className="border border-input">
            <Link
              to="/transmissions/$childId"
              params={{ childId: child.id }}
              aria-label={`Voir la transmission du jour de ${fullName(child)}`}
              data-testid="card-transmission-link"
            >
              <BookOpen className="mr-1.5 size-4" aria-hidden="true" />
              Transmission
            </Link>
          </Button>
        )}
      </div>
    </li>
  );
}

function AttendanceTimes({ record }: { record: AttendanceRecord | null }) {
  if (!record || record.status === "attendu") {
    return <p className="mt-1 text-xs text-muted-foreground">Pas encore pointé</p>;
  }
  if (record.status === "absent") {
    return (
      <p className="mt-1 text-xs text-destructive">
        {record.absenceType ? ABSENCE_TYPE_LABELS[record.absenceType] : "Absent"}
        {record.absenceReason ? ` · ${record.absenceReason}` : ""}
      </p>
    );
  }
  return (
    <p className="mt-1 text-xs tabular-nums text-muted-foreground">
      {record.arrivalTime ? `Arrivée ${record.arrivalTime}` : "Pas d'arrivée"}
      {record.arrivalAccompaniedBy ? ` (${record.arrivalAccompaniedBy})` : ""}
      {record.departureTime ? ` · Départ ${record.departureTime}` : ""}
      {record.departureTime && record.departurePickedUpBy
        ? ` par ${record.departurePickedUpBy}`
        : ""}
    </p>
  );
}
