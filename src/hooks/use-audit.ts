// Hooks d'audit (phase 6) : lecture des journaux, export CSV/JSON,
// et mutation « auditée » qui journalise automatiquement toute mutation.
import { useCallback } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { dataService } from "@/lib/services";
import { useAuth } from "@/lib/auth/auth-context";
import type { AuditLog } from "@/lib/data/types";

const AUDIT_KEYS = { all: ["audit"] as const };

export function useAuditLogs() {
  return useQuery<AuditLog[]>({
    queryKey: AUDIT_KEYS.all,
    queryFn: () => dataService.getAll<AuditLog>("auditLogs"),
  });
}

/** Sérialise les journaux vers CSV (point-virgule, encodage UTF-8 BOM). */
export function auditToCsv(logs: AuditLog[]): string {
  const header = ["Date", "Utilisateur", "Action", "Détail"];
  const rows = logs.map((l) => [
    new Date(l.at).toLocaleString("fr-FR"),
    l.userName,
    l.action,
    l.detail,
  ]);
  const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
  return "\uFEFF" + [header, ...rows].map((r) => r.map(escape).join(";")).join("\r\n");
}

/** Télécharge un fichier local (blob). */
export function downloadFile(filename: string, content: string, mime = "text/plain") {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function useExportAudit() {
  const { data } = useAuditLogs();
  return useCallback(
    (format: "csv" | "json") => {
      const logs = data ?? [];
      const stamp = new Date().toISOString().slice(0, 10);
      if (format === "csv") {
        downloadFile(`audit-${stamp}.csv`, auditToCsv(logs), "text/csv");
      } else {
        downloadFile(`audit-${stamp}.json`, JSON.stringify(logs, null, 2), "application/json");
      }
    },
    [data],
  );
}

/**
 * Mutation auditée : exécute la mutation, puis journalise l'action
 * dans les journaux d'audit via la couche DataService.
 */
export function useAuditedMutation<TData, TError, TVariables, TContext = unknown>({
  audit,
  onSuccess,
  ...options
}: {
  audit: (variables: TVariables, data: TData) => { action: string; detail: string };
  onSuccess?: (data: TData, variables: TVariables, context: TContext) => Promise<unknown> | void;
} & UseMutationOptions<TData, TError, TVariables, TContext>) {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation<TData, TError, TVariables, TContext>({
    ...options,
    onSuccess: async (data, variables, context) => {
      const { action, detail } = audit(variables, data);
      await dataService.create<AuditLog>("auditLogs", {
        id: `log-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
        at: new Date().toISOString(),
        userId: user?.id ?? null,
        userName: user?.fullName ?? "Système",
        action,
        detail,
      });
      void qc.invalidateQueries({ queryKey: AUDIT_KEYS.all });
      await onSuccess?.(data, variables, context);
    },
  });
}
