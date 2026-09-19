# CDP Tests — KAKO Care Hub

Tests end-to-end via Chrome DevTools Protocol (CDP) pour valider les fonctionnalités critiques.

## Prérequis

- **Chrome/Chromium** avec remote debugging sur le port **9223** — Utiliser un profil dédié
  (ne jamais rouvrir/casser les fenêtres Chrome personnelles) :
  ```bash
  chrome.exe --remote-debugging-port=9223 --user-data-dir="%TEMP%\chrome-profile-cdp"
  ```
- **Serveur de dev** démarré sur `http://localhost:8080` :
  ```bash
  npm run dev -- --port 8080 --strictPort
  ```

## Freeze de la date

Tous les harness injectent un script `Page.addScriptToEvaluateOnNewDocument` qui fige `Date` au
**25 août 2026, 10:00 UTC** (`2026-08-25T10:00:00.000Z`, un mardi).

Cela garantit que `buildSeedDatabase()` / `resetData()` génèrent **toujours les mêmes données**
(pointages, transmissions, factures) indépendamment du jour d'exécution → tests déterministes.

> ⚠️ La date doit rester un **jour ouvrable** : `isWeekendDate()` (seed.ts) ne génère aucune
> assiduité le week-end. Exécutée un samedi/dimanche réel, une suite sans gel voit les modules
> Présences/Transmissions vides (échecs en cascade sans lien avec le code testé).

## Règles harness — non négociables

Chaque règle découle d'un échec réel constaté pendant la mise au point du gate 104/104.

### R — Scoper `[role="option"]`

**Interdiction de lire ou cliquer les options via `document.querySelectorAll('[role="option"]')` global.**
Un listbox Radix laissé ouvert (un clic synthétique sur une option ne ferme pas le popover,
contrairement à un clic utilisateur) contamine la sélection globale : les options réelles deviennent
la concaténation de TOUS les listbox ouverts. Conséquence constatée : le flux « départ » persistait
`pickup:null` parce que la personne choisie était en réalité une option du filtre de statut resté
ouvert depuis un test précédent.

→ Cibler le listbox de la zone concernée (ex. `departureListboxExpr`, un `<div role="listbox">` qui
contient « Autre personne… ») puis cliquer l'**option scopée** que ce listbox contient.

### S — Pas de sélecteur implicite par attribut

Ne jamais cibler un élément par son attribut implicite non scopé (`input[type="text"]` quand
plusieurs existent, `button` sans contexte). Utiliser un sélecteur explicite unique (`#id`,
`[data-testid]`, `[aria-label]`) **à l'intérieur** de la fiche/zone/carte concernée.

### C — Comparaisons de texte insensibles au case

Normaliser (minuscules, espaces) des deux côtés avant comparaison : le style peut appliquer
`text-transform` et faire différer un texte DOM d'une constante littérale.

### D — Interactions Radix via helper scopé

Ouvrir un liste/sélecteur dialog Radix, attendre que le **listbox de la zone cible** soit présent
(`waitFor`), puis cliquer l'option scopée. Ne jamais cliquer « à la volée après le déclencheur »
sans attendre le rendu du panel.

### F — La date « courante » se lit côté page

`ctx.today` doit être lu dans le **contexte de la page** :
`const today = await ev(\`new Date().toISOString().slice(0, 10)\`)` — jamais côté Node (le process
Node a la date réelle, la page est figée → incohérence : cards affichées ≠ `presentIds` attendus).

### G — Chaque suite réinitialise sa base

Les suites partagent le même profil Chrome → même origine → `localStorage` partagé. Chaque suite
doit réinitialiser sa base en début d'exécution (`resetData()` ou `buildSeedDatabase`) et ne jamais
supposer l'état laissé par une autre suite.

### H — Smoke cold-start avant toute suite

Vite (rolldown) compile à froid : le premier chargement d'une route peut prendre **30 s à plusieurs
minutes** (jusqu'à ~6 min pour `/presences`). Lancer une suite à froid fait échouer par TIMEOUT des
tests dont le mécanisme est pourtant correct (phase 7 T05/T06, phase 2B T11/T12…).

→ Exécuter `node tests/cdp/cdp-coldstart.mjs` **jusqu'à PASS intégral** avant de lancer les suites.
Un FAIL signale un état froid (ou un serveur régénéré) : relancer le warm-up, puis le smoke.

## Smoke cold-start

`tests/cdp/cdp-coldstart.mjs` charge les 9 routes clés dans un onglet dédié (`/json/new`) et vérifie
que chacune monte en < 20 s (seuil paramétrable via `COLDSTART_MAX_MS`). Sortie 0 si tout passe.
Utilise un onglet neuf — jamais `targets.find(page)` (peut retomber sur un onglet d'ancienne suite).

## Commande pour le gate complet

Lancer **une seule suite à la fois** (toutes utilisent le port CDP 9223), routes chaudes :

```bash
node tests/cdp/cdp-coldstart.mjs      # jusqu'à PASS
node tests/cdp/cdp-phase3c.mjs        # 21/21 transmissions
node tests/cdp/cdp-phase8a.mjs        # 10/10 planning enfants
node tests/cdp/cdp-phase8b.mjs        # 10/10 personnel/ratios
node tests/cdp/cdp-phase6.mjs         # 10/10 rôles & permissions
node tests/cdp/cdp-phase3a.mjs        # 12/12 familles
node tests/cdp/cdp-phase3b.mjs        # 14/14 présences/pointage
node tests/cdp/cdp-phase2b.mjs        # 17/17 UX familles
node tests/cdp/cdp-phase7.mjs         # 10/10 contacts/départ
```

**Total attendu : 104/104.**

## Structure

```
tests/cdp/
├── cdp-coldstart.mjs  # smoke cold-start (routes clés)
├── cdp-phase3a.mjs    # 12 tests — familles, migration, responsables
├── cdp-phase2b.mjs    # 17 tests — UX liste/mosaïque, responsive, fiche
├── cdp-phase3b.mjs    # 14 tests — pointage, filtres, fiche enfant
├── cdp-phase3c.mjs    # 21 tests — transmissions complètes (CRUD 6 sections)
├── cdp-phase6.mjs     # 10 tests — rôles & permissions
├── cdp-phase7.mjs     # 10 tests — contacts & départ sécurisé
├── cdp-phase8a.mjs    # 10 tests — planning enfants
├── cdp-phase8b.mjs    # 10 tests — personnel & ratios
└── README.md
```

## Notes

- Les harness utilisent `ws` (WebSocket) pour communiquer avec Chrome CDP.
- Toujours lancer le serveur dev au préalable (`npm run dev -- --port 8080 --strictPort`).
- Les scripts temporaires (`_diag*.mjs`, `_warm*.mjs`) sont **exclus** du repo.