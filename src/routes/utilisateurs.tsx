import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, UserCog, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/common/status-pill";
import { useAuth } from "@/lib/auth/auth-context";
import { useUsers } from "@/lib/data/use-users";
import { ROLE_LABELS } from "@/lib/auth/permissions";
import { setUserStatus } from "@/lib/data/users";
import { UserFormDialog } from "@/components/users/user-form-dialog";
import { RoleBadge } from "@/components/users/role-badge";

export const Route = createFileRoute("/utilisateurs")({
  head: () => ({
    meta: [
      { title: "Utilisateurs — KAKO Manager" },
      { name: "description", content: "Gestio des comptes, rôles et permissions." },
      { property: "og:title", content: "Utilisateurs — KAKO Manager" },
      { property: "og:description", content: "Gestio des comptes, rôles et permissions." },
    ],
  }),
  component: Page,
});

function Page() {
  const { user: me } = useAuth();
  const { data: users = [], refetch } = useUsers();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<null | (typeof users)[number]>(null);

  async function toggleStatus(id: string, current: "actif" | "suspendu") {
    await setUserStatus(id, current === "actif" ? "suspendu" : "actif");
    toast.success(current === "actif" ? "Compte suspendu" : "Compte réactivé");
    await refetch();
  }

  return (
    <AppShell permission="users.manage">
      <div className="space-y-5">
        <PageHeader
          title="Gestion des utilisateurs"
          description={`${users.length} compte(s) · rôles et permissions granulaires`}
          actions={
            me?.role === "ADMINISTRATEUR" ? (
              <Button
                onClick={() => {
                  setEditing(null);
                  setFormOpen(true);
                }}
              >
                <Plus className="mr-2 size-4" /> Nouvel utilisateur
              </Button>
            ) : undefined
          }
        />

        <div className="overflow-hidden rounded-xl border bg-card shadow-card">
          <div className="hidden items-center justify-between gap-4 border-b px-4 py-2 sm:flex sm:px-5">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Utilisateurs
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Actions
            </span>
          </div>
          <ul className="divide-y">
            {users.map((u) => (
              <li key={u.id} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {u.fullName
                    .split(" ")
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 truncate text-[14px] font-semibold">
                    {u.fullName}
                    {u.id === me?.id ? (
                      <span className="text-[11px] font-normal text-muted-foreground">(vous)</span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    <span className="font-mono">{u.username}</span>
                    <span className="text-muted-foreground/40">·</span>
                    <RoleBadge role={u.role} />
                    <StatusPill tone={u.status === "actif" ? "success" : "neutral"}>
                      {u.status === "actif" ? "Actif" : "Suspendu"}
                    </StatusPill>
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={u.id === me?.id}
                    onClick={() => {
                      setEditing(u);
                      setFormOpen(true);
                    }}
                  >
                    <UserCog className="mr-1.5 size-4" /> Modifier
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={u.id === me?.id}
                    onClick={() => void toggleStatus(u.id, u.status)}
                  >
                    {u.status === "actif" ? "Suspendre" : "Réactiver"}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5" />
          Les mots de passe ne sont jamais stockés en clair (hash SHA-256).
        </p>

        <UserFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          user={editing}
          onSaved={() => void refetch()}
        />
      </div>
    </AppShell>
  );
}
