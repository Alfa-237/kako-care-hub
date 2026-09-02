import type { Database } from "./types";
import { deriveFamiliesFromDatabase } from "../business/families";
import type { AttendanceRecord } from "../models/attendance";
import type {
  ActivityRecord,
  DailyTransmission,
  DiaperChangeRecord,
  IncidentRecord,
  IncidentSeverity,
  IncidentType,
  MealRecord,
  MedicationRecord,
  Mood,
  NapQuality,
  NapRecord,
} from "../models/daily-transmission";

/** Données de démonstration complètes (seed 3A incluant les entités Family). */
export function seedDemoData(): Promise<Database> {
  return buildSeedDatabase();
}

const uid = (p: string, i: number) => `${p}-${String(i).padStart(3, "0")}`;

/** Hachage déterministe (répartition stable des pointages de démo). */
function hashInt(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function minutesToHHmm(total: number): string {
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function isWeekendDate(dateStr: string): boolean {
  const day = new Date(`${dateStr}T12:00:00`).getDay();
  return day === 0 || day === 6;
}

function mkRecord(
  seq: number,
  childId: string,
  date: string,
  status: AttendanceRecord["status"],
  extra: Partial<AttendanceRecord>,
): AttendanceRecord {
  const now = new Date().toISOString();
  return {
    id: uid("att", seq),
    childId,
    familyId: null,
    date,
    status,
    arrivalTime: null,
    arrivalAccompaniedBy: null,
    departureTime: null,
    departurePickedUpBy: null,
    absenceReason: null,
    absenceType: null,
    notes: "",
    recordedBy: "usr-001",
    createdAt: now,
    updatedAt: now,
    isDemo: true,
    ...extra,
  };
}

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
  const [admin, directeur, educateur, comptable, secretaire, consultation, parent] =
    await Promise.all([
      hashPassword("admin123"),
      hashPassword("dir123"),
      hashPassword("edu123"),
      hashPassword("comp123"),
      hashPassword("sec123"),
      hashPassword("view123"),
      hashPassword("parent123"),
    ]);

  const sections = [
    { id: "sec-001", name: "Les Poussins", ageMin: 3, ageMax: 12, capacity: 12, color: "poussins" },
    {
      id: "sec-002",
      name: "Les Explorateurs",
      ageMin: 12,
      ageMax: 24,
      capacity: 16,
      color: "explorateurs",
    },
    { id: "sec-003", name: "Les Grands", ageMin: 24, ageMax: 48, capacity: 18, color: "grands" },
  ].map((s) => ({ ...s, isDemo: true }));

  const children: Database["children"] = [];
  const parents: Database["parents"] = [];
  const childParents: Database["childParents"] = [];
  const attendance: AttendanceRecord[] = [];
  const invoices: Database["invoices"] = [];
  const payments: Database["payments"] = [];

  for (let i = 0; i < 24; i++) {
    const female = i % 2 === 0;
    const firstName = (female ? FIRST_F[i % FIRST_F.length] : FIRST_M[i % FIRST_M.length])!;
    const lastName = LAST[i % LAST.length]!;
    const ageMonths = 4 + ((i * 7) % 40);
    const birth = new Date();
    birth.setMonth(birth.getMonth() - ageMonths);
    const section = sections[ageMonths < 12 ? 0 : ageMonths < 24 ? 1 : 2]!;
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
      firstName: (female ? FIRST_M[(i + 3) % FIRST_M.length] : FIRST_F[(i + 2) % FIRST_F.length])!,
      lastName,
      phone: `+237 6${String(70000000 + i * 137).slice(0, 8)}`,
      email: `${lastName.toLowerCase()}${i}@exemple.fr`,
      address: `${10 + i} rue des Acacias`,
      job: ["Enseignant", "Infirmier", "Commerçant", "Ingénieur"][i % 4]!,
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
        status:
          paid === 0
            ? i % 4 === 0
              ? "En retard"
              : "Non payée"
            : paid < total
              ? "Partiellement payée"
              : "Payée",
        isDemo: true,
      });
      if (paid > 0) {
        payments.push({
          id: uid("pai", i + 1),
          invoiceId,
          date: daysAgo(10),
          amount: paid,
          method: (["Espèces", "Virement", "Mobile money", "Chèque"] as const)[i % 4]!,
          recordedBy: "usr-001",
          isDemo: true,
        });
      }
    }
  }

  // ---- Pointages de démonstration (phase 3B) : aujourd'hui + 7 derniers jours.
  // Répartition du jour : ~60 % présents, ~20 % absents, ~10 % attendus, ~10 % retards.
  const enrolledChildren = children.filter((c) => c.status === "Inscrit");
  const parentByChild = new Map(
    childParents.map((cp) => [cp.childId, parents.find((p) => p.id === cp.parentId)]),
  );
  let attSeq = 1;
  const ABSENCE_CYCLE = ["maladie", "vacances", "absence-non-justifiee", "autre"] as const;
  for (let offset = 0; offset <= 7; offset++) {
    const dateStr = daysAgo(offset);
    if (isWeekendDate(dateStr)) continue; // crèche fermée le week-end
    for (const child of enrolledChildren) {
      const seedKey = `${child.id}|${dateStr}`;
      const r = hashInt(seedKey) % 100;
      const parentName = (() => {
        const p = parentByChild.get(child.id);
        return p ? `${p.firstName} ${p.lastName}` : "Parent";
      })();
      const stampFor = (hhmm?: string | null) =>
        hhmm
          ? new Date(`${dateStr}T${hhmm}:00`).toISOString()
          : new Date(`${dateStr}T12:00:00`).toISOString();

      let record: AttendanceRecord;
      if (r < 60 || (offset > 0 && r < 70)) {
        // Présent — arrivée entre 7h30 et 9h30.
        const arrival = minutesToHHmm(450 + (hashInt(`a|${seedKey}`) % 120));
        const dep = hashInt(`d|${seedKey}`) % 100;
        if (dep < 40) {
          // Départ normal entre 16h00 et 18h30 → reste « present ».
          record = mkRecord(attSeq++, child.id, dateStr, "present", {
            arrivalTime: arrival,
            arrivalAccompaniedBy: hashInt(`aa|${seedKey}`) % 3 === 0 ? parentName : null,
            departureTime: minutesToHHmm(960 + (hashInt(`dn|${seedKey}`) % 150)),
            departurePickedUpBy: parentName,
          });
        } else if (dep < 50 && offset > 0) {
          // Départ anticipé entre 14h00 et 15h55 (uniquement sur les jours passés).
          record = mkRecord(attSeq++, child.id, dateStr, "depart-anticipe", {
            arrivalTime: arrival,
            arrivalAccompaniedBy: null,
            departureTime: minutesToHHmm(840 + (hashInt(`de|${seedKey}`) % 115)),
            departurePickedUpBy: parentName,
          });
        } else {
          record = mkRecord(attSeq++, child.id, dateStr, "present", {
            arrivalTime: arrival,
            arrivalAccompaniedBy: hashInt(`aa|${seedKey}`) % 4 === 0 ? parentName : null,
            departureTime: null,
            departurePickedUpBy: null,
          });
        }
      } else if (r < 80 || (offset > 0 && r < 90)) {
        // Absent — type varié selon un cycle déterministe.
        const absenceType = ABSENCE_CYCLE[hashInt(`t|${seedKey}`) % ABSENCE_CYCLE.length]!;
        record = mkRecord(attSeq++, child.id, dateStr, "absent", {
          absenceType,
          absenceReason:
            absenceType === "maladie"
              ? "Petite maladie, prévenu par la famille"
              : absenceType === "vacances"
                ? "Vacances en famille"
                : null,
        });
      } else if (r < 90) {
        // Attendu — pas encore pointé (aujourd'hui uniquement).
        record = mkRecord(attSeq++, child.id, dateStr, "attendu", {});
      } else {
        // Retard — arrivée après 9h30.
        record = mkRecord(attSeq++, child.id, dateStr, "retard", {
          arrivalTime: minutesToHHmm(575 + (hashInt(`r|${seedKey}`) % 55)),
          arrivalAccompaniedBy: parentName,
        });
      }
      record.createdAt = stampFor(record.arrivalTime);
      record.updatedAt = record.createdAt;
      record.isDemo = true;
      record.recordedBy = "usr-001";
      attendance.push(record);
    }
  }

  // ---- Cahier de liaison (phase 3C) : transmissions du jour + 3 derniers jours ouvrés.
  // Couvre ~80 % des enfants effectivement accueillis (present / retard / depart-anticipe).
  const statusByKey = new Map(attendance.map((a) => [`${a.childId}|${a.date}`, a.status]));
  const ageMonthsById = new Map(children.map((c) => [c.id, 4 + ((children.indexOf(c) * 7) % 40)]));
  const dailyTransmissions: DailyTransmission[] = [];
  let trSeq = 1;
  const DEJEUNER_POOL = [
    "Purée carottes + poulet",
    "Riz aux petits légumes",
    "Semoule bolognaise",
    "Poisson + purée de patate douce",
  ];
  const ACTIVITIES_POOL: Array<{ name: string; category: string }> = [
    { name: "Parcours de motricité", category: "Motricité" },
    { name: "Comptines et chansons", category: "Éveil musical" },
    { name: "Lecture d'album", category: "Langage" },
    { name: "Peinture aux doigts", category: "Arts plastiques" },
  ];
  const SKILLS_POOL = ["motricité fine", "vocabulaire", "autonomie", "partage"];
  const MOOD_POOL: Mood[] = ["excellent", "bon", "moyen", "difficile"];
  const NAP_QUALITY_CYCLE: NapQuality[] = ["bonne", "agitee", "bonne", "longue"];
  const CHANGE_TYPE_CYCLE = ["urine", "selles", "urine", "mixte"] as const;
  const INCIDENT_TYPE_CYCLE: IncidentType[] = ["chute", "griffure", "pleurs", "morsure"];
  const NOTES_POOL = [
    "",
    "Très bonne journée, beaucoup d'énergie.",
    "Un peu fatigué en fin d'après-midi.",
    "A adoré l'activité du matin.",
  ];

  for (let offset = 0; offset <= 3; offset++) {
    const dateStr = daysAgo(offset);
    if (isWeekendDate(dateStr)) continue;
    for (const child of enrolledChildren) {
      const seedKey = `${child.id}|${dateStr}`;
      const status = statusByKey.get(seedKey);
      if (status !== "present" && status !== "retard" && status !== "depart-anticipe") continue;
      if (hashInt(`tr|${seedKey}`) % 100 >= 80) continue; // ~80 % de couverture

      const h = hashInt(`trc|${seedKey}`);
      const tid = uid("tr", trSeq++);
      const ageM = ageMonthsById.get(child.id) ?? 24;
      const stamp = new Date(`${dateStr}T12:00:00`).toISOString();

      // Repas — biberons pour les tout-petits, menus variés pour les grands.
      const meals: MealRecord[] = [];
      if (ageM < 12) {
        meals.push({
          id: `${tid}-meal-1`,
          time: "07:45",
          type: "biberon",
          description: "Lait 1er âge",
          quantityMl: 90 + (h % 60),
          quantity: "tout",
        });
        meals.push({
          id: `${tid}-meal-2`,
          time: "10:15",
          type: "biberon",
          description: "Lait 1er âge",
          quantityMl: 120 + ((h >> 2) % 40),
          quantity: (h >> 4) % 3 === 0 ? "moitie" : "tout",
        });
        meals.push({
          id: `${tid}-meal-3`,
          time: "11:30",
          type: "dejeuner",
          description: "Petit pot légumes de saison",
          quantity: (h >> 6) % 4 === 0 ? "peu" : "tout",
        });
      } else {
        meals.push({
          id: `${tid}-meal-1`,
          time: ageM < 24 ? "08:15" : "08:30",
          type: "petit-dejeuner",
          description: ageM < 24 ? "Biberon de lait + céréales" : "Pain, beurre, lait ou jus",
          quantity: "tout",
        });
        meals.push({
          id: `${tid}-meal-2`,
          time: ageM < 24 ? "11:45" : "12:00",
          type: "dejeuner",
          description: DEJEUNER_POOL[h % DEJEUNER_POOL.length]!,
          quantity: (h >> 5) % 8 === 0 ? "peu" : (h >> 5) % 4 === 0 ? "moitie" : "tout",
        });
        meals.push({
          id: `${tid}-meal-3`,
          time: "15:30",
          type: "gouter",
          description: ageM < 24 ? "Compote + laitage" : "Goûter du jour",
          quantity: (h >> 7) % 5 === 0 ? "refuse" : "tout",
        });
      }

      // Sieste — une par enfant, durée réaliste.
      const napMinutes = 45 + ((h >> 3) % 76); // 45–120 min
      const napStart = ageM < 12 ? 750 : 770; // 12:30 ou 12:50
      const napQuality: NapQuality =
        napMinutes < 60 ? "courte" : napMinutes > 105 ? "longue" : NAP_QUALITY_CYCLE[h % 4]!;
      const naps: NapRecord[] = [
        {
          id: `${tid}-nap-1`,
          startTime: minutesToHHmm(napStart),
          endTime: minutesToHHmm(napStart + napMinutes),
          durationMinutes: napMinutes,
          quality: napQuality,
          ...(h % 3 !== 2
            ? { wakeUpMood: (["reposé", "normal", "grognon"] as const)[h % 3]! }
            : {}),
        },
      ];

      // Changes — plus fréquents pour les plus petits.
      const changeCount = ageM < 24 ? 3 + (h % 3) : 1 + (h % 2);
      const diaperChanges: DiaperChangeRecord[] = [];
      for (let k = 0; k < changeCount; k++) {
        const irritation = (h >> k) % 9 === 0;
        diaperChanges.push({
          id: `${tid}-chg-${k + 1}`,
          time: minutesToHHmm(480 + k * 190 + ((h >> k) % 40)),
          type: CHANGE_TYPE_CYCLE[(h + k) % 4]!,
          irritation,
          ...(irritation ? { productUsed: "Crème apaisante" } : {}),
        });
      }

      // Activités pédagogiques — 1 à 2 par jour.
      const activities: ActivityRecord[] = [];
      const actCount = 1 + (h % 2);
      for (let k = 0; k < actCount; k++) {
        const base = ACTIVITIES_POOL[(h + k * 3) % ACTIVITIES_POOL.length]!;
        activities.push({
          id: `${tid}-actv-${k + 1}`,
          name: base.name,
          category: base.category,
          ...(k === 0
            ? {
                observations: "Participation active et souriante.",
                skillsObserved: [SKILLS_POOL[(h + k) % SKILLS_POOL.length]!],
              }
            : { skillsObserved: [SKILLS_POOL[(h + k) % SKILLS_POOL.length]!] }),
        });
      }

      // Incidents — rares (~10 % des transmissions).
      const incidents: IncidentRecord[] = [];
      if (h % 100 < 10) {
        const sevRoll = (h >> 4) % 10;
        const severity: IncidentSeverity =
          sevRoll < 6 ? "mineur" : sevRoll < 9 ? "moyen" : "important";
        const type = INCIDENT_TYPE_CYCLE[h % INCIDENT_TYPE_CYCLE.length]!;
        incidents.push({
          id: `${tid}-inc-1`,
          time: minutesToHHmm(600 + ((h >> 2) % 300)),
          type,
          description:
            type === "pleurs"
              ? "Épisode de pleurs en fin de matinée, calmé rapidement."
              : type === "chute"
                ? "Petite chute en marchant, aucun signe inquiétant."
                : type === "griffure"
                  ? "Légère griffure au jeu, désinfection effectuée."
                  : "Conflit avec un camarade au moment du rangement.",
          severity,
          actionTaken:
            severity === "important"
              ? "Glace appliquée puis surveillance rapprochée ; parents contactés."
              : "Câlin et surveillance renforcée.",
          parentsNotified: severity !== "mineur",
        });
      }

      // Médicaments — exceptionnels.
      const medications: MedicationRecord[] = [];
      if (h % 25 === 0) {
        medications.push({
          id: `${tid}-med-1`,
          time: "11:00",
          name: "Paracétamol",
          dosage: "2,5 ml",
          reason: "Fièvre 37,9 °C (autorisation parentale)",
          administeredBy: "Claire Marchand",
        });
      }

      dailyTransmissions.push({
        id: tid,
        childId: child.id,
        familyId: null,
        date: dateStr,
        mood: MOOD_POOL[h % 4]!,
        ...((h >> 6) % 5 === 0
          ? { temperature: Number((37 + ((h >> 3) % 8) / 10).toFixed(1)) }
          : {}),
        generalNotes: NOTES_POOL[(h >> 2) % NOTES_POOL.length]!,
        meals,
        naps,
        diaperChanges,
        activities,
        incidents,
        medications,
        recordedBy: "usr-001",
        createdAt: stamp,
        updatedAt: stamp,
        isDemo: true,
      });
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
    {
      id: "usr-001",
      username: "admin",
      fullName: "Awa Ndiaye",
      passwordHash: admin,
      role: "ADMINISTRATEUR",
    },
    {
      id: "usr-002",
      username: "directeur",
      fullName: "Paul Mbarga",
      passwordHash: directeur,
      role: "DIRECTEUR",
    },
    {
      id: "usr-003",
      username: "educateur",
      fullName: "Claire Marchand",
      passwordHash: educateur,
      role: "EDUCATEUR",
    },
    {
      id: "usr-004",
      username: "comptable",
      fullName: "Marie Etoga",
      passwordHash: comptable,
      role: "COMPTABLE",
    },
    {
      id: "usr-006",
      username: "secretaire",
      fullName: "Solange Mvondo",
      passwordHash: secretaire,
      role: "SECRETAIRE",
    },
    {
      id: "usr-007",
      username: "consultation",
      fullName: "Kako Consultation",
      passwordHash: consultation,
      role: "CONSULTATION",
    },
    {
      id: "usr-008",
      username: "parent",
      fullName: "Parent Test",
      passwordHash: parent,
      role: "PARENT",
    },
  ].map((u) => ({
    ...u,
    role: u.role as never,
    status: "actif" as const,
    createdAt: daysAgo(300),
    lastLoginAt: null,
    isDemo: true,
  }));

  const base: Database = {
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
    families: [],
    children,
    parents,
    childParents,
    attendance,
    dailyTransmissions,
    employees,
    invoices,
    payments,
    activities,
    auditLogs: [],
    backups: [],
  };

  // Entités Family persistées, dérivées des relations de démonstration.
  base.families = deriveFamiliesFromDatabase(base);

  // Rattache le compte PARENT de démonstration à la première famille ayant un enfant.
  const firstParentFamily = base.families.find((f) =>
    base.childParents.some((cp) => cp.parentId === f.primaryParentId),
  );
  if (firstParentFamily) {
    const parentUser = base.users.find((u) => u.role === "PARENT");
    if (parentUser) parentUser.familyId = firstParentFamily.id;
  }

  // Renseigne la copie rapide familyId sur chaque pointage (phase 3B)
  // et chaque transmission (phase 3C).
  const famByPrimary = new Map(base.families.map((f) => [f.primaryParentId, f.id]));
  for (const rec of base.attendance) {
    const link = base.childParents.find((cp) => cp.childId === rec.childId);
    rec.familyId = (link ? famByPrimary.get(link.parentId) : undefined) ?? null;
  }
  for (const tr of base.dailyTransmissions) {
    const link = base.childParents.find((cp) => cp.childId === tr.childId);
    tr.familyId = (link ? famByPrimary.get(link.parentId) : undefined) ?? null;
  }

  return base;
}
