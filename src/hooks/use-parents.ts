// Hooks parents (responsables) — TanStack Query + DataService.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dataService } from "@/lib/services";
import type { Parent } from "@/lib/models/parent";

export const PARENT_KEYS = {
  all: ["parents"] as const,
  detail: (id: string) => ["parents", "detail", id] as const,
};

export function useParents() {
  return useQuery({
    queryKey: PARENT_KEYS.all,
    queryFn: () => dataService.getAll<Parent>("parents"),
  });
}

export function useParent(id: string | undefined) {
  return useQuery({
    queryKey: PARENT_KEYS.detail(id ?? ""),
    queryFn: () => dataService.getById<Parent>("parents", id ?? ""),
    enabled: Boolean(id),
  });
}

function invalidateParents(qc: ReturnType<typeof useQueryClient>) {
  void qc.invalidateQueries({ queryKey: PARENT_KEYS.all });
}

export function useCreateParent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Omit<Parent, "id"> & { id?: string }) => {
      const record: Parent = { ...input, id: input.id ?? dataService.nextId("parents") };
      await dataService.create("parents", record);
      return record;
    },
    onSuccess: () => invalidateParents(qc),
  });
}

export function useUpdateParent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Parent> }) =>
      dataService.update<Parent>("parents", id, patch),
    onSuccess: (_d, variables) => {
      invalidateParents(qc);
      void qc.invalidateQueries({ queryKey: PARENT_KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteParent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => dataService.delete("parents", id),
    onSuccess: () => invalidateParents(qc),
  });
}
