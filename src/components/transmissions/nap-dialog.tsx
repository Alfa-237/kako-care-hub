// Dialog « Sieste » — durée calculée automatiquement si début + fin (phase 3C).
import { useEffect, useMemo, useState } from "react";
import { Moon } from "lucide-react";
import { toast } from "sonner";
import { randomId } from "@/lib/models/types";
import {
  NAP_QUALITY_LABELS,
  WAKE_UP_MOOD_LABELS,
  compactRecord,
  formatDuration,
  napDurationMinutes,
  napFormSchema,
} from "@/lib/models/daily-transmission";
import type { NapQuality, NapRecord, WakeUpMood } from "@/lib/models/daily-transmission";
import { useAddNap } from "@/hooks/use-daily-transmissions";
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
import { Textarea } from "@/components/ui/textarea";

const QUALITIES = Object.keys(NAP_QUALITY_LABELS) as NapQuality[];
const WAKE_MOODS = Object.keys(WAKE_UP_MOOD_LABELS) as WakeUpMood[];

export function NapDialog({
  transmissionId,
  childName,
  open,
  onOpenChange,
  initial,
}: {
  transmissionId: string;
  childName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: NapRecord | undefined;
}) {
  const editing = Boolean(initial);
  const [startTime, setStartTime] = useState("12:30");
  const [endTime, setEndTime] = useState("");
  const [quality, setQuality] = useState<NapQuality>("bonne");
  const [wakeUpMood, setWakeUpMood] = useState<WakeUpMood | "">("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const addNap = useAddNap();

  useEffect(() => {
    if (open) {
      setStartTime(initial?.startTime ?? "12:30");
      setEndTime(initial?.endTime ?? "");
      setQuality(initial?.quality ?? "bonne");
      setWakeUpMood(initial?.wakeUpMood ?? "");
      setNotes(initial?.notes ?? "");
      setError(null);
    }
  }, [open, initial]);

  // Aperçu de la durée calculée automatiquement.
  const durationPreview = useMemo(
    () => napDurationMinutes(startTime, endTime || undefined),
    [startTime, endTime],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = napFormSchema.safeParse({
      startTime,
      endTime: endTime || undefined,
      quality,
      wakeUpMood: wakeUpMood || undefined,
      notes: notes.trim() || undefined,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Saisie invalide.");
      return;
    }
    const record = compactRecord<NapRecord>({
      id: initial?.id ?? randomId("nap"),
      ...parsed.data,
      durationMinutes: napDurationMinutes(parsed.data.startTime, parsed.data.endTime),
    });
    try {
      await addNap.mutateAsync({ transmissionId, record });
      toast.success(editing ? "Sieste modifiée" : "Sieste ajoutée", {
        description: `${childName} — ${record.startTime}${record.endTime ? ` → ${record.endTime}` : ""}${
          record.durationMinutes ? ` (${formatDuration(record.durationMinutes)})` : ""
        }`,
      });
      onOpenChange(false);
    } catch {
      toast.error("Erreur", { description: "L'enregistrement de la sieste a échoué." });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Modifier la sieste" : `Ajouter une sieste — ${childName}`}
          </DialogTitle>
          <DialogDescription>
            La durée est calculée automatiquement dès que le réveil est saisi.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="nap-start">Début</Label>
              <Input
                id="nap-start"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nap-end">Réveil (optionnel)</Label>
              <Input
                id="nap-end"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          {durationPreview ? (
            <p className="rounded-lg bg-muted/50 px-3 py-2 text-[13px]" aria-live="polite">
              Durée calculée : <strong>{formatDuration(durationPreview)}</strong>
            </p>
          ) : null}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="nap-quality">Qualité</Label>
              <Select value={quality} onValueChange={(v) => setQuality(v as NapQuality)}>
                <SelectTrigger id="nap-quality" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUALITIES.map((q) => (
                    <SelectItem key={q} value={q}>
                      {NAP_QUALITY_LABELS[q]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nap-wake">Humeur au réveil</Label>
              <Select value={wakeUpMood} onValueChange={(v) => setWakeUpMood(v as WakeUpMood)}>
                <SelectTrigger id="nap-wake" className="w-full">
                  <SelectValue placeholder="Non précisé" />
                </SelectTrigger>
                <SelectContent>
                  {WAKE_MOODS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {WAKE_UP_MOOD_LABELS[m]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="nap-notes">Notes</Label>
            <Textarea
              id="nap-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
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
              disabled={addNap.isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={addNap.isPending}>
              <Moon className="mr-2 size-4" aria-hidden="true" />
              {addNap.isPending ? "Enregistrement…" : editing ? "Modifier" : "Ajouter la sieste"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
