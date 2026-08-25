// Dialog « Incident » — signalement avec validation renforcée (phase 3C).
// Un incident de gravité « important » déclenche un toast d'alerte spécifique.
import { useEffect, useState } from "react";
import { Siren } from "lucide-react";
import { toast } from "sonner";
import { randomId } from "@/lib/models/types";
import {
  INCIDENT_TYPE_LABELS,
  SEVERITY_LABELS,
  compactRecord,
  incidentFormSchema,
} from "@/lib/models/daily-transmission";
import type {
  IncidentRecord,
  IncidentSeverity,
  IncidentType,
} from "@/lib/models/daily-transmission";
import { useAddIncident } from "@/hooks/use-daily-transmissions";
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

const INCIDENT_TYPES = Object.keys(INCIDENT_TYPE_LABELS) as IncidentType[];
const SEVERITIES = Object.keys(SEVERITY_LABELS) as IncidentSeverity[];

export function IncidentDialog({
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
  initial?: IncidentRecord | undefined;
}) {
  const editing = Boolean(initial);
  const [time, setTime] = useState("10:30");
  const [type, setType] = useState<IncidentType>("chute");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<IncidentSeverity>("mineur");
  const [actionTaken, setActionTaken] = useState("");
  const [parentsNotified, setParentsNotified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addIncident = useAddIncident();

  useEffect(() => {
    if (open) {
      setTime(initial?.time ?? "10:30");
      setType(initial?.type ?? "chute");
      setDescription(initial?.description ?? "");
      setSeverity(initial?.severity ?? "mineur");
      setActionTaken(initial?.actionTaken ?? "");
      setParentsNotified(initial?.parentsNotified ?? false);
      setError(null);
    }
  }, [open, initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = incidentFormSchema.safeParse({
      time,
      type,
      description,
      severity,
      actionTaken: actionTaken.trim() || undefined,
      parentsNotified,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Saisie invalide.");
      return;
    }
    const record = compactRecord<IncidentRecord>({
      id: initial?.id ?? randomId("inc"),
      ...parsed.data,
    });
    try {
      await addIncident.mutateAsync({ transmissionId, record });
      if (record.severity === "important") {
        // Alerte spécifique exigée pour les incidents importants.
        toast.warning("⚠ Incident important signalé", {
          description: `${childName} — ${INCIDENT_TYPE_LABELS[record.type]} à ${record.time}. ${
            record.parentsNotified
              ? "Les parents ont été informés."
              : "Pensez à informer rapidement les parents."
          }`,
          duration: 8000,
        });
      } else {
        toast.success(editing ? "Incident modifié" : "Incident signalé", {
          description: `${childName} — ${INCIDENT_TYPE_LABELS[record.type]} (${SEVERITY_LABELS[record.severity]})`,
        });
      }
      onOpenChange(false);
    } catch {
      toast.error("Erreur", { description: "L'enregistrement de l'incident a échoué." });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Modifier l'incident" : `Signaler un incident — ${childName}`}
          </DialogTitle>
          <DialogDescription>
            La description est obligatoire ; pour un incident important, les parents doivent être
            informés.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="incident-time">Heure</Label>
              <Input
                id="incident-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="incident-type">Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as IncidentType)}>
                <SelectTrigger id="incident-type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INCIDENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {INCIDENT_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="incident-severity">Gravité</Label>
            <Select value={severity} onValueChange={(v) => setSeverity(v as IncidentSeverity)}>
              <SelectTrigger id="incident-severity" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SEVERITIES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {SEVERITY_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="incident-description">Description *</Label>
            <Textarea
              id="incident-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez précisément ce qui s'est passé…"
              rows={3}
              maxLength={500}
              required
              aria-required="true"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="incident-action">Mesures prises</Label>
            <Input
              id="incident-action"
              value={actionTaken}
              onChange={(e) => setActionTaken(e.target.value)}
              placeholder="Ex : glace appliquée, surveillance renforcée…"
              maxLength={300}
            />
          </div>
          <label
            htmlFor="incident-parents"
            className="flex items-center gap-2.5 rounded-lg border bg-card px-3 py-2.5 text-sm"
          >
            <Checkbox
              id="incident-parents"
              checked={parentsNotified}
              onCheckedChange={(v) => setParentsNotified(v === true)}
            />
            Parents informés
          </label>
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
              disabled={addIncident.isPending}
            >
              Annuler
            </Button>
            <Button type="submit" variant="destructive" disabled={addIncident.isPending}>
              <Siren className="mr-2 size-4" aria-hidden="true" />
              {addIncident.isPending
                ? "Enregistrement…"
                : editing
                  ? "Modifier"
                  : "Signaler l'incident"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
