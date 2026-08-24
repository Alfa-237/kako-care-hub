import { FC } from "react";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

interface FamilyHeaderProps {
  familyName: string;
  responsableCount: number;
  enfantCount: number;
}

export const FamilyHeader: FC<FamilyHeaderProps> = ({
  familyName,
  responsableCount,
  enfantCount,
}) => {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Users className="size-5" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-foreground">Famille {familyName}</h3>
          <p className="text-xs text-muted-foreground">
            {responsableCount} responsable{responsableCount > 1 ? "s" : ""} · {enfantCount} enfant
            {enfantCount > 1 ? "s" : ""} rattaché{enfantCount > 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </Card>
  );
};
