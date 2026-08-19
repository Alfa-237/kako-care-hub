import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/common/stat-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, FileText, AlertCircle, Baby, Users, ClipboardList, CalendarDays, Search, X, LayoutGrid, ListFilter } from "lucide-react";
import { useEnfants } from "@/hooks/use-enfants";
import { useAuth } from "@/lib/auth/auth-context";
import { cn } from "@/lib/utils";
import { useMemo, useState, useCallback } from "react";
import { EnfantsListView, EnfantsCardsView } from "@/components/enfants/enfants-list";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/enfants")({
  head: () => ({
    meta: [
      { title: "Enfants — KAKO Manager" },
      { name: "description", content: "Gestion complète des enfants inscrits à la crèche." },
      { property: "og:title", content: "Enfants — KAKO Manager" },
      { property: "og:description", content: "Gestion complète des enfants inscrits à la crèche." },
    ],
  }),
  component: Page,
});

function Page() {
  const { can } = useAuth();
  const { 
    children, 
    stats, 
    filters, 
    setFilters, 
    viewMode, 
    setViewMode, 
    sections, 
    availableLanguages, 
    resetFilters,
    loading,
    calculateAge,
    getPrimaryParent,
    hasAttendanceToday,
    archiveChild,
    suspendChild,
    reactivateChild,
    deleteChild,
    canDelete: checkCanDelete,
  } = useEnfants();

  const [childToAction, setChildToAction] = useState<{ id: string; action: "archive" | "suspend" | "reactivate" | "delete" } | null>(null);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.search !== "" ||
      filters.status !== "all" ||
      filters.sectionId !== "all" ||
      filters.gender !== "all" ||
      filters.language !== "all" ||
      filters.hasMedicalAlert !== "all" ||
      filters.hasMissingDocuments !== "all"
    );
  }, [filters]);

  const statusLabels: Record<string, string> = {
    all: "Tous les statuts",
    Inscrit: "Inscrits",
    Préinscrit: "Préinscrits",
    Suspendu: "Suspendus",
    Sorti: "Sortis",
  };

  const genderLabels: Record<string, string> = {
    all: "Tous les sexes",
    F: "Filles",
    M: "Garçons",
  };

  // Handlers pour les actions enfant
  const handleArchiveChild = useCallback(async (childId: string) => {
    await archiveChild(childId);
    toast.success("Enfant archivé avec succès");
    setChildToAction(null);
  }, [archiveChild]);

  const handleSuspendChild = useCallback(async (childId: string) => {
    await suspendChild(childId);
    toast.success("Enfant suspendu avec succès");
    setChildToAction(null);
  }, [suspendChild]);

  const handleReactivateChild = useCallback(async (childId: string) => {
    await reactivateChild(childId);
    toast.success("Enfant réactivé avec succès");
    setChildToAction(null);
  }, [reactivateChild]);

  const handleDeleteChild = useCallback(async (childId: string) => {
    await deleteChild(childId);
    toast.success("Enfant supprimé avec succès");
    setChildToAction(null);
  }, [deleteChild]);

  const onViewChild = useCallback((childId: string) => {
    // Sera implémenté Phase C - navigation vers la fiche détaillée
    toast.info(`Fiche de l'enfant ${childId} - à implémenter`);
  }, []);

  const onEditChild = useCallback((childId: string) => {
    // Sera implémenté Phase D - ouverture du formulaire de modification
    toast.info(`Modification enfant ${childId} - à implémenter`);
  }, []);

  const confirmAction = useCallback((childId: string, action: "archive" | "suspend" | "reactivate" | "delete") => {
    setChildToAction({ id: childId, action });
  }, []);

  if (loading) {
    return (
      <AppShell permission="children.view">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell permission="children.view">
      <div className="space-y-6">
        {/* En-tête */}
        <PageHeader
          title="Enfants"
          description="Gérez les dossiers de tous les enfants inscrits à la crèche"
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === "table" ? "cards" : "table")}>
                {viewMode === "table" ? <LayoutGrid className="size-4" /> : <ListFilter className="size-4" />}
              </Button>
              {can("children.create") && (
                <Button>
                  <Baby className="mr-2 size-4" />
                  Ajouter un enfant
                </Button>
              )}
            </div>
          }
        />

        {/* Statistiques */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total enfants"
            value={stats.total}
            icon={Users}
            tone="primary"
            hint={`${stats.inscrits} inscrits`}
          />
          <StatCard
            label="Inscrits"
            value={stats.inscrits}
            icon={BadgeCheck}
            tone="success"
            hint="Actifs en ce moment"
          />
          <StatCard
            label="Préinscrits"
            value={stats.preinscrits}
            icon={ClipboardList}
            tone="info"
            hint="En attente"
          />
          <StatCard
            label="Nouveaux (30j)"
            value={stats.nouveauxRecemment}
            icon={CalendarDays}
            tone="neutral"
            hint="Récemment inscrits"
          />
        </div>

        {/* Statistiques secondaires */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className={cn(
            "flex items-center gap-3 rounded-lg border p-3",
            stats.suspendus > 0 ? "border-warning/30 bg-warning/5" : "border-border"
          )}>
            <div className={cn(
              "grid size-9 place-items-center rounded-lg",
              stats.suspendus > 0 ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground"
            )}>
              <AlertCircle className="size-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Suspendus</p>
              <p className="text-lg font-bold">{stats.suspendus}</p>
            </div>
          </div>
          <div className={cn(
            "flex items-center gap-3 rounded-lg border p-3",
            stats.sortis > 0 ? "border-border bg-muted/30" : "border-border"
          )}>
            <div className="grid size-9 place-items-center rounded-lg bg-muted text-muted-foreground">
              <FileText className="size-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Sortis</p>
              <p className="text-lg font-bold">{stats.sortis}</p>
            </div>
          </div>
          <div className={cn(
            "flex items-center gap-3 rounded-lg border p-3",
            stats.avecAlertesMedicales > 0 ? "border-destructive/30 bg-destructive/5" : "border-border"
          )}>
            <div className={cn(
              "grid size-9 place-items-center rounded-lg",
              stats.avecAlertesMedicales > 0 ? "bg-destructive/15 text-destructive" : "bg-muted text-muted-foreground"
            )}>
              <AlertCircle className="size-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Alertes médicales</p>
              <p className="text-lg font-bold">{stats.avecAlertesMedicales}</p>
            </div>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            {/* Recherche */}
            <div className="flex-1">
              <label htmlFor="search" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Rechercher
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nom, prénom, n° dossier, parent..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Filtre statut */}
            <div className="w-full sm:w-[180px]">
              <label htmlFor="status" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Statut
              </label>
              <Select
                value={filters.status}
                onValueChange={(value) => setFilters({ ...filters, status: value as ChildStatus | "all" })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtre section */}
            <div className="w-full sm:w-[180px]">
              <label htmlFor="section" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Section
              </label>
              <Select
                value={filters.sectionId}
                onValueChange={(value) => setFilters({ ...filters, sectionId: value })}
              >
                <SelectTrigger id="section">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes sections</SelectItem>
                  {sections.map((section) => (
                    <SelectItem key={section.id} value={section.id}>{section.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtre sexe */}
            <div className="w-full sm:w-[140px]">
              <label htmlFor="gender" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Sexe
              </label>
              <Select
                value={filters.gender}
                onValueChange={(value) => setFilters({ ...filters, gender: value as "F" | "M" | "all" })}
              >
                <SelectTrigger id="gender">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(genderLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtre langue */}
            <div className="w-full sm:w-[140px]">
              <label htmlFor="language" className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                Langue
              </label>
              <Select
                value={filters.language}
                onValueChange={(value) => setFilters({ ...filters, language: value })}
              >
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes langues</SelectItem>
                  {availableLanguages.map((lang) => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bouton réinitialiser */}
            {hasActiveFilters && (
              <Button variant="ghost" onClick={resetFilters} className="shrink-0">
                <X className="mr-2 size-4" />
                Réinitialiser
              </Button>
            )}
          </div>

          {/* Filtres avancés */}
          <div className="mt-4 flex flex-wrap items-center gap-3 pt-4 border-t">
            <span className="text-xs font-semibold text-muted-foreground">Filtres avancés :</span>
            
            <Button
              variant={filters.hasMedicalAlert === true ? "default" : "outline"}
              size="sm"
              onClick={() => setFilters({ 
                ...filters, 
                hasMedicalAlert: filters.hasMedicalAlert === true ? "all" : true 
              })}
              className={cn(
                filters.hasMedicalAlert === true && "bg-destructive hover:bg-destructive/90"
              )}
            >
              <AlertCircle className="mr-1.5 size-3.5" />
              Alertes médicales
            </Button>

            <Button
              variant={filters.hasMissingDocuments === true ? "default" : "outline"}
              size="sm"
              onClick={() => setFilters({ 
                ...filters, 
                hasMissingDocuments: filters.hasMissingDocuments === true ? "all" : true 
              })}
            >
              <FileText className="mr-1.5 size-3.5" />
              Documents manquants
            </Button>

            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-auto">
                {children.length} résultat{children.length > 1 ? "s" : ""}
              </Badge>
            )}
          </div>
        </div>

        {/* Résultat vide */}
        {!loading && children.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card p-12 text-center">
            <div className="grid size-16 place-items-center rounded-full bg-muted">
              <Baby className="size-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Aucun enfant trouvé</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {hasActiveFilters
                ? "Essayez de modifier ou réinitialiser vos filtres de recherche."
                : "Commencez par ajouter un premier enfant à la crèche."}
            </p>
            {hasActiveFilters ? (
              <Button variant="outline" onClick={resetFilters} className="mt-4">
                Réinitialiser les filtres
              </Button>
            ) : can("children.create") ? (
              <Button className="mt-4">
                <Baby className="mr-2 size-4" />
                Ajouter un enfant
              </Button>
            ) : null}
          </div>
        )}

        {/* Vue Tableau ou Cartes */}
        {!loading && children.length > 0 && viewMode === "table" && (
          <EnfantsListView
            children={children}
            sectionsMap={sectionsMap}
            calculateAge={calculateAge}
            getPrimaryParent={getPrimaryParent}
            hasAttendanceToday={hasAttendanceToday}
            canEdit={can("children.edit")}
            canDelete={can("children.delete")}
            canArchive={can("children.archive")}
            onViewChild={onViewChild}
            onEditChild={onEditChild}
            onArchiveChild={(id) => confirmAction(id, "archive")}
            onSuspendChild={(id) => confirmAction(id, "suspend")}
            onReactivateChild={(id) => confirmAction(id, "reactivate")}
            onDeleteChild={(id) => confirmAction(id, "delete")}
            canUserDelete={checkCanDelete}
          />
        )}

        {!loading && children.length > 0 && viewMode === "cards" && (
          <EnfantsCardsView
            children={children}
            sectionsMap={sectionsMap}
            calculateAge={calculateAge}
            getPrimaryParent={getPrimaryParent}
            hasAttendanceToday={hasAttendanceToday}
            canEdit={can("children.edit")}
            canDelete={can("children.delete")}
            canArchive={can("children.archive")}
            onViewChild={onViewChild}
            onEditChild={onEditChild}
            onArchiveChild={(id) => confirmAction(id, "archive")}
            onSuspendChild={(id) => confirmAction(id, "suspend")}
            onReactivateChild={(id) => confirmAction(id, "reactivate")}
            onDeleteChild={(id) => confirmAction(id, "delete")}
            canUserDelete={checkCanDelete}
          />
        )}

        {/* Dialog de confirmation */}
        <AlertDialog open={childToAction !== null} onOpenChange={() => setChildToAction(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {childToAction?.action === "archive" && "Archiver / Sortir l'enfant"}
                {childToAction?.action === "suspend" && "Suspendre l'enfant"}
                {childToAction?.action === "reactivate" && "Réactiver l'enfant"}
                {childToAction?.action === "delete" && "Supprimer l'enfant"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {childToAction?.action === "archive" && "Cet enfant sera marqué comme 'Sorti'. Ses données resteront dans le système pour l'historique."}
                {childToAction?.action === "suspend" && "Cet enfant sera temporairement suspendu. Vous pourrez le réactiver ultérieurement."}
                {childToAction?.action === "reactivate" && "Cet enfant sera réactivé et reprendra sa place dans la crèche."}
                {childToAction?.action === "delete" && "Cette action est irréversible. Toutes les données liées à cet enfant seront supprimées."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (childToAction?.action === "archive") handleArchiveChild(childToAction.id);
                  else if (childToAction?.action === "suspend") handleSuspendChild(childToAction.id);
                  else if (childToAction?.action === "reactivate") handleReactivateChild(childToAction.id);
                  else if (childToAction?.action === "delete") handleDeleteChild(childToAction.id);
                }}
                className={childToAction?.action === "delete" ? "bg-destructive hover:bg-destructive/90" : undefined}
              >
                Confirmer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppShell>
  );
}
