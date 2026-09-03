// Dialog « Départ » — sécurisé par la liste des personnes autorisées (phase 7).
// Les personnes autorisées (canPickup) de la famille de l'enfant sont proposées
// dans un SELECT ; une option « Autre personne… » déclenche une alerte + un champ
// d'identité obligatoire, et enregistre pickupAuthorized=false.
import { useEffect, useMemo, useState } from "react";
import { LogOut, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { nowHHmm, isEarlyDeparture } from "@/lib/models/attendance";
import { useRecordDeparture } from "@/hooks/use-attendance";
import { usePickupPersons } from "@/hooks/use-family-contacts";
import { useDatabase } from "@/lib/data/db";
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

const OTHER = "other";

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
  const db = useDatabase();
  const [departureTime, setDepartureTime] = useState(nowHHmm());
  const [pickupChoice, setPickupChoice] = useState<string>("");
  const [otherName, setOtherName] = useState("");
  const [identity, setIdentity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recordDeparture = useRecordDeparture();

  // Famille de l'enfant → personnes autorisées à récupérer (phase 7).
  const familyId = useMemo(() => {
    if (!db) return null;
    const link = db.childParents.find((cp) => cp.childId === childId);
    if (!link) return null;
    const fam = db.families.find((f) => f.primaryParentId === link.parentId);
    return fam?.id ?? null;
  }, [db, childId]);

  const { data: pickupPersons } = usePickupPersons(familyId ?? undefined);

  useEffect(() => {
    if (open) {
      setDepartureTime(nowHHmm());
      setPickupChoice("");
      setOtherName("");
      setIdentity("");
      setError(null);
    }
  }, [open]);

  const isOther = pickupChoice === OTHER;
  const selectedPerson = useMemo(() => {
    if (!pickupChoice || isOther) return null;
    return (pickupPersons ?? []).find((p) => p.id === pickupChoice) ?? null;
  }, [pickupChoice, isOther, pickupPersons]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!pickupChoice) {
      setError("Merci de choisir la personne qui récupère l'enfant.");
      return;
    }

    // Heure de départ obligatoire au format HH:mm.
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(departureTime)) {
      setError("Heure de départ invalide (format attendu HH:mm).");
      return;
    }

    let pickedUpBy: string;
    let pickupAuthorized: boolean;
    if (isOther) {
      const name = otherName.trim();
      if (!name) {
        setError("Merci d'indiquer le nom de la personne non autorisée.");
        return;
      }
      if (!identity.trim()) {
        setError("La pièce d'identité présentée est obligatoire pour une personne non autorisée.");
        return;
      }
      pickedUpBy = name;
      pickupAuthorized = false;
    } else if (selectedPerson) {
      pickedUpBy = `${selectedPerson.firstName} ${selectedPerson.lastName}`;
      pickupAuthorized = true;
    } else {
      setError("Personne de récupération introuvable.");
      return;
    }

    try {
      await recordDeparture.mutateAsync({
        childId,
        date,
        departureTime,
        pickedUpBy,
        pickupAuthorized,
      });
      toast.success(
        isEarlyDeparture(departureTime) ? "Départ anticipé enregistré" : "Départ enregistré",
        {
          description: `${childName} — récupéré par ${pickedUpBy} à ${departureTime}`,
        },
      );
      onOpenChange(false);
    } catch {
      toast.error("Erreur", { description: "L'enregistrement du départ a échoué." });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Départ de {childName}</DialogTitle>
          <DialogDescription>
            Indiquez l'heure de départ et la personne autorisée qui récupère l'enfant.
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
            <Select value={pickupChoice} onValueChange={setPickupChoice}>
              <SelectTrigger id="departure-pickup" className="w-full">
                <SelectValue placeholder="Choisir la personne autorisée…" />
              </SelectTrigger>
              <SelectContent>
                {(pickupPersons ?? []).map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.firstName} {p.lastName} ({p.relation})
                  </SelectItem>
                ))}
                <SelectItem value={OTHER}>Autre personne…</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isOther ? (
            <div className="space-y-3">
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
              >
                <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                <span>
                  Personne non autorisée — vérification d'identité et accord du responsable requis.
                </span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="departure-other-name">Nom de la personne</Label>
                <Input
                  id="departure-other-name"
                  value={otherName}
                  onChange={(e) => setOtherName(e.target.value)}
                  placeholder="Nom de la personne non autorisée"
                  maxLength={120}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departure-identity">Nom + pièce d'identité présentée</Label>
                <Input
                  id="departure-identity"
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  placeholder="Ex : Ex. : Kamga Amina — CNI-998877"
                  maxLength={160}
                />
              </div>
            </div>
          ) : null}

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
