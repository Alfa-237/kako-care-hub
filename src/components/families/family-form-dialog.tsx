import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/auth-context";
import { logAction } from "@/lib/data/db";
import { dataService } from "@/lib/services";
import { familyFormSchema, type FamilyFormInput, type FamilyRecord } from "@/lib/models/family";

interface FieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

function Field({ label, htmlFor, required, className, children }: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor} className="text-sm">
        {label} {required ? <span className="text-destructive">*</span> : null}
      </Label>
      {children}
    </div>
  );
}

interface FamilyFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  family: FamilyRecord | null;
  /** Appelé après enregistrement réussi, avec l'entité créée ou mise à jour. */
  onSaved?: (record?: FamilyRecord) => void;
}

export function FamilyFormDialog({ open, onOpenChange, family, onSaved }: FamilyFormDialogProps) {
  const { user } = useAuth();
  const [state, setState] = useState<FamilyFormInput>(() => ({
    name: family?.name ?? "",
    address: family?.address ?? "",
    phone: family?.phone ?? "",
    email: family?.email ?? "",
    status: family?.status ?? "Active",
    notes: family?.notes ?? "",
  }));
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setState({
        name: family?.name ?? "",
        address: family?.address ?? "",
        phone: family?.phone ?? "",
        email: family?.email ?? "",
        status: family?.status ?? "Active",
        notes: family?.notes ?? "",
      });
      setFormError("");
    }
  }, [open, family]);

  const set = <K extends keyof FamilyFormInput>(key: K, value: FamilyFormInput[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = familyFormSchema.safeParse(state);
    if (!result.success) {
      const messages = result.error.flatten().fieldErrors;
      setFormError(Object.values(messages).flat().join(" "));
      return;
    }
    setFormError("");
    setSaving(true);

    try {
      const now = new Date().toISOString();
      const record: FamilyRecord = {
        id:
          family?.id ?? `fam-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
        name: result.data.name,
        address: result.data.address,
        phone: result.data.phone,
        email: result.data.email,
        status: result.data.status,
        notes: result.data.notes,
        primaryParentId: family?.primaryParentId ?? null,
        createdAt: family?.createdAt ?? now,
        updatedAt: now,
        isDemo: false,
      };

      if (family) {
        await dataService.update<FamilyRecord>("families", record.id, record);
      } else {
        await dataService.create("families", record);
      }

      await logAction(user, family ? "Modification famille" : "Ajout famille", record.name);
      toast.success(family ? "Famille modifiée" : "Famille créée", {
        description: `${record.name} · ${family ? "fiche mise à jour" : "fiche créée"}`,
      });
      onSaved?.(record);
      onOpenChange(false);
    } catch {
      toast.error("Erreur", { description: "L'enregistrement de la famille a échoué." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{family ? "Modifier la famille" : "Ajouter une famille"}</DialogTitle>
          <DialogDescription>
            {family
              ? "Mettez à jour les informations de la famille."
              : "Renseignez les informations pour créer une nouvelle famille."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nom de la famille" htmlFor="ff-name" required>
              <Input
                id="ff-name"
                value={state.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Ex : Famille Mbarga"
                autoFocus
              />
            </Field>

            <Field label="Statut" htmlFor="ff-status" required>
              <Select
                value={state.status}
                onValueChange={(v) => set("status", v as "Active" | "Inactive" | "Archivée")}
              >
                <SelectTrigger id="ff-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Archivée">Archivée</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Téléphone" htmlFor="ff-phone">
              <Input
                id="ff-phone"
                type="tel"
                value={state.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+237 6XX XXX XXX"
              />
            </Field>

            <Field label="Email" htmlFor="ff-email">
              <Input
                id="ff-email"
                type="email"
                value={state.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="famille@exemple.com"
              />
            </Field>

            <Field label="Adresse" htmlFor="ff-address" className="sm:col-span-2">
              <Input
                id="ff-address"
                value={state.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="Adresse postale"
              />
            </Field>

            <Field label="Observations" htmlFor="ff-notes" className="sm:col-span-2">
              <Textarea
                id="ff-notes"
                value={state.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Notes internes sur la famille..."
                rows={3}
              />
            </Field>
          </div>

          {formError && (
            <p className="text-sm text-destructive" role="alert">
              {formError}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Enregistrement…" : family ? "Enregistrer" : "Ajouter la famille"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
