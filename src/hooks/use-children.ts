// Hooks enfants — TanStack Query + DataService.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dataService } from "@/lib/services";
import type { Child } from "@/lib/models/child";

export const CHILD_KEYS = {
  all: ["children"] as const,
  detail: (id: string) => ["children", "detail", id] as const,
};

export function useChildren() {
  return useQuery({
    queryKey: CHILD_KEYS.all,
    queryFn: () => dataService.getAll<Child>("children"),
  });
}

export function useChild(id: string | undefined) {
  return useQuery({
    queryKey: CHILD_KEYS.detail(id ?? ""),
    queryFn: () => dataService.getById<Child>("children", id ?? ""),
    enabled: Boolean(id),
  });
}

export function useSearchChildren(query: string) {
  return useQuery({
    queryKey: [...CHILD_KEYS.all, "search", query],
    queryFn: () => dataService.searchChildren(query),
  });
}

function invalidateChildren(qc: ReturnType<typeof useQueryClient>) {
  void qc.invalidateQueries({ queryKey: CHILD_KEYS.all });
}

export function useCreateChild() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Omit<Child, "id"> & { id?: string }) => {
      const record: Child = { ...input, id: input.id ?? dataService.nextId("children") };
      await dataService.create("children", record);
      return record;
    },
    onSuccess: () => invalidateChildren(qc),
  });
}

export function useUpdateChild() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Child> }) =>
      dataService.update<Child>("children", id, patch),
    onSuccess: (_d, variables) => {
      invalidateChildren(qc);
      void qc.invalidateQueries({ queryKey: CHILD_KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteChild() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => dataService.delete("children", id),
    onSuccess: () => invalidateChildren(qc),
  });
}
