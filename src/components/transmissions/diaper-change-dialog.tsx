// Dialog « Change » — ajout/édition d'un change dans la transmission (phase 3C).
import { useEffect, useState } from "react";
import { Droplets } from "lucide-react";
import { toast } from "sonner";
import { randomId } from "@/lib/models/types";
import {
  DIAPER_TYPE_LABELS,
  compactRecord,
  diaperChangeFormSchema,
} from "@/lib/models/daily-transmission";
import type { DiaperChangeRecord, DiaperChangeType } from "@/lib/models/daily-transmission";
import { useAddDiaperChange } from "@/hooks/use-daily-transmissions";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

const CHANGE_TYPES = Object.keys(DIAPER_TYPE_LABELS) as DiaperChangeType[];

export function DiaperChangeDialog({
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
  initial?: DiaperChangeRecord | undefined;
}) {
  const editing = Boolean(initial);
  const [time, setTime] = useState("10:00");
  const [type, setType] = useState<DiaperChangeType>("urine");
  const [irritation, setIrritation] = useState(false);
  const [productUsed, setProductUsed] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const addDiaperChange = useAddDiaperChange();

  useEffect(() => {
    if (open) {
      setTime(initial?.time ?? "10:00");
      setType(initial?.type ?? "urine");
      setIrritation(initial?.irritation ?? false);
      setProductUsed(initial?.productUsed ?? "");
      setNotes(initial?.notes ?? "");
      setError(null);
    }
  }, [open, initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = diaperChangeFormSchema.safeParse({
      time,
      type,
      irritation,
      productUsed: productUsed.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Saisie invalide.");
      return;
    }
    const record = compactRecord<DiaperChangeRecord>({
      id: initial?.id ?? randomId("chg"),
      ...parsed.data,
    });
    try {
      await addDiaperChange.mutateAsync({ transmissionId, record });
      toast.success(editing ? "Change modifié" : "Change ajouté", {
        description: `${childName} — ${DIAPER_TYPE_LABELS[record.type]} à ${record.time}${
          record.irritation ? " · irritation signalée" : ""
        }`,
      });
      onOpenChange(false);
    } catch {
      toast.error("Erreur", { description: "L'enregistrement du change a échoué." });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Modifier le change" : `Ajouter un change — ${childName}`}
          </DialogTitle>
          <DialogDescription>Change et état de la peau de l'enfant.</DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="change-time">Heure</Label>
              <Input
                id="change-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="change-type">Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as DiaperChangeType)}>
                <SelectTrigger id="change-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CHANGE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {DIAPER_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <label
            htmlFor="change-irritation"
            className="flex items-center gap-2.5 rounded-lg border bg-card px-3 py-2.5 text-sm"
          >
            <Checkbox
              id="change-irritation"
              checked={irritation}
              onCheckedChange={(v) => setIrritation(v === true)}
            />
            Irritation constatée
          </label>
          {irritation ? (
            <div className="space-y-2">
              <Label htmlFor="change-product">Produit appliqué</Label>
              <Input
                id="change-product"
                value={productUsed}
                onChange={(e) => setProductUsed(e.target.value)}
                placeholder="Ex : crème apaisante"
                maxLength={120}
              />
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="change-notes">Notes</Label>
            <Textarea
              id="change-notes"
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
              disabled={addDiaperChange.isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={addDiaperChange.isPending}>
              <Droplets className="mr-2 size-4" aria-hidden="true" />
              {addDiaperChange.isPending
                ? "Enregistrement…"
                : editing
                  ? "Modifier"
                  : "Ajouter le change"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
