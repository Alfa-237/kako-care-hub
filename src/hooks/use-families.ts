// Hooks famille — TanStack Query + DataService.
// Invalidation automatique : toute mutation invalide les clés « families » ;
// le pont héritage (services/index) recouvre en plus les écritures legacy.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dataService } from "@/lib/services";
import type { FamilyFormInput, FamilyRecord } from "@/lib/models/family";
import { nowIso } from "@/lib/models/types";

export const FAMILY_KEYS = {
  all: ["families"] as const,
  views: ["families", "views"] as const,
  detail: (id: string) => ["families", "detail", id] as const,
  view: (id: string) => ["families", "view", id] as const,
  children: (id: string) => ["families", "children", id] as const,
};

/** Entités Family persistées (brutes). */
export function useFamilies() {
  return useQuery({
    queryKey: FAMILY_KEYS.all,
    queryFn: () => dataService.getAll<FamilyRecord>("families"),
  });
}

/** Vues jointes (entité + responsable + membres + enfants) pour la liste. */
export function useFamiliesView() {
  return useQuery({
    queryKey: FAMILY_KEYS.views,
    queryFn: () => dataService.getFamilyViews(),
  });
}

export function useFamily(id: string | undefined) {
  return useQuery({
    queryKey: FAMILY_KEYS.detail(id ?? ""),
    queryFn: () => dataService.getById<FamilyRecord>("families", id ?? ""),
    enabled: Boolean(id),
  });
}

/** Vue jointe d'une fiche famille. */
export function useFamilyView(id: string | undefined) {
  return useQuery({
    queryKey: FAMILY_KEYS.view(id ?? ""),
    queryFn: () => dataService.getFamilyView(id ?? ""),
    enabled: Boolean(id),
  });
}

/** Enfants rattachés à une famille (via relations). */
export function useFamilyChildren(familyId: string | undefined) {
  return useQuery({
    queryKey: FAMILY_KEYS.children(familyId ?? ""),
    queryFn: () => dataService.getChildrenByFamily(familyId ?? ""),
    enabled: Boolean(familyId),
  });
}

function invalidateFamilies(qc: ReturnType<typeof useQueryClient>) {
  void qc.invalidateQueries({ queryKey: FAMILY_KEYS.all });
}

export function useCreateFamily() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: FamilyFormInput & { primaryParentId?: string | null }) => {
      const now = nowIso();
      const record: FamilyRecord = {
        id: dataService.nextId("families"),
        name: input.name,
        address: input.address,
        phone: input.phone,
        email: input.email,
        status: input.status,
        notes: input.notes,
        primaryParentId: input.primaryParentId ?? null,
        createdAt: now,
        updatedAt: now,
        isDemo: false,
      };
      await dataService.create("families", record);
      return record;
    },
    onSuccess: () => invalidateFamilies(qc),
  });
}

export function useUpdateFamily() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<FamilyRecord> }) => {
      const updated = await dataService.update<FamilyRecord>("families", id, {
        ...patch,
        updatedAt: nowIso(),
      });
      return updated;
    },
    onSuccess: (_data, variables) => {
      invalidateFamilies(qc);
      void qc.invalidateQueries({ queryKey: FAMILY_KEYS.view(variables.id) });
      void qc.invalidateQueries({ queryKey: FAMILY_KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteFamily() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => dataService.delete("families", id),
    onSuccess: () => invalidateFamilies(qc),
  });
}
