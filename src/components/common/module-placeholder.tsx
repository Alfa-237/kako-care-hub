import { Construction } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";

export function ModulePlaceholder({
  title,
  description,
  planned,
}: {
  title: string;
  description: string;
  planned: string[];
}) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <div className="rounded-xl border bg-card p-8 shadow-card">
        <div className="flex items-start gap-4">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <Construction className="size-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold">Module prévu dans une prochaine phase</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              La navigation, les permissions et la structure de données de ce module sont déjà en
              place. Les écrans opérationnels seront développés phase par phase.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {planned.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-sm"
                >
                  <span className="size-1.5 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
