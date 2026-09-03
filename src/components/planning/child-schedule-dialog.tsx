// Dialog « Planning hebdomadaire » — définit ou remplace le rythme de
// présence d'un enfant sur une semaine (jours cochés + plages horaires).
import { useEffect, useMemo, useState } from "react";
import { CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { useDatabase } from "@/lib/data/db";
import { fullName } from "@/lib/business/stats";
import { useUpsertChildSchedule, useChildSchedule } from "@/hooks/use-planning";
import { WEEKDAY_SHORT } from "@/lib/models/child-schedule";
import type { ChildSchedule } from "@/lib/models/child-schedule";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEFAULT_DAYS = [1, 2, 3, 4, 5];

export function ChildScheduleDialog({
  childId,
  open,
  onOpenChange,
}: {
  childId?: string | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const db = useDatabase();
  const [selectedChildId, setSelectedChildId] = useState(childId ?? "");
  const [days, setDays] = useState<number[]>(DEFAULT_DAYS);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("17:00");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const upsertSchedule = useUpsertChildSchedule();
  const { data: existing } = useChildSchedule(selectedChildId || undefined);

  const children = useMemo(() => {
    if (!db) return [];
    return db.children
      .filter((c) => c.status === "Inscrit")
      .sort((a, b) => fullName(a).localeCompare(fullName(b), "fr"));
  }, [db]);

  useEffect(() => {
    if (open) {
      setError(null);
      if (childId) setSelectedChildId(childId);
    }
  }, [open, childId]);

  useEffect(() => {
    if (!selectedChildId) return;
    if (existing) {
      setDays(existing.days);
      setStartTime(existing.startTime);
      setEndTime(existing.endTime);
      setNotes(existing.notes ?? "");
    } else {
      setDays(DEFAULT_DAYS);
      setStartTime("08:00");
      setEndTime("17:00");
      setNotes("");
    }
  }, [selectedChildId, existing]);

  function toggleDay(d: number) {
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!selectedChildId) {
      setError("Merci de choisir un enfant.");
      return;
    }
    if (days.length === 0) {
      setError("Au moins un jour de présence doit être coché.");
      return;
    }
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(startTime)) {
      setError("Heure d'arrivée invalide (format attendu HH:mm).");
      return;
    }
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(endTime)) {
      setError("Heure de départ invalide (format attendu HH:mm).");
      return;
    }
    if (startTime >= endTime) {
      setError("L'heure de départ doit être après l'heure d'arrivée.");
      return;
    }
    const now = new Date().toISOString();
    const schedule: ChildSchedule = {
      id: existing?.id ?? "",
      childId: selectedChildId,
      days: [...days].sort((a, b) => a - b),
      startTime,
      endTime,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      isDemo: false,
    };
    if (notes.trim()) schedule.notes = notes.trim();
    try {
      await upsertSchedule.mutateAsync(schedule);
      const child = children.find((c) => c.id === selectedChildId);
      toast.success("Planning mis à jour", {
        description: `${child ? fullName(child) : "Enfant"} — ${WEEKDAY_SHORT[days[0] ?? 1]} → ${WEEKDAY_SHORT[days[days.length - 1] ?? 5]} · ${startTime}–${endTime}`,
      });
      onOpenChange(false);
    } catch {
      toast.error("Erreur", { description: "L'enregistrement du planning a échoué." });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Planning hebdomadaire</DialogTitle>
          <DialogDescription>
            Définissez les jours et horaires de présence prévue de l'enfant. Les exceptions
            ponctuelles se règlent dans la vue jour/semaine.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="schedule-child">Enfant</Label>
            <Select value={selectedChildId} onValueChange={setSelectedChildId}>
              <SelectTrigger id="schedule-child" className="w-full">
                <SelectValue placeholder="Choisir un enfant…" />
              </SelectTrigger>
              <SelectContent>
                {children.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {fullName(c)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Jours de présence</Label>
            <div className="flex flex-wrap gap-2">
              {WEEKDAY_SHORT.map((dayLabel, d) => (
                <label
                  key={d}
                  className="flex cursor-pointer items-center gap-1.5 rounded-lg border bg-muted/30 px-2.5 py-1.5 text-[13px] font-medium data-[checked=true]:border-primary data-[checked=true]:bg-primary/10"
                  data-checked={days.includes(d)}
                >
                  <Checkbox
                    checked={days.includes(d)}
                    onCheckedChange={() => toggleDay(d)}
                    aria-label={dayLabel}
                  />
                  {dayLabel}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="schedule-start">Arrivée</Label>
              <Input
                id="schedule-start"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule-end">Départ</Label>
              <Input
                id="schedule-end"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="schedule-notes">Notes (optionnel)</Label>
            <Input
              id="schedule-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex : repas sur place, sieste longue…"
              maxLength={300}
            />
          </div>

          {error ? (
            <p className="text-[13px] font-medium text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={upsertSchedule.isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={upsertSchedule.isPending}>
              <CalendarClock className="mr-2 size-4" aria-hidden="true" />
              {upsertSchedule.isPending ? "Enregistrement…" : "Enregistrer le planning"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
