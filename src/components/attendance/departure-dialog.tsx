// Dialog « Départ » — la personne qui récupère l'enfant est obligatoire (phase 3B).
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { departureFormSchema } from "@/lib/models/attendance";
import { nowHHmm, isEarlyDeparture } from "@/lib/models/attendance";
import { useRecordDeparture } from "@/hooks/use-attendance";
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

export function DepartureDialog({
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
  const [departureTime, setDepartureTime] = useState(nowHHmm());
  const [pickedUpBy, setPickedUpBy] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recordDeparture = useRecordDeparture();

  useEffect(() => {
    if (open) {
      setDepartureTime(nowHHmm());
      setPickedUpBy("");
      setError(null);
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = departureFormSchema.safeParse({ departureTime, pickedUpBy });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Saisie invalide.");
      return;
    }
    try {
      await recordDeparture.mutateAsync({
        childId,
        date,
        departureTime: parsed.data.departureTime,
        pickedUpBy: parsed.data.pickedUpBy,
      });
      toast.success(
        isEarlyDeparture(parsed.data.departureTime)
          ? "Départ anticipé enregistré"
          : "Départ enregistré",
        {
          description: `${childName} — récupéré par ${parsed.data.pickedUpBy} à ${parsed.data.departureTime}`,
        },
      );
      onOpenChange(false);
    } catch {
      toast.error("Erreur", { description: "L'enregistrement du départ a échoué." });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Départ de {childName}</DialogTitle>
          <DialogDescription>
            Indiquez l'heure de départ et qui récupère l'enfant (obligatoire).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="departure-time">Heure de départ</Label>
            <Input
              id="departure-time"
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              autoFocus
              required
            />
            <p className="text-xs text-muted-foreground">
              Un départ avant 16h00 sera compté comme départ anticipé.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="departure-pickup">Récupéré par</Label>
            <Input
              id="departure-pickup"
              type="text"
              placeholder="Ex : Maman, Papa, nourrice…"
              value={pickedUpBy}
              onChange={(e) => setPickedUpBy(e.target.value)}
              maxLength={120}
              required
              aria-required="true"
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
              disabled={recordDeparture.isPending}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={recordDeparture.isPending}
              className="bg-warning text-warning-foreground hover:bg-warning/90"
            >
              <LogOut className="mr-2 size-4" aria-hidden="true" />
              {recordDeparture.isPending ? "Enregistrement…" : "Enregistrer le départ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
