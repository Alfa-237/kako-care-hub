// Hooks transmissions quotidiennes / cahier de liaison — TanStack Query (phase 3C).
import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dataService } from "@/lib/services";
import type { TransmissionSectionKey } from "@/lib/services/data-service";
import type {
  ActivityRecord,
  DailyTransmission,
  DiaperChangeRecord,
  IncidentRecord,
  MealRecord,
  MedicationRecord,
  NapRecord,
} from "@/lib/models/daily-transmission";
import { localDateISO } from "@/lib/models/attendance";

export const TRANSMISSION_KEYS = {
  all: ["daily-transmissions"] as const,
  child: (childId: string) => ["daily-transmissions", "child", childId] as const,
  childDate: (childId: string, date: string) =>
    ["daily-transmissions", "child-date", childId, date] as const,
  date: (date: string) => ["daily-transmissions", "date", date] as const,
};

/** Transmission d'un enfant pour une journée (aujourd'hui par défaut). */
export function useDailyTransmission(childId: string | undefined, date?: string) {
  const day = date ?? localDateISO();
  return useQuery({
    queryKey: TRANSMISSION_KEYS.childDate(childId ?? "", day),
    queryFn: () => dataService.getDailyTransmission(childId ?? "", day),
    enabled: Boolean(childId),
  });
}

/** Historique des transmissions d'un enfant (plus récentes en premier). */
export function useDailyTransmissionsByChild(childId: string | undefined) {
  return useQuery({
    queryKey: TRANSMISSION_KEYS.child(childId ?? ""),
    queryFn: () => dataService.getDailyTransmissionsByChild(childId ?? ""),
    enabled: Boolean(childId),
  });
}

/** Transmissions de tous les enfants pour une journée. */
export function useDailyTransmissionsByDate(date: string) {
  return useQuery({
    queryKey: TRANSMISSION_KEYS.date(date),
    queryFn: () => dataService.getDailyTransmissionsByDate(date),
  });
}

function invalidateTransmissions(qc: ReturnType<typeof useQueryClient>) {
  void qc.invalidateQueries({ queryKey: TRANSMISSION_KEYS.all });
}

export interface UpsertTransmissionInput {
  childId: string;
  date?: string | undefined;
  patch: Partial<DailyTransmission>;
  recordedBy?: string | null | undefined;
}

/** Mutation principale : crée ou met à jour la transmission (état général…). */
export function useUpsertDailyTransmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ childId, date, patch, recordedBy }: UpsertTransmissionInput) =>
      dataService.upsertDailyTransmission({
        childId,
        date: date ?? localDateISO(),
        recordedBy: recordedBy ?? null,
        ...patch,
      }),
    onSuccess: () => invalidateTransmissions(qc),
  });
}

interface ItemPayload {
  transmissionId: string;
}

/** Fabrique commune : mutation d'ajout/édition d'un sous-événement. */
function useSectionMutation<R extends { id: string }>(
  run: (transmissionId: string, record: R) => Promise<DailyTransmission>,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ transmissionId, record }: ItemPayload & { record: R }) =>
      run(transmissionId, record),
    onSuccess: () => invalidateTransmissions(qc),
  });
}

export function useAddMeal() {
  return useSectionMutation<MealRecord>(dataService.addMealToTransmission.bind(dataService));
}

export function useAddNap() {
  return useSectionMutation<NapRecord>(dataService.addNapToTransmission.bind(dataService));
}

export function useAddDiaperChange() {
  return useSectionMutation<DiaperChangeRecord>(
    dataService.addDiaperChangeToTransmission.bind(dataService),
  );
}

export function useAddActivity() {
  return useSectionMutation<ActivityRecord>(
    dataService.addActivityToTransmission.bind(dataService),
  );
}

export function useAddIncident() {
  return useSectionMutation<IncidentRecord>(
    dataService.addIncidentToTransmission.bind(dataService),
  );
}

export function useAddMedication() {
  return useSectionMutation<MedicationRecord>(
    dataService.addMedicationToTransmission.bind(dataService),
  );
}

/** Édition générique d'un sous-événement existant. */
export function useUpdateTransmissionItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      transmissionId,
      key,
      record,
    }: ItemPayload & { key: TransmissionSectionKey; record: { id: string } }) =>
      dataService.upsertTransmissionItem(transmissionId, key, record),
    onSuccess: () => invalidateTransmissions(qc),
  });
}

/** Suppression d'un sous-événement. */
export function useRemoveTransmissionItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      transmissionId,
      key,
      itemId,
    }: ItemPayload & { key: TransmissionSectionKey; itemId: string }) =>
      dataService.removeTransmissionItem(transmissionId, key, itemId),
    onSuccess: () => invalidateTransmissions(qc),
  });
}

/** Déclenche l'impression de la vue résumé (CSS @media print). */
export function usePrintTransmission() {
  return useCallback(() => window.print(), []);
}
