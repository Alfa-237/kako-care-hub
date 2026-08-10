import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Baby, Eye, EyeOff, Loader2, ShieldCheck, WifiOff } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/connexion")({
  head: () => ({
    meta: [
      { title: "Connexion — KAKO Manager" },
      {
        name: "description",
        content:
          "Accédez à KAKO Manager, le logiciel de gestion de crèche : enfants, familles, présences, facturation.",
      },
      { property: "og:title", content: "Connexion — KAKO Manager" },
      {
        property: "og:description",
        content: "Logiciel professionnel de gestion de crèche, fonctionnant en local.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn, user, ready } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ready && user) navigate({ to: "/", replace: true });
  }, [ready, user, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("Veuillez renseigner votre identifiant et votre mot de passe.");
      return;
    }
    setLoading(true);
    const res = await signIn(username, password);
    setLoading(false);
    if (!res.ok) setError(res.error ?? "Connexion impossible.");
    else navigate({ to: "/", replace: true });
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <section className="relative hidden flex-col justify-between bg-sidebar p-12 text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <Baby className="size-5" />
          </div>
          <span className="text-lg font-bold">KAKO Manager</span>
        </div>
        <div className="max-w-md">
          <h1 className="text-3xl font-bold leading-tight">
            Le quotidien de votre crèche, enfin sous contrôle.
          </h1>
          <p className="mt-4 text-sm text-sidebar-foreground/70">
            Enfants, familles, présences, transmissions, facturation et personnel réunis dans un
            seul logiciel professionnel — pensé pour fonctionner en local, sans dépendre d'Internet.
          </p>
          <div className="mt-8 grid gap-3 text-sm">
            <span className="flex items-center gap-2 text-sidebar-foreground/80">
              <WifiOff className="size-4 text-sidebar-primary" /> Données conservées sur le poste
            </span>
            <span className="flex items-center gap-2 text-sidebar-foreground/80">
              <ShieldCheck className="size-4 text-sidebar-primary" /> Rôles et permissions appliqués
            </span>
          </div>
        </div>
        <p className="text-xs text-sidebar-foreground/50">Version prototype — Phase 1</p>
      </section>

      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Baby className="size-5" />
            </div>
            <span className="text-lg font-bold">KAKO Manager</span>
          </div>

          <h2 className="text-2xl font-bold">Connexion</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Identifiez-vous pour accéder à l'espace de gestion.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <Label htmlFor="username">Identifiant</Label>
              <Input
                id="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground"
                >
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              Se connecter
            </Button>
          </form>

          <div className="mt-8 rounded-lg border bg-muted/40 p-4 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Comptes de démonstration</p>
            <ul className="mt-2 space-y-1">
              <li>admin / admin123 — Administrateur</li>
              <li>directeur / directeur123 — Directeur</li>
              <li>educateur / educateur123 — Éducateur</li>
              <li>comptable / comptable123 — Comptable</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
