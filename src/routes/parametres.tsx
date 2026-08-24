import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const Route = createFileRoute("/parametres")({
  head: () => ({
    meta: [
      { title: "Paramètres — KAKO Manager" },
      { name: "description", content: "Établissement, sections, utilisateurs et sécurité." },
      { property: "og:title", content: "Paramètres — KAKO Manager" },
      { property: "og:description", content: "Établissement, sections, utilisateurs et sécurité." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell permission="settings.manage">
      <ModulePlaceholder
        title="Paramètres"
        description="Établissement, sections, utilisateurs et sécurité."
        planned={[
          "Informations de l'établissement",
          "Sections et capacités",
          "Utilisateurs et rôles",
          "Permissions",
          "Verrouillage automatique",
          "Journal des actions",
        ]}
      />
    </AppShell>
  );
}
