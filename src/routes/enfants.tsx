import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const Route = createFileRoute("/enfants")({
  head: () => ({
    meta: [
      { title: "Enfants — KAKO Manager" },
      { name: "description", content: "Fiches complètes, recherche, filtres, vues liste et mosaïque." },
      { property: "og:title", content: "Enfants — KAKO Manager" },
      { property: "og:description", content: "Fiches complètes, recherche, filtres, vues liste et mosaïque." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell permission="children.view">
      <ModulePlaceholder
        title="Gestion des enfants"
        description="Fiches complètes, recherche, filtres, vues liste et mosaïque."
        planned={["Liste et vue mosaïque", "Recherche et filtres", "Fiche enfant à onglets", "Ajout / modification", "Archivage", "Documents liés"]}
      />
    </AppShell>
  );
}
