import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const Route = createFileRoute("/familles")({
  head: () => ({
    meta: [
      { title: "Familles — KAKO Manager" },
      { name: "description", content: "Responsables légaux, contacts d'urgence et autorisations." },
      { property: "og:title", content: "Familles — KAKO Manager" },
      { property: "og:description", content: "Responsables légaux, contacts d'urgence et autorisations." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell permission="families.view">
      <ModulePlaceholder
        title="Familles et responsables"
        description="Responsables légaux, contacts d'urgence et autorisations."
        planned={["Responsables multiples", "Autorisations de récupération", "Contacts d'urgence", "Pièces d'identité", "Liens enfant / parent", "Coordonnées"]}
      />
    </AppShell>
  );
}
