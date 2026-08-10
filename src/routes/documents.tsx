import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Documents — KAKO Manager" },
      { name: "description", content: "Centre documentaire et modèles." },
      { property: "og:title", content: "Documents — KAKO Manager" },
      { property: "og:description", content: "Centre documentaire et modèles." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell permission="documents.view">
      <ModulePlaceholder
        title="Documents"
        description="Centre documentaire et modèles."
        planned={["Contrats d'accueil", "Fiches sanitaires", "Autorisations", "Attestations", "Reçus", "Personnalisation du modèle"]}
      />
    </AppShell>
  );
}
