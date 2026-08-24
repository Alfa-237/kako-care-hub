import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { ModulePlaceholder } from "@/components/common/module-placeholder";

export const Route = createFileRoute("/paiements")({
  head: () => ({
    meta: [
      { title: "Paiements — KAKO Manager" },
      { name: "description", content: "Encaissements et reste à payer." },
      { property: "og:title", content: "Paiements — KAKO Manager" },
      { property: "og:description", content: "Encaissements et reste à payer." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <AppShell permission="payments.manage">
      <ModulePlaceholder
        title="Paiements"
        description="Encaissements et reste à payer."
        planned={[
          "Encaissement manuel",
          "Moyens de paiement",
          "Rapprochement facture",
          "Reste à payer",
          "Reçus",
          "Historique",
        ]}
      />
    </AppShell>
  );
}
