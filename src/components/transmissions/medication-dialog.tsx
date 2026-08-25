// Dialog « Médicament » — administration d'un médicament (phase 3C).
import { useEffect, useState } from "react";
import { Pill } from "lucide-react";
import { toast } from "sonner";
import { randomId } from "@/lib/models/types";
import { compactRecord, medicationFormSchema } from "@/lib/models/daily-transmission";
import type { MedicationRecord } from "@/lib/models/daily-transmission";
import { useAddMedication } from "@/hooks/use-daily-transmissions";
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
import { Textarea } from "@/components/ui/textarea";

export function MedicationDialog({
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
  initial?: MedicationRecord | undefined;
}) {
  const editing = Boolean(initial);
  const [time, setTime] = useState("11:00");
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [reason, setReason] = useState("");
  const [administeredBy, setAdministeredBy] = useState("");
  const [error, setError] = useState<string | null>(null);
  const addMedication = useAddMedication();

  useEffect(() => {
    if (open) {
      setTime(initial?.time ?? "11:00");
      setName(initial?.name ?? "");
      setDosage(initial?.dosage ?? "");
      setReason(initial?.reason ?? "");
      setAdministeredBy(initial?.administeredBy ?? "");
      setError(null);
    }
  }, [open, initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = medicationFormSchema.safeParse({
      time,
      name,
      dosage,
      reason: reason.trim() || undefined,
      administeredBy: administeredBy.trim() || undefined,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Saisie invalide.");
      return;
    }
    const record = compactRecord<MedicationRecord>({
      id: initial?.id ?? randomId("med"),
      ...parsed.data,
    });
    try {
      await addMedication.mutateAsync({ transmissionId, record });
      toast.success(editing ? "Médicament modifié" : "Médicament consigné", {
        description: `${childName} — ${record.name} (${record.dosage}) à ${record.time}`,
      });
      onOpenChange(false);
    } catch {
      toast.error("Erreur", { description: "L'enregistrement du médicament a échoué." });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Modifier le médicament" : `Ajouter un médicament — ${childName}`}
          </DialogTitle>
          <DialogDescription>
            Administration de médicament consignée nominativement pour la journée.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="med-time">Heure</Label>
              <Input
                id="med-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="med-name">Médicament</Label>
              <Input
                id="med-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex : paracétamol"
                maxLength={120}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="med-dosage">Dosage</Label>
            <Input
              id="med-dosage"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="Ex : 2,5 ml"
              maxLength={80}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="med-reason">Motif</Label>
            <Input
              id="med-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex : fièvre 38,2 °C (autorisation parentale)"
              maxLength={200}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="med-by">Administré par</Label>
            <Input
              id="med-by"
              value={administeredBy}
              onChange={(e) => setAdministeredBy(e.target.value)}
              placeholder="Nom de l'adulte référent"
              maxLength={120}
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
              disabled={addMedication.isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={addMedication.isPending}>
              <Pill className="mr-2 size-4" aria-hidden="true" />
              {addMedication.isPending ? "Enregistrement…" : editing ? "Modifier" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
