// Conteneur des 6 sections du cahier de liaison : repas, siestes, changes,
// activités, incidents, médicaments (phase 3C).
// Chaque item est éditable/supprimable ; les boutons respectent la permission
// transmissions.edit via la prop canEdit.
import { useState } from "react";
import { Droplets, Moon, Palette, Pencil, Pill, Plus, Siren, Trash2, Utensils } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import type { TransmissionSectionKey } from "@/lib/services/data-service";
import type {
  ActivityRecord,
  DailyTransmission,
  DiaperChangeRecord,
  IncidentRecord,
  MealRecord,
  MedicationRecord,
  NapRecord,
} from "@/lib/models/daily-transmission";
import {
  DIAPER_TYPE_LABELS,
  INCIDENT_TYPE_LABELS,
  MEAL_TYPE_LABELS,
  NAP_QUALITY_LABELS,
  QUANTITY_LABELS,
  SEVERITY_LABELS,
  formatDuration,
} from "@/lib/models/daily-transmission";
import {
  useAddActivity,
  useAddDiaperChange,
  useAddIncident,
  useAddMeal,
  useAddMedication,
  useAddNap,
  useRemoveTransmissionItem,
} from "@/hooks/use-daily-transmissions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MealDialog } from "./meal-dialog";
import { NapDialog } from "./nap-dialog";
import { DiaperChangeDialog } from "./diaper-change-dialog";
import { ActivityDialog } from "./activity-dialog";
import { IncidentDialog } from "./incident-dialog";
import { MedicationDialog } from "./medication-dialog";

type AnySubRecord =
  MealRecord | NapRecord | DiaperChangeRecord | ActivityRecord | IncidentRecord | MedicationRecord;

const SECTION_ICONS: Record<TransmissionSectionKey, LucideIcon> = {
  meals: Utensils,
  naps: Moon,
  diaperChanges: Droplets,
  activities: Palette,
  incidents: Siren,
  medications: Pill,
};

const SECTION_TITLES: Record<TransmissionSectionKey, string> = {
  meals: "Repas",
  naps: "Siestes",
  diaperChanges: "Changes",
  activities: "Activités",
  incidents: "Incidents",
  medications: "Médicaments",
};

const ADD_LABELS: Record<TransmissionSectionKey, string> = {
  meals: "Ajouter un repas",
  naps: "Ajouter une sieste",
  diaperChanges: "Ajouter un change",
  activities: "Ajouter une activité",
  incidents: "Signaler un incident",
  medications: "Ajouter un médicament",
};

function ItemLine({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start justify-between gap-2 px-3 py-2 text-[13px]">{children}</li>
  );
}

export function TransmissionSections({
  transmission,
  childName,
  canEdit,
}: {
  transmission: DailyTransmission;
  childName: string;
  canEdit: boolean;
}) {
  const [dialog, setDialog] = useState<{
    key: TransmissionSectionKey;
    editing?: AnySubRecord;
  } | null>(null);
  const removeItem = useRemoveTransmissionItem();

  const counts: Record<TransmissionSectionKey, number> = {
    meals: transmission.meals.length,
    naps: transmission.naps.length,
    diaperChanges: transmission.diaperChanges.length,
    activities: transmission.activities.length,
    incidents: transmission.incidents.length,
    medications: transmission.medications.length,
  };

  async function handleRemove(key: TransmissionSectionKey, itemId: string, label: string) {
    try {
      await removeItem.mutateAsync({ transmissionId: transmission.id, key, itemId });
      toast.success(`${label} supprimé`);
    } catch {
      toast.error("Erreur", { description: "La suppression a échoué." });
    }
  }

  function renderItems(key: TransmissionSectionKey) {
    const editBtn = (item: AnySubRecord, label: string) =>
      canEdit ? (
        <span className="flex shrink-0 gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setDialog({ key, editing: item })}
            aria-label={`Modifier ${label}`}
            className="size-7"
          >
            <Pencil className="size-3.5" aria-hidden="true" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => void handleRemove(key, item.id, label)}
            aria-label={`Supprimer ${label}`}
            className="size-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
          </Button>
        </span>
      ) : null;

    switch (key) {
      case "meals":
        return transmission.meals.map((m) => (
          <ItemLine key={m.id}>
            <span className="min-w-0 flex-1">
              <strong>{m.time}</strong> · {MEAL_TYPE_LABELS[m.type]}
              {m.quantity ? ` (${QUANTITY_LABELS[m.quantity]})` : ""}
              {m.quantityMl ? ` (${m.quantityMl} ml)` : ""}
              {m.description ? (
                <span className="text-muted-foreground"> — {m.description}</span>
              ) : null}
            </span>
            {editBtn(m, "le repas")}
          </ItemLine>
        ));
      case "naps":
        return transmission.naps.map((n) => (
          <ItemLine key={n.id}>
            <span className="min-w-0 flex-1">
              <strong>{n.startTime}</strong>
              {n.endTime ? ` → ${n.endTime}` : ""}
              {n.durationMinutes ? ` (${formatDuration(n.durationMinutes)})` : ""} ·{" "}
              {NAP_QUALITY_LABELS[n.quality]}
            </span>
            {editBtn(n, "la sieste")}
          </ItemLine>
        ));
      case "diaperChanges":
        return transmission.diaperChanges.map((c) => (
          <ItemLine key={c.id}>
            <span className="min-w-0 flex-1">
              <strong>{c.time}</strong> · {DIAPER_TYPE_LABELS[c.type]}
              {c.irritation ? (
                <span className="ml-1 font-medium text-warning-foreground">· irritation</span>
              ) : null}
              {c.productUsed ? (
                <span className="text-muted-foreground"> ({c.productUsed})</span>
              ) : null}
            </span>
            {editBtn(c, "le change")}
          </ItemLine>
        ));
      case "activities":
        return transmission.activities.map((a) => (
          <ItemLine key={a.id}>
            <span className="min-w-0 flex-1">
              <strong>{a.name}</strong>
              {a.category ? <span className="text-muted-foreground"> ({a.category})</span> : null}
            </span>
            {editBtn(a, "l'activité")}
          </ItemLine>
        ));
      case "incidents":
        return transmission.incidents.map((i) => (
          <li
            key={i.id}
            className={cn(
              "flex items-start justify-between gap-2 rounded-lg px-3 py-2 text-[13px]",
              i.severity === "important" && "bg-destructive/10",
            )}
          >
            <span className="min-w-0 flex-1">
              <strong>{i.time}</strong> · {INCIDENT_TYPE_LABELS[i.type]}{" "}
              <span
                className={cn(
                  "ml-1 inline-flex items-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold",
                  i.severity === "important"
                    ? "bg-destructive text-white"
                    : i.severity === "moyen"
                      ? "bg-warning/20 text-warning-foreground"
                      : "bg-muted text-muted-foreground",
                )}
                data-testid="incident-severity-badge"
              >
                {SEVERITY_LABELS[i.severity]}
              </span>
              <br />
              <span className="text-muted-foreground">{i.description}</span>
              {i.parentsNotified ? (
                <span className="ml-1 text-success">· parents informés ✓</span>
              ) : (
                <span className="ml-1 font-medium text-warning-foreground">
                  · parents non informés
                </span>
              )}
            </span>
            {editBtn(i, "l'incident")}
          </li>
        ));
      case "medications":
        return transmission.medications.map((m) => (
          <ItemLine key={m.id}>
            <span className="min-w-0 flex-1">
              <strong>{m.time}</strong> · {m.name} ({m.dosage})
              {m.administeredBy ? (
                <span className="text-muted-foreground"> · par {m.administeredBy}</span>
              ) : null}
            </span>
            {editBtn(m, "le médicament")}
          </ItemLine>
        ));
    }
  }

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        {(Object.keys(SECTION_TITLES) as TransmissionSectionKey[]).map((key) => {
          const Icon = SECTION_ICONS[key];
          const items = renderItems(key);
          return (
            <section
              key={key}
              className="rounded-xl border bg-card shadow-card"
              data-testid={`section-${key}`}
            >
              <header className="flex flex-wrap items-center gap-2 border-b px-4 py-3">
                <Icon className="size-4 text-primary" aria-hidden="true" />
                <h2 className="text-[14px] font-semibold">{SECTION_TITLES[key]}</h2>
                <span
                  className={cn(
                    "inline-flex min-w-6 justify-center rounded-full px-2 py-0.5 text-[11px] font-bold",
                    key === "incidents" && counts[key] > 0
                      ? "bg-destructive text-white"
                      : "bg-muted text-muted-foreground",
                  )}
                  data-testid={`section-count-${key}`}
                >
                  {counts[key]}
                </span>
                <div className="ml-auto">
                  {canEdit ? (
                    <Button
                      size="sm"
                      variant={key === "incidents" ? "destructive" : "outline"}
                      onClick={() => setDialog({ key })}
                      aria-label={`${ADD_LABELS[key]} pour cette journée`}
                    >
                      <Plus className="mr-1 size-3.5" aria-hidden="true" />
                      {ADD_LABELS[key]}
                    </Button>
                  ) : null}
                </div>
              </header>
              {items.length > 0 ? (
                <ul className="divide-y">{items}</ul>
              ) : (
                <p className="px-4 py-5 text-[13px] text-muted-foreground">
                  Rien à consigner pour le moment.
                </p>
              )}
            </section>
          );
        })}
      </div>

      {dialog ? (
        <>
          <MealDialog
            transmissionId={transmission.id}
            childName={childName}
            open={dialog.key === "meals"}
            onOpenChange={(open) => !open && setDialog(null)}
            initial={
              dialog.key === "meals" ? (dialog.editing as MealRecord | undefined) : undefined
            }
          />
          <NapDialog
            transmissionId={transmission.id}
            childName={childName}
            open={dialog.key === "naps"}
            onOpenChange={(open) => !open && setDialog(null)}
            initial={dialog.key === "naps" ? (dialog.editing as NapRecord | undefined) : undefined}
          />
          <DiaperChangeDialog
            transmissionId={transmission.id}
            childName={childName}
            open={dialog.key === "diaperChanges"}
            onOpenChange={(open) => !open && setDialog(null)}
            initial={
              dialog.key === "diaperChanges"
                ? (dialog.editing as DiaperChangeRecord | undefined)
                : undefined
            }
          />
          <ActivityDialog
            transmissionId={transmission.id}
            childName={childName}
            open={dialog.key === "activities"}
            onOpenChange={(open) => !open && setDialog(null)}
            initial={
              dialog.key === "activities"
                ? (dialog.editing as ActivityRecord | undefined)
                : undefined
            }
          />
          <IncidentDialog
            transmissionId={transmission.id}
            childName={childName}
            open={dialog.key === "incidents"}
            onOpenChange={(open) => !open && setDialog(null)}
            initial={
              dialog.key === "incidents"
                ? (dialog.editing as IncidentRecord | undefined)
                : undefined
            }
          />
          <MedicationDialog
            transmissionId={transmission.id}
            childName={childName}
            open={dialog.key === "medications"}
            onOpenChange={(open) => !open && setDialog(null)}
            initial={
              dialog.key === "medications"
                ? (dialog.editing as MedicationRecord | undefined)
                : undefined
            }
          />
        </>
      ) : null}
    </>
  );
}
