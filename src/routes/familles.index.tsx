import { createFileRoute } from "@tanstack/react-router";
import { FamilyPage } from "@/components/families/FamilyPage";

export const Route = createFileRoute("/familles/")({
  component: FamillesIndexPage,
});

function FamillesIndexPage() {
  return <FamilyPage />;
}
