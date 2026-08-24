import { FC } from "react";
import { Check, Eye } from "lucide-react";

export interface ResponsableCardProps {
  firstName: string;
  lastName: string;
  relation: string;
  phone: string;
  email: string;
  canPickUp: boolean;
  isEmergencyContact: boolean;
  receivesDocuments: boolean;
  canSign: boolean;
}

export const ResponsableCard: FC<ResponsableCardProps> = ({
  firstName,
  lastName,
  relation,
  phone,
  email,
  canPickUp,
  isEmergencyContact,
  receivesDocuments,
  canSign,
}) => {
  return (
    <div className="p-3 rounded-xl border border-border bg-background hover:bg-hover/30 transition-colors cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-medium text-primary">{lastName.charAt(0)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium line-clamp-1">
            {firstName} {lastName}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-1">{relation}</p>
        </div>
        <div className="flex-1 min-w-0 text-right">
          <div className="flex gap-1 my-1">
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-medium ${canPickUp ? "text-primary/80 bg-primary/10" : "text-muted-foreground/20 bg-primary/5"}`}
              title="Peut récupérer"
            >
              <Check className="size-2" /> {canPickUp ? "Oui" : "Non"}
            </span>
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-medium ${isEmergencyContact ? "text-primary/80 bg-primary/10" : "text-muted-foreground/20 bg-primary/5"}`}
              title="Contact urgence"
            >
              <Eye className="size-2" /> {isEmergencyContact ? "Oui" : "Non"}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">{phone}</p>
          <p className="text-[10px] text-muted-foreground">{email}</p>
        </div>
      </div>
    </div>
  );
};
