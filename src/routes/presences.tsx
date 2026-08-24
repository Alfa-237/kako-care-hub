import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const Route = createFileRoute("/presences")({
  head: () => ({
    meta: [
      { title: "Présences — KAKO Manager" },
      { name: "description", content: "Arrivées, départs, retards et absences." },
      { property: "og:title", content: "Présences — KAKO Manager" },
      { property: "og:description", content: "Arrivées, départs, retards et absences." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell permission="attendance.view">
      <ModulePlaceholder
        title="Présences et pointage"
        description="Arrivées, départs, retards et absences."
        planned={[
          "Pointage rapide",
          "Arrivée / départ",
          "Retards",
          "Départs anticipés",
          "Absences justifiées",
          "Historique des modifications",
        ]}
      />
    </AppShell>
  );
}
