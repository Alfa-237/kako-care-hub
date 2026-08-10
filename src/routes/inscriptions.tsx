import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const Route = createFileRoute("/inscriptions")({
  head: () => ({
    meta: [
      { title: "Inscriptions — KAKO Manager" },
      { name: "description", content: "Préinscriptions, dossiers administratifs et contrats." },
      { property: "og:title", content: "Inscriptions — KAKO Manager" },
      { property: "og:description", content: "Préinscriptions, dossiers administratifs et contrats." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell permission="enrollment.manage">
      <ModulePlaceholder
        title="Inscriptions"
        description="Préinscriptions, dossiers administratifs et contrats."
        planned={["Préinscriptions", "Dossier administratif", "Contrats d'accueil", "Pièces obligatoires", "Validation d'inscription", "Liste d'attente"]}
      />
    </AppShell>
  );
}
