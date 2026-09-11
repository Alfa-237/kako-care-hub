// Dialog création / édition employé (phase 8B) — Zod FR, PermissionGuard.
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/common/form-field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  employeeFormSchema,
  FONCTIONS,
  FONCTION_LABELS,
  CONTRACT_TYPES,
  CONTRACT_LABELS,
  STATUS_EMPLOYEE,
  STATUS_LABELS,
  type EmployeeFormValues,
} from "@/lib/models/employee";
import type { Employee } from "@/lib/data/types";
import { useCreateEmployee, useUpdateEmployee } from "@/hooks/use-employees";
import { Dialog } from "@/components/ui/dialog";
import { logAction } from "@/lib/data/db";
import { useAuth } from "@/lib/auth/auth-context";

type FormState = EmployeeFormValues;

const defaultState: FormState = {
  firstName: "",
  lastName: "",
  fonction: "Éducatrice",
  phone: "",
  address: "",
  qualification: "",
  hireDate: new Date().toISOString().slice(0, 10),
  contractType: "cdi",
  status: "actif",
  notes: "",
};

export function EmployeeFormDialog({
  open,
  onOpenChange,
  existing,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  existing?: Employee | null;
}) {
  const create = useCreateEmployee();
  const update = useUpdateEmployee();
  const { user } = useAuth();
  const [form, setForm] = useState<FormState>(defaultState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  useEffect(() => {
    if (open) {
      if (existing) {
        setForm({
          firstName: existing.firstName,
          lastName: existing.lastName,
          fonction: existing.fonction,
          phone: existing.phone,
          address: existing.address ?? "",
          qualification: existing.qualification ?? "",
          hireDate: existing.hireDate,
          contractType: existing.contractType,
          status: existing.status,
          notes: existing.notes ?? "",
        });
      } else {
        setForm(defaultState);
      }
      setErrors({});
    }
  }, [open, existing]);

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = employeeFormSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "");
        if (!errs[key]) errs[key] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    const values = parsed.data;
    const clean = Object.fromEntries(
      Object.entries(values).filter(([, v]) => v !== undefined && v !== ""),
    ) as unknown as Omit<Employee, "id" | "createdAt" | "updatedAt" | "isDemo">;
    try {
      if (existing) {
        await update.mutateAsync({ id: existing.id, patch: clean });
        await logAction(user, "Modification employé", `${values.firstName} ${values.lastName}`);
        toast.success("Employé modifié", {
          description: `${values.firstName} ${values.lastName}`,
        });
      } else {
        await create.mutateAsync(clean);
        await logAction(user, "Ajout employé", `${values.firstName} ${values.lastName}`);
        toast.success("Employé créé", {
          description: `${values.firstName} ${values.lastName}`,
        });
      }
      onOpenChange(false);
    } catch {
      toast.error("Erreur", { description: "L'enregistrement a échec." });
    }
  }

  const isPending = create.isPending || update.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{existing ? "Modifier l'employé" : "Ajouter un employé"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Prénom" error={errors.firstName} required>
              <Input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} />
            </FormField>
            <FormField label="Nom" error={errors.lastName} required>
              <Input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Fonction" error={errors.fonction} required>
              <Select
                value={form.fonction}
                onValueChange={(v) => set("fonction", v as FormState["fonction"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONCTIONS.map((f) => (
                    <SelectItem key={f} value={f}>
                      {FONCTION_LABELS[f]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Téléphone" error={errors.phone} required>
              <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Type de contrat" error={errors.contractType} required>
              <Select
                value={form.contractType}
                onValueChange={(v) => set("contractType", v as FormState["contractType"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTRACT_TYPES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {CONTRACT_LABELS[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Statut" error={errors.status} required>
              <Select
                value={form.status}
                onValueChange={(v) => set("status", v as FormState["status"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_EMPLOYEE.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </div>
          <FormField label="Date d'embauche" error={errors.hireDate} required>
            <Input
              type="date"
              value={form.hireDate}
              onChange={(e) => set("hireDate", e.target.value)}
            />
          </FormField>
          <FormField label="Adresse">
            <Input value={form.address} onChange={(e) => set("address", e.target.value)} />
          </FormField>
          <FormField label="Qualification">
            <Input
              value={form.qualification}
              onChange={(e) => set("qualification", e.target.value)}
            />
          </FormField>
          <FormField label="Notes">
            <Input value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </FormField>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {existing ? "Enregistrer" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
