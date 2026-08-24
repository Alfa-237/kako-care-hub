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
import { logAction, mutate } from "@/lib/data/db";
import type { Child, ChildStatus, Section } from "@/lib/data/types";
import { todayISO } from "@/lib/business/stats";

const CHILD_STATUSES: ChildStatus[] = ["Préinscrit", "Inscrit", "Suspendu", "Sorti"];

interface FormState {
  firstName: string;
  lastName: string;
  gender: "F" | "M";
  birthDate: string;
  address: string;
  language: string;
  sectionId: string;
  status: ChildStatus;
  startDate: string;
  registrationDate: string;
  contractEndDate: string;
  notes: string;
  medicalAlert: string;
  missingDocuments: string;
}

function defaultState(child: Child | null): FormState {
  const today = todayISO();
  if (!child) {
    return {
      firstName: "",
      lastName: "",
      gender: "F",
      birthDate: "",
      address: "",
      language: "Français",
      sectionId: "none",
      status: "Inscrit",
      startDate: today,
      registrationDate: today,
      contractEndDate: "",
      notes: "",
      medicalAlert: "",
      missingDocuments: "",
    };
  }
  return {
    firstName: child.firstName,
    lastName: child.lastName,
    gender: child.gender,
    birthDate: child.birthDate,
    address: child.address,
    language: child.language,
    sectionId: child.sectionId ?? "none",
    status: child.status,
    startDate: child.startDate,
    registrationDate: child.registrationDate,
    contractEndDate: child.contractEndDate ?? "",
    notes: child.notes,
    medicalAlert: child.medicalAlert ?? "",
    missingDocuments: child.missingDocuments.join(", "),
  };
}

function nextFileNumber(children: Child[]): string {
  let max = 1000;
  for (const c of children) {
    const m = /^KM-(\d+)$/.exec(c.fileNumber);
    if (m) max = Math.max(max, parseInt(m[1] ?? "0", 10));
  }
  return `KM-${max + 1}`;
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

export function ChildFormDialog({
  open,
  onOpenChange,
  child,
  sections,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  child: Child | null;
  sections: Section[];
  onSaved?: () => void;
}) {
  const { user } = useAuth();
  const [state, setState] = useState<FormState>(() => defaultState(child));
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setState(defaultState(child));
      setFormError("");
      setSaving(false);
    }
  }, [open, child]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors: string[] = [];
    if (!state.firstName.trim()) errors.push("Le prénom est obligatoire.");
    if (!state.lastName.trim()) errors.push("Le nom est obligatoire.");
    if (!state.birthDate) errors.push("La date de naissance est obligatoire.");
    if (errors.length) {
      setFormError(errors.join(" "));
      return;
    }

    setSaving(true);
    setFormError("");
    const docs = state.missingDocuments
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    try {
      await mutate((d) => {
        if (child) {
          const idx = d.children.findIndex((x) => x.id === child.id);
          if (idx >= 0) {
            d.children[idx] = {
              ...d.children[idx]!,
              firstName: state.firstName.trim(),
              lastName: state.lastName.trim(),
              birthDate: state.birthDate,
              gender: state.gender,
              address: state.address.trim(),
              language: state.language.trim() || "Français",
              sectionId: state.sectionId === "none" ? null : state.sectionId,
              status: state.status,
              startDate: state.startDate || todayISO(),
              contractEndDate: state.contractEndDate || null,
              notes: state.notes.trim(),
              medicalAlert: state.medicalAlert.trim() || null,
              missingDocuments: docs,
            };
          }
        } else {
          d.children.push({
            id: `enf-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
            fileNumber: nextFileNumber(d.children),
            firstName: state.firstName.trim(),
            lastName: state.lastName.trim(),
            birthDate: state.birthDate,
            gender: state.gender,
            photo: null,
            address: state.address.trim(),
            registrationDate: todayISO(),
            startDate: state.startDate || todayISO(),
            sectionId: state.sectionId === "none" ? null : state.sectionId,
            status: state.status,
            language: state.language.trim() || "Français",
            notes: state.notes.trim(),
            medicalAlert: state.medicalAlert.trim() || null,
            missingDocuments: docs,
            contractEndDate: state.contractEndDate || null,
            isDemo: false,
          });
        }
      });
      await logAction(
        user,
        child ? "Modification enfant" : "Ajout enfant",
        `${state.firstName.trim()} ${state.lastName.trim()}`,
      );
      toast.success(child ? "Enfant modifié" : "Enfant ajouté", {
        description: `${state.firstName.trim()} ${state.lastName.trim()} · ${
          child ? "fiche mise à jour" : "fiche créée"
        }`,
      });
      onSaved?.();
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
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{child ? "Modifier l'enfant" : "Ajouter un enfant"}</DialogTitle>
          <DialogDescription>
            {child
              ? "Mettez à jour les informations du dossier."
              : "Renseignez les informations de l'enfant pour créer son dossier."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Prénom" htmlFor="cf-first-name" required>
              <Input
                id="cf-first-name"
                value={state.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                placeholder="Prénom de l'enfant"
                autoFocus
              />
            </Field>
            <Field label="Nom" htmlFor="cf-last-name" required>
              <Input
                id="cf-last-name"
                value={state.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                placeholder="Nom de famille"
              />
            </Field>
            <Field label="Sexe" htmlFor="cf-gender" required>
              <Select value={state.gender} onValueChange={(v) => set("gender", v as "F" | "M")}>
                <SelectTrigger id="cf-gender" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="F">Fille</SelectItem>
                  <SelectItem value="M">Garçon</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Date de naissance" htmlFor="cf-birth-date" required>
              <Input
                id="cf-birth-date"
                type="date"
                value={state.birthDate}
                onChange={(e) => set("birthDate", e.target.value)}
              />
            </Field>
            <Field label="Section" htmlFor="cf-section">
              <Select value={state.sectionId} onValueChange={(v) => set("sectionId", v)}>
                <SelectTrigger id="cf-section" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sans section</SelectItem>
                  {sections.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Langue" htmlFor="cf-language">
              <Input
                id="cf-language"
                value={state.language}
                onChange={(e) => set("language", e.target.value)}
                placeholder="Français"
              />
            </Field>
            <Field label="Date de début d'accueil" htmlFor="cf-start-date">
              <Input
                id="cf-start-date"
                type="date"
                value={state.startDate}
                onChange={(e) => set("startDate", e.target.value)}
              />
            </Field>
            <Field label="Date de fin de contrat" htmlFor="cf-contract-end">
              <Input
                id="cf-contract-end"
                type="date"
                value={state.contractEndDate}
                onChange={(e) => set("contractEndDate", e.target.value)}
              />
            </Field>
            <Field label="Statut" htmlFor="cf-status">
              <Select value={state.status} onValueChange={(v) => set("status", v as ChildStatus)}>
                <SelectTrigger id="cf-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CHILD_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Adresse" htmlFor="cf-address" className="sm:col-span-2">
              <Input
                id="cf-address"
                value={state.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="Adresse de la famille"
              />
            </Field>
            <Field label="Alerte médicale" htmlFor="cf-medical" className="sm:col-span-2">
              <Input
                id="cf-medical"
                value={state.medicalAlert}
                onChange={(e) => set("medicalAlert", e.target.value)}
                placeholder="Ex. : allergie aux arachides, traitement en cours…"
              />
            </Field>
            <Field label="Documents manquants" htmlFor="cf-missing-docs" className="sm:col-span-2">
              <Input
                id="cf-missing-docs"
                value={state.missingDocuments}
                onChange={(e) => set("missingDocuments", e.target.value)}
                placeholder="Ex. : Fiche sanitaire, autorisation photo"
              />
              <p className="text-xs text-muted-foreground">
                Plusieurs documents séparés par des virgules.
              </p>
            </Field>
            <Field label="Observations" htmlFor="cf-notes" className="sm:col-span-2">
              <Textarea
                id="cf-notes"
                rows={3}
                value={state.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Observations générales sur l'enfant…"
              />
            </Field>
          </div>

          {formError ? (
            <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive animate-fade-in">
              {formError}
            </p>
          ) : null}

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
              {saving ? "Enregistrement…" : child ? "Enregistrer" : "Ajouter l'enfant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
