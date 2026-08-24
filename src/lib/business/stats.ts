import type { Database, Child, Attendance } from "../data/types";

export const todayISO = () => new Date().toISOString().slice(0, 10);

export function fullName(c: { firstName: string; lastName: string }) {
  return `${c.firstName} ${c.lastName}`;
}

export function initials(c: { firstName: string; lastName: string }) {
  return `${c.firstName[0] ?? ""}${c.lastName[0] ?? ""}`.toUpperCase();
}

export function ageLabel(birthDate: string) {
  const b = new Date(birthDate);
  const now = new Date();
  let months = (now.getFullYear() - b.getFullYear()) * 12 + (now.getMonth() - b.getMonth());
  if (now.getDate() < b.getDate()) months -= 1;
  if (months < 24) return `${months} mois`;
  return `${Math.floor(months / 12)} ans`;
}

export function formatMoney(amount: number, currency: string) {
  return `${new Intl.NumberFormat("fr-FR").format(Math.round(amount))} ${currency}`;
}

export function formatDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(d: string) {
  return new Date(d).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export interface DashboardStats {
  enrolled: number;
  present: number;
  absent: number;
  expected: number;
  late: number;
  departed: number;
  unpaidInvoices: number;
  unpaidAmount: number;
  missingDocuments: number;
  medicalAlerts: number;
  staffPresent: number;
  staffTotal: number;
  occupancy: number;
  birthdays: Child[];
  expiringContracts: Child[];
  todayAttendance: Attendance[];
}

export function computeDashboard(db: Database): DashboardStats {
  const today = todayISO();
  const enrolledChildren = db.children.filter((c) => c.status === "Inscrit");
  const att = db.attendance.filter((a) => a.date === today);
  const unpaid = db.invoices.filter(
    (i) =>
      i.status === "Non payée" || i.status === "Partiellement payée" || i.status === "En retard",
  );
  const now = new Date();
  const in30 = new Date();
  in30.setDate(in30.getDate() + 30);

  const birthdays = enrolledChildren.filter((c) => {
    const b = new Date(c.birthDate);
    const next = new Date(now.getFullYear(), b.getMonth(), b.getDate());
    if (next < new Date(now.getFullYear(), now.getMonth(), now.getDate()))
      next.setFullYear(now.getFullYear() + 1);
    return (next.getTime() - now.getTime()) / 86400000 <= 30;
  });

  const expiringContracts = enrolledChildren.filter(
    (c) => c.contractEndDate && new Date(c.contractEndDate) <= in30,
  );

  return {
    enrolled: enrolledChildren.length,
    present: att.filter((a) => a.state === "present").length,
    absent: att.filter((a) => a.state === "absent").length,
    expected: att.filter((a) => a.state === "attendu").length,
    late: att.filter((a) => a.late).length,
    departed: att.filter((a) => a.state === "parti").length,
    unpaidInvoices: unpaid.length,
    unpaidAmount: unpaid.reduce((s, i) => s + (i.total - i.discount - i.paidAmount), 0),
    missingDocuments: db.children.filter((c) => c.missingDocuments.length > 0).length,
    medicalAlerts: db.children.filter((c) => c.medicalAlert).length,
    staffPresent: db.employees.filter((e) => e.presentToday).length,
    staffTotal: db.employees.length,
    occupancy: db.establishment.capacity
      ? Math.round((enrolledChildren.length / db.establishment.capacity) * 100)
      : 0,
    birthdays,
    expiringContracts,
    todayAttendance: att,
  };
}
