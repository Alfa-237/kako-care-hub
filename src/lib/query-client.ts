// Instance partagée de TanStack Query.
// Utilisée par le routeur (contexte) et par la couche services pour
// l'invalidation croisée héritage ↔ React Query.
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
