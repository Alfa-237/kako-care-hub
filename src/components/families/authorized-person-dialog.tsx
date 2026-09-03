// Dialog contact autorisé : formulaire de création / édition (phase 7).
// Validation Zod — au moins une autorisation doit être cochée (messages en français).
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { authorizedPersonFormSchema } from "@/lib/models/authorized-person";
import type { AuthorizedPerson } from "@/lib/models/authorized-person";
import { useCreateContact, useUpdateContact } from "@/hooks/use-family-contacts";

interface FormState {
  firstName: string;
  lastName: string;
  relation: string;
  phone: string;
  address: string;
  profession: string;
  idDocument: string;
  canPickup: boolean;
  emergencyContact: boolean;
  receivesDocuments: boolean;
  canSign: boolean;
  notes: string;
}

function defaultState(contact: AuthorizedPerson | null): FormState {
  if (!contact) {
    return {
      firstName: "",
      lastName: "",
      relation: "",
      phone: "",
      address: "",
      profession: "",
      idDocument: "",
      canPickup: false,
      emergencyContact: false,
      receivesDocuments: false,
      canSign: false,
      notes: "",
    };
  }
  return {
    firstName: contact.firstName,
    lastName: contact.lastName,
    relation: contact.relation,
    phone: contact.phone,
    address: contact.address ?? "",
    profession: contact.profession ?? "",
    idDocument: contact.idDocument ?? "",
    canPickup: contact.canPickup,
    emergencyContact: contact.emergencyContact,
    receivesDocuments: contact.receivesDocuments,
    canSign: contact.canSign,
    notes: contact.notes ?? "",
  };
}

export function AuthorizedPersonDialog({
  open,
  onOpenChange,
  familyId,
  contact,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  familyId: string;
  contact: AuthorizedPerson | null;
}) {
  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const [state, setState] = useState<FormState>(() => defaultState(contact));
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (open) {
      setState(defaultState(contact));
      setFormError("");
    }
  }, [open, contact]);

  const saving = createContact.isPending || updateContact.isPending;

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    const parsed = authorizedPersonFormSchema.safeParse(state);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Formulaire invalide.");
      return;
    }
    const data = parsed.data;
    try {
      if (contact) {
        await updateContact.mutateAsync({ id: contact.id, patch: data });
      } else {
        await createContact.mutateAsync({ ...data, familyId });
      }
      toast.success(contact ? "Contact modifié" : "Contact ajouté", {
        description: `${data.firstName} ${data.lastName}`,
      });
      onOpenChange(false);
    } catch {
      toast.error("Erreur", { description: "L'enregistrement du contact a échoué." });
    }
  }

  const permission = (
    key: keyof Pick<FormState, "canPickup" | "emergencyContact" | "receivesDocuments" | "canSign">,
    label: string,
  ) => ({
    key,
    label,
  });

  const perms = [
    permission("canPickup", "Peut récupérer l'enfant"),
    permission("emergencyContact", "Contact d'urgence"),
    permission("receivesDocuments", "Reçoit les documents"),
    permission("canSign", "Peut signer des documents"),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{contact ? "Modifier le contact" : "Ajouter un contact"}</DialogTitle>
          <DialogDescription>
            Renseignez la personne et ses autorisations (récupération, urgence, documents,
            signature).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5 noValidate">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="ap-first-name" className="text-sm">
                Prénom <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ap-first-name"
                value={state.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                placeholder="Prénom"
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ap-last-name" className="text-sm">
                Nom <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ap-last-name"
                value={state.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                placeholder="Nom de famille"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ap-relation" className="text-sm">
                Lien avec la famille <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ap-relation"
                value={state.relation}
                onChange={(e) => set("relation", e.target.value)}
                placeholder="Mère, Oncle, Voisine…"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ap-phone" className="text-sm">
                Téléphone <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ap-phone"
                type="tel"
                value={state.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+237 6XX XXX XXX"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ap-profession" className="text-sm">
                Profession
              </Label>
              <Input
                id="ap-profession"
                value={state.profession}
                onChange={(e) => set("profession", e.target.value)}
                placeholder="Ex : Infirmière, Commerçant"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ap-id-document" className="text-sm">
                Pièce d'identité
              </Label>
              <Input
                id="ap-id-document"
                value={state.idDocument}
                onChange={(e) => set("idDocument", e.target.value)}
                placeholder="Ex : CNI-1234567"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="ap-address" className="text-sm">
                Adresse
              </Label>
              <Input
                id="ap-address"
                value={state.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="Adresse du contact"
              />
            </div>
          </div>

          <fieldset className="space-y-2 rounded-xl border p-4">
            <legend className="px-1 text-sm font-medium text-foreground">
              Autorisations <span className="text-destructive">*</span>
            </legend>
            {perms.map(({ key, label }) => (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
              >
                <Checkbox
                  id={`ap-${key}`}
                  checked={state[key]}
                  onCheckedChange={(c) => set(key, c === true)}
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
            <p className="text-xs text-muted-foreground">
              Au moins une autorisation doit être cochée.
            </p>
          </fieldset>

          <div className="space-y-1.5">
            <Label htmlFor="ap-notes" className="text-sm">
              Notes
            </Label>
            <Input
              id="ap-notes"
              value={state.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Précisions éventuelles"
            />
          </div>

          {formError ? (
            <p
              role="alert"
              className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive animate-fade-in"
            >
              {formError}
            </p>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Enregistrement…" : contact ? "Enregistrer" : "Ajouter le contact"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
