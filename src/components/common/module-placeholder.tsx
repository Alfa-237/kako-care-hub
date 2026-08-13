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
    <div className="space-y-5">
      <PageHeader title={title} description={description} />
      <div className="overflow-hidden rounded-xl border bg-card shadow-card">
        <div className="flex items-start gap-4 border-b bg-muted/25 px-5 py-4">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <Construction className="size-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-[15px] font-semibold tracking-tight">
              Module prévu dans une prochaine phase
            </h2>
            <p className="mt-1 text-[13px] text-muted-foreground">
              La navigation, les permissions et la structure de données de ce module sont déjà en
              place. Les écrans opérationnels seront développés phase par phase.
            </p>
          </div>
        </div>
        <ul className="grid gap-2 p-5 sm:grid-cols-2">
          {planned.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2.5 rounded-lg border bg-muted/30 px-3 py-2.5 text-[13.5px] transition-colors hover:border-primary/30 hover:bg-muted/50"
            >
              <span className="size-1.5 shrink-0 rounded-full bg-primary" />
              <span className="truncate">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
