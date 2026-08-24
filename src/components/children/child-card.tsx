import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { FileWarning, HeartPulse } from "lucide-react";
import { ageLabel } from "@/lib/business/stats";
import type { Child } from "@/lib/data/types";
import { ChildAvatar } from "./child-avatar";
import { ChildStatusBadge } from "./child-status-badge";

export function ChildCard({
  child,
  sectionName,
  actions,
}: {
  child: Child;
  sectionName?: string;
  actions?: ReactNode;
}) {
  const hasAlert = Boolean(child.medicalAlert);
  const hasMissingDocs = child.missingDocuments.length > 0;

  return (
    <div className="group flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <Link
          to="/enfants/$id"
          params={{ id: child.id }}
          aria-label={`Voir la fiche de ${child.firstName} ${child.lastName}`}
          className="rounded-full outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChildAvatar
            photo={child.photo}
            firstName={child.firstName}
            lastName={child.lastName}
            className="size-14 text-base"
          />
        </Link>
        <div className="flex items-center gap-1.5">
          <ChildStatusBadge status={child.status} />
          {actions}
        </div>
      </div>

      <Link
        to="/enfants/$id"
        params={{ id: child.id }}
        className="min-w-0 outline-none focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-ring"
      >
        <p className="truncate text-[15px] font-bold leading-tight tracking-tight">
          {child.firstName} {child.lastName}
        </p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {child.fileNumber} · {ageLabel(child.birthDate)}
        </p>
      </Link>

      <div className="mt-auto flex flex-wrap items-center gap-1.5">
        {sectionName ? (
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
            {sectionName}
          </span>
        ) : null}
        {hasAlert ? (
          <span
            title={`Alerte médicale : ${child.medicalAlert ?? ""}`}
            className="grid size-6 place-items-center rounded-full bg-destructive/12 text-destructive"
          >
            <HeartPulse className="size-3.5" />
          </span>
        ) : null}
        {hasMissingDocs ? (
          <span
            title={`Documents manquants : ${child.missingDocuments.join(", ")}`}
            className="grid size-6 place-items-center rounded-full bg-warning/18 text-warning-foreground"
          >
            <FileWarning className="size-3.5" />
          </span>
        ) : null}
      </div>
    </div>
  );
}
