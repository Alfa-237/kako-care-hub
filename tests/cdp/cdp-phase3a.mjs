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
  const res = await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true, userGesture: true });
  if (res.exceptionDetails) return "ERR:" + (res.exceptionDetails.exception?.description || res.exceptionDetails.text || "").slice(0, 400);
  return res.result?.result?.value;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const BASE = "http://localhost:8080";

function report(id, label, pass, detail = "") {
  results.push({ id, pass });
  console.log(`${pass ? "PASS" : "FAIL"}  ${id} - ${label}${detail ? "  [" + detail + "]" : ""}`);
}

async function waitFor(expr, label, timeoutMs = 45000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const v = await ev(expr);
    if (v && v !== "0" && !String(v).startsWith("ERR") && String(v) !== "false" && String(v) !== "undefined") return v;
    await sleep(500);
  }
  console.log(`   [TIMEOUT] ${label}`);
  return null;
}

async function measure(sel, text) {
  const rect = await ev(`(() => {
    const el = [...document.querySelectorAll(${JSON.stringify(sel)})].find(x => x.textContent.includes(${JSON.stringify(text)}));
    if (!el) return null;
    el.scrollIntoView({ block: 'center' });
    const r = el.getBoundingClientRect();
    return JSON.stringify({ x: r.x + r.width / 2, y: r.y + r.height / 2 });
  })()`);
  if (!rect) return null;
  return JSON.parse(rect);
}

async function rawClick(x, y) {
  await sleep(200);
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y });
  await send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", clickCount: 1 });
  await send("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", clickCount: 1 });
  await sleep(500);
}

// Click with retry-until-effect: keeps clicking until `untilJs` evaluates truthy or tries exhausted
async function clickUntil(sel, text, untilJs, maxTries = 6, settleMs = 600) {
  for (let i = 1; i <= maxTries; i++) {
    const pos = await measure(sel, text);
    if (!pos) { await sleep(600); continue; }
    await rawClick(pos.x, pos.y);
    if (untilJs) {
      const ok = await ev(untilJs);
      if (ok && ok !== "false" && !String(ok).startsWith("ERR")) { await sleep(settleMs); return true; }
    } else { await sleep(settleMs); return true; }
  }
  return false;
}

async function typeInto(sel, text) {
  await ev(`(() => { const i = document.querySelector(${JSON.stringify(sel)}); if (i) i.focus(); })()`);
  await sleep(200);
  await send("Input.insertText", { text });
  await sleep(250);
}

async function goto(path) {
  await send("Page.navigate", { url: BASE + path });
  await sleep(1200);
}

async function main() {
  const targets = await (await fetch("http://127.0.0.1:9223/json/list")).json();
  const page = targets.find((t) => t.type === "page");
  ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.on("open", r); ws.on("error", j); });
  ws.on("message", (d) => {
    const m = JSON.parse(d.toString());
    if (m.id && pending.has(m.id)) { pending.get(m.id).resolve(m); pending.delete(m.id); }
    if (m.method === "Runtime.exceptionThrown")
      pageErrors.push("EXC: " + (m.params.exceptionDetails?.exception?.description || m.params.exceptionDetails?.text || ""));
    if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error")
      pageErrors.push("CONSOLE: " + (m.params.args || []).map(a => a.value ?? a.description ?? "").join(" ").slice(0, 300));
  });
  await send("Runtime.enable");
  await send("Page.enable");
  // Figer Date au 25 août 2026 pour des seeds déterministes
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `(() => { const RD = Date; const FT = new RD("2026-08-25T10:00:00.000Z").getTime(); const FD = function(...a) { return a.length === 0 ? new RD(FT) : new RD(...a); }; FD.now = () => FT; FD.parse = RD.parse; FD.UTC = RD.UTC; FD.prototype = RD.prototype; Object.setPrototypeOf(FD, RD); Date = FD; })()`
  });

  console.log("=== PHASE 3A : ENTITE FAMILY + DATA SERVICE - TESTS ===\n");

  // ---- Setup : session admin + vue liste forcee + stockage legacy sans entites Family
  await goto("/connexion");
  await waitFor(`document.body.innerText.length > 50`, "connexion page");
  await ev(`(async () => {
    localStorage.setItem("kako.session.v1", JSON.stringify({ userId: "usr-001", startedAt: new Date().toISOString() }));
    localStorage.setItem("families.viewMode", "liste");
    const mod = await import("/src/lib/data/seed.ts");
    const db = await mod.buildSeedDatabase();
    delete db.families;
    localStorage.setItem("kako.db.v1", JSON.stringify(db));
    return "seeded-legacy";
  })()`);

  // ---- T01 : migration automatique d'un stockage sans entites Family
  await goto("/familles");
  await waitFor(`document.body.innerText.includes("Gestion des familles")`, "familles apres migration");
  await sleep(1000);
  const migrated = await ev(`(() => {
    const db = JSON.parse(localStorage.getItem("kako.db.v1"));
    if (!Array.isArray(db.families)) return "absent";
    const p1 = db.families.find(f => f.id === "par-001");
    return JSON.stringify({ count: db.families.length, par001: p1 ? { name: p1.name, status: p1.status, primary: p1.primaryParentId } : null });
  })()`);
  let m = {};
  try { m = JSON.parse(migrated); } catch {}
  report("T01", "Migration auto : entites Family derivees (24, par-001 actif)", m.count === 24 && m.par001?.name === "Famille Mbarga" && m.par001?.status === "Active", migrated);

  // ---- T02 : rendu de la liste depuis les entites persistees (vue liste => 24 lignes)
  const rows = await ev(`document.querySelectorAll('a[href^="/familles/"]').length`);
  report("T02", "Liste familles rendue depuis les entites (24 lignes)", Number(rows) === 24, `rows=${rows}`);

  // ---- T03 : non-regression bascule vue + persistance
  const t3 = await ev(`(() => {
    const b = document.querySelector('button[aria-label="Vue mosaique"], button[aria-label*="mosa"]');
    if (!b) {
      const alt = [...document.querySelectorAll('button[aria-label]')].find(x => (x.getAttribute('aria-label')||'').toLowerCase().includes('mosai'));
      if (alt) { alt.click(); return "clicked"; }
      return "nobtn";
    }
    b.click();
    return "clicked";
  })()`);
  await sleep(700);
  const cards = await ev(`[...document.querySelectorAll('a')].filter(a => a.textContent.includes('Voir la famille')).length`);
  const stored = await ev(`localStorage.getItem("families.viewMode")`);
  report("T03", "Bascule mosaique operationnelle (non-regression 2B)", t3 === "clicked" && Number(cards) === 24 && stored === "mosaique", `cards=${cards} stored=${stored}`);

  // ---- T04 : creation via le NOUVEAU dialog famille
  await clickUntil('button', 'Vue liste', `[...document.querySelectorAll('button')].some(b => b.textContent.includes('Vue liste') && b.getAttribute('aria-pressed') !== 'true') || [...document.querySelectorAll('button[aria-label]')].some(b => (b.getAttribute('aria-label')||'').toLowerCase().includes('liste'))`, 3);
  await sleep(400);
  await clickUntil('button', 'Ajouter une famille', `!!document.querySelector('#ff-name')`, 4);
  await typeInto("#ff-name", "Famille Test3A");
  await typeInto("#ff-phone", "+237 611223344");
  await typeInto("#ff-email", "test3a@exemple.com");
  await typeInto("#ff-address", "23 rue des Jacarandas, Douala");
  await typeInto("#ff-notes", "Famille creee par le test automatise 3A.");
  await sleep(300);
  await clickUntil('[role="dialog"] button', 'Ajouter la famille', `document.body.innerText.includes("Famille creee") || location.pathname.startsWith("/familles/fam-")`, 4);
  await waitFor(`location.pathname.startsWith("/familles/fam-")`, "navigation vers fiche creee", 15000);
  await sleep(1500);
  const afterCreate = await ev(`JSON.stringify({
    path: location.pathname,
    rec: (() => { const db = JSON.parse(localStorage.getItem('kako.db.v1')); const f = (db.families||[]).find(x => x.name === 'Famille Test3A'); return f ? { id: f.id, status: f.status, notes: (f.notes||'').slice(0,20), primary: f.primaryParentId } : null; })()
  })`);
  let ac = {};
  try { ac = JSON.parse(afterCreate); } catch {}
  report("T04", "Creation famille via dialog Zod -> navigation fiche + persistance",
    String(ac.path || "").startsWith("/familles/fam-") && ac.rec?.status === "Active" && ac.rec?.primary === null,
    afterCreate);

  // ---- T05 : fiche nouvelle famille - CTA responsable principal + Lier desactive
  const famPath = String(ac.path || "");
  const tabSwitched = await clickUntil('[role="tab"]', 'Famille', `(() => { const t=[...document.querySelectorAll('[role=\"tab\"]')].find(x=>x.textContent.trim()==='Famille'); return t && t.getAttribute('aria-selected')==='true'; })()`);
  await sleep(500);
  const ctaVisible = await ev(`[...document.querySelectorAll('button')].some(b => b.textContent.includes('Définir le responsable principal'))`);
  const linkDisabled = await ev(`(() => {
    const b = [...document.querySelectorAll('button')].find(x => x.textContent.includes('Lier un enfant'));
    return b ? b.disabled : null;
  })()`);
  report("T05", "Nouvelle famille : CTA 'Definir le responsable principal' + 'Lier un enfant' desactive",
    tabSwitched === true && ctaVisible === true && linkDisabled === true, `tab=${tabSwitched} cta=${ctaVisible} disabled=${linkDisabled}`);

  // ---- T06 : definition du responsable principal -> patch primaryParentId
  await clickUntil('button', 'Définir le responsable principal', `!!document.querySelector('#pf-first-name')`, 4);
  await typeInto("#pf-first-name", "Ruth");
  await typeInto("#pf-last-name", "Test3A");
  await typeInto("#pf-phone", "+237 699887766");
  await typeInto("#pf-email", "ruth.test3a@exemple.com");
  await sleep(300);
  await clickUntil('[role="dialog"] button', 'Ajouter le responsable', `document.body.innerText.includes("Responsable ajouté") || !!document.querySelector('#pf-first-name') === false`, 4);
  await waitFor(`document.body.innerText.includes("Responsable ajouté")`, "toast responsable", 15000);
  await sleep(1500);
  const primarySet = await ev(`(() => {
    const db = JSON.parse(localStorage.getItem('kako.db.v1'));
    const f = (db.families||[]).find(x => x.name === 'Famille Test3A');
    const p = db.parents.find(x => x.lastName === 'Test3A');
    return JSON.stringify({ primary: f?.primaryParentId, parentExists: !!p, match: !!f?.primaryParentId && f?.primaryParentId === p?.id });
  })()`);
  let ps = {};
  try { ps = JSON.parse(primarySet); } catch {}
  report("T06", "Responsable principal defini -> primaryParentId persiste", ps.match === true, primarySet);

  // ---- T07 : modification famille (statut Inactive) + persistance reload
  await clickUntil('button', 'Modifier', `!!document.querySelector('#ff-status')`, 4);
  // Radix Select : pointerdown requis -> clic reel sur le trigger puis l'option
  await clickUntil('#ff-status', '', `!!document.querySelector('[role="listbox"], [role="option"]')`, 4);
  await sleep(400);
  await clickUntil('[role="option"]', 'Inactive', `[...document.querySelectorAll('[role="option"]')].some(o => o.getAttribute('aria-selected') === 'true' || o.getAttribute('data-state') === 'checked')`, 4);
  await sleep(300);
  await ev(`(() => { const n = document.querySelector('#ff-notes'); if (n) { n.focus(); n.select(); } })()`);
  await send("Input.insertText", { text: "Statut passe a Inactive par le test." });
  await sleep(200);
  await clickUntil('[role="dialog"] button', 'Enregistrer', `document.body.innerText.includes("Famille modifiée")`, 4);
  // Le StatusPill est dans l'onglet Infos : y revenir avant verification
  await clickUntil('[role="tab"]', 'Infos', `(() => { const t=[...document.querySelectorAll('[role=\"tab\"]')].find(x=>x.textContent.trim().startsWith('Infos')); return t && t.getAttribute('aria-selected')==='true'; })()`);
  await sleep(500);
  const pillInactive = await ev(`document.body.innerText.includes("Inactive")`);
  await goto(famPath);
  await waitFor(`document.body.innerText.length > 100`, "reload fiche");
  await sleep(800);
  const persistedInactive = await ev(`(() => {
    const db = JSON.parse(localStorage.getItem('kako.db.v1'));
    const f = (db.families||[]).find(x => x.name === 'Famille Test3A');
    return f?.status;
  })()`);
  const pillAfterReload = await ev(`document.body.innerText.includes("Inactive")`);
  report("T07", "Edition statut->Inactive : StatusPill + persistance apres rechargement",
    pillInactive === true && persistedInactive === "Inactive" && pillAfterReload === true,
    `pill=${pillInactive} stored=${persistedInactive} afterReload=${pillAfterReload}`);

  // ---- T08 : 'Lier un enfant' maintenant active
  await clickUntil('[role="tab"]', 'Famille', `(() => { const t=[...document.querySelectorAll('[role=\"tab\"]')].find(x=>x.textContent.trim()==='Famille'); return t && t.getAttribute('aria-selected')==='true'; })()`);
  await sleep(500);
  const linkEnabledNow = await ev(`(() => {
    const b = [...document.querySelectorAll('button')].find(x => x.textContent.includes('Lier un enfant'));
    return b ? !b.disabled : null;
  })()`);
  report("T08", "'Lier un enfant' active une fois le responsable defini", linkEnabledNow === true, `enabled=${linkEnabledNow}`);

  // ---- T09 : non-regression navigation contexte 2B (?from)
  await goto("/familles/par-001");
  await waitFor(`document.body.innerText.includes("Informations du dossier")`, "fiche par-001");
  await clickUntil('[role="tab"]', 'Famille', `(() => { const t=[...document.querySelectorAll('[role=\"tab\"]')].find(x=>x.textContent.trim()==='Famille'); return t && t.getAttribute('aria-selected')==='true'; })()`);
  await sleep(500);
  await waitFor(`[...document.querySelectorAll('a')].some(a => a.textContent.includes('Mbarga'))`, "lien enfant Mbarga visible");
  await clickUntil('a', 'Mbarga', `location.pathname.startsWith('/enfants/')`, 4);
  await sleep(1200);
  const fromCtx = await ev(`location.pathname.startsWith('/enfants/') && location.search.includes('from=par-001') && [...document.querySelectorAll('button')].some(b => b.textContent.includes('Retour à la famille'))`);
  report("T09", "Non-regression 2B : lien enfant avec contexte ?from=par-001", fromCtx === true);

  // ---- T10 : permissions educateur sur la nouvelle UI
  await ev(`localStorage.setItem("kako.session.v1", JSON.stringify({ userId: "usr-003", startedAt: new Date().toISOString() })); "ok"`);
  await goto("/familles");
  await waitFor(`document.body.innerText.includes("Gestion des familles")`, "edu liste");
  await sleep(900);
  const eduNoAdd = await ev(`!document.body.innerText.includes("Ajouter une famille")`);
  await goto("/familles/par-001");
  await waitFor(`document.body.innerText.includes("Informations du dossier")`, "edu fiche");
  const eduNoEdit = await ev(`![...document.querySelectorAll('button')].some(b => b.textContent.trim() === 'Modifier')`);
  report("T10", "Educateur : ni 'Ajouter une famille' ni bouton Modifier", eduNoAdd === true && eduNoEdit === true, `add=${eduNoAdd} edit=${eduNoEdit}`);

  // ---- T11 : reset.ts - resetData restaure le jeu complet
  await ev(`localStorage.setItem("kako.session.v1", JSON.stringify({ userId: "usr-001", startedAt: new Date().toISOString() })); "ok"`);
  const resetResult = await ev(`(async () => {
    const r = await import("/src/lib/data/reset.ts");
    await r.resetData();
    const db = JSON.parse(localStorage.getItem('kako.db.v1'));
    return JSON.stringify({ families: db.families.length, children: db.children.length });
  })()`);
  let rr = {};
  try { rr = JSON.parse(resetResult); } catch {}
  report("T11", "resetData() reinitialise la base (familles incluses)", rr.families === 24 && rr.children === 24, resetResult);

  // ---- T12 : erreurs console
  const realErrors = pageErrors.filter((e) => !e.includes("favicon"));
  report("T12", "Aucune erreur JS/console sur tout le parcours", realErrors.length === 0, `errors=${realErrors.length}`);
  if (realErrors.length) {
    console.log("\n--- Detail des erreurs ---");
    realErrors.slice(0, 10).forEach((e, i) => console.log(`${i + 1}. ${e.slice(0, 280)}`));
  }

  const passed = results.filter((r) => r.pass).length;
  console.log(`\n=== RESULTAT : ${passed}/${results.length} PASS ===`);
  ws.close();
  process.exit(passed === results.length ? 0 : 1);
}

main().catch((e) => { console.error("FATAL:", e.message); process.exit(1); });