import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const Route = createFileRoute("/rapports")({
  head: () => ({
    meta: [
      { title: "Rapports — KAKO Manager" },
      { name: "description", content: "Statistiques et exports." },
      { property: "og:title", content: "Rapports — KAKO Manager" },
      { property: "og:description", content: "Statistiques et exports." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell permission="reports.view">
      <ModulePlaceholder
        title="Rapports"
        description="Statistiques et exports."
        planned={[
          "Taux d'occupation",
          "Présences et absences",
          "Chiffre d'affaires",
          "Impayés",
          "Activités et incidents",
          "Export CSV / PDF",
        ]}
      />
    </AppShell>
  );
}
