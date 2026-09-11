// Logique métier — personnel & alertes ratio (phase 8B).
import type { Employee, EmployeeSchedule, Section } from "../data/types";
import type { ChildSchedule, ScheduleException } from "../models/child-schedule";
import type { Child } from "../data/types";
import { weekdayIndex } from "./planning";

// ---- Types d'alerte

export interface StaffingAlert {
  section: string;
  sectionId: string;
  needed: number;
  actual: number;
}

export interface ScheduleConflict {
  employeeId: string;
  employeeName: string;
  day: number;
  label: string;
}

// ---- Fonctions pures

/** Nombre d'enfants actifs (Inscrit ou Préinscrit) le jour donné. */
export function activeChildrenOnDay(
  children: Child[],
  schedules: ChildSchedule[],
  exceptions: ScheduleException[],
  date: string,
): Child[] {
  const day = weekdayIndex(date);
  return children.filter((c) => {
    if (c.status !== "Inscrit" && c.status !== "Préinscrit") return false;
    const exc = exceptions.find((e) => e.childId === c.id && e.date === date);
    if (exc?.type === "absence") return false;
    const sch = schedules.find((s) => s.childId === c.id);
    if (!sch) return false;
    return sch.days.includes(day);
  });
}

/**
 * Par section, nombre d'enfants attendus ce jour.
 */
export function childrenBySection(
  children: Child[],
  schedules: ChildSchedule[],
  exceptions: ScheduleException[],
  sections: Section[],
  date: string,
): Map<string, number> {
  const active = activeChildrenOnDay(children, schedules, exceptions, date);
  const map = new Map<string, number>();
  for (const s of sections) map.set(s.id, 0);
  for (const c of active) {
    if (c.sectionId && map.has(c.sectionId)) {
      map.set(c.sectionId, (map.get(c.sectionId) ?? 0) + 1);
    }
  }
  return map;
}

/**
 * Par section, employés attendus ce jour (schedule couvrant le jour, status actif).
 */
export function getExpectedStaff(
  employees: Employee[],
  empSchedules: EmployeeSchedule[],
  date: string,
): Map<string, Employee[]> {
  const day = weekdayIndex(date);
  const map = new Map<string, Employee[]>();
  for (const emp of employees) {
    if (emp.status !== "actif") continue;
    const sch = empSchedules.find((s) => s.employeeId === emp.id);
    if (!sch) continue;
    if (!sch.weekdays.includes(day)) continue;
    const sec = sch.section ?? "_volant";
    if (!map.has(sec)) map.set(sec, []);
    map.get(sec)!.push(emp);
  }
  return map;
}

/**
 * Alertes ratio : needed = ceil(children / ratio), actual = nb employés.
 */
export function getStaffingAlerts(
  children: Child[],
  schedules: ChildSchedule[],
  exceptions: ScheduleException[],
  sections: Section[],
  employees: Employee[],
  empSchedules: EmployeeSchedule[],
  date: string,
): StaffingAlert[] {
  const counts = childrenBySection(children, schedules, exceptions, sections, date);
  const staff = getExpectedStaff(employees, empSchedules, date);
  const alerts: StaffingAlert[] = [];
  for (const sec of sections) {
    const childCount = counts.get(sec.id) ?? 0;
    if (childCount === 0) continue;
    const needed = Math.ceil(childCount / sec.ratio);
    const actual = (staff.get(sec.id) ?? []).length;
    if (actual < needed) {
      alerts.push({
        section: sec.name,
        sectionId: sec.id,
        needed,
        actual,
      });
    }
  }
  return alerts;
}

/**
 * Conflits d'horaires : même employé, deux schedules qui se chevauchent le même jour.
 */
export function getScheduleConflicts(
  employees: Employee[],
  empSchedules: EmployeeSchedule[],
): ScheduleConflict[] {
  const byEmployee = new Map<string, EmployeeSchedule[]>();
  for (const s of empSchedules) {
    const list = byEmployee.get(s.employeeId) ?? [];
    list.push(s);
    byEmployee.set(s.employeeId, list);
  }

  const DAY_NAMES = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  const conflicts: ScheduleConflict[] = [];

  for (const [empId, scheds] of byEmployee) {
    const emp = employees.find((e) => e.id === empId);
    if (!emp) continue;
    for (let i = 0; i < scheds.length; i++) {
      for (let j = i + 1; j < scheds.length; j++) {
        const a = scheds[i]!;
        const b = scheds[j]!;
        const commonDays = a.weekdays.filter((d) => b.weekdays.includes(d));
        for (const day of commonDays) {
          if (timeOverlaps(a.startTime, a.endTime, b.startTime, b.endTime)) {
            conflicts.push({
              employeeId: empId,
              employeeName: `${emp.firstName} ${emp.lastName}`,
              day,
              label: `${DAY_NAMES[day]} ${a.startTime}–${a.endTime} vs ${b.startTime}–${b.endTime}`,
            });
          }
        }
      }
    }
  }
  return conflicts;
}

/** Vérifie si deux créneaux horaires se chevauchent. */
function timeOverlaps(startA: string, endA: string, startB: string, endB: string): boolean {
  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h! * 60 + m!;
  };
  const a1 = toMin(startA);
  const a2 = toMin(endA);
  const b1 = toMin(startB);
  const b2 = toMin(endB);
  return a1 < b2 && b1 < a2;
}
