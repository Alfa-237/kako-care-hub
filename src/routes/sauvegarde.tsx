import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const Route = createFileRoute("/sauvegarde")({
  head: () => ({
    meta: [
      { title: "Sauvegarde — KAKO Manager" },
      { name: "description", content: "Sauvegardes locales et restauration sécurisée." },
      { property: "og:title", content: "Sauvegarde — KAKO Manager" },
      { property: "og:description", content: "Sauvegardes locales et restauration sécurisée." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell permission="backup.manage">
      <ModulePlaceholder
        title="Sauvegarde et restauration"
        description="Sauvegardes locales et restauration sécurisée."
        planned={["Sauvegarde manuelle", "Sauvegarde automatique", "Restauration", "Choix du dossier", "Historique", "Sauvegarde de sécurité"]}
      />
    </AppShell>
  );
}
