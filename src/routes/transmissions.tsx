import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const Route = createFileRoute("/transmissions")({
  head: () => ({
    meta: [
      { title: "Transmissions — KAKO Manager" },
      { name: "description", content: "Cahier de transmission par enfant." },
      { property: "og:title", content: "Transmissions — KAKO Manager" },
      { property: "og:description", content: "Cahier de transmission par enfant." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell permission="transmissions.view">
      <ModulePlaceholder
        title="Transmissions quotidiennes"
        description="Cahier de transmission par enfant."
        planned={[
          "Repas et biberons",
          "Changes",
          "Siestes",
          "Humeur et température",
          "Observations",
          "Impression du jour",
        ]}
      />
    </AppShell>
  );
}
