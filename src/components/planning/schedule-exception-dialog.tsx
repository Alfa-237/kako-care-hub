// Dialog « Exception de planning » — dérogation ponctuelle à la présence
// prévue d'un enfant pour une journée donnée (départ anticipé, absence, …).
import { useEffect, useMemo, useState } from "react";
import { CalendarX2 } from "lucide-react";
import { toast } from "sonner";
import { useDatabase } from "@/lib/data/db";
import { fullName } from "@/lib/business/stats";
import { localDateISO } from "@/lib/models/attendance";
import { useCreateScheduleException } from "@/hooks/use-planning";
import { SCHEDULE_EXCEPTION_LABELS } from "@/lib/models/child-schedule";
import type { ScheduleException, ScheduleExceptionType } from "@/lib/models/child-schedule";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EXCEPTION_TYPES: ScheduleExceptionType[] = ["depart-avance", "absence", "activite", "autre"];

export function ScheduleExceptionDialog({
  childId,
  childName,
  date,
  open,
  onOpenChange,
}: {
  childId?: string | undefined;
  childName?: string | undefined;
  date?: string | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const db = useDatabase();
  const [selectedChildId, setSelectedChildId] = useState(childId ?? "");
  const [selectedDate, setSelectedDate] = useState(date ?? localDateISO());
  const [type, setType] = useState<ScheduleExceptionType>("depart-avance");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const createException = useCreateScheduleException();

  const children = useMemo(() => {
    if (!db) return [];
    return db.children
      .filter((c) => c.status === "Inscrit")
      .sort((a, b) => fullName(a).localeCompare(fullName(b), "fr"));
  }, [db]);

  useEffect(() => {
    if (open) {
      setSelectedChildId(childId ?? "");
      setSelectedDate(date ?? localDateISO());
      setType("depart-avance");
      setStartTime("");
      setEndTime("");
      setReason("");
      setError(null);
    }
  }, [open, childId, date]);

  const needsTime = type === "depart-avance" || type === "activite";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!selectedChildId) {
      setError("Merci de choisir un enfant.");
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
      setError("La date est invalide.");
      return;
    }
    if (needsTime && endTime && startTime && startTime >= endTime) {
      setError("L'heure de fin doit être après l'heure de début.");
      return;
    }
    const now = new Date().toISOString();
    const ex: ScheduleException = {
      id: "",
      childId: selectedChildId,
      date: selectedDate,
      type,
      createdAt: now,
      updatedAt: now,
      isDemo: false,
    };
    if (needsTime && startTime) ex.startTime = startTime;
    if (needsTime && endTime) ex.endTime = endTime;
    if (reason.trim()) ex.reason = reason.trim();
    try {
      await createException.mutateAsync(ex);
      toast.success("Exception enregistrée", {
        description: `${SCHEDULE_EXCEPTION_LABELS[type]} — ${selectedDate}`,
      });
      onOpenChange(false);
    } catch {
      toast.error("Erreur", { description: "L'enregistrement de l'exception a échoué." });
    }
  }

  const selectedChild = children.find((c) => c.id === selectedChildId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exception de planning</DialogTitle>
          <DialogDescription>
            Dérogez ponctuellement à la présence prévue d'un enfant pour une journée donnée.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="exception-child">Enfant</Label>
            <Select value={selectedChildId} onValueChange={setSelectedChildId}>
              <SelectTrigger id="exception-child" className="w-full">
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
            {selectedChild ? (
              <p className="text-xs text-muted-foreground">
                {childName && selectedChild.id === childId ? childName : fullName(selectedChild)}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="exception-date">Date</Label>
            <Input
              id="exception-date"
              type="date"
              value={selectedDate}
              onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="exception-type">Type d'exception</Label>
            <Select value={type} onValueChange={(v) => setType(v as ScheduleExceptionType)}>
              <SelectTrigger id="exception-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXCEPTION_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {SCHEDULE_EXCEPTION_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {needsTime ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="exception-start">Début (optionnel)</Label>
                <Input
                  id="exception-start"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exception-end">Fin (optionnel)</Label>
                <Input
                  id="exception-end"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="exception-reason">Motif (optionnel)</Label>
            <Input
              id="exception-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex : rendez-vous médical, sortie…"
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
              disabled={createException.isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={createException.isPending}>
              <CalendarX2 className="mr-2 size-4" aria-hidden="true" />
              {createException.isPending ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
