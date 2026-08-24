import type { Child, ChildParent, Database, Parent } from "../data/types";
import type { FamilyRecord } from "../models/family";
import { nowIso } from "../models/types";

export interface FamilyMember {
  id: string;
  childParentId: string;
  parentId: string;
  firstName: string;
  lastName: string;
  relation: string;
  phone: string;
  email: string;
  address: string;
  job: string;
  canPickUp: boolean;
  isEmergencyContact: boolean;
  receivesDocuments: boolean;
  canSign: boolean;
}

export interface Family {
  /** Entité persistée (identité : nom, contact, statut, notes). */
  record: FamilyRecord;
  /** Responsable principal — ou un profil « tampon » alimenté par l'entité si aucun responsable n'est encore défini. */
  parent: Parent;
  members: FamilyMember[];
  children: Child[];
}

/** Profil de substitution utilisé tant qu'aucun responsable principal n'est rattaché. */
function placeholderParent(record: FamilyRecord): Parent {
  return {
    id: record.primaryParentId ?? `placeholder-${record.id}`,
    firstName: "",
    lastName: record.name.replace(/^Famille\s+/i, "") || record.name,
    phone: record.phone,
    email: record.email,
    address: record.address,
    job: "",
    idDocument: "",
    isDemo: record.isDemo,
  };
}

/**
 * Construit une famille à partir d'un parent de référence.
 * La famille regroupe tous les parents liés aux mêmes enfants (co-responsables)
 * et les enfants rattachés au parent de référence.
 */
export function buildFamily(db: Database, parentId: string): Family | null {
  const parent = db.parents?.find((p) => p.id === parentId);
  if (!parent) return null;

  const relations: ChildParent[] = (db.childParents ?? []).filter((cp) => cp.parentId === parentId);
  if (relations.length === 0) {
    const members: FamilyMember[] = [
      {
        id: parent.id,
        childParentId: parent.id,
        parentId: parent.id,
        firstName: parent.firstName,
        lastName: parent.lastName,
        relation: "Parent",
        phone: parent.phone,
        email: parent.email,
        address: parent.address,
        job: parent.job,
        canPickUp: false,
        isEmergencyContact: false,
        receivesDocuments: false,
        canSign: false,
      },
    ];
    const base: Omit<Family, "record"> = { parent, members, children: [] };
    return { ...base, record: recordFromFamily(base) };
  }
  const childIds = relations.map((cp) => cp.childId);
  const childSet = new Set(childIds);

  const children = (db.children ?? []).filter((c) => childSet.has(c.id));

  const seenParents = new Set<string>();
  const members: FamilyMember[] = [];
  for (const cp of db.childParents ?? []) {
    if (!childSet.has(cp.childId)) continue;
    if (seenParents.has(cp.parentId)) continue;
    seenParents.add(cp.parentId);
    const p = db.parents?.find((x) => x.id === cp.parentId);
    if (!p) continue;
    members.push({
      id: p.id,
      childParentId: cp.id,
      parentId: p.id,
      firstName: p.firstName,
      lastName: p.lastName,
      relation: cp.relation || "Parent",
      phone: p.phone,
      email: p.email,
      address: p.address,
      job: p.job,
      canPickUp: cp.canPickUp ?? false,
      isEmergencyContact: cp.isEmergencyContact ?? false,
      receivesDocuments: cp.receivesDocuments ?? false,
      canSign: cp.canSign ?? false,
    });
  }

  if (members.length === 0) {
    members.push({
      id: parent.id,
      childParentId: parent.id,
      parentId: parent.id,
      firstName: parent.firstName,
      lastName: parent.lastName,
      relation: "Parent",
      phone: parent.phone,
      email: parent.email,
      address: parent.address,
      job: parent.job,
      canPickUp: false,
      isEmergencyContact: false,
      receivesDocuments: false,
      canSign: false,
    });
  }

  const base: Omit<Family, "record"> = { parent, members, children };
  return { ...base, record: recordFromFamily(base) };
}

/** Construit l'entité Family correspondant à une vue dérivée (sans la persister). */
export function recordFromFamily(family: Omit<Family, "record">): FamilyRecord {
  const now = nowIso();
  return {
    id: family.parent.id,
    name: `Famille ${family.parent.lastName || family.parent.firstName || family.parent.id}`.trim(),
    address: family.parent.address || "",
    phone: family.parent.phone || "",
    email: family.parent.email || "",
    status: "Active",
    notes: "",
    primaryParentId: family.parent.id,
    createdAt: now,
    updatedAt: now,
    isDemo: family.parent.isDemo,
  };
}

/**
 * Dérive les entités Family persistées à partir des relations existantes
 * (utilisé pour la migration automatique et le seed de démonstration).
 * L'id de l'entité reprend l'id du parent de référence afin de préserver les URL /familles/$id.
 */
export function deriveFamiliesFromDatabase(db: Database): FamilyRecord[] {
  return listFamiliesLegacy(db).map(recordFromFamily);
}

/** Assemble la vue jointe (entité + responsable + membres + enfants) d'une famille persistée. */
function viewFromRecord(db: Database, record: FamilyRecord): Family {
  const joined =
    record.primaryParentId && db.parents?.some((p) => p.id === record.primaryParentId)
      ? buildFamily(db, record.primaryParentId)
      : null;
  return {
    record,
    parent:
      joined?.parent ??
      db.parents?.find((p) => p.id === record.primaryParentId) ??
      placeholderParent(record),
    members: joined?.members ?? [],
    children: joined?.children ?? [],
  };
}

/** Vue jointe par identifiant d'entité famille (id d'entité OU id de parent hérité). */
export function getFamilyViewById(db: Database, id: string): Family | null {
  const record = (db.families ?? []).find((f) => f.id === id);
  if (record) return viewFromRecord(db, record);
  // Compatibilité : id hérité d'un parent sans entité (stockage non migré).
  const legacy = buildFamily(db, id);
  if (!legacy) return null;
  return { ...legacy, record: recordFromFamily(legacy) };
}

/**
 * Liste toutes les familles.
 * Source prioritaire : entités persistées (`db.families`).
 * Repli : dérivation historique depuis les parents (stockage non migré).
 */
export function listFamilies(db: Database): Family[] {
  const persisted = db.families;
  if (Array.isArray(persisted) && persisted.length > 0) {
    return persisted
      .map((r) => viewFromRecord(db, r))
      .sort((a, b) => a.record.name.localeCompare(b.record.name, "fr"));
  }
  return listFamiliesLegacy(db).map((legacy) => ({ ...legacy, record: recordFromFamily(legacy) }));
}

/** Liste toutes les familles : un parent de référence par groupe de relations. */
function listFamiliesLegacy(db: Database): Family[] {
  const parents = db.parents ?? [];
  if (parents.length === 0) return [];

  const seenChildren = new Set<string>();
  const grouped = new Map<string, ChildParent[]>();
  for (const cp of db.childParents ?? []) {
    const list = grouped.get(cp.parentId) ?? [];
    list.push(cp);
    grouped.set(cp.parentId, list);
  }

  const families: Family[] = [];
  for (const parent of parents) {
    const rels = grouped.get(parent.id) ?? [];
    if (rels.length === 0) continue;
    const family = buildFamily(db, parent.id);
    if (!family) continue;
    const childIds = new Set(family.children.map((c) => c.id));
    const isCoResponsible = [...childIds].every((cid) => seenChildren.has(cid));
    if (isCoResponsible && childIds.size > 0) continue;
    childIds.forEach((cid) => seenChildren.add(cid));
    families.push(family);
  }

  return families;
}
