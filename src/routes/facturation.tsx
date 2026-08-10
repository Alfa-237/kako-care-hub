import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const Route = createFileRoute("/facturation")({
  head: () => ({
    meta: [
      { title: "Facturation — KAKO Manager" },
      { name: "description", content: "Tarifs, factures et impayés." },
      { property: "og:title", content: "Facturation — KAKO Manager" },
      { property: "og:description", content: "Tarifs, factures et impayés." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell permission="billing.view">
      <ModulePlaceholder
        title="Facturation"
        description="Tarifs, factures et impayés."
        planned={["Grille tarifaire", "Génération de factures", "Lignes de facture", "Réductions fratrie", "Suivi des impayés", "Export PDF"]}
      />
    </AppShell>
  );
}
