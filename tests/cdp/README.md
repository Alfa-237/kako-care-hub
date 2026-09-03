# CDP Tests — KAKO Care Hub

Tests end-to-end via Chrome DevTools Protocol (CDP) pour valider les fonctionnalités critiques.

## Prérequis

- **Chrome/Chromium** avec remote debugging sur le port **9223** :
  ```bash
  chrome.exe --remote-debugging-port=9223 --user-data-dir="%TEMP%\chrome-profile-cdp"
  ```
- **Serveur de dev** démarré sur `http://localhost:8080` :
  ```bash
  npm run dev
  ```
  (ou laisser le harness le lancer automatiquement via `spawn` dans `cdp-phase3c.mjs`)

## Freeze de la date

Tous les harness injectent un script `Page.addScriptToEvaluateOnNewDocument` qui fige `Date` au **25 août 2026, 10:00 UTC** (`2026-08-25T10:00:00.000Z`).

Cela garantit que `buildSeedDatabase()` génère **toujours les mêmes données** (pointages, transmissions, factures) indépendamment du jour d'exécution → tests déterministes.

## Commandes

| Phase | Description                         | Commande              |
| ----- | ----------------------------------- | --------------------- |
| 3A    | Entités Family + Data Service       | `npm run test:cdp:3a` |
| 2B    | UX Familles (liste/mosaïque, fiche) | `npm run test:cdp:2b` |
| 3B    | Présences / Pointage                | `npm run test:cdp:3b` |
| 3C    | Transmissions / Cahier de liaison   | `npm run test:cdp:3c` |

Lancer **une seule suite à la fois** (toutes utilisent le port CDP 9223).

## Structure

```
tests/cdp/
├── cdp-phase3a.mjs   # 12 tests — familles, migration, responsables
├── cdp-phase2b.mjs   # 17 tests — UX liste/mosaïque, responsive, fiche
├── cdp-phase3b.mjs   # 14 tests — pointage, filtres, fiche enfant
├── cdp-phase3c.mjs   # 21 tests — transmissions complètes (CRUD 6 sections)
└── README.md
```

## Notes

- Les harness utilisent `ws` (WebSocket) pour communiquer avec Chrome CDP.
- Le `spawn` du serveur dev n'existe que dans `cdp-phase3c.mjs` ; les autres attendent que `npm run dev` tourne déjà.
- Les scripts `cdp-debug*.mjs` sont des fichiers temporaires **exclus** du repo.
