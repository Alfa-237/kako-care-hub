// Barre de statistiques du jour : 5 cartes compactes (phase 3B).
import { CalendarClock, CheckCircle2, Percent, UserX, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AttendanceSummary } from "@/lib/services/data-service";
import { Skeleton } from "@/components/ui/skeleton";

function StatBox({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  accent?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-card">
      <span
        className={cn("grid size-9 shrink-0 place-items-center rounded-lg bg-muted", accent)}
        aria-hidden="true"
      >
        <Icon className="size-4.5" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="text-lg font-bold leading-tight tabular-nums">{value}</p>
      </div>
    </div>
  );
}

export function AttendanceStatsBar({
  summary,
  isPending,
}: {
  summary: AttendanceSummary | undefined;
  isPending: boolean;
}) {
  if (isPending || !summary) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5" aria-busy="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[68px] rounded-xl" />
        ))}
      </div>
    );
  }
  const taux = `${summary.tauxOccupation} %`;
  return (
    <section aria-label="Statistiques du jour" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <StatBox
        icon={Users}
        label="Attendus"
        value={summary.totalAttendu}
        accent="bg-primary/10 text-primary"
      />
      <StatBox
        icon={CheckCircle2}
        label="Présents"
        value={summary.totalPresent}
        accent="bg-success/12 text-success"
      />
      <StatBox
        icon={UserX}
        label="Absents"
        value={summary.totalAbsent}
        accent="bg-destructive/10 text-destructive"
      />
      <StatBox
        icon={CalendarClock}
        label="Retards"
        value={summary.totalRetard}
        accent="bg-warning/18 text-warning-foreground"
      />
      <StatBox icon={Percent} label="Taux de présence" value={taux} />
    </section>
  );
}
