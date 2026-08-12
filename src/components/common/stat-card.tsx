import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "neutral",
  trend,
  className,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: "neutral" | "success" | "danger" | "warning" | "info" | "primary";
  trend?: { value: string; direction: "up" | "down" };
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-muted text-muted-foreground",
    success: "bg-success/12 text-success",
    danger: "bg-destructive/12 text-destructive",
    warning: "bg-warning/18 text-warning-foreground",
    info: "bg-info/12 text-info",
    primary: "bg-primary/10 text-primary",
  };
  const bars: Record<string, string> = {
    neutral: "bg-muted-foreground/30",
    success: "bg-success",
    danger: "bg-destructive",
    warning: "bg-warning",
    info: "bg-info",
    primary: "bg-primary",
  };

  const TrendIcon = trend?.direction === "down" ? TrendingDown : TrendingUp;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg",
        className,
      )}
    >
      <span
        className={cn(
          "absolute inset-y-0 left-0 w-1 opacity-70 transition-opacity group-hover:opacity-100",
          bars[tone],
        )}
        aria-hidden
      />
      <div className="flex items-start justify-between gap-3 pl-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <span
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-lg transition-transform duration-200 group-hover:scale-105",
            tones[tone],
          )}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <div className="mt-2 flex items-end gap-2 pl-1.5">
        <p className="text-[26px] font-bold leading-none tabular-nums">{value}</p>
        {trend ? (
          <span
            className={cn(
              "mb-0.5 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-semibold",
              trend.direction === "down"
                ? "bg-destructive/12 text-destructive"
                : "bg-success/12 text-success",
            )}
          >
            <TrendIcon className="size-3" />
            {trend.value}
          </span>
        ) : null}
      </div>
      {hint ? <p className="mt-1.5 pl-1.5 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
