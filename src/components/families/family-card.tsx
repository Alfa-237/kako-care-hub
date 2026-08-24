import type { FC } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Users } from "lucide-react";
import type { Family } from "@/lib/business/families";
import { fullName, initials } from "@/lib/business/stats";
import { StatusPill } from "@/components/common/status-pill";
import { cn } from "@/lib/utils";

const STATUS_TONES = {
  Active: "success",
  Inactive: "warning",
  Archivée: "neutral",
} as const;

interface FamilyCardProps {
  family: Family;
  className?: string;
}

export const FamilyCard: FC<FamilyCardProps> = ({ family, className }) => {
  const childrenPreview = family.children.slice(0, 4);
  const extraChildren = family.children.length - childrenPreview.length;

  return (
    <div
      className={cn(
        "group flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
          {initials(family.parent)}
        </div>
        <div className="flex items-center gap-2">
          <StatusPill tone={STATUS_TONES[family.record.status]}>{family.record.status}</StatusPill>
          <Link
            to="/familles/$id"
            params={{ id: family.record.id }}
            aria-label={`Voir la fiche de la famille ${family.record.name}`}
            className="grid size-8 place-items-center rounded-lg text-muted-foreground opacity-0 transition-opacity outline-none group-hover:opacity-100 hover:bg-muted hover:text-foreground focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      <Link
        to="/familles/$id"
        params={{ id: family.record.id }}
        className="min-w-0 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <p className="truncate text-[15px] font-bold leading-tight tracking-tight">
          {family.record.name}
        </p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {fullName(family.parent) || family.parent.job || "Responsable à définir"}
        </p>
      </Link>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          <Users className="size-3" />
          {Math.max(family.members.length, family.record.primaryParentId ? 1 : 0)} responsable
          {family.members.length > 1 ? "s" : ""}
        </span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
          {family.children.length} enfant{family.children.length > 1 ? "s" : ""}
        </span>
      </div>

      {childrenPreview.length > 0 ? (
        <ul className="min-h-0 space-y-1">
          {childrenPreview.map((c) => (
            <li key={c.id} className="flex min-w-0 items-center gap-2 text-[13px]">
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full text-[9px] font-bold",
                  c.gender === "F" ? "bg-pink-500/15 text-pink-600" : "bg-sky-500/15 text-sky-600",
                )}
              >
                {c.firstName.charAt(0)}
              </span>
              <span className="truncate font-medium">{fullName(c)}</span>
            </li>
          ))}
          {extraChildren > 0 ? (
            <li className="pl-7 text-xs text-muted-foreground">
              + {extraChildren} autre{extraChildren > 1 ? "s" : ""}
            </li>
          ) : null}
        </ul>
      ) : (
        <p className="text-xs italic text-muted-foreground/60">Aucun enfant rattaché</p>
      )}

      <div className="mt-auto pt-1">
        <Link
          to="/familles/$id"
          params={{ id: family.record.id }}
          className="flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
        >
          Voir la famille
          <ArrowRight className="size-3.5" />
          <span className="sr-only">— {family.record.name}</span>
        </Link>
      </div>
    </div>
  );
};
