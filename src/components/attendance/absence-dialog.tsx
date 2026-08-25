// Dialog « Absence » — type + motif optionnel (phase 3B).
import { useEffect, useState } from "react";
import { CalendarX } from "lucide-react";
import { toast } from "sonner";
import { ABSENCE_TYPE_LABELS, absenceFormSchema } from "@/lib/models/attendance";
import type { AbsenceType } from "@/lib/models/attendance";
import { useRecordAbsence } from "@/hooks/use-attendance";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const ABSENCE_TYPES = Object.keys(ABSENCE_TYPE_LABELS) as AbsenceType[];

export function AbsenceDialog({
  childId,
  childName,
  date,
  open,
  onOpenChange,
}: {
  childId: string;
  childName: string;
  date?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [absenceType, setAbsenceType] = useState<AbsenceType>("maladie");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recordAbsence = useRecordAbsence();

  useEffect(() => {
    if (open) {
      setAbsenceType("maladie");
      setReason("");
      setError(null);
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = absenceFormSchema.safeParse({ absenceType, reason });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Saisie invalide.");
      return;
    }
    try {
      await recordAbsence.mutateAsync({
        childId,
        date,
        absenceType: parsed.data.absenceType,
        reason: parsed.data.reason,
      });
      toast.success("Absence enregistrée", {
        description: `${childName} — ${ABSENCE_TYPE_LABELS[parsed.data.absenceType]}${parsed.data.reason ? ` · ${parsed.data.reason}` : ""}`,
      });
      onOpenChange(false);
    } catch {
      toast.error("Erreur", { description: "L'enregistrement de l'absence a échoué." });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Absence de {childName}</DialogTitle>
          <DialogDescription>
            Précisez le type d'absence ; le motif est optionnel.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="absence-type">Type d'absence</Label>
            <Select value={absenceType} onValueChange={(v) => setAbsenceType(v as AbsenceType)}>
              <SelectTrigger id="absence-type" className="w-full">
                <SelectValue placeholder="Choisir un type" />
              </SelectTrigger>
              <SelectContent>
                {ABSENCE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {ABSENCE_TYPE_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="absence-reason">Motif (optionnel)</Label>
            <Textarea
              id="absence-reason"
              placeholder="Ex : Petite grippe, prévenu par la maman…"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={300}
              rows={3}
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
              disabled={recordAbsence.isPending}
            >
              Annuler
            </Button>
            <Button type="submit" variant="destructive" disabled={recordAbsence.isPending}>
              <CalendarX className="mr-2 size-4" aria-hidden="true" />
              {recordAbsence.isPending ? "Enregistrement…" : "Enregistrer l'absence"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
