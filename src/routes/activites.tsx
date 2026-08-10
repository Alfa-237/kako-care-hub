import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const Route = createFileRoute("/activites")({
  head: () => ({
    meta: [
      { title: "Activités — KAKO Manager" },
      { name: "description", content: "Ateliers, catégories et observations." },
      { property: "og:title", content: "Activités — KAKO Manager" },
      { property: "og:description", content: "Ateliers, catégories et observations." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell permission="activities.manage">
      <ModulePlaceholder
        title="Activités pédagogiques"
        description="Ateliers, catégories et observations."
        planned={["Création d'activité", "Catégories pédagogiques", "Sélection des enfants", "Observations", "Compétences observées", "Photos locales"]}
      />
    </AppShell>
  );
}
