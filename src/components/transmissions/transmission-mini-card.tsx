// Carte compacte d'un enfant dans la liste des transmissions du jour (phase 3C).
import { Link } from "@tanstack/react-router";
import { AlertTriangle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fullName, initials } from "@/lib/business/stats";
import type { Child } from "@/lib/data/types";
import type { DailyTransmission } from "@/lib/models/daily-transmission";
import { MOOD_EMOJI } from "@/lib/models/daily-transmission";

export function TransmissionMiniCard({
  child,
  transmission,
}: {
  child: Child;
  transmission: DailyTransmission | undefined;
}) {
  // Transmission incomplète : pas encore de repas ou de sieste consigné.
  const incomplete =
    !transmission || transmission.meals.length === 0 || transmission.naps.length === 0;
  const summary = [
    `${transmission?.meals.length ?? 0} repas`,
    `${transmission?.naps.length ?? 0} sieste${(transmission?.naps.length ?? 0) > 1 ? "s" : ""}`,
    `${transmission?.diaperChanges.length ?? 0} change${(transmission?.diaperChanges.length ?? 0) > 1 ? "s" : ""}`,
    `${transmission?.incidents.length ?? 0} incident${(transmission?.incidents.length ?? 0) > 1 ? "s" : ""}`,
  ].join(" · ");

  return (
    <li
      className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl border bg-card p-4 shadow-card transition-colors sm:p-5"
      data-testid={`transmission-card-${child.id}`}
      data-incomplete={incomplete ? "true" : "false"}
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
        <p className="flex flex-wrap items-center gap-2 truncate text-[14.5px] font-semibold">
          {fullName(child)}
          {transmission?.mood ? (
            <span
              className="inline-flex items-center gap-1 rounded-full border bg-muted/40 px-2 py-0.5 text-[11px] font-medium"
              data-testid="mood-badge"
            >
              <span aria-hidden="true">{MOOD_EMOJI[transmission.mood]}</span>
              Humeur
            </span>
          ) : null}
          {incomplete ? (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-[11px] font-medium text-warning-foreground"
              title="Transmission incomplète"
            >
              <AlertTriangle className="size-3" aria-hidden="true" />
              Incomplète
            </span>
          ) : null}
        </p>
        <p className={cn("mt-0.5 text-xs text-muted-foreground")} data-testid="mini-summary">
          {summary}
        </p>
      </div>

      <Button asChild className="min-w-[170px]">
        <Link
          to="/transmissions/$childId"
          params={{ childId: child.id }}
          aria-label={`Ouvrir la transmission de ${fullName(child)}`}
        >
          <BookOpen className="mr-1.5 size-4" aria-hidden="true" />
          Ouvrir la transmission
        </Link>
      </Button>
    </li>
  );
}
