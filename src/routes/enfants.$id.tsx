import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Archive, ArrowLeft, Baby, Pencil } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
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
import { useDatabase, logAction, mutate } from "@/lib/data/db";
import { useAuth } from "@/lib/auth/auth-context";
import { ageLabel, fullName } from "@/lib/business/stats";
import { ChildAvatar } from "@/components/children/child-avatar";
import { ChildStatusBadge } from "@/components/children/child-status-badge";
import { ChildDetail } from "@/components/children/child-detail";
import { ChildFormDialog } from "@/components/children/child-form-dialog";

export const Route = createFileRoute("/enfants/$id")({
  head: () => ({
    meta: [
      { title: "Fiche enfant — KAKO Manager" },
      {
        name: "description",
        content: "Fiche complète d'un enfant : famille, santé, présences, activités, facturation.",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { from?: string } => {
    const raw = search["from"];
    const from = typeof raw === "string" && raw ? raw : undefined;
    return from === undefined ? {} : { from };
  },
  component: ChildDetailPage,
});

function ChildDetailPage() {
  const { id } = Route.useParams();
  const { from } = Route.useSearch();
  const navigate = useNavigate();
  const db = useDatabase();
  const { can, user } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [archiving, setArchiving] = useState(false);

  const cameFromFamily = Boolean(from && db?.parents.some((p) => p.id === from));

  function returnToFamily() {
    if (!from) return;
    void navigate({ to: "/familles/$id", params: { id: from } });
  }

  if (!db) {
    return (
      <AppShell permission="children.view">
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
          Chargement de la fiche…
        </div>
      </AppShell>
    );
  }

  const child = db.children.find((c) => c.id === id);
  const section = child ? db.sections.find((s) => s.id === child.sectionId) : null;

  const isArchived = child?.status === "Sorti";

  async function handleArchive() {
    setArchiving(true);
    try {
      await mutate((d) => {
        const idx = d.children.findIndex((c) => c.id === child?.id);
        if (idx >= 0) d.children[idx] = { ...d.children[idx]!, status: "Sorti" };
      });
      await logAction(user, "Archivage enfant", fullName(child!));
      toast.success("Enfant archivé", {
        description: `${fullName(child!)} — statut passé à « Sorti ».`,
      });
      setArchiveOpen(false);
    } catch {
      toast.error("Erreur", { description: "L'archivage a échoué." });
    } finally {
      setArchiving(false);
    }
  }

  if (!child) {
    return (
      <AppShell permission="children.view">
        <div className="mx-auto max-w-md rounded-xl border bg-card p-10 text-center shadow-card">
          <div className="mx-auto grid size-12 place-items-center rounded-xl bg-muted text-muted-foreground">
            <Baby className="size-6" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">Enfant introuvable</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Ce dossier n'existe pas ou a été supprimé.
          </p>
          <Button variant="outline" className="mt-5" asChild>
            <Link to="/enfants">Retour à la liste</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell permission="children.view">
      <div className="space-y-5">
        {cameFromFamily ? (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 text-muted-foreground"
            onClick={returnToFamily}
          >
            <ArrowLeft className="mr-2 size-4" /> Retour à la famille
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="-ml-2 text-muted-foreground" asChild>
            <Link to="/enfants">
              <ArrowLeft className="mr-2 size-4" /> Retour à la liste
            </Link>
          </Button>
        )}

        <div className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-5 shadow-card">
          <ChildAvatar
            photo={child.photo}
            firstName={child.firstName}
            lastName={child.lastName}
            className="size-16 text-lg"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-xl font-bold tracking-tight">{fullName(child)}</h1>
              <ChildStatusBadge status={child.status} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {child.fileNumber} · {ageLabel(child.birthDate)} · {section?.name ?? "Sans section"}
            </p>
          </div>
          {can("children.edit") ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setArchiveOpen(true)}
                disabled={isArchived}
                title={isArchived ? "Cet enfant est déjà archivé" : undefined}
              >
                <Archive className="mr-2 size-4" /> Archiver
              </Button>
              <Button onClick={() => setEditOpen(true)}>
                <Pencil className="mr-2 size-4" /> Modifier
              </Button>
            </div>
          ) : null}
        </div>

        <ChildDetail child={child} />

        <AlertDialog open={archiveOpen} onOpenChange={setArchiveOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Archiver {fullName(child)} ?</AlertDialogTitle>
              <AlertDialogDescription>
                Le dossier passera au statut « Sorti ». Il restera consultable dans l'historique,
                mais il n'apparaîtra plus dans la liste active. Ses présences et factures sont
                conservées.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={archiving}>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  void handleArchive();
                }}
                disabled={archiving}
              >
                {archiving ? "Archivage…" : "Archiver"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {can("children.edit") ? (
          <ChildFormDialog
            open={editOpen}
            onOpenChange={setEditOpen}
            child={child}
            sections={db?.sections ?? []}
            {...(cameFromFamily ? { onSaved: returnToFamily } : {})}
          />
        ) : null}
      </div>
    </AppShell>
  );
}
