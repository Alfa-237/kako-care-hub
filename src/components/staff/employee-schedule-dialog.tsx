// Dialog planning hebdomadaire employé (phase 8B) — jours + horaires + section.
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/common/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { employeeScheduleSchema } from "@/lib/models/employee";
import type { Employee, Section } from "@/lib/data/types";
import type { EmployeeSchedule } from "@/lib/data/types";
import { useUpsertEmployeeSchedule } from "@/hooks/use-employees";

const WEEKDAY_LABELS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

interface FormState {
  weekdays: number[];
  startTime: string;
  endTime: string;
  section: string;
}

export function EmployeeScheduleDialog({
  open,
  onOpenChange,
  employee,
  existing,
  sections,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  employee: Employee;
  existing: EmployeeSchedule | null;
  sections: Section[];
}) {
  const upsert = useUpsertEmployeeSchedule();
  const [form, setForm] = useState<FormState>({
    weekdays: [1, 2, 3, 4, 5],
    startTime: "08:00",
    endTime: "17:00",
    section: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  useEffect(() => {
    if (open) {
      if (existing) {
        setForm({
          weekdays: existing.weekdays,
          startTime: existing.startTime,
          endTime: existing.endTime,
          section: existing.section ?? "",
        });
      } else {
        setForm({ weekdays: [1, 2, 3, 4, 5], startTime: "08:00", endTime: "17:00", section: "" });
      }
      setErrors({});
    }
  }, [open, existing]);

  function toggleDay(d: number) {
    setForm((f) => ({
      ...f,
      weekdays: f.weekdays.includes(d)
        ? f.weekdays.filter((x) => x !== d)
        : [...f.weekdays, d].sort(),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = employeeScheduleSchema.safeParse({
      weekdays: form.weekdays,
      startTime: form.startTime,
      endTime: form.endTime,
      section: form.section === "_volant" || form.section === "" ? undefined : form.section,
    });
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
    if (form.startTime >= form.endTime) {
      setErrors({ endTime: "L'heure de fin doit être après l'heure de début." });
      return;
    }
    try {
      const schedule: EmployeeSchedule = {
        id: existing?.id ?? "",
        employeeId: employee.id,
        weekdays: parsed.data.weekdays,
        startTime: parsed.data.startTime,
        endTime: parsed.data.endTime,
        section: parsed.data.section ?? "_volant",
        updatedAt: new Date().toISOString(),
      };
      await upsert.mutateAsync(schedule);
      toast.success("Planning enregistré");
      onOpenChange(false);
    } catch {
      toast.error("Erreur", { description: "Échec de l'enregistrement." });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Planning hebdomadaire — {employee.firstName} {employee.lastName}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="mb-2 block">Jours de présence</Label>
            <div className="flex flex-wrap gap-2">
              {WEEKDAY_LABELS.map((label, idx) => (
                <Button
                  key={idx}
                  type="button"
                  variant={form.weekdays.includes(idx) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleDay(idx)}
                >
                  {label}
                </Button>
              ))}
            </div>
            {errors.weekdays && <p className="mt-1 text-xs text-destructive">{errors.weekdays}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Heure d'arrivée" error={errors.startTime} required>
              <Input
                type="time"
                value={form.startTime}
                onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
              />
            </FormField>
            <FormField label="Heure de départ" error={errors.endTime} required>
              <Input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
              />
            </FormField>
          </div>
          <FormField label="Section assignée">
            <Select
              value={form.section}
              onValueChange={(v) => setForm((f) => ({ ...f, section: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Volant (non assigné)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_volant">Volant (non assigné)</SelectItem>
                {sections.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={upsert.isPending}>
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
