import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Baby, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth, type SignUpInput } from "@/lib/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthSlideshow } from "@/components/auth/auth-slideshow";
import { AuthDecor } from "@/components/auth/auth-decor";
import { TEAM_SLIDES } from "@/components/auth/slides";

export const Route = createFileRoute("/inscription")({
  head: () => ({
    meta: [
      { title: "Créer votre espace — KAKO Manager" },
      {
        name: "description",
        content:
          "Créez l'espace de gestion de votre crèche en quelques minutes : enfants, familles, présences et facturation réunis.",
      },
      { property: "og:title", content: "Créer votre espace — KAKO Manager" },
      {
        property: "og:description",
        content: "Ouvrez le compte de votre crèche sur KAKO Manager.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignUpPage,
});

type Field = keyof SignUpInput;

const EMPTY: SignUpInput = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  crecheName: "",
  crechePhone: "",
  city: "",
  address: "",
  password: "",
};

function SignUpPage() {
  const { signUp, user, ready } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<SignUpInput>(EMPTY);
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Partial<Record<Field | "confirm" | "global", string>>>({});
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (ready && user && !done) navigate({ to: "/", replace: true });
  }, [ready, user, done, navigate]);

  const set = (field: Field) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined, global: undefined }));
  };

  function validate() {
    const next: Partial<Record<Field | "confirm" | "global", string>> = {};
    if (!form.firstName.trim()) next.firstName = "Prénom obligatoire.";
    if (!form.lastName.trim()) next.lastName = "Nom obligatoire.";
    if (!form.phone.trim()) next.phone = "Téléphone obligatoire.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      next.email = "Adresse e-mail invalide.";
    if (!form.crecheName.trim()) next.crecheName = "Nom de la crèche obligatoire.";
    if (!form.city.trim()) next.city = "Ville obligatoire.";
    if (form.password.length < 8)
      next.password = "8 caractères minimum, avec au moins une lettre et un chiffre.";
    else if (!/[a-zA-Z]/.test(form.password) || !/\d/.test(form.password))
      next.password = "Ajoutez au moins une lettre et un chiffre.";
    if (confirm !== form.password) next.confirm = "Les mots de passe ne correspondent pas.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const res = await signUp(form);
    setLoading(false);
    if (!res.ok) {
      setErrors({ global: res.error ?? "Création impossible." });
      return;
    }
    setDone(true);
    setTimeout(() => navigate({ to: "/", replace: true }), 1600);
  }

  const strength = (() => {
    let s = 0;
    if (form.password.length >= 8) s++;
    if (/[A-Z]/.test(form.password)) s++;
    if (/\d/.test(form.password)) s++;
    if (/[^A-Za-z0-9]/.test(form.password)) s++;
    return s;
  })();

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[55fr_45fr]">
      <section className="relative hidden lg:block">
        <AuthSlideshow slides={TEAM_SLIDES} interval={5500}>
          <div className="flex items-center gap-3 text-sidebar-foreground">
            <div className="grid size-11 place-items-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground shadow-lg">
              <Baby className="size-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">KAKO Manager</span>
          </div>

          <div className="max-w-lg animate-fade-in text-sidebar-foreground">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-sidebar-primary">
              Pour les équipes éducatives
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.12] xl:text-5xl">
              Construisons ensemble un meilleur environnement pour les enfants.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-sidebar-foreground/80">
              Les bons outils permettent aux équipes éducatives de se concentrer sur ce qui compte
              vraiment.
            </p>
          </div>

          <p className="text-xs text-sidebar-foreground/50">Version prototype — Phase 1</p>
        </AuthSlideshow>
      </section>

      <section className="relative flex items-start justify-center px-5 py-10 sm:px-8 lg:items-center">
        <AuthDecor />

        <div className="absolute inset-x-0 top-0 h-28 overflow-hidden lg:hidden">
          <AuthSlideshow slides={TEAM_SLIDES}>
            <div className="flex items-center gap-2 text-sidebar-foreground">
              <div className="grid size-8 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
                <Baby className="size-4" />
              </div>
              <span className="text-sm font-bold">KAKO Manager</span>
            </div>
          </AuthSlideshow>
        </div>

        <div className="relative mt-28 w-full max-w-lg animate-fade-in lg:mt-0">
          {done ? (
            <div className="rounded-3xl border bg-card p-9 text-center shadow-[var(--shadow-card)]">
              <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-success/12 text-success">
                <CheckCircle2 className="size-7" />
              </div>
              <h2 className="mt-5 text-2xl font-bold">Bienvenue dans KAKO 🎉</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                L'espace « {form.crecheName} » est prêt. Ouverture de votre tableau de bord…
              </p>
            </div>
          ) : (
            <div className="rounded-3xl border bg-card p-6 shadow-[var(--shadow-card)] sm:p-9">
              <h2 className="text-2xl font-bold sm:text-3xl">Créer votre espace KAKO</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Quelques informations suffisent pour commencer.
              </p>

              <form onSubmit={handleSubmit} className="mt-7 space-y-7" noValidate>
                <Section title="Informations personnelles">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldInput
                      id="firstName"
                      label="Prénom"
                      value={form.firstName}
                      onChange={set("firstName")}
                      error={errors.firstName}
                      autoComplete="given-name"
                    />
                    <FieldInput
                      id="lastName"
                      label="Nom"
                      value={form.lastName}
                      onChange={set("lastName")}
                      error={errors.lastName}
                      autoComplete="family-name"
                    />
                    <FieldInput
                      id="phone"
                      label="Téléphone"
                      value={form.phone}
                      onChange={set("phone")}
                      error={errors.phone}
                      autoComplete="tel"
                      placeholder="+237 6 00 00 00 00"
                    />
                    <FieldInput
                      id="email"
                      label="Adresse e-mail"
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      error={errors.email}
                      autoComplete="email"
                      placeholder="vous@creche.com"
                    />
                  </div>
                </Section>

                <Section title="Informations de la crèche">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldInput
                      id="crecheName"
                      label="Nom de la crèche"
                      value={form.crecheName}
                      onChange={set("crecheName")}
                      error={errors.crecheName}
                    />
                    <FieldInput
                      id="crechePhone"
                      label="Téléphone de la crèche"
                      value={form.crechePhone}
                      onChange={set("crechePhone")}
                      error={errors.crechePhone}
                    />
                    <FieldInput
                      id="city"
                      label="Ville"
                      value={form.city}
                      onChange={set("city")}
                      error={errors.city}
                    />
                    <FieldInput
                      id="address"
                      label="Adresse"
                      value={form.address}
                      onChange={set("address")}
                      error={errors.address}
                    />
                  </div>
                </Section>

                <Section title="Sécurité">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm">
                        Mot de passe
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={show ? "text" : "password"}
                          value={form.password}
                          onChange={set("password")}
                          autoComplete="new-password"
                          aria-invalid={!!errors.password}
                          className="h-12 rounded-xl pr-11 text-base"
                        />
                        <button
                          type="button"
                          onClick={() => setShow((s) => !s)}
                          aria-label={show ? "Masquer" : "Afficher"}
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground hover:text-foreground"
                        >
                          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                      {form.password && (
                        <div className="flex gap-1.5" aria-hidden>
                          {[0, 1, 2, 3].map((i) => (
                            <span
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-colors ${
                                i < strength
                                  ? strength <= 2
                                    ? "bg-warning"
                                    : "bg-success"
                                  : "bg-border"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                      {errors.password && <InlineError>{errors.password}</InlineError>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm" className="text-sm">
                        Confirmer le mot de passe
                      </Label>
                      <Input
                        id="confirm"
                        type={show ? "text" : "password"}
                        value={confirm}
                        onChange={(e) => {
                          setConfirm(e.target.value);
                          setErrors((p) => ({ ...p, confirm: undefined }));
                        }}
                        autoComplete="new-password"
                        aria-invalid={!!errors.confirm}
                        className="h-12 rounded-xl text-base"
                      />
                      {errors.confirm && <InlineError>{errors.confirm}</InlineError>}
                    </div>
                  </div>
                </Section>

                {errors.global && (
                  <p className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive animate-fade-in">
                    {errors.global}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full rounded-xl text-base font-semibold transition-transform hover:-translate-y-0.5"
                >
                  {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                  Créer mon compte
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Vous avez déjà un compte ?{" "}
                <Link
                  to="/connexion"
                  className="font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4">
      <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function InlineError({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-medium text-destructive animate-fade-in">{children}</p>;
}

function FieldInput({
  id,
  label,
  error,
  ...props
}: React.ComponentProps<typeof Input> & { id: string; label: string; error?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm">
        {label}
      </Label>
      <Input
        id={id}
        aria-invalid={!!error}
        className="h-12 rounded-xl text-base"
        {...props}
      />
      {error && <InlineError>{error}</InlineError>}
    </div>
  );
}
