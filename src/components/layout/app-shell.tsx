import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Baby, Loader2, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import type { Permission } from "@/lib/auth/permissions";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function FullScreenLoader() {
  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <div className="flex items-center gap-3 text-muted-foreground">
        <Loader2 className="size-5 animate-spin" />
        <span className="text-sm">Chargement de KAKO Manager…</span>
      </div>
    </div>
  );
}

function LockScreen() {
  const { user, unlock, signOut } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="grid min-h-screen place-items-center bg-sidebar px-4">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const ok = await unlock(password);
          if (!ok) setError("Mot de passe incorrect.");
          else {
            setError("");
            setPassword("");
          }
        }}
        className="w-full max-w-sm rounded-xl border border-sidebar-border bg-card p-6 shadow-card"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <Lock className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold">Session verrouillée</p>
            <p className="truncate text-xs text-muted-foreground">{user?.fullName}</p>
          </div>
        </div>
        <Label htmlFor="lock-pass">Mot de passe</Label>
        <Input
          id="lock-pass"
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5"
        />
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        <Button type="submit" className="mt-4 w-full">
          Déverrouiller
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="mt-2 w-full"
          onClick={() => void signOut()}
        >
          Changer d'utilisateur
        </Button>
      </form>
    </div>
  );
}

export function AppShell({
  children,
  permission,
}: {
  children: ReactNode;
  permission?: Permission;
}) {
  const { ready, user, locked, can } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setCollapsed(window.localStorage.getItem("kako:sidebar-collapsed") === "1");
  }, []);

  const toggleSidebar = () =>
    setCollapsed((c) => {
      const next = !c;
      if (typeof window !== "undefined")
        window.localStorage.setItem("kako:sidebar-collapsed", next ? "1" : "0");
      return next;
    });

  useEffect(() => {
    if (ready && !user) navigate({ to: "/connexion", replace: true });
  }, [ready, user, navigate]);

  if (!ready) return <FullScreenLoader />;
  if (!user) return <FullScreenLoader />;
  if (locked) return <LockScreen />;

  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="hidden md:block">
        <div className="sticky top-0">
          <AppSidebar collapsed={collapsed} onToggle={toggleSidebar} />
        </div>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader collapsed={collapsed} onToggleSidebar={toggleSidebar} />
        <main className="mx-auto w-full max-w-[1500px] flex-1 px-4 py-5 md:px-7 md:py-6">
          {permission && !can(permission) ? <AccessDenied /> : children}
        </main>
      </div>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="mx-auto max-w-md rounded-xl border bg-card p-8 text-center shadow-card">
      <div className="mx-auto grid size-12 place-items-center rounded-xl bg-destructive/10 text-destructive">
        <Baby className="size-6" />
      </div>
      <h2 className="mt-4 text-lg font-semibold">Accès non autorisé</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Votre rôle ne vous permet pas de consulter ce module. Contactez un administrateur si vous
        pensez qu'il s'agit d'une erreur.
      </p>
    </div>
  );
}
