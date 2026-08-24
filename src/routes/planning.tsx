import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const Route = createFileRoute("/planning")({
  head: () => ({
    meta: [
      { title: "Planning — KAKO Manager" },
      { name: "description", content: "Planning des enfants et du personnel." },
      { property: "og:title", content: "Planning — KAKO Manager" },
      { property: "og:description", content: "Planning des enfants et du personnel." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell permission="planning.view">
      <ModulePlaceholder
        title="Planning"
        description="Planning des enfants et du personnel."
        planned={[
          "Vue jour / semaine / mois",
          "Planning par section",
          "Horaires prévus",
          "Planning du personnel",
          "Congés et remplacements",
          "Alertes de capacité",
        ]}
      />
    </AppShell>
  );
}
