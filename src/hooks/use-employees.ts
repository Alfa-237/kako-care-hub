// Hooks personnel — TanStack Query + DataService (phase 8B).
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dataService } from "@/lib/services";
import type { Employee, EmployeeSchedule } from "@/lib/data/types";

export const EMPLOYEE_KEYS = {
  all: ["employees"] as const,
  list: ["employees", "list"] as const,
  detail: (id: string) => ["employees", "detail", id] as const,
  schedule: (id: string) => ["employees", "schedule", id] as const,
  schedules: ["employees", "schedules"] as const,
};

function invalidateEmployees(qc: ReturnType<typeof useQueryClient>) {
  void qc.invalidateQueries({ queryKey: EMPLOYEE_KEYS.all });
}

/** Liste de tous les employés. */
export function useEmployees() {
  return useQuery({
    queryKey: EMPLOYEE_KEYS.list,
    queryFn: () => dataService.getAll<Employee>("employees"),
  });
}

/** Détail d'un employé. */
export function useEmployee(id: string | undefined) {
  return useQuery({
    queryKey: EMPLOYEE_KEYS.detail(id ?? ""),
    queryFn: () => dataService.getById<Employee>("employees", id ?? ""),
    enabled: Boolean(id),
  });
}

/** Planning hebdomadaire d'un employé. */
export function useEmployeeSchedule(employeeId: string | undefined) {
  return useQuery({
    queryKey: EMPLOYEE_KEYS.schedule(employeeId ?? ""),
    queryFn: () => dataService.getEmployeeSchedule(employeeId ?? ""),
    enabled: Boolean(employeeId),
  });
}

/** Tous les plannings employés. */
export function useAllEmployeeSchedules() {
  return useQuery({
    queryKey: EMPLOYEE_KEYS.schedules,
    queryFn: () => dataService.getEmployeeSchedules(),
  });
}

/** Créer un employé. */
export function useCreateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Omit<Employee, "id" | "createdAt" | "updatedAt" | "isDemo">) => {
      const now = new Date().toISOString();
      const record: Employee = {
        ...input,
        id: dataService.nextId("employees", "emp"),
        createdAt: now,
        updatedAt: now,
        isDemo: false,
      };
      await dataService.create("employees", record);
      return record;
    },
    onSuccess: () => invalidateEmployees(qc),
  });
}

/** Mettre à jour un employé. */
export function useUpdateEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Employee> }) => {
      return dataService.update<Employee>("employees", id, {
        ...patch,
        updatedAt: new Date().toISOString(),
      });
    },
    onSuccess: (_d, variables) => {
      invalidateEmployees(qc);
      void qc.invalidateQueries({ queryKey: EMPLOYEE_KEYS.detail(variables.id) });
    },
  });
}

/** Supprimer un employé. */
export function useDeleteEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => dataService.delete("employees", id),
    onSuccess: () => invalidateEmployees(qc),
  });
}

/** Enregistrer le planning hebdomadaire d'un employé. */
export function useUpsertEmployeeSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (schedule: EmployeeSchedule) => dataService.upsertEmployeeSchedule(schedule),
    onSuccess: () => {
      invalidateEmployees(qc);
      void qc.invalidateQueries({ queryKey: EMPLOYEE_KEYS.schedules });
    },
  });
}
