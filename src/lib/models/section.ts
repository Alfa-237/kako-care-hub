// Modèle Section — groupe d'accueil des enfants (phase 8A).
// Le type Section vit dans src/lib/data/types.ts ; ce module expose la
// validation (Zod) et des helpers de lecture pour le module planning.
import { z } from "zod";
import type { Section } from "../data/types";

export type { Section } from "../data/types";

/** Schéma complet (stockage) d'une section. */
export const sectionRecordSchema = z.object({
  id: z.string(),
  name: z.string(),
  ageMin: z.number(),
  ageMax: z.number(),
  capacity: z.number(),
  color: z.string(),
  isDemo: z.boolean(),
});

/** Initiales de la section (utilisées pour l'affichage avatar / badge). */
export function sectionInitials(name: string): string {
  return name
    .replace(/^(Les|La|Le)\s+/i, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
}

/** Libellé de tranche d'âge lisible, ex. « 3–12 mois ». */
export function sectionAgeLabel(s: Section): string {
  return `${s.ageMin}–${s.ageMax} mois`;
}
