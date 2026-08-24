import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const Route = createFileRoute("/personnel")({
  head: () => ({
    meta: [
      { title: "Personnel — KAKO Manager" },
      { name: "description", content: "Employés, plannings et congés." },
      { property: "og:title", content: "Personnel — KAKO Manager" },
      { property: "og:description", content: "Employés, plannings et congés." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell permission="staff.view">
      <ModulePlaceholder
        title="Personnel"
        description="Employés, plannings et congés."
        planned={[
          "Fiches employés",
          "Contrats",
          "Planning et pointage",
          "Demandes de congés",
          "Validation",
          "Documents",
        ]}
      />
    </AppShell>
  );
}
