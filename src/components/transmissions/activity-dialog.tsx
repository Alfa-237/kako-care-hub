// Dialog « Activité » — ajout/édition d'une activité pédagogique (phase 3C).
import { useEffect, useState } from "react";
import { Palette } from "lucide-react";
import { toast } from "sonner";
import { randomId } from "@/lib/models/types";
import { activityFormSchema, compactRecord } from "@/lib/models/daily-transmission";
import type { ActivityRecord } from "@/lib/models/daily-transmission";
import { useAddActivity } from "@/hooks/use-daily-transmissions";
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

export function ActivityDialog({
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
  initial?: ActivityRecord | undefined;
}) {
  const editing = Boolean(initial);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [observations, setObservations] = useState("");
  const [skills, setSkills] = useState("");
  const [error, setError] = useState<string | null>(null);
  const addActivity = useAddActivity();

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setCategory(initial?.category ?? "");
      setObservations(initial?.observations ?? "");
      setSkills((initial?.skillsObserved ?? []).join(", "));
      setError(null);
    }
  }, [open, initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const skillsObserved = skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const parsed = activityFormSchema.safeParse({
      name,
      category: category.trim() || undefined,
      observations: observations.trim() || undefined,
      skillsObserved,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Saisie invalide.");
      return;
    }
    const record = compactRecord<ActivityRecord>({
      id: initial?.id ?? randomId("actv"),
      ...parsed.data,
    });
    try {
      await addActivity.mutateAsync({ transmissionId, record });
      toast.success(editing ? "Activité modifiée" : "Activité ajoutée", {
        description: `${childName} — ${record.name}`,
      });
      onOpenChange(false);
    } catch {
      toast.error("Erreur", { description: "L'enregistrement de l'activité a échoué." });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Modifier l'activité" : `Ajouter une activité — ${childName}`}
          </DialogTitle>
          <DialogDescription>
            Activité pédagogique de la journée et observations associées.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="activity-name">Nom de l'activité</Label>
            <Input
              id="activity-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex : comptines du matin"
              maxLength={120}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="activity-category">Catégorie</Label>
            <Input
              id="activity-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ex : Éveil musical, Motricité…"
              maxLength={80}
              list="activity-categories"
            />
            <datalist id="activity-categories">
              <option value="Motricité" />
              <option value="Langage" />
              <option value="Éveil musical" />
              <option value="Arts plastiques" />
              <option value="Découverte du monde" />
            </datalist>
          </div>
          <div className="space-y-2">
            <Label htmlFor="activity-observations">Observations pédagogiques</Label>
            <Textarea
              id="activity-observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              rows={3}
              maxLength={400}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="activity-skills">
              Compétences observées (séparées par des virgules)
            </Label>
            <Input
              id="activity-skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Ex : motricité fine, vocabulaire"
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
              disabled={addActivity.isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={addActivity.isPending}>
              <Palette className="mr-2 size-4" aria-hidden="true" />
              {addActivity.isPending
                ? "Enregistrement…"
                : editing
                  ? "Modifier"
                  : "Ajouter l'activité"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
