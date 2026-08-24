import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      className={cn("flex flex-wrap items-center gap-1.5 text-sm", className)}
      aria-label="Fil d'Ariane"
    >
      <ol className="flex items-center gap-1.5">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-center gap-1.5"
            aria-current={index === items.length - 1 ? "page" : undefined}
          >
            {index > 0 && (
              <ChevronRight
                className="size-3.5 text-muted-foreground/50 flex-shrink-0"
                aria-hidden="true"
              />
            )}
            {item.href ? (
              <Link
                to={item.href}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-foreground truncate max-w-[200px]">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
