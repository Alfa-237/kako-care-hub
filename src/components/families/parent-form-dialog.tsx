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
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/auth-context";
import { logAction, mutate } from "@/lib/data/db";
import type { Parent } from "@/lib/data/types";

interface FormState {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  job: string;
  idDocument: string;
}

function defaultState(parent: Parent | null): FormState {
  if (!parent) {
    return {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
      job: "",
      idDocument: "",
    };
  }
  return {
    firstName: parent.firstName,
    lastName: parent.lastName,
    phone: parent.phone,
    email: parent.email,
    address: parent.address,
    job: parent.job,
    idDocument: parent.idDocument,
  };
}

function Field({
  label,
  htmlFor,
  required,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor} className="text-sm">
        {label} {required ? <span className="text-destructive">*</span> : null}
      </Label>
      {children}
    </div>
  );
}

export function ParentFormDialog({
  open,
  onOpenChange,
  parent,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parent: Parent | null;
  onCreated?: (parentId: string) => void;
}) {
  const { user } = useAuth();
  const [state, setState] = useState<FormState>(() => defaultState(parent));
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setState(defaultState(parent));
      setFormError("");
    }
  }, [open, parent]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors: string[] = [];
    if (!state.firstName.trim()) errors.push("Le prénom est obligatoire.");
    if (!state.lastName.trim()) errors.push("Le nom est obligatoire.");
    if (!state.phone.trim()) errors.push("Le téléphone est obligatoire.");
    if (!state.email.trim()) errors.push("L'email est obligatoire.");
    if (errors.length) {
      setFormError(errors.join(" "));
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      let createdId: string | null = null;
      await mutate((d) => {
        if (parent) {
          const idx = d.parents.findIndex((x) => x.id === parent.id);
          if (idx >= 0) {
            d.parents[idx] = {
              ...d.parents[idx]!,
              firstName: state.firstName.trim(),
              lastName: state.lastName.trim(),
              phone: state.phone.trim(),
              email: state.email.trim(),
              address: state.address.trim(),
              job: state.job.trim(),
              idDocument: state.idDocument.trim(),
            };
          }
        } else {
          createdId = `par-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
          d.parents.push({
            id: createdId,
            firstName: state.firstName.trim(),
            lastName: state.lastName.trim(),
            phone: state.phone.trim(),
            email: state.email.trim(),
            address: state.address.trim(),
            job: state.job.trim(),
            idDocument: state.idDocument.trim(),
            isDemo: false,
          });
        }
      });
      if (!parent && createdId) onCreated?.(createdId);
      await logAction(
        user,
        parent ? "Modification responsable" : "Ajout responsable",
        `${state.firstName.trim()} ${state.lastName.trim()}`,
      );
      toast.success(parent ? "Responsable modifié" : "Responsable ajouté", {
        description: `${state.firstName.trim()} ${state.lastName.trim()} · ${
          parent ? "fiche mise à jour" : "fiche créée"
        }`,
      });
      onOpenChange(false);
    } catch {
      toast.error("Erreur", {
        description: "L'enregistrement de la fiche a échoué.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{parent ? "Modifier le responsable" : "Ajouter un responsable"}</DialogTitle>
          <DialogDescription>
            {parent
              ? "Mettez à jour les informations du responsable."
              : "Renseignez les informations du responsable pour l'ajouter à la famille."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Prénom" htmlFor="pf-first-name" required>
              <Input
                id="pf-first-name"
                value={state.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                placeholder="Prénom du responsable"
                autoFocus
              />
            </Field>
            <Field label="Nom" htmlFor="pf-last-name" required>
              <Input
                id="pf-last-name"
                value={state.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                placeholder="Nom de famille"
              />
            </Field>
            <Field label="Téléphone" htmlFor="pf-phone" required>
              <Input
                id="pf-phone"
                type="tel"
                value={state.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+237 6XX XXX XXX"
              />
            </Field>
            <Field label="Email" htmlFor="pf-email" required>
              <Input
                id="pf-email"
                type="email"
                value={state.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="email@exemple.com"
              />
            </Field>
            <Field label="Adresse" htmlFor="pf-address" className="sm:col-span-2">
              <Input
                id="pf-address"
                value={state.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="Adresse du responsable"
              />
            </Field>
            <Field label="Profession" htmlFor="pf-job">
              <Input
                id="pf-job"
                value={state.job}
                onChange={(e) => set("job", e.target.value)}
                placeholder="Ex: Enseignant, Infirmier, Commerçant"
              />
            </Field>
            <Field label="Pièce d'identité" htmlFor="pf-id-document">
              <Input
                id="pf-id-document"
                value={state.idDocument}
                onChange={(e) => set("idDocument", e.target.value)}
                placeholder="Ex: CNI-1234567"
              />
            </Field>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={saving}>
              Annuler
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Enregistrement…" : parent ? "Enregistrer" : "Ajouter le responsable"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}