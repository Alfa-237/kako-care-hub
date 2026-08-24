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
import { fullName, todayISO } from "@/lib/business/stats";
import type { Child, Section } from "@/lib/data/types";

const RELATIONS = ["Mère", "Père", "Tuteur légal", "Grand-parent", "Autre"] as const;

interface LinkChildDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  familyParentId: string;
  alreadyLinkedChildIds: string[];
}

export function LinkChildDialog({
  open,
  onOpenChange,
  familyParentId,
  alreadyLinkedChildIds,
}: LinkChildDialogProps) {
  const db = useDatabase();
  const { user } = useAuth();
  const [mode, setMode] = useState<"existing" | "create">("existing");
  const [query, setQuery] = useState("");
  const [childId, setChildId] = useState("");
  const [relation, setRelation] = useState<string>(RELATIONS[0]);
  const [canPickUp, setCanPickUp] = useState(true);
  const [isEmergencyContact, setIsEmergencyContact] = useState(false);
  const [receivesDocuments, setReceivesDocuments] = useState(true);
  const [canSign, setCanSign] = useState(false);
  const [saving, setSaving] = useState(false);

  // Champs création enfant
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<"F" | "M">("F");
  const [birthDate, setBirthDate] = useState("");
  const [sectionId, setSectionId] = useState("none");

  useEffect(() => {
    if (open) {
      setMode("existing");
      setQuery("");
      setChildId("");
      setRelation(RELATIONS[0]);
      setCanPickUp(true);
      setIsEmergencyContact(false);
      setReceivesDocuments(true);
      setCanSign(false);
      setFirstName("");
      setLastName("");
      setGender("F");
      setBirthDate("");
      setSectionId("none");
    }
  }, [open]);

  const availableChildren = useMemo(() => {
    if (!db) return [];
    const blocked = new Set(alreadyLinkedChildIds);
    const q = query.trim().toLowerCase();
    return db.children.filter((c) => {
      if (blocked.has(c.id)) return false;
      if (!q) return true;
      return fullName(c).toLowerCase().includes(q) || c.fileNumber.toLowerCase().includes(q);
    });
  }, [db, alreadyLinkedChildIds, query]);

  const sections: Section[] = db?.sections ?? [];

  function nextFileNumber(children: Child[]): string {
    let max = 1000;
    for (const c of children) {
      const m = /^KM-(\d+)$/.exec(c.fileNumber);
      if (m) max = Math.max(max, parseInt(m[1] ?? "0", 10));
    }
    return `KM-${max + 1}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!db) return;

    const errors: string[] = [];
    if (mode === "existing" && !childId) errors.push("Choisissez un enfant à lier.");
    if (mode === "create") {
      if (!firstName.trim()) errors.push("Le prénom de l'enfant est obligatoire.");
      if (!lastName.trim()) errors.push("Le nom de l'enfant est obligatoire.");
      if (!birthDate) errors.push("La date de naissance est obligatoire.");
    }
    if (errors.length) {
      toast.error("Champs manquants", { description: errors.join(" ") });
      return;
    }

    setSaving(true);
    try {
      let targetChildId = childId;
      if (mode === "create") {
        await mutate((d) => {
          const id = `enf-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
          d.children.push({
            id,
            fileNumber: nextFileNumber(d.children),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            birthDate,
            gender,
            photo: null,
            address: "",
            registrationDate: todayISO(),
            startDate: todayISO(),
            sectionId: sectionId === "none" ? null : sectionId,
            status: "Inscrit",
            language: "Français",
            notes: "",
            medicalAlert: null,
            missingDocuments: [],
            contractEndDate: null,
            isDemo: false,
          });
          targetChildId = id;
        });
      }
      await mutate((d) => {
        d.childParents.push({
          id: `lien-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
          childId: targetChildId,
          parentId: familyParentId,
          relation,
          canPickUp,
          isEmergencyContact,
          receivesDocuments,
          canSign,
          isDemo: false,
        });
      });
      await logAction(user, "Lien enfant / famille", `${targetChildId} → ${familyParentId}`);
      toast.success(mode === "create" ? "Enfant créé et lié" : "Enfant lié à la famille", {
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
          <DialogTitle>Lier un enfant à la famille</DialogTitle>
          <DialogDescription>
            Rattachez un enfant existant ou créez un nouvel enfant, puis définissez les
            autorisations du responsable principal.
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
              Enfant existant
            </button>
            <button
              type="button"
              onClick={() => setMode("create")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                mode === "create" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Créer un enfant
            </button>
          </div>

          {mode === "existing" ? (
            <div className="space-y-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher par nom ou n° de dossier…"
                  className="h-9 pl-9"
                  aria-label="Rechercher un enfant à lier"
                />
              </div>
              <div className="max-h-56 overflow-y-auto rounded-lg border">
                {availableChildren.length === 0 ? (
                  <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                    Aucun enfant disponible à lier.
                  </p>
                ) : (
                  <ul className="divide-y">
                    {availableChildren.map((c) => (
                      <li key={c.id}>
                        <label
                          htmlFor={`lc-${c.id}`}
                          className="flex cursor-pointer items-center gap-3 px-3 py-2.5 hover:bg-muted/40"
                        >
                          <input
                            id={`lc-${c.id}`}
                            type="radio"
                            name="child-pick"
                            checked={childId === c.id}
                            onChange={() => setChildId(c.id)}
                            className="size-4 accent-primary"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">
                              {fullName(c)}
                            </span>
                            <span className="block text-xs text-muted-foreground">
                              {c.fileNumber} · {c.status}
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
                <Label htmlFor="lchild-first" className="text-sm">
                  Prénom <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lchild-first"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Prénom de l'enfant"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lchild-last" className="text-sm">
                  Nom <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lchild-last"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Nom de famille"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Sexe</Label>
                <Select value={gender} onValueChange={(v) => setGender(v as "F" | "M")}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="F">Fille</SelectItem>
                    <SelectItem value="M">Garçon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lchild-birth" className="text-sm">
                  Date de naissance <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lchild-birth"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-sm">Section</Label>
                <Select value={sectionId} onValueChange={setSectionId}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sans section</SelectItem>
                    {sections.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  ? "Créer et lier l'enfant"
                  : "Lier l'enfant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
