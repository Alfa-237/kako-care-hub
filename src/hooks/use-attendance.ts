// Hooks présences / pointage — TanStack Query + DataService (phase 3B).
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dataService } from "@/lib/services";
import type { AttendanceRecord } from "@/lib/models/attendance";
import { isEarlyDeparture, localDateISO } from "@/lib/models/attendance";
import type { AttendanceSummary } from "@/lib/services/data-service";

export const ATTENDANCE_KEYS = {
  all: ["attendance"] as const,
  date: (date: string) => ["attendance", "date", date] as const,
  child: (childId: string) => ["attendance", "child", childId] as const,
  family: (familyId: string) => ["attendance", "family", familyId] as const,
  summary: (date: string) => ["attendance", "summary", date] as const,
};

/** Pointages d'une journée (aujourd'hui par défaut). */
export function useTodayAttendance(date?: string) {
  const day = date ?? localDateISO();
  return useQuery({
    queryKey: ATTENDANCE_KEYS.date(day),
    queryFn: () => dataService.getAttendanceByDate(day),
  });
}

/** Historique des pointages d'un enfant (plus récent en premier). */
export function useAttendanceByChild(childId: string | undefined) {
  return useQuery({
    queryKey: ATTENDANCE_KEYS.child(childId ?? ""),
    queryFn: () => dataService.getAttendanceByChild(childId ?? ""),
    enabled: Boolean(childId),
  });
}

/** Pointages des enfants d'une famille. */
export function useAttendanceByFamily(familyId: string | undefined) {
  return useQuery({
    queryKey: ATTENDANCE_KEYS.family(familyId ?? ""),
    queryFn: () => dataService.getAttendanceByFamily(familyId ?? ""),
    enabled: Boolean(familyId),
  });
}

/** Statistiques du jour (cartes compactes de la barre supérieure). */
export function useAttendanceSummary(date?: string): {
  data: AttendanceSummary | undefined;
  isPending: boolean;
} {
  const day = date ?? localDateISO();
  const query = useQuery({
    queryKey: ATTENDANCE_KEYS.summary(day),
    queryFn: () => dataService.getTodayAttendanceSummary(day),
  });
  return { data: query.data, isPending: query.isPending };
}

function invalidateAttendance(qc: ReturnType<typeof useQueryClient>) {
  void qc.invalidateQueries({ queryKey: ATTENDANCE_KEYS.all });
}

export interface UpsertInput {
  childId: string;
  date?: string | undefined;
  patch: Partial<AttendanceRecord>;
}

/** Crée ou met à jour un pointage (base commune des mutations de pointage). */
export function useUpsertAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ childId, date, patch }: UpsertInput) =>
      dataService.upsertAttendance({ childId, date: date ?? localDateISO(), ...patch }),
    onSuccess: () => invalidateAttendance(qc),
  });
}

export interface ArrivalPayload {
  childId: string;
  date?: string | undefined;
  arrivalTime: string;
  accompaniedBy?: string;
}

/** Mutation « arrivée » : status → present ou retard (après 9h30). */
export function useRecordArrival() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ childId, date, arrivalTime, accompaniedBy }: ArrivalPayload) => {
      const late = arrivalTime > "09:30";
      return dataService.upsertAttendance({
        childId,
        date: date ?? localDateISO(),
        status: late ? "retard" : "present",
        arrivalTime,
        arrivalAccompaniedBy: accompaniedBy?.trim() ? accompaniedBy.trim() : null,
        departureTime: null,
        departurePickedUpBy: null,
        absenceReason: null,
        absenceType: null,
      });
    },
    onSuccess: () => invalidateAttendance(qc),
  });
}

export interface DeparturePayload {
  childId: string;
  date?: string | undefined;
  departureTime: string;
  pickedUpBy: string;
}

/**
 * Mutation « départ » : avant 16h00 le statut passe à « depart-anticipe »,
 * sinon l'enfant reste « present » avec une heure de départ renseignée.
 */
export function useRecordDeparture() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ childId, date, departureTime, pickedUpBy }: DeparturePayload) => {
      const early = isEarlyDeparture(departureTime);
      return dataService.upsertAttendance({
        childId,
        date: date ?? localDateISO(),
        status: early ? "depart-anticipe" : "present",
        departureTime,
        departurePickedUpBy: pickedUpBy.trim(),
      });
    },
    onSuccess: () => invalidateAttendance(qc),
  });
}

export interface AbsencePayload {
  childId: string;
  date?: string | undefined;
  absenceType: NonNullable<AttendanceRecord["absenceType"]>;
  reason?: string;
}

/** Mutation « absence ». */
export function useRecordAbsence() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ childId, date, absenceType, reason }: AbsencePayload) =>
      dataService.upsertAttendance({
        childId,
        date: date ?? localDateISO(),
        status: "absent",
        absenceType,
        absenceReason: reason?.trim() ? reason.trim() : null,
        arrivalTime: null,
        arrivalAccompaniedBy: null,
        departureTime: null,
        departurePickedUpBy: null,
      }),
    onSuccess: () => invalidateAttendance(qc),
  });
}
