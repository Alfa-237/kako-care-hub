import { Link, useRouterState } from "@tanstack/react-router";
import { Baby, ChevronsLeft, ChevronsRight, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { ROLE_LABELS } from "@/lib/auth/permissions";
import { NAV_GROUPS, NAV_ITEMS } from "./nav-items";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AppSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const { user, can, signOut } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside
      className={cn(
        "flex h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-out",
        collapsed ? "w-[76px]" : "w-[262px]",
      )}
    >
      <div
        className={cn(
          "flex h-16 items-center gap-3 border-b border-sidebar-border px-4",
          collapsed && "justify-center px-0",
        )}
      >
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
          <Baby className="size-5" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-[15px] font-extrabold leading-tight tracking-tight">
              KAKO <span className="text-sidebar-primary">MANAGER</span>
            </p>
            <p className="truncate text-[11px] text-sidebar-foreground/55">Gestion de crèche</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => {
          const items = NAV_ITEMS.filter((i) => i.group === group && can(i.permission));
          if (!items.length) return null;
          return (
            <div key={group}>
              {collapsed ? (
                <div className="mx-auto mb-2 h-px w-8 bg-sidebar-border" />
              ) : (
                <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-sidebar-foreground/40">
                  {group}
                </p>
              )}
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        title={collapsed ? item.label : undefined}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13.5px] font-medium transition-colors duration-150",
                          active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_0_0_0_1px_var(--sidebar-border)]"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/55 hover:text-sidebar-accent-foreground",
                          collapsed && "justify-center px-0",
                        )}
                      >
                        {active && (
                          <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-sidebar-primary" />
                        )}
                        <item.icon
                          className={cn(
                            "size-[18px] shrink-0 transition-colors",
                            active ? "text-sidebar-primary" : "group-hover:text-sidebar-primary/80",
                          )}
                        />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-sidebar-accent/40",
            collapsed && "justify-center",
          )}
        >
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-sidebar-accent text-xs font-bold text-sidebar-accent-foreground">
            {user?.fullName
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{user?.fullName}</p>
              <p className="truncate text-[11px] text-sidebar-foreground/55">
                {user ? ROLE_LABELS[user.role] : ""}
              </p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => void signOut()}
              title="Se déconnecter"
              className="rounded-md p-1.5 text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <LogOut className="size-4" />
            </button>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          title={collapsed ? "Déployer le menu" : "Réduire le menu"}
          className={cn(
            "mt-2 w-full justify-center text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          )}
        >
          {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
          {!collapsed && <span className="ml-2 text-xs">Réduire le menu</span>}
        </Button>
      </div>
    </aside>
  );
}
