// Module Transmissions — layout parent (phase 3C).
// Les pages enfants (index = liste du jour, $childId = fiche) rendent dans l'Outlet.
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";

export const Route = createFileRoute("/transmissions")({
  head: () => ({
    meta: [
      { title: "Transmissions — KAKO Manager" },
      { name: "description", content: "Cahier de liaison quotidien par enfant." },
      { property: "og:title", content: "Transmissions — KAKO Manager" },
      {
        property: "og:description",
        content: "Cahier de liaison quotidien : repas, siestes, changes, incidents.",
      },
    ],
  }),
  component: TransmissionsLayout,
});

function TransmissionsLayout() {
  return (
    <AppShell permission="transmissions.view">
      <Outlet />
    </AppShell>
  );
}
