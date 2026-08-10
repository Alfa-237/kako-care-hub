import type { Database } from "./types";

const uid = (p: string, i: number) => `${p}-${String(i).padStart(3, "0")}`;

function iso(d: Date) {
  return d.toISOString().slice(0, 10);
}
function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return iso(d);
}
function inDays(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return iso(d);
}

const FIRST_F = ["Aïcha", "Léa", "Nour", "Emma", "Sarah", "Maëlys", "Fatou", "Chloé"];
const FIRST_M = ["Yanis", "Noah", "Ibrahim", "Lucas", "Adam", "Théo", "Malik", "Gabriel"];
const LAST = [
  "Mbarga",
  "Durand",
  "Ngoma",
  "Bernard",
  "Diallo",
  "Petit",
  "Kouassi",
  "Fontaine",
  "Sow",
  "Moreau",
];

export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(`kako::${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function buildSeedDatabase(): Promise<Database> {
  const [admin, directeur, educateur, comptable] = await Promise.all([
    hashPassword("admin123"),
    hashPassword("directeur123"),
    hashPassword("educateur123"),
    hashPassword("comptable123"),
  ]);

  const sections = [
    { id: "sec-001", name: "Les Poussins", ageMin: 3, ageMax: 12, capacity: 12, color: "poussins" },
    { id: "sec-002", name: "Les Explorateurs", ageMin: 12, ageMax: 24, capacity: 16, color: "explorateurs" },
    { id: "sec-003", name: "Les Grands", ageMin: 24, ageMax: 48, capacity: 18, color: "grands" },
  ].map((s) => ({ ...s, isDemo: true }));

  const children: Database["children"] = [];
  const parents: Database["parents"] = [];
  const childParents: Database["childParents"] = [];
  const attendance: Database["attendance"] = [];
  const invoices: Database["invoices"] = [];
  const payments: Database["payments"] = [];

  const today = iso(new Date());

  for (let i = 0; i < 24; i++) {
    const female = i % 2 === 0;
    const firstName = female ? FIRST_F[i % FIRST_F.length] : FIRST_M[i % FIRST_M.length];
    const lastName = LAST[i % LAST.length];
    const ageMonths = 4 + ((i * 7) % 40);
    const birth = new Date();
    birth.setMonth(birth.getMonth() - ageMonths);
    const section = sections[ageMonths < 12 ? 0 : ageMonths < 24 ? 1 : 2];
    const status = i >= 22 ? "Préinscrit" : i === 21 ? "Sorti" : "Inscrit";
    const childId = uid("enf", i + 1);

    children.push({
      id: childId,
      fileNumber: `KM-${String(1000 + i)}`,
      firstName,
      lastName,
      birthDate: iso(birth),
      gender: female ? "F" : "M",
      photo: null,
      address: `${10 + i} rue des Acacias`,
      registrationDate: daysAgo(120 - i * 3),
      startDate: daysAgo(100 - i * 3),
      sectionId: section.id,
      status: status as never,
      language: "Français",
      notes: "",
      medicalAlert: i % 9 === 0 ? "Allergie aux arachides" : null,
      missingDocuments: i % 5 === 0 ? ["Fiche sanitaire"] : [],
      contractEndDate: i % 7 === 0 ? inDays(18) : inDays(200),
      isDemo: true,
    });

    const parentId = uid("par", i + 1);
    parents.push({
      id: parentId,
      firstName: female ? FIRST_M[(i + 3) % FIRST_M.length] : FIRST_F[(i + 2) % FIRST_F.length],
      lastName,
      phone: `+237 6${String(70000000 + i * 137).slice(0, 8)}`,
      email: `${lastName.toLowerCase()}${i}@exemple.fr`,
      address: `${10 + i} rue des Acacias`,
      job: ["Enseignant", "Infirmier", "Commerçant", "Ingénieur"][i % 4],
      idDocument: `CNI-${900000 + i}`,
      isDemo: true,
    });
    childParents.push({
      id: uid("lien", i + 1),
      childId,
      parentId,
      relation: i % 2 === 0 ? "Mère" : "Père",
      canPickUp: true,
      isEmergencyContact: true,
      receivesDocuments: true,
      canSign: true,
      isDemo: true,
    });

    if (status === "Inscrit") {
      const mod = i % 6;
      const state = mod === 5 ? "absent" : mod === 4 ? "attendu" : mod === 3 ? "parti" : "present";
      attendance.push({
        id: uid("pres", i + 1),
        childId,
        date: today,
        expectedArrival: "08:00",
        expectedDeparture: "16:30",
        arrivalTime: state === "present" || state === "parti" ? (mod === 2 ? "09:15" : "07:55") : null,
        departureTime: state === "parti" ? "15:20" : null,
        state: state as never,
        late: mod === 2,
        earlyLeave: state === "parti",
        broughtBy: state === "absent" || state === "attendu" ? null : "Parent",
        pickedUpBy: state === "parti" ? "Parent" : null,
        recordedBy: "usr-001",
        absenceReason: state === "absent" ? "Maladie" : null,
        isDemo: true,
      });

      const total = 45000 + (i % 4) * 5000;
      const paid = i % 4 === 0 ? 0 : i % 4 === 1 ? total / 2 : total;
      const invoiceId = uid("fac", i + 1);
      invoices.push({
        id: invoiceId,
        number: `FA-2026-${String(100 + i)}`,
        date: daysAgo(20),
        dueDate: i % 4 === 0 ? daysAgo(3) : inDays(10),
        childId,
        parentId,
        total,
        discount: 0,
        paidAmount: paid,
        status: paid === 0 ? (i % 4 === 0 ? "En retard" : "Non payée") : paid < total ? "Partiellement payée" : "Payée",
        isDemo: true,
      });
      if (paid > 0) {
        payments.push({
          id: uid("pai", i + 1),
          invoiceId,
          date: daysAgo(10),
          amount: paid,
          method: (["Espèces", "Virement", "Mobile money", "Chèque"] as const)[i % 4],
          recordedBy: "usr-001",
          isDemo: true,
        });
      }
    }
  }

  const employees: Database["employees"] = [
    ["Awa", "Ndiaye", "Directrice", "sec-003"],
    ["Claire", "Marchand", "Éducatrice de jeunes enfants", "sec-001"],
    ["Sofiane", "Belkacem", "Auxiliaire de puériculture", "sec-002"],
    ["Marie", "Etoga", "Secrétaire", null],
    ["Jean", "Tchoumi", "Agent d'entretien", null],
  ].map((e, i) => ({
    id: uid("emp", i + 1),
    firstName: e[0] as string,
    lastName: e[1] as string,
    jobTitle: e[2] as string,
    phone: `+237 69900${10 + i}0`,
    sectionId: e[3] as string | null,
    hireDate: daysAgo(500 - i * 40),
    contractType: i < 3 ? "CDI" : "CDD",
    presentToday: i !== 4,
    isDemo: true,
  }));

  const activities: Database["activities"] = [
    { title: "Parcours de motricité", category: "Motricité" },
    { title: "Comptines du matin", category: "Éveil musical" },
    { title: "Peinture aux doigts", category: "Arts plastiques" },
  ].map((a, i) => ({
    id: uid("act", i + 1),
    date: daysAgo(i),
    title: a.title,
    category: a.category,
    description: "Activité encadrée en petit groupe.",
    childIds: children.slice(i * 3, i * 3 + 4).map((c) => c.id),
    isDemo: true,
  }));

  const users: Database["users"] = [
    { id: "usr-001", username: "admin", fullName: "Awa Ndiaye", passwordHash: admin, role: "ADMINISTRATEUR" },
    { id: "usr-002", username: "directeur", fullName: "Paul Mbarga", passwordHash: directeur, role: "DIRECTEUR" },
    { id: "usr-003", username: "educateur", fullName: "Claire Marchand", passwordHash: educateur, role: "EDUCATEUR" },
    { id: "usr-004", username: "comptable", fullName: "Marie Etoga", passwordHash: comptable, role: "COMPTABLE" },
  ].map((u) => ({
    ...u,
    role: u.role as never,
    status: "actif" as const,
    createdAt: daysAgo(300),
    lastLoginAt: null,
    isDemo: true,
  }));

  return {
    version: 1,
    establishment: {
      id: "etab-001",
      name: "Crèche Les Petits Kako",
      address: "12 avenue de la Paix, Douala",
      phone: "+237 699 00 00 00",
      email: "contact@kako-creche.com",
      currency: "FCFA",
      legalMentions: "Établissement agréé petite enfance.",
      capacity: 46,
      autoLockMinutes: 15,
    },
    users,
    sections,
    children,
    parents,
    childParents,
    attendance,
    employees,
    invoices,
    payments,
    activities,
    auditLogs: [],
    backups: [],
  };
}
