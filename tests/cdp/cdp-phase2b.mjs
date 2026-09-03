import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const WebSocket = (await import(pathToFileURL(require.resolve("ws")).href)).default;

let msgId = 0;
const pending = new Map();
let ws;
const pageErrors = [];
const results = [];

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++msgId;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function ev(expr) {
  const res = await send("Runtime.evaluate", {
    expression: expr,
    awaitPromise: true,
    returnByValue: true,
    userGesture: true,
  });
  if (res.exceptionDetails)
    return (
      "ERR:" +
      (res.exceptionDetails.exception?.description || res.exceptionDetails.text || "").slice(0, 300)
    );
  return res.result?.result?.value;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const BASE = "http://localhost:8080";

function report(id, label, pass, detail = "") {
  results.push({ id, label, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${id} — ${label}${detail ? "  [" + detail + "]" : ""}`);
}

async function waitFor(expr, label, timeoutMs = 45000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const v = await ev(expr);
    if (
      v &&
      v !== "0" &&
      !String(v).startsWith("ERR") &&
      String(v) !== "false" &&
      String(v) !== "undefined"
    )
      return v;
    await sleep(500);
  }
  console.log(`   [TIMEOUT] ${label}`);
  return null;
}

async function clickSel(selector) {
  const r = await ev(`(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    if (!el) return 'NO';
    el.scrollIntoView({ block: 'center' });
    const rect = el.getBoundingClientRect();
    const cx = rect.x + rect.width / 2, cy = rect.y + rect.height / 2;
    for (const t of ['pointerdown','mousedown','pointerup','mouseup','click']) {
      const e = t.startsWith('pointer')
        ? new PointerEvent(t, { bubbles: true, cancelable: true, button: 0, pointerId: 1, isPrimary: true, clientX: cx, clientY: cy, view: window })
        : new MouseEvent(t, { bubbles: true, cancelable: true, button: 0, clientX: cx, clientY: cy, view: window });
      el.dispatchEvent(e);
    }
    return 'OK';
  })()`);
  await sleep(400);
  return r === "OK";
}

async function clickVisible(selector, text) {
  const textMatch = JSON.stringify(text);
  const r = await ev(`(() => {
    const el = [...document.querySelectorAll(${JSON.stringify(selector)})].find(x => (x.textContent||'').includes(${textMatch}));
    if (!el) return 'NO';
    el.scrollIntoView({ block: 'center' });
    const rect = el.getBoundingClientRect();
    const cx = rect.x + rect.width / 2, cy = rect.y + rect.height / 2;
    for (const t of ['pointerdown','mousedown','pointerup','mouseup','click']) {
      const e = t.startsWith('pointer')
        ? new PointerEvent(t, { bubbles: true, cancelable: true, button: 0, pointerId: 1, isPrimary: true, clientX: cx, clientY: cy, view: window })
        : new MouseEvent(t, { bubbles: true, cancelable: true, button: 0, clientX: cx, clientY: cy, view: window });
      el.dispatchEvent(e);
    }
    return 'OK';
  })()`);
  await sleep(400);
  return r === "OK";
}

async function clickUntil(sel, text, untilJs, maxTries = 6, settleMs = 600) {
  const textMatch = text ? JSON.stringify(text) : "null";
  for (let i = 1; i <= maxTries; i++) {
    const r = await ev(`(() => {
      const all = [...document.querySelectorAll(${JSON.stringify(sel)})];
      const el = ${textMatch} ? all.find(x => (x.textContent||'').includes(${textMatch}) || (x.getAttribute('aria-label')||'').includes(${textMatch}) || (x.getAttribute('title')||'').includes(${textMatch})) : all[0];
      if (!el) return 'NO';
      el.scrollIntoView({ block: 'center' });
      const rect = el.getBoundingClientRect();
      const cx = rect.x + rect.width / 2, cy = rect.y + rect.height / 2;
      for (const t of ['pointerdown','mousedown','pointerup','mouseup','click']) {
        const e = t.startsWith('pointer')
          ? new PointerEvent(t, { bubbles: true, cancelable: true, button: 0, pointerId: 1, isPrimary: true, clientX: cx, clientY: cy, view: window })
          : new MouseEvent(t, { bubbles: true, cancelable: true, button: 0, clientX: cx, clientY: cy, view: window });
        el.dispatchEvent(e);
      }
      return 'OK';
    })()`);
    if (r !== "OK") {
      await sleep(600);
      continue;
    }
    if (untilJs) {
      const ok = await ev(untilJs);
      if (ok && ok !== "false" && !String(ok).startsWith("ERR")) {
        await sleep(settleMs);
        return true;
      }
    } else {
      await sleep(settleMs);
      return true;
    }
  }
  return false;
}

async function typeInto(sel, text) {
  await ev(
    `(() => { const i = document.querySelector(${JSON.stringify(sel)}); if (i) i.focus(); })()`,
  );
  await sleep(200);
  await send("Input.insertText", { text });
  await sleep(300);
}

async function setSession(userId) {
  await ev(
    `localStorage.setItem("kako.session.v1", JSON.stringify({ userId: ${JSON.stringify(userId)}, startedAt: new Date().toISOString() })); "ok"`,
  );
}

async function goto(path) {
  await send("Page.navigate", { url: BASE + path });
  await sleep(1500);
}

async function gridCols() {
  const v = await ev(`(() => {
    const card = [...document.querySelectorAll('div.group')].find(d => typeof d.className === 'string' && d.className.includes('p-5'));
    if (!card || !card.parentElement) return -1;
    const t = getComputedStyle(card.parentElement).gridTemplateColumns;
    return t ? t.trim().split(/\\s+/).length : -1;
  })()`);
  return Number(v);
}

async function main() {
  const targets = await (await fetch("http://127.0.0.1:9223/json/list")).json();
  const page = targets.find((t) => t.type === "page");
  ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r, j) => {
    ws.on("open", r);
    ws.on("error", j);
  });
  ws.on("message", (d) => {
    const m = JSON.parse(d.toString());
    if (m.id && pending.has(m.id)) {
      pending.get(m.id).resolve(m);
      pending.delete(m.id);
    }
    if (m.method === "Runtime.exceptionThrown")
      pageErrors.push(m.params.exceptionDetails?.text || "exception");
    if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error")
      pageErrors.push(
        (m.params.args || [])
          .map((a) => a.value || a.description || "")
          .join(" ")
          .slice(0, 200),
      );
  });
  await send("Runtime.enable");
  await send("Page.enable");
  // Figer Date au 25 août 2026 pour des seeds déterministes
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `(() => { const RD = Date; const FT = new RD("2026-08-25T10:00:00.000Z").getTime(); const FD = function(...a) { return a.length === 0 ? new RD(FT) : new RD(...a); }; FD.now = () => FT; FD.parse = RD.parse; FD.UTC = RD.UTC; FD.prototype = RD.prototype; Object.setPrototypeOf(FD, RD); Date = FD; })()`,
  });

  // Setup: seed DB + admin session
  await goto("/connexion");
  await sleep(3000);
  await ev(`(async () => {
    const seed = await import("/src/lib/data/seed.ts");
    const db = await seed.buildSeedDatabase();
    localStorage.setItem("kako.db.v1", JSON.stringify(db));
    localStorage.setItem("kako.session.v1", JSON.stringify({ userId: "usr-001", startedAt: new Date().toISOString() }));
    localStorage.removeItem("families.viewMode");
    return "ok";
  })()`);

  console.log("=== PHASE 2B-UX : SUITE DE TESTS ===\n");

  // ---- T01: default view is list
  await goto("/familles");
  await waitFor(`document.body.innerText.includes("Gestion des familles")`, "familles page");
  await sleep(800);
  const listRows = await ev(`document.querySelectorAll('a[href^="/familles/"]').length`);
  const mosaicDefault = await ev(`document.body.innerText.includes("Voir la famille")`);
  report(
    "T01",
    "Vue par défaut = liste (sans préférence stockée)",
    Number(listRows) > 0 && mosaicDefault !== true,
    `rows=${listRows} mosaic=${mosaicDefault}`,
  );

  // ---- T02: toggle buttons present with aria
  const hasListBtn = await ev(`document.querySelector('button[aria-label="Vue liste"]') != null`);
  const hasGridBtn = await ev(
    `document.querySelector('button[aria-label="Vue mosaïque"]') != null`,
  );
  const pressedList = await ev(
    `document.querySelector('button[aria-label="Vue liste"]').getAttribute('aria-pressed')`,
  );
  report(
    "T02",
    "Bascule Liste/Mosaïque présente (aria-label + aria-pressed)",
    hasListBtn === true && hasGridBtn === true && pressedList === "true",
  );

  // ---- T03: switch to mosaic + localStorage
  await clickSel('button[aria-label="Vue mosaïque"]');
  await sleep(600);
  const cardsCount = await ev(
    `[...document.querySelectorAll('a')].filter(a => a.textContent.includes('Voir la famille')).length`,
  );
  const stored = await ev(`localStorage.getItem("families.viewMode")`);
  report(
    "T03",
    "Bascule mosaïque → cartes visibles + localStorage='mosaique'",
    Number(cardsCount) >= 20 && stored === "mosaique",
    `cards=${cardsCount} stored=${stored}`,
  );

  // ---- T04: persistence after reload
  await goto("/familles");
  await waitFor(`document.body.innerText.includes("Gestion des familles")`, "reload familles");
  await sleep(800);
  const stillMosaic = await ev(`document.body.innerText.includes("Voir la famille")`);
  report("T04", "Persistance : mosaïque conservée après rechargement", stillMosaic === true);

  // ---- T05: search filters mosaic (expected count computed from the app's own algorithm)
  await typeInto('input[aria-label="Rechercher une famille"]', "mbarga");
  await sleep(900);
  const mbargaCards = await ev(
    `[...document.querySelectorAll('a')].filter(a => a.textContent.includes('Voir la famille')).length`,
  );
  const expectedMatches = await ev(`(async () => {
    const mod = await import("/src/lib/business/families.ts");
    const dbRaw = JSON.parse(localStorage.getItem("kako.db.v1"));
    const fams = mod.listFamilies(dbRaw);
    const q = "mbarga";
    return fams.filter(f =>
      f.parent.lastName.toLowerCase().includes(q) ||
      f.members.some(m => (m.firstName + " " + m.lastName).toLowerCase().includes(q)) ||
      f.children.some(c => (c.firstName + " " + c.lastName).toLowerCase().includes(q))
    ).length;
  })()`);
  report(
    "T05",
    `Recherche 'mbarga' filtre la mosaïque (attendu ${expectedMatches})`,
    Number(mbargaCards) === Number(expectedMatches) && Number(mbargaCards) >= 1,
    `cards=${mbargaCards} expected=${expectedMatches}`,
  );

  // ---- T06: switch to list with active search → same filter, input preserved
  await clickSel('button[aria-label="Vue liste"]');
  await sleep(600);
  const inputValue = await ev(
    `document.querySelector('input[aria-label="Rechercher une famille"]').value`,
  );
  const listFiltered = await ev(`document.querySelectorAll('a[href^="/familles/"]').length`);
  const mosaicGone = await ev(`!document.body.innerText.includes("Voir la famille")`);
  await ev(
    `(() => { const i = document.querySelector('input[aria-label=\"Rechercher une famille\"]'); i.focus(); i.select(); })()`,
  );
  await send("Input.insertText", { text: "" });
  await send("Input.dispatchKeyEvent", {
    type: "keyDown",
    code: "Backspace",
    windowsVirtualKeyCode: 8,
  });
  await send("Input.dispatchKeyEvent", {
    type: "keyUp",
    code: "Backspace",
    windowsVirtualKeyCode: 8,
  });
  await sleep(700);
  const listAllAfterClear = await ev(`document.querySelectorAll('a[href^="/familles/"]').length`);
  report(
    "T06",
    "Recherche conservée entre les vues + reset fonctionne",
    inputValue === "mbarga" &&
      Number(listFiltered) === Number(expectedMatches) &&
      mosaicGone === true &&
      Number(listAllAfterClear) > 5,
    `input='${inputValue}' filtered=${listFiltered} all=${listAllAfterClear}`,
  );

  // ---- T07: open family from mosaic → breadcrumb + single sidebar
  await clickSel('button[aria-label="Vue mosaïque"]');
  await sleep(600);
  await clickVisible("a", "Voir la famille");
  await waitFor(`document.body.innerText.includes("Informations du dossier")`, "family fiche");
  await sleep(500);
  const bcExists = await ev(
    `[...document.querySelectorAll('nav')].some(n => (n.getAttribute('aria-label') || '').includes('Ariane'))`,
  );
  const bcLink = await ev(`(() => {
    const nav = [...document.querySelectorAll('nav')].find(n => (n.getAttribute('aria-label') || '').includes('Ariane'));
    return nav ? [...nav.querySelectorAll('a')].some(a => a.textContent.trim() === 'Familles') : false;
  })()`);
  const asides = await ev(`document.querySelectorAll('aside').length`);
  report(
    "T07",
    "Fiche famille : breadcrumb + 1 seule sidebar",
    bcExists === true && bcLink === true && Number(asides) === 1,
    `bc=${bcExists} link=${bcLink} asides=${asides}`,
  );

  // ---- T08: breadcrumb navigates back to list
  await clickVisible('nav[aria-label*="Fil"] a', "Familles");
  await sleep(1200);
  const backOnList = await ev(
    `location.pathname === '/familles' && document.body.innerText.includes('Gestion des familles')`,
  );
  report("T08", "Breadcrumb 'Familles' ramène à la liste", backOnList === true);

  // ---- T09: child link carries from= context (tab Famille first)
  await goto("/familles/par-001");
  await waitFor(`document.body.innerText.includes("Informations du dossier")`, "par-001 fiche");
  await clickVisible("button", "Famille");
  await sleep(600);
  const childLinkClicked = await clickVisible("a", "Mbarga");
  await sleep(1500);
  const urlHasFrom = await ev(
    `location.pathname.startsWith('/enfants/') && location.search.includes('from=par-001')`,
  );
  const backFamilyBtn = await ev(
    `[...document.querySelectorAll('button')].some(b => b.textContent.includes('Retour à la famille'))`,
  );
  report(
    "T09",
    "Lien enfant avec contexte ?from=par-001 + bouton 'Retour à la famille'",
    childLinkClicked === true && urlHasFrom === true && backFamilyBtn === true,
    `clicked=${childLinkClicked} url=${urlHasFrom} btn=${backFamilyBtn}`,
  );

  // ---- T10: back button returns to the family
  await clickVisible("button", "Retour à la famille");
  await sleep(1500);
  const returnedToFamily = await ev(`location.pathname === '/familles/par-001'`);
  report("T10", "'Retour à la famille' → retour fiche par-001", returnedToFamily === true);

  // ---- T11: direct child URL without from → classic back to list (no regression)
  await goto("/enfants/enf-001");
  await waitFor(`document.body.innerText.includes("Modifier")`, "enf-001 fiche");
  const backListBtn = await ev(
    `[...document.querySelectorAll('a')].some(a => a.textContent.includes('Retour à la liste'))`,
  );
  report(
    "T11",
    "Accès direct enfant sans ?from → 'Retour à la liste' (non-régression)",
    backListBtn === true,
  );

  // ---- T12: edit + save in family context → auto-return
  await goto("/enfants/enf-001?from=par-001");
  await waitFor(`document.body.innerText.includes("Modifier")`, "enf-001 fiche ctx");
  await clickVisible("button", "Modifier");
  await waitFor(`document.querySelector('[role="dialog"]') != null`, "edit dialog");
  await sleep(500);
  await clickVisible('[role="dialog"] button', "Enregistrer");
  const editToast = await waitFor(
    `document.body.innerText.includes("Enfant modifié")`,
    "edit toast",
    15000,
  );
  await sleep(1000);
  const autoReturnUrl = await ev(`location.pathname === '/familles/par-001'`);
  report(
    "T12",
    "Sauvegarde enfant en contexte famille → retour auto fiche famille",
    editToast != null && autoReturnUrl === true,
    `toast=${editToast != null} url=${autoReturnUrl}`,
  );

  // ---- T13: educateur permissions on new UI
  await setSession("usr-003");
  await goto("/familles");
  await waitFor(`document.body.innerText.includes("Gestion des familles")`, "edu familles");
  await sleep(800);
  const eduAddBtn = await ev(`document.body.innerText.includes("Ajouter une famille")`);
  const eduToggle = await ev(`document.querySelector('button[aria-label="Vue mosaïque"]') != null`);
  await goto("/familles/par-001");
  await waitFor(`document.body.innerText.includes("Informations du dossier")`, "edu fiche");
  const eduLinkChild = await ev(`document.body.innerText.includes("Lier un enfant")`);
  report(
    "T13",
    "Éducateur : bascule visible, pas d'Ajouter/Lier (permissions)",
    eduAddBtn === false && eduToggle === true && eduLinkChild === false,
    `add=${eduAddBtn} toggle=${eduToggle} link=${eduLinkChild}`,
  );

  // ---- restore admin for responsive tests
  await setSession("usr-001");
  await goto("/familles");
  await waitFor(`document.body.innerText.includes("Gestion des familles")`, "admin familles again");
  await sleep(600);
  await clickSel('button[aria-label="Vue mosaïque"]');
  await sleep(600);

  // ---- T14/T15/T16: responsive columns desktop/tablet/mobile
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1280,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await sleep(800);
  const colsDesktop = await gridCols();
  await send("Emulation.setDeviceMetricsOverride", {
    width: 800,
    height: 900,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await sleep(800);
  const colsTablet = await gridCols();
  await send("Emulation.setDeviceMetricsOverride", {
    width: 375,
    height: 700,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await sleep(800);
  const colsMobile = await gridCols();
  await send("Emulation.clearDeviceMetricsOverride");
  report(
    "T14",
    "Grille responsive desktop ≥1024px → 3 colonnes",
    colsDesktop === 3,
    `cols=${colsDesktop}`,
  );
  report(
    "T15",
    "Grille responsive tablette ≥640px → 2 colonnes",
    colsTablet === 2,
    `cols=${colsTablet}`,
  );
  report(
    "T16",
    "Grille responsive mobile <640px → 1 colonne",
    colsMobile === 1,
    `cols=${colsMobile}`,
  );

  // ---- console errors
  const realErrors = pageErrors.filter((e) => !e.includes("favicon"));
  report(
    "T17",
    "Aucune erreur JS/console sur tout le parcours",
    realErrors.length === 0,
    `errors=${realErrors.length}`,
  );
  if (realErrors.length) {
    console.log("\n--- Détail des erreurs console ---");
    realErrors.slice(0, 15).forEach((e, i) => console.log(`${i + 1}. ${String(e).slice(0, 300)}`));
  }

  // summary
  const passed = results.filter((r) => r.pass).length;
  console.log(`\n=== RÉSULTAT : ${passed}/${results.length} PASS ===`);
  ws.close();
  process.exit(passed === results.length ? 0 : 1);
}

main().catch((e) => {
  console.error("FATAL:", e.message);
  process.exit(1);
});
