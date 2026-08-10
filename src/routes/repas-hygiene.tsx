import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const Route = createFileRoute("/repas-hygiene")({
  head: () => ({
    meta: [
      { title: "Repas & Hygiène — KAKO Manager" },
      { name: "description", content: "Suivi quotidien des soins." },
      { property: "og:title", content: "Repas & Hygiène — KAKO Manager" },
      { property: "og:description", content: "Suivi quotidien des soins." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell permission="care.manage">
      <ModulePlaceholder
        title="Repas, changes et siestes"
        description="Suivi quotidien des soins."
        planned={["Menus par jour", "Menus par section", "Allergies", "Changes", "Siestes et durées", "Historique"]}
      />
    </AppShell>
  );
}
