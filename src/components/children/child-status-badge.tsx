import { StatusPill } from "@/components/common/status-pill";
import type { ChildStatus } from "@/lib/data/types";

const STATUS_TONE: Record<ChildStatus, "success" | "warning" | "info" | "neutral"> = {
  Inscrit: "success",
  Préinscrit: "warning",
  Suspendu: "info",
  Sorti: "neutral",
};

export function ChildStatusBadge({
  status,
  className,
}: {
  status: ChildStatus;
  className?: string;
}) {
  return (
    <StatusPill tone={STATUS_TONE[status]} {...(className ? { className } : {})}>
      {status}
    </StatusPill>
  );
}
