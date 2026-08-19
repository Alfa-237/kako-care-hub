import { useMemo, useState, useCallback } from "react";
import { useDatabase, mutate, logAction } from "@/lib/data/db";
import type { Child, ChildStatus, Section } from "@/lib/data/types";
import { useAuth } from "@/lib/auth/auth-context";

export interface EnfantsFilters {
  search: string;
  status: ChildStatus | "all";
  sectionId: string | "all";
  gender: "F" | "M" | "all";
  language: string | "all";
  hasMedicalAlert: boolean | "all";
  hasMissingDocuments: boolean | "all";
}

export const defaultFilters: EnfantsFilters = {
  search: "",
  status: "all",
  sectionId: "all",
  gender: "all",
  language: "all",
  hasMedicalAlert: "all",
  hasMissingDocuments: "all",
};

export interface EnfantsStats {
  total: number;
  inscrits: number;
  preinscrits: number;
  suspendus: number;
  sortis: number;
  nouveauxRecemment: number;
  avecAlertesMedicales: number;
  avecDocumentsManquants: number;
}

export function useEnfants() {
  const db = useDatabase();
  const { user } = useAuth();
  const [filters, setFilters] = useState<EnfantsFilters>(defaultFilters);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  const sectionsMap = useMemo(() => {
    if (!db) return new Map<string, Section>();
    return new Map(db.sections.map((s) => [s.id, s]));
  }, [db]);

  const stats = useMemo<EnfantsStats>(() => {
    if (!db) {
      return {
        total: 0,
        inscrits: 0,
        preinscrits: 0,
        suspendus: 0,
        sortis: 0,
        nouveauxRecemment: 0,
        avecAlertesMedicales: 0,
        avecDocumentsManquants: 0,
      };
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      total: db.children.length,
      inscrits: db.children.filter((c) => c.status === "Inscrit").length,
      preinscrits: db.children.filter((c) => c.status === "Préinscrit").length,
      suspendus: db.children.filter((c) => c.status === "Suspendu").length,
      sortis: db.children.filter((c) => c.status === "Sorti").length,
      nouveauxRecemment: db.children.filter(
        (c) => new Date(c.registrationDate) >= thirtyDaysAgo
      ).length,
      avecAlertesMedicales: db.children.filter((c) => c.medicalAlert).length,
      avecDocumentsManquants: db.children.filter((c) => c.missingDocuments.length > 0).length,
    };
  }, [db]);

  const filteredChildren = useMemo<Child[]>(() => {
    if (!db) return [];

    return db.children.filter((child) => {
      // Filtre par recherche textuelle
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchName =
          child.firstName.toLowerCase().includes(searchLower) ||
          child.lastName.toLowerCase().includes(searchLower);
        const matchFileNumber = child.fileNumber.toLowerCase().includes(searchLower);
        
        // Recherche par parent
        const childParentIds = db.childParents
          .filter((cp) => cp.childId === child.id)
          .map((cp) => cp.parentId);
        const parents = db.parents.filter((p) => childParentIds.includes(p.id));
        const matchParent = parents.some(
          (p) =>
            p.firstName.toLowerCase().includes(searchLower) ||
            p.lastName.toLowerCase().includes(searchLower)
        );

        // Recherche par section
        const section = child.sectionId ? sectionsMap.get(child.sectionId) : null;
        const matchSection = section?.name.toLowerCase().includes(searchLower);

        if (!matchName && !matchFileNumber && !matchParent && !matchSection) {
          return false;
        }
      }

      // Filtre par statut
      if (filters.status !== "all" && child.status !== filters.status) {
        return false;
      }

      // Filtre par section
      if (filters.sectionId !== "all" && child.sectionId !== filters.sectionId) {
        return false;
      }

      // Filtre par sexe
      if (filters.gender !== "all" && child.gender !== filters.gender) {
        return false;
      }

      // Filtre par langue
      if (filters.language !== "all" && child.language !== filters.language) {
        return false;
      }

      // Filtre par alertes médicales
      if (filters.hasMedicalAlert !== "all") {
        const hasAlert = !!child.medicalAlert;
        if (hasAlert !== filters.hasMedicalAlert) {
          return false;
        }
      }

      // Filtre par documents manquants
      if (filters.hasMissingDocuments !== "all") {
        const hasMissing = child.missingDocuments.length > 0;
        if (hasMissing !== filters.hasMissingDocuments) {
          return false;
        }
      }

      return true;
    });
  }, [db, filters, sectionsMap]);

  const availableLanguages = useMemo(() => {
    if (!db) return [];
    const langs = new Set(db.children.map((c) => c.language));
    return Array.from(langs).sort();
  }, [db]);

  const resetFilters = () => setFilters(defaultFilters);

  // Fonction pour calculer l'âge d'un enfant
  const calculateAge = useCallback((birthDate: string): number => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }, []);

  // Fonction pour obtenir le parent principal d'un enfant
  const getPrimaryParent = useCallback((childId: string) => {
    if (!db) return null;
    const childParent = db.childParents.find(cp => cp.childId === childId && cp.relation === "parent-principal");
    if (childParent) {
      return db.parents.find(p => p.id === childParent.parentId) || null;
    }
    // Fallback: premier parent trouvé
    const firstChildParent = db.childParents.find(cp => cp.childId === childId);
    if (firstChildParent) {
      return db.parents.find(p => p.id === firstChildParent.parentId) || null;
    }
    return null;
  }, [db]);

  // Fonction pour vérifier si un enfant a une présence aujourd'hui
  const hasAttendanceToday = useCallback((childId: string) => {
    if (!db) return false;
    const today = new Date().toISOString().split('T')[0];
    return db.attendance.some(a => a.childId === childId && a.date === today && a.state === "present");
  }, [db]);

  // Action: Archiver/sortir un enfant
  const archiveChild = useCallback(async (childId: string) => {
    await mutate((draft) => {
      const child = draft.children.find(c => c.id === childId);
      if (child) {
        child.status = "Sorti";
        child.contractEndDate = new Date().toISOString().split('T')[0];
      }
    });
    await logAction(user, "enfant.archive", `Enfant ${childId} archivé`);
  }, [user]);

  // Action: Suspendre un enfant
  const suspendChild = useCallback(async (childId: string) => {
    await mutate((draft) => {
      const child = draft.children.find(c => c.id === childId);
      if (child && child.status !== "Sorti") {
        child.status = "Suspendu";
      }
    });
    await logAction(user, "enfant.suspend", `Enfant ${childId} suspendu`);
  }, [user]);

  // Action: Réactiver un enfant
  const reactivateChild = useCallback(async (childId: string) => {
    await mutate((draft) => {
      const child = draft.children.find(c => c.id === childId);
      if (child && child.status === "Suspendu") {
        child.status = "Inscrit";
      }
    });
    await logAction(user, "enfant.reactivate", `Enfant ${childId} réactivé`);
  }, [user]);

  // Action: Supprimer un enfant (seulement si pas de données liées)
  const deleteChild = useCallback(async (childId: string) => {
    await mutate((draft) => {
      // Vérifier les relations
      const hasInvoices = draft.invoices.some(i => i.childId === childId);
      const hasAttendance = draft.attendance.some(a => a.childId === childId);
      const hasActivities = draft.activities.some(a => a.childIds.includes(childId));
      
      if (!hasInvoices && !hasAttendance && !hasActivities) {
        draft.children = draft.children.filter(c => c.id !== childId);
        draft.childParents = draft.childParents.filter(cp => cp.childId !== childId);
      }
    });
    await logAction(user, "enfant.delete", `Enfant ${childId} supprimé`);
  }, [user]);

  return {
    children: filteredChildren,
    allChildren: db?.children ?? [],
    stats,
    filters,
    setFilters,
    viewMode,
    setViewMode,
    sections: db?.sections ?? [],
    sectionsMap,
    availableLanguages,
    resetFilters,
    loading: !db,
    calculateAge,
    getPrimaryParent,
    hasAttendanceToday,
    archiveChild,
    suspendChild,
    reactivateChild,
    deleteChild,
    canDelete: (childId: string) => {
      if (!db) return false;
      const hasInvoices = db.invoices.some(i => i.childId === childId);
      const hasAttendance = db.attendance.some(a => a.childId === childId);
      const hasActivities = db.activities.some(a => a.childIds.includes(childId));
      return !hasInvoices && !hasAttendance && !hasActivities;
    },
  };
}
