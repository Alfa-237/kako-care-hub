import { useMemo, useState } from "react";
import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  FileWarning,
  HeartPulse,
  LayoutGrid,
  List as ListIcon,
  Plus,
  Search,
  SearchX,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth/auth-context";
import { useDatabase } from "@/lib/data/db";
import type { ChildStatus } from "@/lib/data/types";
import { ageLabel, fullName } from "@/lib/business/stats";
import { ChildAvatar } from "@/components/children/child-avatar";
import { ChildActionsInline, ChildActionsMenu } from "@/components/children/child-actions";
import { ChildCard } from "@/components/children/child-card";
import { ChildStatusBadge } from "@/components/children/child-status-badge";
import { ChildFormDialog } from "@/components/children/child-form-dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/enfants")({
  head: () => ({
    meta: [
      { title: "Enfants — KAKO Manager" },
      {
        name: "description",
        content: "Fiches complètes, recherche, filtres, vues liste et mosaïque.",
      },
      { property: "og:title", content: "Enfants — KAKO Manager" },
      {
        property: "og:description",
        content: "Fiches complètes, recherche, filtres, vues liste et mosaïque.",
      },
    ],
  }),
  component: ChildrenLayout,
});

function ChildrenLayout() {
  const { pathname } = useRouterState().location;
  if (pathname !== "/enfants") return <Outlet />;
  return <ChildrenPage />;
}

const STATUS_FILTERS: Array<{ value: "tous" | ChildStatus; label: string }> = [
  { value: "tous", label: "Tous les statuts" },
  { value: "Inscrit", label: "Inscrit" },
  { value: "Préinscrit", label: "Préinscrit" },
  { value: "Suspendu", label: "Suspendu" },
  { value: "Sorti", label: "Sorti" },
];

const SORT_OPTIONS = [
  { value: "nom-az", label: "Nom (A → Z)" },
  { value: "nom-za", label: "Nom (Z → A)" },
  { value: "age-croissant", label: "Âge (croissant)" },
  { value: "age-decroissant", label: "Âge (décroissant)" },
  { value: "inscription", label: "Date d'inscription" },
  { value: "dossier", label: "N° de dossier" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["value"];

function ChildrenPage() {
  const db = useDatabase();
  const { can } = useAuth();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"tous" | ChildStatus>("tous");
  const [showArchived, setShowArchived] = useState(false);
  const [sectionFilter, setSectionFilter] = useState("toutes");
  const [sort, setSort] = useState<SortKey>("nom-az");
  const [view, setView] = useState<"liste" | "mosaique">("liste");
  const [formOpen, setFormOpen] = useState(false);

  const sectionName = (id: string | null) => db?.sections.find((s) => s.id === id)?.name;

  const filtered = useMemo(() => {
    if (!db) return [];
    const q = query.trim().toLowerCase();
    const base = db.children.filter((c) => {
      const matchesQuery =
        !q || fullName(c).toLowerCase().includes(q) || c.fileNumber.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "tous" ? c.status !== "Sorti" || showArchived : c.status === statusFilter;
      const matchesSection = sectionFilter === "toutes" || c.sectionId === sectionFilter;
      return matchesQuery && matchesStatus && matchesSection;
    });
    return [...base].sort((a, b) => {
      switch (sort) {
        case "nom-az":
          return fullName(a).localeCompare(fullName(b), "fr");
        case "nom-za":
          return fullName(b).localeCompare(fullName(a), "fr");
        case "age-croissant":
          return b.birthDate.localeCompare(a.birthDate);
        case "age-decroissant":
          return a.birthDate.localeCompare(b.birthDate);
        case "inscription":
          return b.registrationDate.localeCompare(a.registrationDate);
        case "dossier":
          return a.fileNumber.localeCompare(b.fileNumber);
      }
    });
  }, [db, query, statusFilter, showArchived, sectionFilter, sort]);

  if (!db) return null;

  const hasActiveFilters =
    query.trim() !== "" || statusFilter !== "tous" || sectionFilter !== "toutes";

  const resetFilters = () => {
    setQuery("");
    setStatusFilter("tous");
    setSectionFilter("toutes");
  };

  return (
    <AppShell permission="children.view">
      <div className="space-y-5">
        <PageHeader
          title="Gestion des enfants"
          description={`${filtered.length} enfant(s) affiché(s) sur ${db.children.length} dossier(s)`}
          actions={
            can("children.edit") ? (
              <Button onClick={() => setFormOpen(true)}>
                <Plus className="mr-2 size-4" /> Ajouter un enfant
              </Button>
            ) : null
          }
        />

        <div className="rounded-xl border bg-card p-3 shadow-card md:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher par nom, prénom ou n° de dossier…"
                className="h-10 pl-9"
                aria-label="Rechercher un enfant"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as "tous" | ChildStatus)}
              >
                <SelectTrigger className="h-10 w-[170px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_FILTERS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sectionFilter} onValueChange={setSectionFilter}>
                <SelectTrigger className="h-10 w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="toutes">Toutes les sections</SelectItem>
                  {db.sections.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {statusFilter === "tous" ? (
                <label
                  htmlFor="show-archived"
                  className="flex h-10 cursor-pointer select-none items-center gap-2 rounded-lg border bg-card px-3 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Checkbox
                    id="show-archived"
                    checked={showArchived}
                    onCheckedChange={(v) => setShowArchived(v === true)}
                    aria-label="Afficher les enfants sortis"
                  />
                  <span>Sortis</span>
                </label>
              ) : null}

              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger className="h-10 w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-1 rounded-lg border bg-muted/30 p-1">
                <button
                  type="button"
                  onClick={() => setView("liste")}
                  aria-label="Vue liste"
                  aria-pressed={view === "liste"}
                  className={cn(
                    "grid size-8 place-items-center rounded-md transition-colors",
                    view === "liste"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <ListIcon className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setView("mosaique")}
                  aria-label="Vue mosaïque"
                  aria-pressed={view === "mosaique"}
                  className={cn(
                    "grid size-8 place-items-center rounded-md transition-colors",
                    view === "mosaique"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <LayoutGrid className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border bg-card p-10 text-center shadow-card">
            <div className="mx-auto grid size-12 place-items-center rounded-xl bg-muted text-muted-foreground">
              <SearchX className="size-6" />
            </div>
            <h2 className="mt-4 text-lg font-semibold">Aucun enfant trouvé</h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              {hasActiveFilters
                ? "Aucun enfant ne correspond à vos critères de recherche. Essayez de les élargir."
                : "Aucun enfant n'est encore enregistré. Ajoutez votre premier enfant pour commencer."}
            </p>
            {hasActiveFilters ? (
              <Button variant="outline" className="mt-5" onClick={resetFilters}>
                Réinitialiser les filtres
              </Button>
            ) : null}
          </div>
        ) : view === "liste" ? (
          <div className="overflow-hidden rounded-xl border bg-card shadow-card">
            <div className="hidden items-center justify-between gap-4 border-b px-4 py-2 sm:flex sm:px-5">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Enfants
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Actions
              </span>
            </div>
            <ul className="divide-y">
              {filtered.map((c) => {
                const secName = sectionName(c.sectionId);
                const hasAlert = Boolean(c.medicalAlert);
                const hasMissing = c.missingDocuments.length > 0;
                return (
                  <li key={c.id} className="flex items-center transition-colors hover:bg-muted/40">
                    <Link
                      to="/enfants/$id"
                      params={{ id: c.id }}
                      className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 sm:px-5"
                    >
                      <ChildAvatar photo={c.photo} firstName={c.firstName} lastName={c.lastName} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-semibold">{fullName(c)}</p>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                          <span>{c.fileNumber}</span>
                          <span className="text-muted-foreground/40">·</span>
                          <span>{ageLabel(c.birthDate)}</span>
                          {secName ? (
                            <>
                              <span className="text-muted-foreground/40">·</span>
                              <span>{secName}</span>
                            </>
                          ) : null}
                          {hasAlert ? (
                            <span className="flex items-center gap-1 text-destructive">
                              <HeartPulse className="size-3" /> alerte
                            </span>
                          ) : null}
                          {hasMissing ? (
                            <span className="flex items-center gap-1 text-warning-foreground">
                              <FileWarning className="size-3" /> documents manquants
                            </span>
                          ) : null}
                        </p>
                      </div>
                      <ChildStatusBadge status={c.status} className="hidden sm:inline-flex" />
                    </Link>
                    <div className="flex shrink-0 items-center gap-0.5 pr-1 sm:pr-2">
                      <ChildActionsInline child={c} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((c) => {
              const sec = sectionName(c.sectionId);
              return (
                <ChildCard
                  key={c.id}
                  child={c}
                  {...(sec ? { sectionName: sec } : {})}
                  actions={<ChildActionsMenu child={c} />}
                />
              );
            })}
          </div>
        )}

        <ChildFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          child={null}
          sections={db.sections}
        />
      </div>
    </AppShell>
  );
}
