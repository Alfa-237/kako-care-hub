import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Baby, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck, WifiOff } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthSlideshow } from "@/components/auth/auth-slideshow";
import { AuthDecor } from "@/components/auth/auth-decor";
import { CHILD_SLIDES } from "@/components/auth/slides";

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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn, user, ready } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
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
    <div className="grid min-h-screen bg-background lg:grid-cols-[55fr_45fr]">
      {/* Partie visuelle */}
      <section className="relative hidden lg:block">
        <AuthSlideshow slides={CHILD_SLIDES}>
          <div className="flex items-center gap-3 text-sidebar-foreground">
            <div className="grid size-11 place-items-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground shadow-lg">
              <Baby className="size-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">KAKO Manager</span>
          </div>

          <div className="max-w-lg animate-fade-in text-sidebar-foreground">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-sidebar-primary">
              Grandir. Apprendre. S'épanouir.
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.12] xl:text-5xl">
              La gestion de votre crèche, simplement.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-sidebar-foreground/80">
              Un espace pensé pour les enfants, les éducateurs et ceux qui les accompagnent.
            </p>
            <div className="mt-8 grid gap-3 text-sm">
              <span className="flex items-center gap-2 text-sidebar-foreground/80">
                <WifiOff className="size-4 text-sidebar-primary" /> Données conservées sur le poste
              </span>
              <span className="flex items-center gap-2 text-sidebar-foreground/80">
                <ShieldCheck className="size-4 text-sidebar-primary" /> Rôles et permissions
                appliqués
              </span>
            </div>
          </div>

          <p className="text-xs text-sidebar-foreground/50">Version prototype — Phase 1</p>
        </AuthSlideshow>
      </section>

      {/* Formulaire */}
      <section className="relative flex items-center justify-center px-5 py-10 sm:px-8">
        <AuthDecor />

        {/* Bannière mobile */}
        <div className="absolute inset-x-0 top-0 h-32 overflow-hidden lg:hidden">
          <AuthSlideshow slides={CHILD_SLIDES}>
            <div className="flex items-center gap-2 text-sidebar-foreground">
              <div className="grid size-8 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
                <Baby className="size-4" />
              </div>
              <span className="text-sm font-bold">KAKO Manager</span>
            </div>
          </AuthSlideshow>
        </div>

        <div className="relative mt-32 w-full max-w-md animate-fade-in lg:mt-0">
          <div className="rounded-3xl border bg-card p-6 shadow-[var(--shadow-card)] sm:p-9">
            <div className="hidden items-center gap-3 lg:flex">
              <div className="grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground">
                <Baby className="size-5" />
              </div>
              <span className="text-base font-bold">KAKO Manager</span>
            </div>

            <h2 className="mt-6 text-2xl font-bold sm:text-3xl">Bienvenue 👋</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Connectez-vous à votre espace de gestion.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm">
                  Adresse e-mail ou identifiant
                </Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="username"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="vous@creche.com"
                    className="h-12 rounded-xl pl-10 text-base transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={show ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 rounded-xl pl-10 pr-11 text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="size-4 rounded border-input accent-primary"
                  />
                  Se souvenir de moi
                </label>
                <button
                  type="button"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                  onClick={() =>
                    setError(
                      "Contactez l'administrateur de votre établissement pour réinitialiser votre mot de passe.",
                    )
                  }
                >
                  Mot de passe oublié ?
                </button>
              </div>

              {error && (
                <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive animate-fade-in">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl text-base font-semibold transition-transform hover:-translate-y-0.5"
              >
                {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                Se connecter
              </Button>
            </form>

            <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-widest text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              ou
              <span className="h-px flex-1 bg-border" />
            </div>

            <Link
              to="/inscription"
              className="flex h-12 w-full items-center justify-center rounded-xl border border-primary/30 bg-primary/5 text-base font-semibold text-primary transition-all hover:-translate-y-0.5 hover:bg-primary/10"
            >
              Créer un compte
            </Link>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Vous n'avez pas encore de compte ? Créez votre espace KAKO.
            </p>
          </div>

          <div className="mt-5 rounded-2xl border bg-muted/40 p-4 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Comptes de démonstration</p>
            <ul className="mt-2 grid gap-1 sm:grid-cols-2">
              <li>admin / admin123</li>
              <li>directeur / directeur123</li>
              <li>educateur / educateur123</li>
              <li>comptable / comptable123</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
