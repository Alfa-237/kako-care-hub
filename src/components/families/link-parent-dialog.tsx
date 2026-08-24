import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth/auth-context";
import { useDatabase, logAction, mutate } from "@/lib/data/db";
import { fullName } from "@/lib/business/stats";

const RELATIONS = ["Mère", "Père", "Tuteur légal", "Grand-parent", "Autre"] as const;

interface LinkParentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  childId: string;
  alreadyLinkedParentIds: string[];
}

export function LinkParentDialog({
  open,
  onOpenChange,
  childId,
  alreadyLinkedParentIds,
}: LinkParentDialogProps) {
  const db = useDatabase();
  const { user } = useAuth();
  const [mode, setMode] = useState<"existing" | "create">("existing");
  const [query, setQuery] = useState("");
  const [parentId, setParentId] = useState("");
  const [relation, setRelation] = useState<string>(RELATIONS[0]);
  const [canPickUp, setCanPickUp] = useState(true);
  const [isEmergencyContact, setIsEmergencyContact] = useState(false);
  const [receivesDocuments, setReceivesDocuments] = useState(true);
  const [canSign, setCanSign] = useState(false);
  const [saving, setSaving] = useState(false);

  // Champs création parent
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [job, setJob] = useState("");

  useEffect(() => {
    if (open) {
      setMode("existing");
      setQuery("");
      setParentId("");
      setRelation(RELATIONS[0]);
      setCanPickUp(true);
      setIsEmergencyContact(false);
      setReceivesDocuments(true);
      setCanSign(false);
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      setJob("");
    }
  }, [open]);

  const availableParents = useMemo(() => {
    if (!db) return [];
    const blocked = new Set(alreadyLinkedParentIds);
    const q = query.trim().toLowerCase();
    return db.parents.filter((p) => {
      if (blocked.has(p.id)) return false;
      if (!q) return true;
      return fullName(p).toLowerCase().includes(q) || p.phone.toLowerCase().includes(q);
    });
  }, [db, alreadyLinkedParentIds, query]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!db) return;

    const errors: string[] = [];
    if (mode === "existing" && !parentId) errors.push("Choisissez un responsable à lier.");
    if (mode === "create") {
      if (!firstName.trim()) errors.push("Le prénom est obligatoire.");
      if (!lastName.trim()) errors.push("Le nom est obligatoire.");
      if (!phone.trim()) errors.push("Le téléphone est obligatoire.");
      if (!email.trim()) errors.push("L'email est obligatoire.");
    }
    if (errors.length) {
      toast.error("Champs manquants", { description: errors.join(" ") });
      return;
    }

    setSaving(true);
    try {
      let targetParentId = parentId;
      if (mode === "create") {
        await mutate((d) => {
          const id = `par-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
          d.parents.push({
            id,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: phone.trim(),
            email: email.trim(),
            address: "",
            job: job.trim(),
            idDocument: "",
            isDemo: false,
          });
          targetParentId = id;
        });
      }
      await mutate((d) => {
        d.childParents.push({
          id: `lien-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
          childId,
          parentId: targetParentId,
          relation,
          canPickUp,
          isEmergencyContact,
          receivesDocuments,
          canSign,
          isDemo: false,
        });
      });
      await logAction(user, "Lien parent / enfant", `${targetParentId} → ${childId}`);
      toast.success(mode === "create" ? "Responsable créé et lié" : "Responsable lié à l'enfant", {
        description: mode === "create" ? `${firstName.trim()} ${lastName.trim()}` : undefined,
      });
      onOpenChange(false);
    } catch {
      toast.error("Erreur", { description: "La liaison a échoué." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Lier un responsable à l'enfant</DialogTitle>
          <DialogDescription>
            Ajoutez un second responsable à cet enfant : choisissez un parent existant ou créez-en
            un nouveau.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/40 p-1">
            <button
              type="button"
              onClick={() => setMode("existing")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                mode === "existing" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Parent existant
            </button>
            <button
              type="button"
              onClick={() => setMode("create")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                mode === "create" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Nouveau parent
            </button>
          </div>

          {mode === "existing" ? (
            <div className="space-y-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher par nom ou téléphone…"
                  className="h-9 pl-9"
                  aria-label="Rechercher un parent à lier"
                />
              </div>
              <div className="max-h-56 overflow-y-auto rounded-lg border">
                {availableParents.length === 0 ? (
                  <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                    Aucun parent disponible à lier.
                  </p>
                ) : (
                  <ul className="divide-y">
                    {availableParents.map((p) => (
                      <li key={p.id}>
                        <label
                          htmlFor={`lp-${p.id}`}
                          className="flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-muted/40"
                        >
                          <input
                            id={`lp-${p.id}`}
                            type="radio"
                            name="parent-pick"
                            checked={parentId === p.id}
                            onChange={() => setParentId(p.id)}
                            className="size-4 accent-primary"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">
                              {fullName(p)}
                            </span>
                            <span className="block text-xs text-muted-foreground">
                              {p.phone}
                              {p.job ? ` · ${p.job}` : ""}
                            </span>
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="lp-first" className="text-sm">
                  Prénom <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lp-first"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Prénom du responsable"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lp-last" className="text-sm">
                  Nom <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lp-last"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Nom de famille"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lp-phone" className="text-sm">
                  Téléphone <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lp-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+237 6XX XXX XXX"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lp-email" className="text-sm">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lp-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemple.com"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="lp-job" className="text-sm">
                  Profession
                </Label>
                <Input
                  id="lp-job"
                  value={job}
                  onChange={(e) => setJob(e.target.value)}
                  placeholder="Ex: Enseignant, Infirmier, Commerçant"
                />
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-sm">Lien de parenté</Label>
              <Select value={relation} onValueChange={setRelation}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RELATIONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2 rounded-lg border p-3 sm:grid-cols-2">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={canPickUp} onCheckedChange={(v) => setCanPickUp(v === true)} />
              Peut récupérer l'enfant
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={isEmergencyContact}
                onCheckedChange={(v) => setIsEmergencyContact(v === true)}
              />
              Contact d'urgence
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={receivesDocuments}
                onCheckedChange={(v) => setReceivesDocuments(v === true)}
              />
              Reçoit les documents
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={canSign} onCheckedChange={(v) => setCanSign(v === true)} />
              Peut signer
            </label>
          </div>

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
              {saving
                ? "Enregistrement…"
                : mode === "create"
                  ? "Créer et lier le responsable"
                  : "Lier le responsable"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
