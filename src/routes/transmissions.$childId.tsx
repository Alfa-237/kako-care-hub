// Fiche de transmission quotidienne d'un enfant — cahier de liaison (phase 3C).
// État général + 6 sections de sous-événements + résumé imprimable.
import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, FileText, Loader2, Printer, Thermometer } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth/auth-context";
import { useDatabase } from "@/lib/data/db";
import { ageLabel, fullName, initials } from "@/lib/business/stats";
import { localDateISO } from "@/lib/models/attendance";
import { compactRecord, dailyTransmissionFormSchema } from "@/lib/models/daily-transmission";
import type { DailyTransmission, Mood } from "@/lib/models/daily-transmission";
import {
  useDailyTransmission,
  usePrintTransmission,
  useUpsertDailyTransmission,
} from "@/hooks/use-daily-transmissions";
import { useTodayAttendance } from "@/hooks/use-attendance";
import { MoodSelector } from "@/components/transmissions/mood-selector";
import { TransmissionSections } from "@/components/transmissions/transmission-sections";
import { TransmissionSummary } from "@/components/transmissions/transmission-summary";

export const Route = createFileRoute("/transmissions/$childId")({
  validateSearch: (search: Record<string, unknown>): { date?: string | undefined } => ({
    date: typeof search["date"] === "string" ? search["date"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Transmission enfant — KAKO Manager" },
      { name: "description", content: "Cahier de liaison quotidien d'un enfant." },
    ],
  }),
  component: Page,
});

function Page() {
  return <TransmissionDetail />;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function TransmissionDetail() {
  const db = useDatabase();
  const { user, can } = useAuth();
  const { childId } = Route.useParams();
  const { date: searchDate } = Route.useSearch();
  const navigate = Route.useNavigate();
  const print = usePrintTransmission();

  const [dateOverride, setDateOverride] = useState<string | null>(null);
  const date =
    dateOverride ?? (searchDate && DATE_RE.test(searchDate) ? searchDate : localDateISO());

  function changeDate(next: string) {
    setDateOverride(null);
    void navigate({ search: { date: next }, replace: true });
  }

  const child = db?.children.find((c) => c.id === childId);
  const attendanceQuery = useTodayAttendance(date);
  const record = (attendanceQuery.data ?? []).find((a) => a.childId === childId);
  const transmissionQuery = useDailyTransmission(childId, date);
  const transmission = transmissionQuery.data;

  // Création paresseuse : ouvrir la fiche initialise le cahier du jour
  // (uniquement si l'enfant n'est pas absent ce jour-là).
  const upsertTransmission = useUpsertDailyTransmission();
  const creatingRef = useRef<string | null>(null);
  useEffect(() => {
    if (!child) return;
    if (attendanceQuery.isPending || transmissionQuery.isPending) return;
    if (!record || record.status === "absent") return;
    if (transmission) return;
    const key = `${child.id}|${date}`;
    if (creatingRef.current === key) return;
    creatingRef.current = key;
    void upsertTransmission
      .mutateAsync({ childId: child.id, date, patch: {}, recordedBy: user?.id ?? null })
      .catch(() => {});
  }, [
    child,
    date,
    record,
    transmission,
    attendanceQuery.isPending,
    transmissionQuery.isPending,
    upsertTransmission,
    user?.id,
  ]);

  if (!db) {
    return (
      <div className="space-y-3" aria-busy="true">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  if (!child) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/20 px-6 py-10 text-center">
        <h1 className="text-sm font-semibold">Enfant introuvable</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Cet identifiant ne correspond à aucun enfant enregistré.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/transmissions">
            <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
            Retour aux transmissions
          </Link>
        </Button>
      </div>
    );
  }

  const isAbsent = record?.status === "absent";

  return (
    <div className="space-y-5">
      <nav aria-label="Fil d'Ariane" className="no-print">
        <Link
          to="/transmissions"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Transmissions
        </Link>
      </nav>

      <header className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {initials(child)}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[22px] font-bold leading-tight tracking-tight md:text-[26px]">
            Transmission du jour
          </h1>
          <p className="truncate text-[13px] text-muted-foreground">
            {fullName(child)} · {ageLabel(child.birthDate)}
            {!isAbsent && record
              ? ` · ${record.arrivalTime ? `arrivée ${record.arrivalTime}` : "en accueil"}`
              : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 shadow-sm">
            <CalendarDays className="size-4 text-muted-foreground" aria-hidden="true" />
            <input
              type="date"
              value={date}
              max={localDateISO()}
              onChange={(e) => e.target.value && changeDate(e.target.value)}
              aria-label="Choisir la journée de la transmission"
              className="bg-transparent text-sm outline-none"
            />
          </label>
          {!isAbsent && transmission ? (
            <>
              <a
                href="#resume-imprimable"
                className="inline-flex h-9 items-center gap-1.5 rounded-md border bg-card px-3 text-[13px] font-medium shadow-sm transition-colors hover:bg-accent"
                aria-label="Voir le résumé imprimable en bas de page"
              >
                <FileText className="size-4" aria-hidden="true" />
                Voir le résumé imprimable
              </a>
              <Button onClick={print} aria-label="Imprimer la transmission du jour">
                <Printer className="mr-1.5 size-4" aria-hidden="true" />
                Imprimer
              </Button>
            </>
          ) : null}
        </div>
      </header>

      {isAbsent ? (
        <div
          className="rounded-xl border border-warning/40 bg-warning/10 px-6 py-8 text-center"
          data-testid="absent-guard"
        >
          <h2 className="text-sm font-semibold">Enfant absent ce jour-là</h2>
          <p className="mx-auto mt-1 max-w-md text-[13px] text-muted-foreground">
            {fullName(child)} est pointé absent pour cette journée : aucune transmission ne peut
            être saisie. Pointez son arrivée depuis le module Présences pour ouvrir le cahier de
            liaison.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/presences">Aller au pointage</Link>
          </Button>
        </div>
      ) : transmissionQuery.isPending || !transmission ? (
        <div className="flex items-center gap-2 rounded-xl border bg-card px-4 py-6 text-[13px] text-muted-foreground shadow-card">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Ouverture du cahier de liaison…
        </div>
      ) : (
        <>
          <GeneralStateSection
            transmission={transmission}
            childId={child.id}
            date={date}
            canEdit={can("transmissions.edit")}
          />
          <TransmissionSections
            transmission={transmission}
            childName={fullName(child)}
            canEdit={can("transmissions.edit")}
          />
          <div id="resume-imprimable" className="scroll-mt-24 pt-2">
            <TransmissionSummary
              transmission={transmission}
              child={child}
              establishmentName={db.establishment.name}
            />
          </div>
        </>
      )}
    </div>
  );
}

/** État général : humeur, température et observations générales du jour. */
function GeneralStateSection({
  transmission,
  childId,
  date,
  canEdit,
}: {
  transmission: { id: string; mood?: Mood; temperature?: number; generalNotes?: string };
  childId: string;
  date: string;
  canEdit: boolean;
}) {
  const upsert = useUpsertDailyTransmission();
  const [mood, setMood] = useState<Mood | undefined>(transmission.mood);
  const [temperature, setTemperature] = useState(
    transmission.temperature != null ? String(transmission.temperature) : "",
  );
  const [notes, setNotes] = useState(transmission.generalNotes ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMood(transmission.mood);
    setTemperature(transmission.temperature != null ? String(transmission.temperature) : "");
    setNotes(transmission.generalNotes ?? "");
    setError(null);
  }, [transmission.id]); // eslint-disable-line react-hooks/exhaustive-deps -- réinitialisation à chaque changement de journée

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = dailyTransmissionFormSchema.safeParse({
      mood,
      temperature: temperature === "" ? undefined : Number(temperature),
      generalNotes: notes,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Saisie invalide.");
      return;
    }
    try {
      await upsert.mutateAsync({
        childId,
        date,
        patch: compactRecord<Partial<DailyTransmission>>(parsed.data),
      });
      toast.success("État général enregistré");
    } catch {
      toast.error("Erreur", { description: "L'enregistrement de l'état général a échoué." });
    }
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      noValidate
      className="rounded-xl border bg-card p-4 shadow-card sm:p-5"
      data-testid="general-state"
    >
      <h2 className="text-[14px] font-semibold">État général</h2>
      <p className="mt-0.5 text-[13px] text-muted-foreground">
        Humeur du jour, température éventuelle et observations générales.
      </p>
      <div className="mt-4 space-y-4">
        <MoodSelector value={mood} onChange={setMood} disabled={!canEdit} />
        <div className="max-w-[220px] space-y-2">
          <Label htmlFor="general-temperature">
            <Thermometer className="mr-1 inline size-3.5" aria-hidden="true" />
            Température (°C)
          </Label>
          <Input
            id="general-temperature"
            type="number"
            step="0.1"
            min={30}
            max={45}
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            placeholder="Ex : 37,2"
            disabled={!canEdit}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="general-notes">Observations générales</Label>
          <Textarea
            id="general-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            maxLength={1000}
            placeholder="Ex : très joyeux aujourd'hui, a beaucoup joué dehors…"
            disabled={!canEdit}
          />
        </div>
        {error ? (
          <p className="text-[13px] font-medium text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        {canEdit ? (
          <Button type="submit" disabled={upsert.isPending}>
            {upsert.isPending ? "Enregistrement…" : "Enregistrer l'état général"}
          </Button>
        ) : null}
      </div>
    </form>
  );
}
