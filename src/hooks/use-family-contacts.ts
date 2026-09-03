// Hooks contacts & autorisations par famille (phase 7) — TanStack Query + DataService.
// Les mutations sont auditées via le wrapper de la phase 6 (entité « authorized_person »).
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { dataService } from "@/lib/services";
import { useAuditedMutation } from "@/hooks/use-audit";
import type { AuthorizedPerson } from "@/lib/models/authorized-person";
import { nowIso } from "@/lib/models/types";

export const CONTACT_KEYS = {
  all: ["contacts"] as const,
  family: (familyId: string) => ["contacts", "family", familyId] as const,
  pickup: (familyId: string) => ["contacts", "pickup", familyId] as const,
};

export function useFamilyContacts(familyId: string | undefined) {
  return useQuery({
    queryKey: CONTACT_KEYS.family(familyId ?? ""),
    queryFn: () => dataService.getContactsByFamily(familyId ?? ""),
    enabled: Boolean(familyId),
  });
}

export function usePickupPersons(familyId: string | undefined) {
  return useQuery({
    queryKey: CONTACT_KEYS.pickup(familyId ?? ""),
    queryFn: () => dataService.getPickupPersons(familyId ?? ""),
    enabled: Boolean(familyId),
  });
}

function invalidateContacts(qc: ReturnType<typeof useQueryClient>, familyId: string) {
  void qc.invalidateQueries({ queryKey: CONTACT_KEYS.all });
  void qc.invalidateQueries({ queryKey: CONTACT_KEYS.family(familyId) });
  void qc.invalidateQueries({ queryKey: CONTACT_KEYS.pickup(familyId) });
}

function buildContact(
  input: Omit<AuthorizedPerson, "id" | "createdAt" | "updatedAt">,
): AuthorizedPerson {
  const now = nowIso();
  return {
    id: `${dataService.nextId("authorizedPersons", "ap")}`,
    ...input,
    notes: input.notes ?? "",
    address: input.address ?? "",
    profession: input.profession ?? "",
    idDocument: input.idDocument ?? "",
    createdAt: now,
    updatedAt: now,
  };
}

function contactLabel(c: AuthorizedPerson): string {
  return `${c.firstName} ${c.lastName}`;
}

export type ContactInput = Omit<AuthorizedPerson, "id" | "createdAt" | "updatedAt">;

export function useCreateContact() {
  const qc = useQueryClient();
  return useAuditedMutation<AuthorizedPerson, unknown, ContactInput>({
    mutationFn: async (input: ContactInput) => {
      const record = buildContact(input);
      await dataService.createContact(record);
      return record;
    },
    audit: (input, data) => ({
      action: "Création contact autorisé",
      detail: `${contactLabel(data)} — ${input.familyId}`,
    }),
    onSuccess: (data) => invalidateContacts(qc, data.familyId),
  });
}

export function useUpdateContact() {
  const qc = useQueryClient();
  return useAuditedMutation<
    AuthorizedPerson,
    unknown,
    { id: string; patch: Partial<AuthorizedPerson> }
  >({
    mutationFn: async ({ id, patch }) => dataService.updateContact(id, patch),
    audit: (_v, data) => ({
      action: "Modification contact autorisé",
      detail: `${contactLabel(data)} — ${data.familyId}`,
    }),
    onSuccess: (data) => invalidateContacts(qc, data.familyId),
  });
}

export function useDeleteContact() {
  const qc = useQueryClient();
  return useAuditedMutation<AuthorizedPerson, unknown, AuthorizedPerson>({
    mutationFn: async (input) => {
      await dataService.deleteContact(input.id);
      return input;
    },
    audit: (v) => ({
      action: "Suppression contact autorisé",
      detail: `${contactLabel(v)} — ${v.familyId}`,
    }),
    onSuccess: (data) => invalidateContacts(qc, data.familyId),
  });
}
