import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Baby,
  CheckCircle2,
  XCircle,
  Clock,
  LogIn,
  LogOut,
  ReceiptText,
  FileWarning,
  HeartPulse,
  Users,
  Gauge,
  Cake,
  FileSignature,
  Plus,
  CalendarX,
  NotebookPen,
  Wallet,
  DatabaseBackup,
  Activity as ActivityIcon,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { StatusPill } from "@/components/common/status-pill";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth/auth-context";
import { logAction, mutate, useDatabase } from "@/lib/data/db";
import {
  ageLabel,
  computeDashboard,
  formatDateTime,
  formatMoney,
  fullName,
  initials,
} from "@/lib/business/stats";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — KAKO Manager" },
      {
        name: "description",
        content:
          "Pilotez votre crèche au quotidien : présences, alertes, impayés, occupation et actions rapides.",
      },
      { property: "og:title", content: "Tableau de bord — KAKO Manager" },
      {
        property: "og:description",
        content: "Vue opérationnelle de la journée : présences, alertes et indicateurs clés.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <AppShell permission="dashboard.view">
      <Dashboard />
    </AppShell>
  );
}

function Dashboard() {
  const db = useDatabase();
  const { user, can } = useAuth();

  if (!db) return null;
  const s = computeDashboard(db);
  const currency = db.establishment.currency;

  const quickActions = [
    { label: "Ajouter un enfant", icon: Plus, to: "/enfants", perm: "children.edit" as const },
    { label: "Enregistrer une arrivée", icon: LogIn, to: "/presences", perm: "attendance.edit" as const },
    { label: "Enregistrer un départ", icon: LogOut, to: "/presences", perm: "attendance.edit" as const },
    { label: "Ajouter une absence", icon: CalendarX, to: "/presences", perm: "attendance.edit" as const },
    { label: "Ajouter une transmission", icon: NotebookPen, to: "/transmissions", perm: "transmissions.edit" as const },
    { label: "Créer une facture", icon: ReceiptText, to: "/facturation", perm: "billing.edit" as const },
    { label: "Enregistrer un paiement", icon: Wallet, to: "/paiements", perm: "payments.manage" as const },
  ].filter((a) => can(a.perm));

  async function handleBackup() {
    const label = `Sauvegarde du ${new Date().toLocaleString("fr-FR")}`;
    await mutate((d) => {
      d.backups.unshift({
        id: `bkp-${Date.now()}`,
        at: new Date().toISOString(),
        label,
        size: JSON.stringify(d).length,
        kind: "manuelle",
      });
    });
    await logAction(user, "Sauvegarde manuelle", label);
    toast.success("Sauvegarde locale créée", { description: label });
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Bonjour ${user?.fullName.split(" ")[0]} 👋`}
        description={`${db.establishment.name} — résumé de la journée`}
        actions={
          can("backup.manage") ? (
            <Button variant="outline" onClick={() => void handleBackup()}>
              <DatabaseBackup className="mr-2 size-4" /> Faire une sauvegarde
            </Button>
          ) : null
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Enfants inscrits" value={s.enrolled} icon={Baby} tone="primary" hint={`Capacité : ${db.establishment.capacity} places`} />
        <StatCard label="Présents aujourd'hui" value={s.present} icon={CheckCircle2} tone="success" hint={`${s.departed} déjà partis`} />
        <StatCard label="Absents" value={s.absent} icon={XCircle} tone="danger" hint={`${s.expected} encore attendus`} />
        <StatCard label="Retards" value={s.late} icon={Clock} tone="warning" hint="Arrivées après l'horaire prévu" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section className="space-y-5">
          <div className="rounded-xl border bg-card p-5 shadow-card">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
              <div className="min-w-0">
                <h2 className="text-[15px] font-semibold tracking-tight">Taux d'occupation</h2>
                <p className="text-[13px] text-muted-foreground">
                  {s.enrolled} enfants inscrits sur {db.establishment.capacity} places
                </p>
              </div>
              <span className="shrink-0 text-2xl font-bold tabular-nums text-primary">
                {s.occupancy}%
              </span>
            </div>
            <Progress value={s.occupancy} className="mt-4 h-2" />
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {db.sections.map((sec) => {
                const count = db.children.filter(
                  (c) => c.sectionId === sec.id && c.status === "Inscrit",
                ).length;
                return (
                  <div
                    key={sec.id}
                    className="rounded-lg border bg-muted/30 p-3 transition-colors hover:border-primary/30 hover:bg-muted/50"
                  >
                    <p className="truncate text-[13px] font-semibold">{sec.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                      {count} / {sec.capacity} places
                    </p>
                    <Progress
                      value={Math.round((count / sec.capacity) * 100)}
                      className="mt-2 h-1.5"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border bg-card shadow-card">
            <div className="flex items-center justify-between gap-3 border-b bg-muted/25 px-5 py-3">
              <h2 className="text-[15px] font-semibold tracking-tight">Présences du jour</h2>
              <Link
                to="/presences"
                className="text-[13px] font-medium text-primary transition-colors hover:underline"
              >
                Ouvrir le pointage
              </Link>
            </div>
            <ul className="divide-y">
              {s.todayAttendance.slice(0, 6).map((a) => {
                const child = db.children.find((c) => c.id === a.childId);
                if (!child) return null;
                const tone =
                  a.state === "present"
                    ? "success"
                    : a.state === "absent"
                      ? "danger"
                      : a.state === "parti"
                        ? "info"
                        : "warning";
                const label =
                  a.state === "present"
                    ? "Présent"
                    : a.state === "absent"
                      ? "Absent"
                      : a.state === "parti"
                        ? "Parti"
                        : "Attendu";
                return (
                  <li
                    key={a.id}
                    className="flex items-center gap-3 px-5 py-2.5 transition-colors hover:bg-muted/40"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {initials(child)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-medium">{fullName(child)}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {ageLabel(child.birthDate)} ·{" "}
                        {db.sections.find((x) => x.id === child.sectionId)?.name ?? "Sans section"}
                      </p>
                    </div>
                    <span className="hidden shrink-0 text-xs tabular-nums text-muted-foreground sm:block">
                      {a.arrivalTime ? `Arrivée ${a.arrivalTime}` : "—"}
                    </span>
                    <StatusPill tone={tone}>{label}</StatusPill>
                  </li>
                );
              })}
              {s.todayAttendance.length === 0 && (
                <li className="px-5 py-8 text-center text-sm text-muted-foreground">
                  Aucun pointage enregistré aujourd'hui.
                </li>
              )}
            </ul>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Factures impayées"
              value={s.unpaidInvoices}
              icon={ReceiptText}
              tone="danger"
              hint={formatMoney(s.unpaidAmount, currency)}
            />
            <StatCard label="Documents manquants" value={s.missingDocuments} icon={FileWarning} tone="warning" hint="Dossiers incomplets" />
            <StatCard label="Alertes médicales" value={s.medicalAlerts} icon={HeartPulse} tone="danger" hint="Allergies et traitements" />
            <StatCard
              label="Personnel présent"
              value={`${s.staffPresent}/${s.staffTotal}`}
              icon={Users}
              tone="info"
              hint="Équipe du jour"
            />
          </div>
        </section>

        <aside className="space-y-5">
          <Panel title="Actions rapides" icon={Sparkles}>
            <div className="grid gap-2">
              {quickActions.map((a) => (
                <Button key={a.label} variant="outline" className="justify-start" asChild>
                  <Link to={a.to}>
                    <a.icon className="mr-2 size-4 text-primary" />
                    {a.label}
                  </Link>
                </Button>
              ))}
              {can("backup.manage") && (
                <Button variant="outline" className="justify-start" onClick={() => void handleBackup()}>
                  <DatabaseBackup className="mr-2 size-4 text-primary" /> Faire une sauvegarde
                </Button>
              )}
            </div>
          </Panel>

          <Panel title="Alertes importantes" icon={Gauge}>
            <ul className="space-y-2 text-sm">
              <AlertRow
                icon={Gauge}
                tone={s.occupancy > 95 ? "danger" : "success"}
                text={
                  s.occupancy > 95
                    ? "Capacité d'accueil presque atteinte"
                    : "Capacité d'accueil maîtrisée"
                }
              />
              <AlertRow
                icon={FileSignature}
                tone={s.expiringContracts.length ? "warning" : "success"}
                text={`${s.expiringContracts.length} contrat(s) arrivant à expiration sous 30 jours`}
              />
              <AlertRow
                icon={HeartPulse}
                tone={s.medicalAlerts ? "danger" : "success"}
                text={`${s.medicalAlerts} enfant(s) avec alerte médicale`}
              />
              <AlertRow
                icon={ReceiptText}
                tone={s.unpaidInvoices ? "warning" : "success"}
                text={`${s.unpaidInvoices} facture(s) en attente de règlement`}
              />
            </ul>
          </Panel>

          <Panel title="Anniversaires à venir" icon={Cake}>
            <ul className="space-y-1">
              {s.birthdays.slice(0, 4).map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-muted/50"
                >
                  <span className="truncate">{fullName(c)}</span>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {new Date(c.birthDate).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </li>
              ))}
              {s.birthdays.length === 0 && (
                <li className="px-2 py-1.5 text-sm text-muted-foreground">
                  Aucun anniversaire sous 30 jours.
                </li>
              )}
            </ul>
          </Panel>

          <Panel title="Activité récente" icon={ActivityIcon} bodyClassName="p-0">
            <ul className="divide-y">
              {db.auditLogs.slice(0, 5).map((log) => (
                <li key={log.id} className="px-4 py-2.5 text-sm transition-colors hover:bg-muted/40">
                  <p className="truncate font-medium">{log.action}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {log.userName} · {formatDateTime(log.at)}
                  </p>
                </li>
              ))}
              {db.auditLogs.length === 0 && (
                <li className="px-4 py-6 text-center text-sm text-muted-foreground">
                  Aucune action enregistrée.
                </li>
              )}
            </ul>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function AlertRow({
  icon: Icon,
  tone,
  text,
}: {
  icon: typeof Gauge;
  tone: "success" | "warning" | "danger";
  text: string;
}) {
  const colors = {
    success: "text-success",
    warning: "text-warning-foreground",
    danger: "text-destructive",
  };
  return (
    <li className="flex items-start gap-2.5 rounded-lg border bg-muted/30 px-3 py-2">
      <Icon className={`mt-0.5 size-4 shrink-0 ${colors[tone]}`} />
      <span className="text-sm">{text}</span>
    </li>
  );
}
