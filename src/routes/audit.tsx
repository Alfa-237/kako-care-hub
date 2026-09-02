import { createFileRoute } from "@tanstack/react-router";
import { Download, FileJson, FileSpreadsheet, ScrollText } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { useAuditLogs, useExportAudit } from "@/hooks/use-audit";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "Journal d'audit — KAKO Manager" },
      { name: "description", content: "Historique des actions et export CSV/JSON." },
      { property: "og:title", content: "Journal d'audit — KAKO Manager" },
      { property: "og:description", content: "Historique des actions et export CSV/JSON." },
    ],
  }),
  component: Page,
});

function Page() {
  const { data: logs = [] } = useAuditLogs();
  const exportAudit = useExportAudit();

  return (
    <AppShell permission="audit.view">
      <div className="space-y-5">
        <PageHeader
          title="Journal d'audit"
          description={`${logs.length} action(s) tracée(s) · triées de la plus récente à la plus ancienne`}
          actions={
            <>
              <Button variant="outline" onClick={() => exportAudit("csv")}>
                <FileSpreadsheet className="mr-2 size-4" /> Exporter CSV
              </Button>
              <Button variant="outline" onClick={() => exportAudit("json")}>
                <FileJson className="mr-2 size-4" /> Exporter JSON
              </Button>
            </>
          }
        />

        <div className="overflow-hidden rounded-xl border bg-card shadow-card">
          {logs.length === 0 ? (
            <div className="p-10 text-center">
              <div className="mx-auto grid size-12 place-items-center rounded-xl bg-muted text-muted-foreground">
                <ScrollText className="size-6" />
              </div>
              <h2 className="mt-4 text-lg font-semibold">Aucune action tracée</h2>
              <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
                Les connexions, créations et modifications seront enregistrées ici.
              </p>
            </div>
          ) : (
            <ul className="divide-y">
              {logs.map((l) => (
                <li key={l.id} className="flex items-start gap-3 px-4 py-3 sm:px-5">
                  <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                    <Download className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold">{l.action}</p>
                    {l.detail ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">{l.detail}</p>
                    ) : null}
                  </div>
                  <div className="hidden shrink-0 text-right sm:block">
                    <p className="text-xs font-medium">{l.userName}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(l.at).toLocaleString("fr-FR")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppShell>
  );
}
