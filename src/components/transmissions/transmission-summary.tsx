// Résumé quotidien imprimable de la transmission (phase 3C).
// Zone .print-area : seule zone visible à l'impression (voir src/styles/print.css).
import { Droplets, Moon, Palette, Pill, Siren, Utensils } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Child } from "@/lib/data/types";
import type { DailyTransmission } from "@/lib/models/daily-transmission";
import {
  DIAPER_TYPE_LABELS,
  INCIDENT_TYPE_LABELS,
  MEAL_TYPE_LABELS,
  MOOD_LABELS,
  NAP_QUALITY_LABELS,
  QUANTITY_LABELS,
  SEVERITY_LABELS,
  WAKE_UP_MOOD_LABELS,
  formatDuration,
} from "@/lib/models/daily-transmission";
import { ageLabel, formatDate, fullName } from "@/lib/business/stats";

function SummarySection({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="summary-section">
      <h2 className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide">
        <Icon className="size-4" aria-hidden="true" />
        {title}
      </h2>
      <div className="mt-1.5">{children}</div>
    </section>
  );
}

function EmptyLine({ text }: { text: string }) {
  return <p className="summary-empty">{text}</p>;
}

export function TransmissionSummary({
  transmission,
  child,
  establishmentName,
}: {
  transmission: DailyTransmission;
  child: Child;
  establishmentName?: string;
}) {
  const totalEvents =
    transmission.meals.length +
    transmission.naps.length +
    transmission.diaperChanges.length +
    transmission.activities.length +
    transmission.incidents.length +
    transmission.medications.length;

  return (
    <div
      className="print-area rounded-xl border bg-card p-5 shadow-card sm:p-7"
      data-testid="transmission-summary"
    >
      <header className="border-b pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              {establishmentName ?? "KAKO Manager"}
            </p>
            <h2 className="mt-1 text-lg font-bold">
              Transmission du jour — {formatDate(transmission.date)}
            </h2>
          </div>
          <p className="text-right text-[13px]">
            <strong>{fullName(child)}</strong>
            <br />
            <span className="text-muted-foreground">
              Né(e) le {formatDate(child.birthDate)} · {ageLabel(child.birthDate)}
            </span>
            <br />
            <span className="text-muted-foreground">N° dossier {child.fileNumber}</span>
          </p>
        </div>
      </header>

      <div className="grid gap-x-8 gap-y-4 py-4 sm:grid-cols-2 print:grid-cols-1">
        <SummarySection icon={Palette} title="État général">
          <ul className="space-y-0.5 text-[13px]">
            <li>
              Humeur :{" "}
              <strong>
                {transmission.mood ? MOOD_LABELS[transmission.mood] : "non renseignée"}
              </strong>
            </li>
            <li>
              Température :{" "}
              <strong>
                {transmission.temperature ? `${transmission.temperature} °C` : "non relevée"}
              </strong>
            </li>
          </ul>
        </SummarySection>

        <SummarySection icon={Utensils} title={`Repas (${transmission.meals.length})`}>
          {transmission.meals.length === 0 ? (
            <EmptyLine text="Aucun repas consigné." />
          ) : (
            <ul className="space-y-0.5 text-[13px]">
              {transmission.meals.map((m) => (
                <li key={m.id}>
                  {m.time} — {MEAL_TYPE_LABELS[m.type]}
                  {m.quantity ? ` (${QUANTITY_LABELS[m.quantity]})` : ""}
                  {m.quantityMl ? ` (${m.quantityMl} ml)` : ""}
                  {m.description ? ` : ${m.description}` : ""}
                </li>
              ))}
            </ul>
          )}
        </SummarySection>

        <SummarySection icon={Moon} title={`Siestes (${transmission.naps.length})`}>
          {transmission.naps.length === 0 ? (
            <EmptyLine text="Aucune sieste consignée." />
          ) : (
            <ul className="space-y-0.5 text-[13px]">
              {transmission.naps.map((n) => (
                <li key={n.id}>
                  {n.startTime}
                  {n.endTime ? ` → ${n.endTime}` : ""}
                  {n.durationMinutes ? ` (${formatDuration(n.durationMinutes)})` : ""} —{" "}
                  {NAP_QUALITY_LABELS[n.quality]}
                  {n.wakeUpMood
                    ? `, réveil ${WAKE_UP_MOOD_LABELS[n.wakeUpMood].toLowerCase()}`
                    : ""}
                </li>
              ))}
            </ul>
          )}
        </SummarySection>

        <SummarySection icon={Droplets} title={`Changes (${transmission.diaperChanges.length})`}>
          {transmission.diaperChanges.length === 0 ? (
            <EmptyLine text="Aucun change consigné." />
          ) : (
            <ul className="space-y-0.5 text-[13px]">
              {transmission.diaperChanges.map((c) => (
                <li key={c.id}>
                  {c.time} — {DIAPER_TYPE_LABELS[c.type]}
                  {c.irritation ? " · irritation" : ""}
                  {c.productUsed ? ` (${c.productUsed})` : ""}
                </li>
              ))}
            </ul>
          )}
        </SummarySection>

        <SummarySection icon={Palette} title={`Activités (${transmission.activities.length})`}>
          {transmission.activities.length === 0 ? (
            <EmptyLine text="Aucune activité consignée." />
          ) : (
            <ul className="space-y-0.5 text-[13px]">
              {transmission.activities.map((a) => (
                <li key={a.id}>
                  <strong>{a.name}</strong>
                  {a.category ? ` (${a.category})` : ""}
                  {a.observations ? ` : ${a.observations}` : ""}
                  {a.skillsObserved && a.skillsObserved.length > 0
                    ? ` — compétences : ${a.skillsObserved.join(", ")}`
                    : ""}
                </li>
              ))}
            </ul>
          )}
        </SummarySection>

        <SummarySection icon={Siren} title={`Incidents (${transmission.incidents.length})`}>
          {transmission.incidents.length === 0 ? (
            <EmptyLine text="Aucun incident signalé." />
          ) : (
            <ul className="space-y-1 text-[13px]">
              {transmission.incidents.map((i) => (
                <li key={i.id}>
                  {i.time} — {INCIDENT_TYPE_LABELS[i.type]} (
                  <strong>{SEVERITY_LABELS[i.severity]}</strong>) : {i.description}
                  {i.actionTaken ? ` · Mesures : ${i.actionTaken}` : ""} ·{" "}
                  {i.parentsNotified ? "Parents informés ✓" : "Parents non informés ✗"}
                </li>
              ))}
            </ul>
          )}
        </SummarySection>

        <SummarySection icon={Pill} title={`Médicaments (${transmission.medications.length})`}>
          {transmission.medications.length === 0 ? (
            <EmptyLine text="Aucun médicament administré." />
          ) : (
            <ul className="space-y-0.5 text-[13px]">
              {transmission.medications.map((m) => (
                <li key={m.id}>
                  {m.time} — {m.name} ({m.dosage}){m.reason ? ` · Motif : ${m.reason}` : ""}
                  {m.administeredBy ? ` · Par ${m.administeredBy}` : ""}
                </li>
              ))}
            </ul>
          )}
        </SummarySection>

        <SummarySection icon={Palette} title="Observations générales">
          {transmission.generalNotes ? (
            <p className="text-[13px] leading-relaxed">{transmission.generalNotes}</p>
          ) : (
            <EmptyLine text="Aucune observation particulière." />
          )}
        </SummarySection>
      </div>

      <footer className="summary-signatures mt-2 border-t pt-5">
        <p className="mb-3 text-[11px] text-muted-foreground">
          {totalEvents} événement{totalEvents > 1 ? "s" : ""} consigné
          {totalEvents > 1 ? "s" : ""} · Document généré par KAKO Manager le{" "}
          {new Date().toLocaleDateString("fr-FR")} · À remettre à la famille en fin de journée.
        </p>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p>Signature éducateur :</p>
            <div className="signature-line" aria-hidden="true" />
          </div>
          <div>
            <p>Signature parent :</p>
            <div className="signature-line" aria-hidden="true" />
          </div>
        </div>
      </footer>
    </div>
  );
}
