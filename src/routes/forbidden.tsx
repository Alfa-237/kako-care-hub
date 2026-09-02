import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/forbidden")({
  head: () => ({
    meta: [
      { title: "Accès refusé — KAKO Manager" },
      { name: "description", content: "Vous n'avez pas la permission d'accéder à cette page." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-destructive/10 text-destructive">
          <ShieldAlert className="size-8" />
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">403 — Accès refusé</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Votre rôle ne vous autorise pas à consulter cette page. Contactez un administrateur si
          vous pensez qu'il s'agit d'une erreur.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button asChild>
            <Link to="/">Retour à l'accueil</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/connexion">Changer d'utilisateur</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
