// Logique métier du planning enfants (phase 8A) — calcul des présences prévues
// à partir des rythmes hebdomadaires (ChildSchedule) et des exceptions
// (ScheduleException), puis des jauges de capacité par section.
import type { Child, ChildStatus, Section } from "../data/types";
import type { ChildSchedule, ScheduleException } from "../models/child-schedule";

export type ExceptionType = ScheduleException["type"];

/** Créneau prévisionnel d'un enfant pour une journée donnée. */
export interface ExpectedSlot {
  childId: string;
  sectionId: string | null;
  childName: string;
  startTime: string;
  endTime: string;
  /** Indique si le créneau est dérivé d'une dérogation ponctuelle. */
  type: ExceptionType | "regulier";
}

/** Jauge d'une section pour une journée donnée. */
export interface SectionLoad {
  sectionId: string;
  name: string;
  color: string;
  capacity: number;
  expected: number;
  /** expected / capacity * 100 (arrondi à l'entier). */
  loadPercent: number;
  /** true quand la jauge dépasse 100 % (alerte capacité). */
  overCapacity: boolean;
  /** true quand la jauge dépasse 90 % (avertissement proche saturation). */
  nearCapacity: boolean;
}

/** Index JS du jour (0=Dimanche … 6=Samedi) pour une date YYYY-MM-DD. */
export function weekdayIndex(dateISO: string): number {
  const d = new Date(`${dateISO}T12:00:00`);
  return d.getDay();
}

/** Une exception « absence » retire l'enfant de la liste des attendus. */
export function isAbsenceException(ex: ScheduleException): boolean {
  return ex.type === "absence";
}

function daySchedulesFor(schedules: ChildSchedule[], childId: string, dateISO: string) {
  const dow = weekdayIndex(dateISO);
  return schedules.filter((s) => s.childId === childId && s.days.includes(dow));
}

/**
 * Liste des créneaux prévus pour un jour donné.
 * - Un enfant est attendu s'il a un planning hebdomadaire couvrant ce jour.
 * - Une exception « absence » le retire.
 * - Les autres exceptions (départ anticipé, activité, autre) remplacent les
 *   horaires du créneau.
 */
export function getExpectedSlots(options: {
  children: Child[];
  schedules: ChildSchedule[];
  exceptions: ScheduleException[];
  date: string;
}): ExpectedSlot[] {
  const { children, schedules, exceptions, date } = options;
  const childById = new Map(children.map((c) => [c.id, c]));
  const exceptionsForDate = exceptions.filter((e) => e.date === date);
  const byChild = new Map<string, ScheduleException[]>();
  for (const e of exceptionsForDate) {
    const arr = byChild.get(e.childId) ?? [];
    arr.push(e);
    byChild.set(e.childId, arr);
  }

  const slots: ExpectedSlot[] = [];
  for (const child of children) {
    if (child.status !== "Inscrit") continue;
    const childExceptions = byChild.get(child.id) ?? [];
    const absences = childExceptions.filter(isAbsenceException);
    if (absences.length > 0) continue;

    const daySchedules = daySchedulesFor(schedules, child.id, date);
    if (daySchedules.length === 0) continue;

    const override = childExceptions.find((e) => e.type !== "absence");
    let startTime = daySchedules[0]!.startTime;
    let endTime = daySchedules[0]!.endTime;
    let type: ExpectedSlot["type"] = "regulier";
    if (override) {
      if (override.startTime) startTime = override.startTime;
      if (override.endTime) endTime = override.endTime;
      type = override.type;
    }
    slots.push({
      childId: child.id,
      sectionId: child.sectionId,
      childName: `${child.firstName} ${child.lastName}`,
      startTime,
      endTime,
      type,
    });
  }
  return slots;
}

/** Jaunes par section pour un jour donné (nb attendus vs capacité). */
export function getSectionLoads(options: {
  children: Child[];
  sections: Section[];
  schedules: ChildSchedule[];
  exceptions: ScheduleException[];
  date: string;
}): SectionLoad[] {
  const { children, sections, schedules, exceptions, date } = options;
  const slots = getExpectedSlots({ children, schedules, exceptions, date });
  const countBySection = new Map<string | null, number>();
  for (const slot of slots) {
    countBySection.set(slot.sectionId, (countBySection.get(slot.sectionId) ?? 0) + 1);
  }
  return sections.map((s) => {
    const expected = countBySection.get(s.id) ?? 0;
    const loadPercent = s.capacity > 0 ? Math.round((expected / s.capacity) * 100) : 0;
    return {
      sectionId: s.id,
      name: s.name,
      color: s.color,
      capacity: s.capacity,
      expected,
      loadPercent,
      overCapacity: expected > s.capacity,
      nearCapacity: !(expected > s.capacity) && loadPercent >= 90,
    };
  });
}

/** Nombre d'enfants attendus un jour donné (toutes sections confondues). */
export function expectedChildrenCount(
  children: Child[],
  schedules: ChildSchedule[],
  exceptions: ScheduleException[],
  date: string,
): number {
  return getExpectedSlots({ children, schedules, exceptions, date }).length;
}

/** Contexte d'un enfant (utile au formulaire de planning). */
export function isActiveChildStatus(status: ChildStatus): boolean {
  return status === "Inscrit" || status === "Préinscrit";
}
