// Badges d'autorisation d'un contact (phase 7).
// [Récupération] vert · [Urgence] rouge · [Documents] bleu · [Signature] violet
import { Badge } from "@/components/ui/badge";

export function AuthorizationBadges({
  canPickup,
  emergencyContact,
  receivesDocuments,
  canSign,
}: {
  canPickup: boolean;
  emergencyContact: boolean;
  receivesDocuments: boolean;
  canSign: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {canPickup ? (
        <Badge
          variant="default"
          className="border-transparent bg-green-600 text-white hover:bg-green-700"
        >
          Récupération
        </Badge>
      ) : null}
      {emergencyContact ? <Badge variant="destructive">Urgence</Badge> : null}
      {receivesDocuments ? (
        <Badge
          variant="secondary"
          className="border-transparent bg-blue-600 text-white hover:bg-blue-700"
        >
          Documents
        </Badge>
      ) : null}
      {canSign ? (
        <Badge
          variant="secondary"
          className="border-transparent bg-violet-600 text-white hover:bg-violet-700"
        >
          Signature
        </Badge>
      ) : null}
    </div>
  );
}
