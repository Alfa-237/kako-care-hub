import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function Panel({
  title,
  icon: Icon,
  action,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  icon?: LucideIcon;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border bg-card shadow-card transition-colors hover:border-primary/25",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b bg-muted/25 px-4 py-3">
        <h2 className="flex min-w-0 items-center gap-2 text-[15px] font-semibold tracking-tight">
          {Icon ? <Icon className="size-4 shrink-0 text-primary" /> : null}
          <span className="truncate">{title}</span>
        </h2>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className={cn("p-4", bodyClassName)}>{children}</div>
    </section>
  );
}
