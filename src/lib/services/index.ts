// Point d'entrée de la couche services.
// Exporte l'instance par défaut (localStorage aujourd'hui ; SQLite/IndexedDB
// demain, sans modifier les composants) et installe le pont d'invalidation :
// toute écriture héritée (mutate direct) invalide les caches React Query,
// et inversement via la notification partagée de db.ts.
import { queryClient } from "../query-client";
import { bindLegacyWrites, localStorageService } from "./local-storage-service";
import type { IDataService } from "./data-service";

export const dataService: IDataService = localStorageService;

export type { IDataService } from "./data-service";
export { ID_PREFIXES } from "./local-storage-service";

// Pont héritage → React Query (installé une seule fois par chargement).
bindLegacyWrites(() => {
  void queryClient.invalidateQueries();
});
