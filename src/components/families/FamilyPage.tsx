import { FC, useMemo, useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import {
  LayoutGrid,
  List as ListIcon,
  Plus,
  ChevronRight,
  Search,
  SearchX,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/auth-context";
import { fullName, initials } from "@/lib/business/stats";
import type { Family } from "@/lib/business/families";
import { useFamiliesView } from "@/hooks/use-families";
import { FamilyFormDialog } from "./family-form-dialog";
import { FamilyCard } from "./family-card";
import { cn } from "@/lib/utils";

type ViewMode = "liste" | "mosaique";

function readViewMode(): ViewMode {
  if (typeof window === "undefined") return "liste";
  return window.localStorage.getItem("families.viewMode") === "mosaique" ? "mosaique" : "liste";
}

export const FamilyPage: FC = () => {
  const { can } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [view, setView] = useState<ViewMode>(readViewMode);
  const [createOpen, setCreateOpen] = useState(false);
  const familiesView = useFamiliesView();

  function switchView(next: ViewMode) {
    setView(next);
    try {
      window.localStorage.setItem("families.viewMode", next);
    } catch {
      // stockage indisponible : la préférence sera simplement non persistée
    }
  }

  const familles: Family[] = useMemo(
    () => (familiesView.data ? [...familiesView.data] : []),
    [familiesView.data],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return familles;
    return familles.filter((f) => {
      const nameText = f.record.name.toLowerCase();
      const contactText = `${f.record.phone} ${f.record.email}`.toLowerCase();
      const parentText = fullName(f.parent).toLowerCase();
      const membersText = f.members
        .map((m) => fullName({ firstName: m.firstName, lastName: m.lastName }))
        .join(" ")
        .toLowerCase();
      const childrenText = f.children
        .map((c) => fullName(c))
        .join(" ")
        .toLowerCase();
      const jobText = f.parent.job.toLowerCase();
      return (
        nameText.includes(q) ||
        contactText.includes(q) ||
        parentText.includes(q) ||
        membersText.includes(q) ||
        childrenText.includes(q) ||
        jobText.includes(q)
      );
    });
  }, [familles, query]);

  const responsableCount = useMemo(
    () =>
      familles.reduce(
        (sum, f) => sum + Math.max(f.members.length, f.record.primaryParentId ? 1 : 0),
        0,
      ),
    [familles],
  );
  const enfantCount = useMemo(
    () => familles.reduce((sum, f) => sum + f.children.length, 0),
    [familles],
  );

  function renderLoading() {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Chargement des familles…
      </div>
    );
  }

  function renderEmptyState() {
    return (
      <div className="rounded-xl border bg-card p-10 text-center shadow-card">
        <div className="mx-auto grid size-12 place-items-center rounded-xl bg-muted text-muted-foreground">
          <Users className="size-6" />
        </div>
        <h2 className="mt-4 text-lg font-semibold">Aucune famille</h2>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          Aucune famille n'est encore enregistrée. Créez une première famille pour commencer.
        </p>
      </div>
    );
  }

  function renderNoResults() {
    return (
      <div className="rounded-xl border bg-card p-10 text-center shadow-card">
        <div className="mx-auto grid size-12 place-items-center rounded-xl bg-muted text-muted-foreground">
          <SearchX className="size-6" />
        </div>
        <h2 className="mt-4 text-lg font-semibold">Aucune famille trouvée</h2>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
          Aucune famille ne correspond à votre recherche. Essayez d'élargir vos critères.
        </p>
        <button
          type="button"
          onClick={() => setQuery("")}
          className="mt-5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
          Réinitialiser la recherche
        </button>
      </div>
    );
  }

  function renderFamilyList() {
    return (
      <div className="overflow-hidden rounded-xl border bg-card shadow-card">
        <ul className="divide-y">
          {filtered.map((f) => (
            <li key={f.record.id} className="transition-colors hover:bg-muted/40">
              <Link
                to="/familles/$id"
                params={{ id: f.record.id }}
                className="flex items-center gap-3 px-4 py-3 sm:px-5"
              >
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                  {initials(f.parent)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-[14px] font-semibold">{f.record.name}</p>
                    {f.children.length > 0 && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {f.children.length} enfant{f.children.length > 1 ? "s" : ""}
                      </span>
                    )}
                    {f.members.length > 1 && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {f.members.length} responsables
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                    {f.members.length > 0
                      ? f.members
                          .map((m) => `${m.firstName} ${m.lastName} (${m.relation})`)
                          .join(", ")
                      : "Aucun responsable rattaché"}
                  </p>
                  {f.parent.job && (
                    <>
                      <span className="text-muted-foreground/40">·</span>
                      <span>{f.parent.job}</span>
                    </>
                  )}
                  {f.record.phone && (
                    <>
                      <span className="text-muted-foreground/40">·</span>
                      <span>{f.record.phone}</span>
                    </>
                  )}
                  {f.children.length > 0 && (
                    <p className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground/80">
                      {f.children.map((c) => (
                        <span key={c.id} className="truncate">
                          {fullName(c)}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
                <ChevronRight
                  className={cn("size-4 shrink-0 text-muted-foreground/50 transition-transform")}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  function renderFamilyGrid() {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {filtered.map((f) => (
          <FamilyCard key={f.record.id} family={f} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Gestion des familles"
        description={`${familles.length} famille(s) · ${responsableCount} responsable(s) · ${enfantCount} enfant(s)`}
        actions={
          can("families.edit") ? (
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 size-4" /> Ajouter une famille
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
              placeholder="Rechercher par nom de famille, responsable ou enfant…"
              className="h-10 pl-9"
              aria-label="Rechercher une famille"
            />
          </div>
          <div
            className="flex items-center gap-1 rounded-lg border bg-muted/30 p-1"
            role="group"
            aria-label="Mode d'affichage"
          >
            <button
              type="button"
              onClick={() => switchView("liste")}
              aria-label="Vue liste"
              aria-pressed={view === "liste"}
              title="Vue liste"
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
              onClick={() => switchView("mosaique")}
              aria-label="Vue mosaïque"
              aria-pressed={view === "mosaique"}
              title="Vue mosaïque"
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

      {familiesView.isLoading && familles.length === 0
        ? renderLoading()
        : familles.length === 0
          ? renderEmptyState()
          : filtered.length === 0
            ? renderNoResults()
            : view === "mosaique"
              ? renderFamilyGrid()
              : renderFamilyList()}

      <FamilyFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        family={null}
        onSaved={(record) => {
          setCreateOpen(false);
          if (record) {
            void navigate({ to: "/familles/$id", params: { id: record.id } });
          }
        }}
      />
    </div>
  );
};
