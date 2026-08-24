import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";

export const Route = createFileRoute("/familles")({
  head: () => ({
    meta: [
      { title: "Familles — KAKO Manager" },
      { name: "description", content: "Responsables légaux, contacts d'urgence et autorisations." },
      { property: "og:title", content: "Familles — KAKO Manager" },
      {
        property: "og:description",
        content: "Responsables légaux, contacts d'urgence et autorisations.",
      },
    ],
  }),
  component: FamillesLayout,
});

function FamillesLayout() {
  return (
    <AppShell permission="families.view">
      <Outlet />
    </AppShell>
  );
}
