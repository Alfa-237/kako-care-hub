// Dialog rapide « Arrivée » — 2 clics pour pointer un enfant (phase 3B).
import { useEffect, useState } from "react";
import { LogIn } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
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
import { arrivalFormSchema, nowHHmm } from "@/lib/models/attendance";
import { useRecordArrival } from "@/hooks/use-attendance";

export function ArrivalDialog({
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
  const [arrivalTime, setArrivalTime] = useState(nowHHmm());
  const [accompaniedBy, setAccompaniedBy] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recordArrival = useRecordArrival();

  // Réinitialise à chaque ouverture : heure courante pré-remplie.
  useEffect(() => {
    if (open) {
      setArrivalTime(nowHHmm());
      setAccompaniedBy("");
      setError(null);
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = arrivalFormSchema.safeParse({ arrivalTime, accompaniedBy });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Saisie invalide.");
      return;
    }
    try {
      await recordArrival.mutateAsync({
        childId,
        date,
        arrivalTime: parsed.data.arrivalTime,
        accompaniedBy: parsed.data.accompaniedBy ?? "",
      });
      toast.success("Arrivée enregistrée", {
        description: `${childName} — ${parsed.data.arrivalTime}${parsed.data.accompaniedBy ? ` · accompagné par ${parsed.data.accompaniedBy}` : ""}`,
      });
      onOpenChange(false);
    } catch {
      toast.error("Erreur", { description: "L'enregistrement de l'arrivée a échoué." });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Arrivée de {childName}</DialogTitle>
          <DialogDescription>
            Enregistrez l'heure d'arrivée et la personne qui a déposé l'enfant.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="arrival-time">Heure d'arrivée</Label>
            <Input
              id="arrival-time"
              type="time"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              autoFocus
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="arrival-accompanied">Accompagné par (optionnel)</Label>
            <Input
              id="arrival-accompanied"
              type="text"
              placeholder="Ex : Maman, Papa, Grand-mère…"
              value={accompaniedBy}
              onChange={(e) => setAccompaniedBy(e.target.value)}
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
              disabled={recordArrival.isPending}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={recordArrival.isPending}
              className="bg-success text-success-foreground hover:bg-success/90"
            >
              <LogIn className="mr-2 size-4" aria-hidden="true" />
              {recordArrival.isPending ? "Enregistrement…" : "Enregistrer l'arrivée"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
