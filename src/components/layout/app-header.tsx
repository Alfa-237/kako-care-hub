import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  Lock,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { ROLE_LABELS } from "@/lib/auth/permissions";
import { useDatabase } from "@/lib/data/db";
import { computeDashboard } from "@/lib/business/stats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppSidebar } from "./app-sidebar";
import { fullName } from "@/lib/business/stats";

export function AppHeader({
  collapsed = false,
  onToggleSidebar,
}: {
  collapsed?: boolean;
  onToggleSidebar?: () => void;
}) {
  const { user, signOut } = useAuth();
  const db = useDatabase();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const stats = db ? computeDashboard(db) : null;
  const alerts = stats ? stats.medicalAlerts + stats.missingDocuments + stats.unpaidInvoices : 0;

  const results =
    query.length > 1 && db
      ? db.children
          .filter((c) => fullName(c).toLowerCase().includes(query.toLowerCase()))
          .slice(0, 5)
      : [];

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-card/90 px-3 backdrop-blur-md md:px-5">
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Ouvrir le menu">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[262px] border-0 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <AppSidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {onToggleSidebar ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-label={collapsed ? "Déployer le menu" : "Réduire le menu"}
          title={collapsed ? "Déployer le menu" : "Réduire le menu"}
          className="hidden text-muted-foreground hover:text-foreground md:inline-flex"
        >
          {collapsed ? <PanelLeftOpen className="size-5" /> : <PanelLeftClose className="size-5" />}
        </Button>
      ) : null}

      <div className="relative min-w-0 flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un enfant, une famille…"
          className="h-9 rounded-full bg-muted/50 pl-9 transition-colors focus-visible:bg-card"
        />
        {results.length > 0 && (
          <div className="absolute left-0 right-0 top-11 z-40 animate-fade-in overflow-hidden rounded-xl border bg-popover shadow-lg">
            {results.map((c) => (
              <Link
                key={c.id}
                to="/enfants"
                onClick={() => setQuery("")}
                className="flex items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-muted"
              >
                <span className="truncate">{fullName(c)}</span>
                <span className="text-xs text-muted-foreground">{c.fileNumber}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <p className="ml-2 hidden shrink-0 text-xs font-medium text-muted-foreground lg:block first-letter:uppercase">
        {today}
      </p>

      <div className="ml-auto flex shrink-0 items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
          aria-label="Alertes"
          asChild
        >
          <Link to="/">
            <Bell className="size-5" />
            {alerts > 0 && (
              <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground ring-2 ring-card">
                {alerts > 9 ? "9+" : alerts}
              </span>
            )}
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="hidden text-muted-foreground hover:text-foreground sm:inline-flex"
          aria-label="Paramètres"
          asChild
        >
          <Link to="/parametres">
            <Settings className="size-5" />
          </Link>
        </Button>

        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 gap-2 px-1.5 sm:pr-3">
              <span className="grid size-8 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {user?.fullName
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")}
              </span>
              <span className="hidden text-left leading-tight sm:block">
                <span className="block text-[13px] font-semibold">{user?.fullName}</span>
                <span className="block text-[11px] font-normal text-muted-foreground">
                  {user ? ROLE_LABELS[user.role] : ""}
                </span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm font-semibold">{user?.fullName}</p>
              <p className="flex items-center gap-1 text-xs font-normal text-muted-foreground">
                <ShieldCheck className="size-3" /> {user ? ROLE_LABELS[user.role] : ""}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/parametres">
                <Settings className="mr-2 size-4" /> Paramètres
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.dispatchEvent(new Event("kako:lock"))}>
              <Lock className="mr-2 size-4" /> Verrouiller la session
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => void signOut()}>
              <LogOut className="mr-2 size-4" /> Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
