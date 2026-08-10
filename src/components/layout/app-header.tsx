import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, Lock, LogOut, Menu, Search, ShieldCheck } from "lucide-react";
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

export function AppHeader() {
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
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card/85 px-4 backdrop-blur md:px-6">
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Ouvrir le menu">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[260px] border-0 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <AppSidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="relative min-w-0 flex-1 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un enfant, une famille…"
          className="h-9 pl-9"
        />
        {results.length > 0 && (
          <div className="absolute left-0 right-0 top-11 z-40 overflow-hidden rounded-lg border bg-popover shadow-md">
            {results.map((c) => (
              <Link
                key={c.id}
                to="/enfants"
                onClick={() => setQuery("")}
                className="flex items-center justify-between px-3 py-2 text-sm hover:bg-muted"
              >
                <span className="truncate">{fullName(c)}</span>
                <span className="text-xs text-muted-foreground">{c.fileNumber}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <p className="hidden shrink-0 text-sm text-muted-foreground lg:block first-letter:uppercase">
        {today}
      </p>

      <div className="ml-auto flex shrink-0 items-center gap-1.5">
        <Button variant="ghost" size="icon" className="relative" aria-label="Alertes" asChild>
          <Link to="/">
            <Bell className="size-5" />
            {alerts > 0 && (
              <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {alerts > 9 ? "9+" : alerts}
              </span>
            )}
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 px-2">
              <span className="grid size-7 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {user?.fullName
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")}
              </span>
              <span className="hidden text-sm font-medium sm:inline">{user?.fullName}</span>
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
