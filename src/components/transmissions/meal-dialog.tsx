// Dialog « Repas » — ajout/édition d'un repas dans la transmission (phase 3C).
import { useEffect, useState } from "react";
import { Utensils } from "lucide-react";
import { toast } from "sonner";
import { randomId } from "@/lib/models/types";
import {
  MEAL_TYPE_LABELS,
  QUANTITY_LABELS,
  compactRecord,
  mealFormSchema,
} from "@/lib/models/daily-transmission";
import type { MealQuantity, MealRecord, MealType } from "@/lib/models/daily-transmission";
import { useAddMeal } from "@/hooks/use-daily-transmissions";
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

const MEAL_TYPES = Object.keys(MEAL_TYPE_LABELS) as MealType[];
const QUANTITIES = Object.keys(QUANTITY_LABELS) as MealQuantity[];

export function MealDialog({
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
  initial?: MealRecord | undefined;
}) {
  const editing = Boolean(initial);
  const [time, setTime] = useState("12:00");
  const [type, setType] = useState<MealType>("dejeuner");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState<MealQuantity | "">("");
  const [quantityMl, setQuantityMl] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const addMeal = useAddMeal();

  useEffect(() => {
    if (open) {
      setTime(initial?.time ?? "12:00");
      setType(initial?.type ?? "dejeuner");
      setDescription(initial?.description ?? "");
      setQuantity(initial?.quantity ?? "");
      setQuantityMl(initial?.quantityMl != null ? String(initial.quantityMl) : "");
      setNotes(initial?.notes ?? "");
      setError(null);
    }
  }, [open, initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = mealFormSchema.safeParse({
      time,
      type,
      description: description.trim() || undefined,
      quantity: quantity || undefined,
      quantityMl: quantityMl === "" ? undefined : Number(quantityMl),
      notes: notes.trim() || undefined,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Saisie invalide.");
      return;
    }
    const record = compactRecord<MealRecord>({
      id: initial?.id ?? randomId("meal"),
      ...parsed.data,
    });
    try {
      await addMeal.mutateAsync({ transmissionId, record });
      toast.success(editing ? "Repas modifié" : "Repas ajouté", {
        description: `${childName} — ${MEAL_TYPE_LABELS[record.type]} à ${record.time}`,
      });
      onOpenChange(false);
    } catch {
      toast.error("Erreur", { description: "L'enregistrement du repas a échoué." });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Modifier le repas" : `Ajouter un repas — ${childName}`}
          </DialogTitle>
          <DialogDescription>
            Consignez le repas pris par l'enfant ; visible dans le résumé imprimable.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="meal-time">Heure</Label>
              <Input
                id="meal-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meal-type">Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as MealType)}>
                <SelectTrigger id="meal-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEAL_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {MEAL_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {type === "biberon" ? (
            <div className="space-y-2">
              <Label htmlFor="meal-ml">Quantité (ml)</Label>
              <Input
                id="meal-ml"
                type="number"
                min={0}
                max={500}
                value={quantityMl}
                onChange={(e) => setQuantityMl(e.target.value)}
                placeholder="Ex : 150"
                required
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="meal-quantity">Quantité mangée</Label>
              <Select value={quantity} onValueChange={(v) => setQuantity(v as MealQuantity)}>
                <SelectTrigger id="meal-quantity" className="w-full">
                  <SelectValue placeholder="Non précisé" />
                </SelectTrigger>
                <SelectContent>
                  {QUANTITIES.map((q) => (
                    <SelectItem key={q} value={q}>
                      {QUANTITY_LABELS[q]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="meal-description">Menu / description</Label>
            <Input
              id="meal-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex : purée carottes + poulet"
              maxLength={200}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="meal-notes">Notes</Label>
            <Textarea
              id="meal-notes"
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
              disabled={addMeal.isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={addMeal.isPending}>
              <Utensils className="mr-2 size-4" aria-hidden="true" />
              {addMeal.isPending ? "Enregistrement…" : editing ? "Modifier" : "Ajouter le repas"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
