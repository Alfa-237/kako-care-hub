import { FC } from "react";
import { Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";

export interface EnfantLinkProps {
  childId: string;
  childFirstName: string;
  childLastName: string;
  /** Id du parent de référence de la famille d'origine : active « Retour à la famille » sur la fiche enfant. */
  fromFamilyId?: string;
}

export const EnfantLink: FC<EnfantLinkProps> = ({
  childId,
  childFirstName,
  childLastName,
  fromFamilyId,
}) => {
  return (
    <Link
      to="/enfants/$id"
      params={{ id: childId }}
      {...(fromFamilyId ? { search: { from: fromFamilyId } } : {})}
      className="flex items-center gap-2 rounded-md transition-colors outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
    >
      <ExternalLink className="size-4" />
      <span>
        {childFirstName} {childLastName}
      </span>
    </Link>
  );
};
