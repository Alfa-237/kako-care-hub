import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

/**
 * Avatar d'un enfant : affiche la photo si elle est disponible,
 * sinon un avatar avec les initiales. Un système d'upload de photo
 * pourra s'y brancher ultérieurement sans changer l'interface.
 */
export function ChildAvatar({
  photo,
  firstName,
  lastName,
  className,
}: {
  photo?: string | null;
  firstName: string;
  lastName: string;
  className?: string;
}) {
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
  return (
    <Avatar className={cn("size-10 bg-primary/10", className)}>
      {photo ? <AvatarImage src={photo} alt={`Photo de ${firstName} ${lastName}`} /> : null}
      <AvatarFallback className="bg-primary/10 text-sm font-bold text-primary">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
