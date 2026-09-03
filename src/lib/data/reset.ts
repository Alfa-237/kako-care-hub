// Réinitialisation des données locales.
import { replaceDatabase } from "./db";
import { buildSeedDatabase } from "./seed";
import type { Database } from "./types";

/**
 * Réinitialise la base avec le jeu de données de démonstration
 * (familles incluses). Équivaut à « Restaurer les données démo ».
 */
export async function resetData(): Promise<Database> {
  const seeded = await buildSeedDatabase();
  await replaceDatabase(seeded);
  return seeded;
}

/**
 * Vide toutes les collections métier en conservant l'établissement et les
 * comptes utilisateurs (l'application reste utilisable à vide).
 */
export async function emptyData(): Promise<Database> {
  const current = await buildSeedDatabase();
  const empty: Database = {
    ...current,
    families: [],
    children: [],
    parents: [],
    childParents: [],
    attendance: [],
    dailyTransmissions: [],
    childSchedules: [],
    scheduleExceptions: [],
    employees: [],
    invoices: [],
    payments: [],
    activities: [],
    auditLogs: [],
    backups: [],
  };
  await replaceDatabase(empty);
  return empty;
}
