// PermissionGuard : masque ou remplace son contenu selon la permission.
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth/auth-context";
import type { Permission } from "@/lib/auth/permissions";
import { Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PermissionGuard({
  permission,
  children,
  fallback,
}: {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { can } = useAuth();
  if (can(permission)) return <>{children}</>;
  if (fallback !== undefined) return <>{fallback}</>;
  return null;
}

export function PermissionDenied({ text = "Accès non autorisé pour ce rôle." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="grid size-14 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <ShieldAlert className="size-7" />
      </div>
      <div>
        <p className="text-base font-semibold">Permission refusée</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{text}</p>
      </div>
      <Button asChild variant="outline">
        <Link to="/">Retour à l'accueil</Link>
      </Button>
    </div>
  );
}
