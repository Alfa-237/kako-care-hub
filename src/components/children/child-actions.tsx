import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { fullName } from "@/lib/business/stats";
import type { Child } from "@/lib/data/types";
import { ChildFormDialog } from "./child-form-dialog";

/**
 * Actions fonctionnelles d'un enfant : Détails (fiche /enfants/$id), Modifier
 * (formulaire existant prérempli) et Supprimer (archivage via le statut « Sorti »,
 * cohérent avec l'architecture : les présences, factures et liens familiaux sont
 * conservés). La suppression destructive n'existe pas dans l'application.
 */
function useChildActions(child: Child) {
  const { can, user } = useAuth();
  const db = useDatabase();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const canEdit = can("children.edit");
  const canDelete = can("children.delete");
  const name = fullName(child);

  async function handleDelete() {
    setBusy(true);
    try {
      await mutate((d) => {
        const idx = d.children.findIndex((c) => c.id === child.id);
        if (idx >= 0) d.children[idx] = { ...d.children[idx]!, status: "Sorti" };
      });
      await logAction(user, "Archivage enfant", name);
      toast.success("Enfant archivé", {
        description: `${name} — retiré de la liste active, données liées conservées.`,
      });
      setDeleteOpen(false);
    } catch {
      toast.error("Erreur", { description: "L'archivage a échoué." });
    } finally {
      setBusy(false);
    }
  }

  return {
    child,
    db,
    canEdit,
    canDelete,
    name,
    editOpen,
    setEditOpen,
    deleteOpen,
    setDeleteOpen,
    busy,
    handleDelete,
  };
}

function ChildActionDialogs({
  child,
  db,
  editOpen,
  setEditOpen,
  deleteOpen,
  setDeleteOpen,
  busy,
  handleDelete,
  name,
}: ReturnType<typeof useChildActions>) {
  return (
    <>
      {db ? (
        <ChildFormDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          child={child}
          sections={db.sections}
        />
      ) : null}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer {name} ?</AlertDialogTitle>
            <AlertDialogDescription>
              Par sécurité, la suppression se fait par archivage : {name} passera au statut « Sorti
              » et n'apparaîtra plus dans la liste active. Son dossier, ses présences, ses factures
              et ses données liées seront conservés et resteront consultables.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                void handleDelete();
              }}
              disabled={busy}
            >
              {busy ? "Archivage…" : "Supprimer (archiver)"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

/** Actions compactes (icônes) pour la vue liste. */
export function ChildActionsInline({ child }: { child: Child }) {
  const actions = useChildActions(child);
  const navigate = useNavigate();

  function openDetails() {
    void navigate({ to: "/enfants/$id", params: { id: child.id } });
  }

  return (
    <>
      <div className="flex items-center gap-0.5">
        <Button
          size="icon"
          variant="ghost"
          className="size-8"
          title="Voir la fiche"
          aria-label={`Voir la fiche de ${actions.name}`}
          onClick={openDetails}
        >
          <Eye className="size-4" />
        </Button>
        {actions.canEdit ? (
          <Button
            size="icon"
            variant="ghost"
            className="size-8"
            title="Modifier"
            aria-label={`Modifier ${actions.name}`}
            onClick={() => actions.setEditOpen(true)}
          >
            <Pencil className="size-4" />
          </Button>
        ) : null}
        {actions.canDelete ? (
          <Button
            size="icon"
            variant="ghost"
            className="size-8 text-destructive hover:text-destructive"
            title="Supprimer (archiver)"
            aria-label={`Supprimer ${actions.name}`}
            onClick={() => actions.setDeleteOpen(true)}
          >
            <Trash2 className="size-4" />
          </Button>
        ) : null}
      </div>
      <ChildActionDialogs {...actions} />
    </>
  );
}

/** Menu « … » pour la vue mosaïque afin de ne pas surcharger la carte. */
export function ChildActionsMenu({ child }: { child: Child }) {
  const actions = useChildActions(child);
  const navigate = useNavigate();

  function openDetails() {
    void navigate({ to: "/enfants/$id", params: { id: child.id } });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="size-8"
            aria-label={`Actions pour ${actions.name}`}
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem onSelect={openDetails}>
            <Eye className="size-4" /> Détails
          </DropdownMenuItem>
          {actions.canEdit ? (
            <DropdownMenuItem onClick={() => actions.setEditOpen(true)}>
              <Pencil className="size-4" /> Modifier
            </DropdownMenuItem>
          ) : null}
          {actions.canDelete ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => actions.setDeleteOpen(true)}
              >
                <Trash2 className="size-4" /> Supprimer
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
      <ChildActionDialogs {...actions} />
    </>
  );
}
