import { FC, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Link2,
  Pencil,
  Plus,
  Trash2,
  Unlink,
  Users,
  Info,
  AlertTriangle,
  FileText,
  CreditCard,
  Clock,
  Contact,
} from "lucide-react";
import { toast } from "sonner";
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
import { useAuth } from "@/lib/auth/auth-context";
import { useDatabase, logAction, mutate } from "@/lib/data/db";
import { fullName } from "@/lib/business/stats";
import { PageHeader } from "@/components/common/page-header";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { StatusPill } from "@/components/common/status-pill";
import { ResponsableCard } from "./ResponsableCard";
import { EnfantLink } from "./EnfantLink";
import { ParentFormDialog } from "./parent-form-dialog";
import { FamilyFormDialog } from "./family-form-dialog";
import { LinkChildDialog } from "./link-child-dialog";
import { LinkParentDialog } from "./link-parent-dialog";
import { useFamilyView, useUpdateFamily } from "@/hooks/use-families";
import { useFamilyContacts, useDeleteContact } from "@/hooks/use-family-contacts";
import { authorizedPersonInitials, type AuthorizedPerson } from "@/lib/models/authorized-person";
import { AuthorizedPersonDialog } from "./authorized-person-dialog";
import { AuthorizationBadges } from "./authorization-badges";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const STATUS_TONES = {
  Active: "success",
  Inactive: "warning",
  Archivée: "neutral",
} as const;

interface FamilyDetailProps {
  id: string;
}

export const FamilyDetail: FC<FamilyDetailProps> = ({ id }) => {
  const db = useDatabase();
  const { can, user } = useAuth();
  const navigate = useNavigate();

  const familyQuery = useFamilyView(id);
  const updateFamily = useUpdateFamily();
  const contactsQuery = useFamilyContacts(id);
  const deleteContact = useDeleteContact();

  const [editParentOpen, setEditParentOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<string | null>(null);
  const [deleteParentId, setDeleteParentId] = useState<string | null>(null);
  const [linkChildOpen, setLinkChildOpen] = useState(false);
  const [linkParentChildId, setLinkParentChildId] = useState<string | null>(null);
  const [unlinkCpId, setUnlinkCpId] = useState<string | null>(null);
  const [editFamilyOpen, setEditFamilyOpen] = useState(false);
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<AuthorizedPerson | null>(null);
  const [deletingContact, setDeletingContact] = useState<AuthorizedPerson | null>(null);
  /** Mode du dialog responsable : création simple ou définition du responsable principal. */
  const [definePrimaryMode, setDefinePrimaryMode] = useState(false);

  const family = familyQuery.data ?? null;

  const childParentMap = useMemo(() => {
    if (!db)
      return new Map<
        string,
        { id: string; parentId: string; relation: string; canPickUp: boolean }[]
      >();
    const map = new Map<
      string,
      { id: string; parentId: string; relation: string; canPickUp: boolean }[]
    >();
    for (const cp of db.childParents) {
      const list = map.get(cp.childId) ?? [];
      list.push({
        id: cp.id,
        parentId: cp.parentId,
        relation: cp.relation,
        canPickUp: cp.canPickUp,
      });
      map.set(cp.childId, list);
    }
    return map;
  }, [db]);

  if (!db || !family) {
    return familyQuery.isPending ? (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
        Chargement de la fiche…
      </div>
    ) : (
      <div className="mx-auto max-w-md rounded-xl border bg-card p-10 text-center shadow-card">
        <div className="mx-auto grid size-12 place-items-center rounded-xl bg-muted text-muted-foreground">
          <Users className="size-6" />
        </div>
        <h2 className="mt-4 text-lg font-semibold">Famille introuvable</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ce dossier n'existe pas ou a été supprimé.
        </p>
        <Button variant="outline" className="mt-5" asChild>
          <Link to="/familles">Retour à la liste</Link>
        </Button>
      </div>
    );
  }

  const memberForDelete = family.members.find((m) => m.parentId === deleteParentId);

  function handleAddResponsable() {
    setDefinePrimaryMode(false);
    setEditingParent(null);
    setEditParentOpen(true);
  }

  function handleDefinePrimaryResponsable() {
    setDefinePrimaryMode(true);
    setEditingParent(null);
    setEditParentOpen(true);
  }

  async function handleParentCreated(parentId: string) {
    if (!definePrimaryMode) return;
    try {
      await updateFamily.mutateAsync({ id, patch: { primaryParentId: parentId } });
      await logAction(
        user,
        "Définition responsable principal",
        fullName(
          db?.parents?.find((p) => p.id === parentId) ?? { firstName: "", lastName: parentId },
        ),
      );
      toast.success("Responsable principal défini");
    } catch {
      toast.error("Erreur", { description: "La définition du responsable a échoué." });
    }
  }

  function handleEditResponsable(parentId: string) {
    setEditingParent(parentId);
    setEditParentOpen(true);
  }

  async function handleConfirmDeleteParent() {
    if (!deleteParentId || !db) return;
    const parent = db.parents?.find((p) => p.id === deleteParentId);
    try {
      await mutate((d) => {
        d.parents = d.parents.filter((p) => p.id !== deleteParentId);
        d.childParents = d.childParents.filter((cp) => cp.parentId !== deleteParentId);
        // Si le responsable supprimé était l'ancre de la famille, on détache l'entité.
        for (const f of d.families ?? []) {
          if (f.primaryParentId === deleteParentId) f.primaryParentId = null;
        }
      });
      await logAction(user, "Suppression responsable", parent ? fullName(parent) : "");
      toast.success("Responsable supprimé");
      setDeleteParentId(null);
      if (parent?.id === record.primaryParentId) {
        navigate({ to: "/familles" });
      }
    } catch {
      toast.error("Erreur", { description: "La suppression a échoué." });
    }
  }

  async function handleConfirmUnlink() {
    if (!unlinkCpId || !db) return;
    const cp = db.childParents.find((x) => x.id === unlinkCpId);
    if (!cp) return;
    const parent = db.parents?.find((p) => p.id === cp.parentId);
    const child = db.children?.find((c) => c.id === cp.childId);
    try {
      await mutate((d) => {
        d.childParents = d.childParents.filter((x) => x.id !== unlinkCpId);
      });
      await logAction(
        user,
        "Suppression lien parent/enfant",
        `${parent ? fullName(parent) : "?"} - ${child ? fullName(child) : "?"}`,
      );
      toast.success("Lien retiré", {
        description: `${parent ? fullName(parent) : "Parent"} ↔ ${child ? fullName(child) : "enfant"}`,
      });
    } catch {
      toast.error("Erreur", { description: "La suppression du lien a échoué." });
    }
    setUnlinkCpId(null);
  }

  async function handleConfirmDeleteContact() {
    if (!deletingContact) return;
    try {
      await deleteContact.mutateAsync(deletingContact);
      toast.success("Contact supprimé", {
        description: `${deletingContact.firstName} ${deletingContact.lastName}`,
      });
      setDeletingContact(null);
    } catch {
      toast.error("Erreur", { description: "La suppression du contact a échoué." });
    }
  }

  const linkedParentNames = (childId: string) => {
    const links = childParentMap.get(childId) ?? [];
    return links
      .map((l) => db.parents.find((p) => p.id === l.parentId))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
  };

  const referenceParent = family.parent;
  const record = family.record;

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: "Familles", href: "/familles" }, { label: record.name }]} />

      <PageHeader
        title={record.name}
        description={`${family.children.length} enfant(s) • ${family.members.length} responsable(s) • ${record.phone || "—"}`}
        actions={
          <>
            {can("families.edit") ? (
              <Button variant="outline" size="sm" onClick={() => setEditFamilyOpen(true)}>
                <Pencil className="mr-2 size-4" /> Modifier
              </Button>
            ) : null}
            {can("families.edit") ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLinkChildOpen(true)}
                disabled={!record.primaryParentId}
                title={
                  record.primaryParentId
                    ? undefined
                    : "Définissez d'abord un responsable principal (onglet Famille)."
                }
              >
                <Link2 className="mr-2 size-4" /> Lier un enfant
              </Button>
            ) : null}
          </>
        }
      />

      <Tabs defaultValue="infos" className="space-y-4">
        <TabsList
          className="h-auto w-full flex-wrap justify-start gap-1"
          aria-label="Sections de la fiche famille"
        >
          <TabsTrigger value="infos">
            <Info className="mr-2 size-4" /> Infos générales
          </TabsTrigger>
          <TabsTrigger value="famille">
            <Users className="mr-2 size-4" /> Famille
          </TabsTrigger>
          <TabsTrigger value="urgences">
            <AlertTriangle className="mr-2 size-4" /> Urgences & Autorisations
          </TabsTrigger>
          <TabsTrigger value="contacts">
            <Contact className="mr-2 size-4" /> Autorisations & contacts
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="mr-2 size-4" /> Documents
          </TabsTrigger>
          <TabsTrigger value="facturation">
            <CreditCard className="mr-2 size-4" /> Facturation
          </TabsTrigger>
          <TabsTrigger value="historique">
            <Clock className="mr-2 size-4" /> Historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="infos" className="space-y-5">
          <section className="rounded-xl border bg-card p-5 shadow-card">
            <h2 className="text-sm font-semibold text-foreground mb-4">Informations du dossier</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  N° de dossier
                </p>
                <p className="text-[13.5px] font-medium">FAM-{record.id.slice(-6).toUpperCase()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Nom de la famille
                </p>
                <p className="text-[13.5px] font-medium">{record.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Statut
                </p>
                <StatusPill tone={STATUS_TONES[record.status]}>{record.status}</StatusPill>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Responsable principal
                </p>
                <p className="text-[13.5px] font-medium">
                  {record.primaryParentId ? fullName(referenceParent) : "À définir"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Téléphone
                </p>
                <p className="text-[13.5px] font-medium">{record.phone || "—"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Email
                </p>
                <p className="text-[13.5px] font-medium truncate">{record.email || "—"}</p>
              </div>
              <div className="space-y-1 sm:col-span-2 lg:col-span-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Adresse
                </p>
                <p className="text-[13.5px] font-medium">{record.address || "—"}</p>
              </div>
              {referenceParent.job ? (
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Profession du responsable
                  </p>
                  <p className="text-[13.5px] font-medium">{referenceParent.job || "—"}</p>
                </div>
              ) : null}
              <div className="space-y-1 sm:col-span-2 lg:col-span-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Observations
                </p>
                <p className="whitespace-pre-line text-[13.5px] font-medium">
                  {record.notes || "—"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border bg-card p-5 shadow-card">
            <h2 className="text-sm font-semibold text-foreground mb-4">Composition</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Enfants rattachés
                </p>
                <p className="text-2xl font-bold text-foreground">{family.children.length}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Responsables
                </p>
                <p className="text-2xl font-bold text-foreground">{family.members.length}</p>
              </div>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="famille" className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <section className="rounded-xl border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-foreground">Responsables</h2>
                {can("families.edit") ? (
                  <Button variant="outline" size="sm" onClick={handleAddResponsable}>
                    <Plus className="mr-2 size-4" /> Ajouter
                  </Button>
                ) : null}
              </div>
              {family.members.length > 0 ? (
                <div className="mt-3 space-y-3">
                  {family.members.map((m) => (
                    <div key={m.parentId} className="group relative">
                      <ResponsableCard
                        firstName={m.firstName}
                        lastName={m.lastName}
                        relation={m.relation}
                        phone={m.phone}
                        email={m.email}
                        canPickUp={m.canPickUp}
                        isEmergencyContact={m.isEmergencyContact}
                        receivesDocuments={m.receivesDocuments}
                        canSign={m.canSign}
                      />
                      {can("families.edit") ? (
                        <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => handleEditResponsable(m.parentId)}
                            title="Modifier ce responsable"
                            className="rounded-md bg-background p-1.5 text-muted-foreground shadow-sm transition-colors hover:text-foreground"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteParentId(m.parentId)}
                            title="Supprimer ce responsable"
                            className="rounded-md bg-background p-1.5 text-destructive shadow-sm transition-colors hover:text-destructive/80"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : !record.primaryParentId && can("families.edit") ? (
                <div className="mt-3 rounded-xl border border-dashed p-5 text-center">
                  <p className="text-sm text-muted-foreground">
                    Cette famille n'a pas encore de responsable principal.
                  </p>
                  <Button size="sm" className="mt-3" onClick={handleDefinePrimaryResponsable}>
                    <Plus className="mr-2 size-4" /> Définir le responsable principal
                  </Button>
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground/60">
                  Aucun responsable enregistré
                </p>
              )}
            </section>

            <section className="rounded-xl border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-foreground">Enfants rattachés</h2>
                {family.children.length > 0 ? (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {family.children.length}
                  </span>
                ) : null}
              </div>
              {family.children.length > 0 ? (
                <div className="mt-3 space-y-3">
                  {family.children.map((child) => {
                    const parents = linkedParentNames(child.id);
                    return (
                      <div key={child.id} className="rounded-xl border p-3">
                        <div className="flex items-center justify-between gap-3">
                          <EnfantLink
                            childId={child.id}
                            childFirstName={child.firstName}
                            childLastName={child.lastName}
                            fromFamilyId={id}
                          />
                          {can("families.edit") ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setLinkParentChildId(child.id)}
                              title="Lier un responsable à cet enfant"
                            >
                              <Plus className="mr-1.5 size-3.5" /> Lier un parent
                            </Button>
                          ) : null}
                        </div>
                        {parents.length > 0 ? (
                          <ul className="mt-2 space-y-1.5">
                            {parents.map((p) => {
                              const link = (childParentMap.get(child.id) ?? []).find(
                                (l) => l.parentId === p.id,
                              );
                              return (
                                <li
                                  key={p.id}
                                  className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 px-2.5 py-1.5 text-sm"
                                >
                                  <span className="min-w-0 truncate">
                                    <span className="font-medium">{fullName(p)}</span>
                                    {link ? (
                                      <span className="text-muted-foreground">
                                        {" "}
                                        ({link.relation})
                                      </span>
                                    ) : null}
                                  </span>
                                  {can("families.edit") ? (
                                    <button
                                      type="button"
                                      onClick={() => link && setUnlinkCpId(link.id)}
                                      title="Retirer ce lien"
                                      className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-background hover:text-destructive"
                                    >
                                      <Unlink className="size-3.5" />
                                    </button>
                                  ) : null}
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <p className="mt-2 text-xs text-muted-foreground/60">
                            Aucun responsable lié à cet enfant.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground/60">Aucun enfant rattaché</p>
              )}
            </section>
          </div>
        </TabsContent>

        <TabsContent value="urgences" className="space-y-5">
          <section className="rounded-xl border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-foreground">Contacts d'urgence</h2>
              <span className="text-xs text-muted-foreground">
                Basé sur isEmergencyContact / canPickUp
              </span>
            </div>
            {family.members.length > 0 ? (
              <div className="mt-3 space-y-3">
                {family.members.map((m) => {
                  const isEmergency = m.isEmergencyContact;
                  const canPickUp = m.canPickUp;
                  if (!isEmergency && !canPickUp) return null;
                  return (
                    <div key={m.parentId} className="rounded-lg border p-3 bg-muted/30">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-medium text-primary">
                              {m.lastName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              {m.firstName} {m.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">{m.relation}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isEmergency && (
                            <span className="rounded px-2 py-0.5 text-[10px] font-medium text-red/80 bg-red/10 flex items-center gap-1">
                              <AlertTriangle className="size-2.5" /> Contact urgence
                            </span>
                          )}
                          {canPickUp && (
                            <span className="rounded px-2 py-0.5 text-[10px] font-medium text-green/80 bg-green/10 flex items-center gap-1">
                              <Users className="size-2.5" /> Peut récupérer
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <span>{m.phone}</span>
                        <span>{m.email}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground/60">
                Aucun responsable avec autorisations d'urgence ou de récupération.
              </p>
            )}
          </section>

          <section className="rounded-xl border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-foreground">
                Personnes autorisées à récupérer les enfants
              </h2>
              <span className="text-xs text-muted-foreground">
                Par enfant (canPickUp sur le lien)
              </span>
            </div>
            {family.children.length > 0 ? (
              <div className="mt-3 space-y-3">
                {family.children.map((child) => {
                  const parents = linkedParentNames(child.id);
                  const authorized = parents.filter((p) => {
                    const link = (childParentMap.get(child.id) ?? []).find(
                      (l) => l.parentId === p.id,
                    );
                    return link?.canPickUp;
                  });
                  if (authorized.length === 0) return null;
                  return (
                    <div key={child.id} className="rounded-lg border p-3">
                      <p className="font-medium flex items-center gap-2">
                        <span className="size-4">👶</span>
                        {child.firstName} {child.lastName}
                      </p>
                      <ul className="mt-2 space-y-1">
                        {authorized.map((p) => (
                          <li key={p.id} className="flex items-center gap-2 text-sm">
                            <span className="size-4">✓</span>
                            <span className="font-medium">{fullName(p)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground/60">Aucun enfant rattaché.</p>
            )}
          </section>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-5">
          <section className="rounded-xl border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-foreground">Contacts & autorisations</h2>
              {can("families.update") ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingContact(null);
                    setAddContactOpen(true);
                  }}
                >
                  <Plus className="mr-2 size-4" /> Ajouter un contact
                </Button>
              ) : null}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Personnes autorisées à récupérer les enfants, à être contactées en urgence, à recevoir
              les documents ou à signer.
            </p>

            {contactsQuery.isPending ? (
              <p className="mt-4 text-sm text-muted-foreground">Chargement des contacts…</p>
            ) : (contactsQuery.data ?? []).length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Aucun contact enregistré pour cette famille.
                </p>
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {(contactsQuery.data ?? []).map((c) => (
                  <li
                    key={c.id}
                    className="group relative rounded-xl border p-4 transition-colors hover:bg-muted/20"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {authorizedPersonInitials(c)}
                        </div>
                        <div>
                          <p className="font-medium">
                            {c.firstName} {c.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {c.relation} · {c.phone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <AuthorizationBadges
                          canPickup={c.canPickup}
                          emergencyContact={c.emergencyContact}
                          receivesDocuments={c.receivesDocuments}
                          canSign={c.canSign}
                        />
                        {can("families.update") ? (
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingContact(c);
                                setAddContactOpen(true);
                              }}
                              title="Modifier ce contact"
                              className="rounded-md bg-muted p-1.5 text-muted-foreground shadow-sm transition-colors hover:text-foreground"
                            >
                              <Pencil className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingContact(c)}
                              title="Supprimer ce contact"
                              className="rounded-md bg-muted p-1.5 text-destructive shadow-sm transition-colors hover:text-destructive/80"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    {c.profession || c.idDocument ? (
                      <p className="mt-2 text-xs text-muted-foreground">
                        {c.profession ? `Profession : ${c.profession}` : ""}
                        {c.profession && c.idDocument ? " · " : ""}
                        {c.idDocument ? `Pièce d'identité : ${c.idDocument}` : ""}
                      </p>
                    ) : null}
                    {c.notes ? (
                      <p className="mt-1 text-xs text-muted-foreground/70">{c.notes}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </TabsContent>

        <TabsContent value="documents" className="space-y-5">
          <section className="rounded-xl border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-foreground">Documents administratifs</h2>
              <span className="text-xs text-muted-foreground">Bientôt disponible</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground/60">
              Gestion des documents familiaux : livret de famille, justificatifs de domicile, pièces
              d'identité, autorisations...
            </p>
          </section>
        </TabsContent>

        <TabsContent value="facturation" className="space-y-5">
          <section className="rounded-xl border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-foreground">Facturation famille</h2>
              <span className="text-xs text-muted-foreground">Bientôt disponible</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground/60">
              Solde global, factures groupées, échéanciers, paiements mutualisés par famille.
            </p>
          </section>
        </TabsContent>

        <TabsContent value="historique" className="space-y-5">
          <section className="rounded-xl border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-foreground">Historique de la famille</h2>
              <span className="text-xs text-muted-foreground">Basé sur logAction</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground/60">
              Timeline des événements : créations, modifications, rattachements, changements de
              responsables, documents...
            </p>
          </section>
        </TabsContent>
      </Tabs>

      <ParentFormDialog
        open={editParentOpen}
        onOpenChange={setEditParentOpen}
        parent={editingParent ? (db.parents?.find((p) => p.id === editingParent) ?? null) : null}
        onCreated={handleParentCreated}
      />

      <FamilyFormDialog open={editFamilyOpen} onOpenChange={setEditFamilyOpen} family={record} />

      <LinkChildDialog
        open={linkChildOpen}
        onOpenChange={setLinkChildOpen}
        familyParentId={record.primaryParentId ?? ""}
        alreadyLinkedChildIds={family.children.map((c) => c.id)}
      />

      <LinkParentDialog
        open={Boolean(linkParentChildId)}
        onOpenChange={(o) => setLinkParentChildId(o ? linkParentChildId : null)}
        childId={linkParentChildId ?? ""}
        alreadyLinkedParentIds={(childParentMap.get(linkParentChildId ?? "") ?? []).map(
          (l) => l.parentId,
        )}
      />

      <AlertDialog
        open={Boolean(deleteParentId)}
        onOpenChange={(o) => setDeleteParentId(o ? deleteParentId : null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce responsable ?</AlertDialogTitle>
            <AlertDialogDescription>
              {memberForDelete
                ? `${fullName(memberForDelete)} sera définitivement supprimé${
                    memberForDelete.parentId === record.primaryParentId
                      ? ", ainsi que le rattachement responsable principal de cette famille."
                      : " et retiré de tous les liens avec les enfants."
                  }`
                : "Cette action est irréversible."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteParentId(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleConfirmDeleteParent();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(unlinkCpId)}
        onOpenChange={(o) => setUnlinkCpId(o ? unlinkCpId : null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Retirer ce lien ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le lien entre ce responsable et cet enfant sera supprimé. Le parent et l'enfant
              resteront dans la base.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUnlinkCpId(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleConfirmUnlink();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Retirer le lien
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AuthorizedPersonDialog
        open={addContactOpen}
        onOpenChange={setAddContactOpen}
        familyId={record.id}
        contact={editingContact}
      />

      <AlertDialog
        open={Boolean(deletingContact)}
        onOpenChange={(o) => setDeletingContact(o ? deletingContact : null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce contact ?</AlertDialogTitle>
            <AlertDialogDescription>
              {deletingContact
                ? `${deletingContact.firstName} ${deletingContact.lastName} sera définitivement supprimé${
                    deletingContact.canPickup
                      ? " et ne pourra plus récupérer d'enfants sans vérification."
                      : "."
                  }`
                : "Cette action est irréversible."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingContact(null)}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleConfirmDeleteContact();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
