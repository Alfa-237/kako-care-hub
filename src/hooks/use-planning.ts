// Hooks planning enfants — TanStack Query + DataService (phase 8A).
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dataService } from "@/lib/services";
import type { Section } from "@/lib/data/types";
import type { ChildSchedule, ScheduleException } from "@/lib/models/child-schedule";

export const PLANNING_KEYS = {
  all: ["planning"] as const,
  sections: ["planning", "sections"] as const,
  schedules: ["planning", "schedules"] as const,
  exceptions: ["planning", "exceptions"] as const,
  schedule: (childId: string) => ["planning", "schedule", childId] as const,
};

/** Sections d'accueil (groupes). */
export function useSections() {
  return useQuery({
    queryKey: PLANNING_KEYS.sections,
    queryFn: () => dataService.getSections(),
  });
}

/** Rythmes hebdomadaires de tous les enfants. */
export function useChildSchedules() {
  return useQuery({
    queryKey: PLANNING_KEYS.schedules,
    queryFn: () => dataService.getChildSchedules(),
  });
}

/** Planning hebdomadaire d'un enfant. */
export function useChildSchedule(childId: string | undefined) {
  return useQuery({
    queryKey: PLANNING_KEYS.schedule(childId ?? ""),
    queryFn: () => dataService.getScheduleByChild(childId ?? ""),
    enabled: Boolean(childId),
  });
}

/** Exceptions de planning (toutes ou filtrées par date). */
export function useScheduleExceptions() {
  return useQuery({
    queryKey: PLANNING_KEYS.exceptions,
    queryFn: () => dataService.getScheduleExceptions(),
  });
}

function invalidatePlanning(qc: ReturnType<typeof useQueryClient>) {
  void qc.invalidateQueries({ queryKey: PLANNING_KEYS.all });
}

/** Crée ou remplace le planning hebdomadaire d'un enfant. */
export function useUpsertChildSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (schedule: ChildSchedule) => dataService.upsertChildSchedule(schedule),
    onSuccess: () => invalidatePlanning(qc),
  });
}

/** Ajoute une exception de planning. */
export function useCreateScheduleException() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ex: ScheduleException) => dataService.createScheduleException(ex),
    onSuccess: () => invalidatePlanning(qc),
  });
}

/** Supprime une exception de planning. */
export function useDeleteScheduleException() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => dataService.deleteScheduleException(id),
    onSuccess: () => invalidatePlanning(qc),
  });
}

// ---- Helpers d'affichage

/** Raccourcis mois français pour la navigation par date. */
export const MONTHS_SHORT = [
  "janv.",
  "févr.",
  "mars",
  "avr.",
  "mai",
  "juin",
  "juil.",
  "août",
  "sept.",
  "oct.",
  "nov.",
  "déc.",
] as const;

/** Libellé français d'une date YYYY-MM-DD. */
export function formatDateFr(dateISO: string): string {
  const d = new Date(`${dateISO}T12:00:00`);
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Classe de couleur de badge d'une section (mappée sur tailwind). */
export function sectionColorClass(color: string): string {
  const map: Record<string, string> = {
    poussins: "bg-sky-100 text-sky-700",
    explorateurs: "bg-amber-100 text-amber-700",
    grands: "bg-emerald-100 text-emerald-700",
    creche: "bg-violet-100 text-violet-700",
    "petite-section": "bg-sky-100 text-sky-700",
    "moyenne-section": "bg-amber-100 text-amber-700",
    "grande-section": "bg-emerald-100 text-emerald-700",
  };
  return map[color] ?? "bg-muted text-muted-foreground";
}

export type { Section };
