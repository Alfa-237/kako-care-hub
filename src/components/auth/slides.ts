/**
 * Visuels d'accueil KAKO Manager.
 * Images générées pour le projet (aucune source tierce, aucun watermark),
 * libres de droit et utilisables commercialement.
 */
import enfants1 from "@/assets/login/enfants-1.jpg";
import enfants2 from "@/assets/login/enfants-2.jpg";
import enfants3 from "@/assets/login/enfants-3.jpg";
import enfants4 from "@/assets/login/enfants-4.jpg";
import equipe1 from "@/assets/login/equipe-1.jpg";
import equipe2 from "@/assets/login/equipe-2.jpg";
import equipe3 from "@/assets/login/equipe-3.jpg";
import equipe4 from "@/assets/login/equipe-4.jpg";
import type { Slide } from "./auth-slideshow";

export const CHILD_SLIDES: Slide[] = [
  { src: enfants1, alt: "Enfants joyeux jouant ensemble dans une salle de crèche" },
  { src: enfants2, alt: "Enfants réalisant une activité de dessin" },
  { src: enfants3, alt: "Groupe d'enfants écoutant une histoire en maternelle" },
  { src: enfants4, alt: "Petite fille souriante jouant avec des cubes en bois" },
];

export const TEAM_SLIDES: Slide[] = [
  { src: equipe1, alt: "Éducatrice accompagnant des enfants pendant une activité" },
  { src: equipe2, alt: "Directrice de crèche dans son bureau" },
  { src: equipe3, alt: "Équipe éducative en réunion" },
  { src: equipe4, alt: "Éducateur lisant une histoire à des enfants" },
];
