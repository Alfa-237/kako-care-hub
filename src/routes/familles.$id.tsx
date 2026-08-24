import { createFileRoute } from "@tanstack/react-router";
import { FamilyDetail } from "@/components/families/FamilyDetail";

export const Route = createFileRoute("/familles/$id")({
  head: () => ({
    meta: [
      { title: "Fiche famille — KAKO Manager" },
      { name: "description", content: "Fiche complète d'une famille : responsables, enfants, finances, historique." },
    ],
  }),
  component: FamilyDetailPage,
});

function FamilyDetailPage() {
  const { id } = Route.useParams();
  return <FamilyDetail id={id} />;
}