import {
  Droplets,
  ExternalLink,
  FileWarning,
  HeartPulse,
  Moon,
  NotebookPen,
  Pill,
  Plus,
  Siren,
  Utensils,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Panel } from "@/components/common/panel";
import { StatusPill } from "@/components/common/status-pill";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDatabase } from "@/lib/data/db";
import { ageLabel, formatDate, formatMoney, fullName } from "@/lib/business/stats";
import type { Child } from "@/lib/data/types";

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 truncate text-[13.5px] font-medium">{value || "—"}</p>
    </div>
  );
}

function DetailEmpty({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-dashed bg-muted/20 px-6 py-10 text-center">
      <div className="mx-auto grid size-11 place-items-center rounded-xl bg-card text-muted-foreground shadow-sm">
        <Icon className="size-5" />
      </div>
      <h3 className="mt-3 text-sm font-semibold">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-[13px] text-muted-foreground">{text}</p>
    </div>
  );
}

const GENDER_LABEL: Record<"F" | "M", string> = { F: "Fille", M: "Garçon" };

function attendanceInfo(state: string): {
  label: string;
  tone: "success" | "danger" | "info" | "warning";
} {
  switch (state) {
    case "present":
      return { label: "Présent", tone: "success" };
    case "absent":
      return { label: "Absent", tone: "danger" };
    case "parti":
      return { label: "Parti", tone: "info" };
    default:
      return { label: "Attendu", tone: "warning" };
  }
}

function invoiceTone(status: string): "success" | "warning" | "danger" | "info" | "neutral" {
  switch (status) {
    case "Payée":
      return "success";
    case "Remboursée":
      return "info";
    case "En retard":
      return "danger";
    case "Partiellement payée":
    case "Non payée":
      return "warning";
    default:
      return "neutral";
  }
}

const FUTURE_TABS: Array<{ value: string; label: string; module: string }> = [
  { value: "repas", label: "Repas", module: "Repas & Hygiène" },
  { value: "sommeil", label: "Sommeil", module: "Repas & Hygiène" },
  { value: "changes", label: "Changes", module: "Repas & Hygiène" },
  { value: "incidents", label: "Incidents", module: "Incidents" },
  { value: "medicaments", label: "Médicaments", module: "Médicaments" },
  { value: "transmissions", label: "Transmissions", module: "Transmissions" },
];

const FUTURE_ICONS: Record<string, LucideIcon> = {
  repas: Utensils,
  sommeil: Moon,
  changes: Droplets,
  incidents: Siren,
  medicaments: Pill,
  transmissions: NotebookPen,
};

export function ChildDetail({ child }: { child: Child }) {
  const db = useDatabase();
  if (!db) return null;

  const section = db.sections.find((s) => s.id === child.sectionId);
  const currency = db.establishment.currency;

  const familyLinks = db.childParents.filter((cp) => cp.childId === child.id);
  const family = familyLinks
    .map((link) => ({ link, parent: db.parents.find((p) => p.id === link.parentId) }))
    .filter((x) => x.parent);

  const attendances = db.attendance
    .filter((a) => a.childId === child.id)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 30);

  const activities = db.activities
    .filter((a) => a.childIds.includes(child.id))
    .sort((a, b) => b.date.localeCompare(a.date));

  const invoices = db.invoices
    .filter((i) => i.childId === child.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Tabs defaultValue="infos" className="space-y-4">
      <TabsList className="h-auto w-full flex-wrap justify-start">
        <TabsTrigger value="infos">Informations générales</TabsTrigger>
        <TabsTrigger value="famille">Famille</TabsTrigger>
        <TabsTrigger value="sante">Santé</TabsTrigger>
        <TabsTrigger value="presences">Présences</TabsTrigger>
        <TabsTrigger value="activites">Activités</TabsTrigger>
        <TabsTrigger value="facturation">Facturation</TabsTrigger>
        {FUTURE_TABS.map((t) => (
          <TabsTrigger key={t.value} value={t.value}>
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="infos" className="space-y-5">
        <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          <InfoRow label="N° de dossier" value={child.fileNumber} />
          <InfoRow label="Nom complet" value={fullName(child)} />
          <InfoRow
            label="Date de naissance"
            value={`${formatDate(child.birthDate)} · ${ageLabel(child.birthDate)}`}
          />
          <InfoRow label="Sexe" value={GENDER_LABEL[child.gender]} />
          <InfoRow label="Section" value={section?.name ?? "Sans section"} />
          <InfoRow label="Statut" value={child.status} />
          <InfoRow label="Langue" value={child.language} />
          <InfoRow label="Adresse" value={child.address} />
          <InfoRow label="Date d'inscription" value={formatDate(child.registrationDate)} />
          <InfoRow label="Début d'accueil" value={formatDate(child.startDate)} />
          <InfoRow
            label="Fin de contrat"
            value={child.contractEndDate ? formatDate(child.contractEndDate) : null}
          />
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Observations
          </p>
          <p className="mt-1.5 rounded-lg border bg-muted/30 px-3.5 py-2.5 text-[13.5px] leading-relaxed">
            {child.notes || "Aucune observation enregistrée."}
          </p>
        </div>
      </TabsContent>

      <TabsContent value="famille">
        {family.length === 0 ? (
          <DetailEmpty
            icon={HeartPulse}
            title="Aucun responsable enregistré"
            text="Les parents et tuteurs de cet enfant pourront être rattachés depuis le module Familles."
          />
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {family.map(({ link, parent }) => (
              <li key={link.id} className="rounded-xl border bg-card p-4 shadow-card">
                <p className="truncate text-[14px] font-semibold">
                  <Link
                    to="/familles/$id"
                    params={{ id: parent!.id }}
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
                    title="Voir la fiche de la famille"
                  >
                    {fullName(parent!)}
                    <ExternalLink className="size-3 text-muted-foreground" />
                  </Link>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{link.relation}</p>
                {parent!.phone || parent!.email ? (
                  <p className="mt-2 text-[13px] text-muted-foreground">
                    {parent!.phone}
                    {parent!.phone && parent!.email ? " · " : ""}
                    {parent!.email}
                  </p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {link.canPickUp ? (
                    <StatusPill tone="success">Peut récupérer l'enfant</StatusPill>
                  ) : null}
                  {link.isEmergencyContact ? (
                    <StatusPill tone="warning">Contact d'urgence</StatusPill>
                  ) : null}
                  {link.receivesDocuments ? (
                    <StatusPill tone="info">Reçoit les documents</StatusPill>
                  ) : null}
                  {link.canSign ? <StatusPill tone="primary">Peut signer</StatusPill> : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </TabsContent>

      <TabsContent value="sante">
        <div className="grid gap-3 md:grid-cols-2">
          <Panel title="Alertes médicales" icon={HeartPulse} className="shadow-none">
            {child.medicalAlert ? (
              <div className="flex items-start gap-3 rounded-lg bg-destructive/10 px-3.5 py-3">
                <HeartPulse className="mt-0.5 size-4 shrink-0 text-destructive" />
                <p className="text-sm">{child.medicalAlert}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aucune alerte médicale enregistrée.</p>
            )}
          </Panel>
          <Panel title="Documents manquants" icon={FileWarning} className="shadow-none">
            {child.missingDocuments.length === 0 ? (
              <p className="text-sm text-muted-foreground">Dossier administratif complet.</p>
            ) : (
              <ul className="space-y-2">
                {child.missingDocuments.map((d) => (
                  <li
                    key={d}
                    className="flex items-center gap-2.5 rounded-lg border bg-warning/10 px-3 py-2 text-sm"
                  >
                    <FileWarning className="size-4 shrink-0 text-warning-foreground" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </TabsContent>

      <TabsContent value="presences">
        {attendances.length === 0 ? (
          <DetailEmpty
            icon={HeartPulse}
            title="Aucune présence enregistrée"
            text="Les pointages quotidiens de cet enfant apparaîtront ici une fois le module Présences actif."
          />
        ) : (
          <ul className="divide-y overflow-hidden rounded-xl border bg-card shadow-card">
            {attendances.map((a) => {
              const info = attendanceInfo(a.state);
              return (
                <li key={a.id} className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-5">
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-semibold">{formatDate(a.date)}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {a.arrivalTime ? `Arrivée ${a.arrivalTime}` : "Pas d'arrivée"}
                      {a.departureTime ? ` · Départ ${a.departureTime}` : ""}
                      {a.late ? " · En retard" : ""}
                      {a.earlyLeave ? " · Départ anticipé" : ""}
                    </p>
                    {a.absenceReason ? (
                      <p className="mt-0.5 text-xs text-destructive">Raison : {a.absenceReason}</p>
                    ) : null}
                  </div>
                  <StatusPill tone={info.tone}>{info.label}</StatusPill>
                </li>
              );
            })}
          </ul>
        )}
      </TabsContent>

      <TabsContent value="activites">
        {activities.length === 0 ? (
          <DetailEmpty
            icon={Plus}
            title="Aucune activité enregistrée"
            text="Les activités pédagogiques auxquelles cet enfant participe apparaîtront ici."
          />
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {activities.map((a) => (
              <li key={a.id} className="rounded-xl border bg-card p-4 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <p className="min-w-0 truncate text-[14px] font-semibold">{a.title}</p>
                  <StatusPill tone="primary">{a.category}</StatusPill>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{formatDate(a.date)}</p>
                <p className="mt-2 text-[13px] text-muted-foreground">{a.description}</p>
              </li>
            ))}
          </ul>
        )}
      </TabsContent>

      <TabsContent value="facturation">
        {invoices.length === 0 ? (
          <DetailEmpty
            icon={Plus}
            title="Aucune facture"
            text="Les factures de cet enfant apparaîtront ici une fois générées depuis le module Facturation."
          />
        ) : (
          <div className="overflow-hidden rounded-xl border bg-card shadow-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-2.5 font-semibold">Facture</th>
                  <th className="px-4 py-2.5 font-semibold">Date</th>
                  <th className="px-4 py-2.5 font-semibold">Total</th>
                  <th className="px-4 py-2.5 font-semibold">Reste à payer</th>
                  <th className="px-4 py-2.5 font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="transition-colors hover:bg-muted/40">
                    <td className="px-4 py-3 font-medium">{inv.number}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(inv.date)}</td>
                    <td className="px-4 py-3 tabular-nums">
                      {formatMoney(inv.total - inv.discount, currency)}
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      {formatMoney(
                        Math.max(inv.total - inv.discount - inv.paidAmount, 0),
                        currency,
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill tone={invoiceTone(inv.status)}>{inv.status}</StatusPill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TabsContent>

      {FUTURE_TABS.map((t) => {
        const Icon = FUTURE_ICONS[t.value] ?? NotebookPen;
        return (
          <TabsContent key={t.value} value={t.value}>
            <DetailEmpty
              icon={Icon}
              title={`${t.label} : à venir`}
              text={`Cet onglet sera alimenté automatiquement lorsque le module ${t.module} sera implémenté.`}
            />
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
