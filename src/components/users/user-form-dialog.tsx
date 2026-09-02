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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth/auth-context";
import { hashPassword } from "@/lib/data/seed";
import type { RoleCode, User } from "@/lib/data/types";
import { ROLE_LABELS } from "@/lib/auth/permissions";

const ROLES: RoleCode[] = [
  "ADMINISTRATEUR",
  "DIRECTEUR",
  "SECRETAIRE",
  "EDUCATEUR",
  "COMPTABLE",
  "CONSULTATION",
  "PARENT",
];

interface FormState {
  username: string;
  fullName: string;
  password: string;
  role: RoleCode;
  status: "actif" | "suspendu";
}

function defaultState(user: User | null): FormState {
  if (!user) {
    return { username: "", fullName: "", password: "", role: "SECRETAIRE", status: "actif" };
  }
  return {
    username: user.username,
    fullName: user.fullName,
    password: "",
    role: user.role,
    status: user.status,
  };
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSaved?: (created: boolean) => void;
}) {
  const { user: me } = useAuth();
  const [state, setState] = useState<FormState>(() => defaultState(user));
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setState(defaultState(user));
      setFormError("");
      setSaving(false);
    }
  }, [open, user]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors: string[] = [];
    if (!state.username.trim()) errors.push("Le nom d'utilisateur est obligatoire.");
    if (!state.fullName.trim()) errors.push("Le nom complet est obligatoire.");
    if (!user && state.password.length < 6)
      errors.push("Le mot de passe doit contenir au moins 6 caractères.");
    if (errors.length) {
      setFormError(errors.join(" "));
      return;
    }

    setSaving(true);
    setFormError("");
    try {
      const { createUser, updateUser } = await import("@/lib/data/users");
      let created = false;
      if (user) {
        await updateUser(user.id, {
          username: state.username.trim(),
          fullName: state.fullName.trim(),
          role: state.role,
          status: state.status,
          ...(state.password ? { passwordHash: await hashPassword(state.password) } : {}),
        });
      } else {
        created = true;
        await createUser({
          username: state.username.trim(),
          fullName: state.fullName.trim(),
          passwordHash: await hashPassword(state.password),
          role: state.role,
          status: state.status,
        });
      }
      await import("@/lib/data/db").then(({ logAction }) =>
        logAction(
          me,
          created ? "Création utilisateur" : "Modification utilisateur",
          `${state.username.trim()} (${ROLE_LABELS[state.role]})`,
        ),
      );
      toast.success(created ? "Utilisateur créé" : "Utilisateur modifié", {
        description: state.fullName.trim(),
      });
      onSaved?.(created);
      onOpenChange(false);
    } catch {
      toast.error("Erreur", { description: "L'enregistrement a échoué." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? "Modifier l'utilisateur" : "Créer un utilisateur"}</DialogTitle>
          <DialogDescription>
            {user
              ? "Mettez à jour les informations ou le mot de passe."
              : "Créez un compte avec un rôle et des permissions."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="uf-username" className="text-sm">
              Nom d'utilisateur <span className="text-destructive">*</span>
            </Label>
            <Input
              id="uf-username"
              value={state.username}
              onChange={(e) => set("username", e.target.value)}
              placeholder="identifiant de connexion"
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="uf-fullname" className="text-sm">
              Nom complet <span className="text-destructive">*</span>
            </Label>
            <Input
              id="uf-fullname"
              value={state.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              placeholder="Prénom Nom"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="uf-password" className="text-sm">
              Mot de passe{" "}
              {user ? "(laisser vide pour conserver)" : <span className="text-destructive">*</span>}
            </Label>
            <Input
              id="uf-password"
              type="password"
              value={state.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder={user ? "••••••••" : "6 caractères minimum"}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="uf-role" className="text-sm">
                Rôle
              </Label>
              <Select value={state.role} onValueChange={(v) => set("role", v as RoleCode)}>
                <SelectTrigger id="uf-role" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="uf-status" className="text-sm">
                Statut
              </Label>
              <Select
                value={state.status}
                onValueChange={(v) => set("status", v as "actif" | "suspendu")}
              >
                <SelectTrigger id="uf-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="suspendu">Suspendu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formError ? (
            <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive animate-fade-in">
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
              {saving ? "Enregistrement…" : user ? "Enregistrer" : "Créer l'utilisateur"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
