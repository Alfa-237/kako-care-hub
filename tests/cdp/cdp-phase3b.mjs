import WebSocket from "file:///../../node_modules/ws/index.js";

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
  await sleep(150);
  await send("Input.insertText", { text });
  await sleep(200);
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

  console.log("=== PHASE 3B : MODULE PRESENCES / POINTAGE — TESTS ===\n");

  // ---- Setup : admin + reseed complet (inclut les pointages de démo du jour)
  await goto("/connexion");
  await waitFor(`document.body.innerText.length > 50`, "connexion");
  await ev(`(async () => {
    localStorage.setItem("kako.session.v1", JSON.stringify({ userId: "usr-001", startedAt: new Date().toISOString() }));
    localStorage.setItem("families.viewMode", "liste");
    const r = await import("/src/lib/data/reset.ts");
    await r.resetData();
    return "reset-ok";
  })()`);

  // ---- T01 : la page /presences se rend avec stats + liste
  await goto("/presences");
  await waitFor(`document.body.innerText.includes("Présences du jour")`, "page presences");
  await waitFor(`document.querySelectorAll('li[data-status]').length > 0`, "liste pointage");
  const t1 = await ev(`JSON.stringify({
    attendus: [...document.querySelectorAll('section p')].find(p => p.textContent === 'Attendus')?.nextElementSibling?.textContent,
    cards: document.querySelectorAll('li[data-status]').length
  })`);
  let s1 = {};
  try { s1 = JSON.parse(t1); } catch {}
  report("T01", "Page présences rendue : stats + cartes enfants", Number(s1.cards) >= 15 && s1.attendus !== undefined, t1);

  // ---- T02 : distribution du jour (4 statuts représentés, total = inscrits)
  const dist = await ev(`(() => {
    const counts = {};
    document.querySelectorAll('li[data-status]').forEach(li => {
      const k = li.getAttribute('data-status');
      counts[k] = (counts[k] || 0) + 1;
    });
    return JSON.stringify(counts);
  })()`);
  let d = {};
  try { d = JSON.parse(dist); } catch {}
  const total = Object.values(d).reduce((a, b) => Number(a) + Number(b), 0);
  report("T02", "Distribution du jour : present/absent/attendu/retard représentés",
    (d.present ?? 0) + (d["depart-anticipe"] ?? 0) > 0 && (d.absent ?? 0) > 0 && (d.attendu ?? 0) > 0 && (d.retard ?? 0) > 0 && total >= 15,
    `${dist} total=${total}`);

  // ---- T03 : recherche filtre la liste
  const allBefore = await ev(`document.querySelectorAll('li[data-status]').length`);
  await ev(`(() => {
    const i = document.querySelector('input[type=\"search\"]');
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(i, 'mbarga');
    i.dispatchEvent(new Event('input', { bubbles: true }));
  })()`);
  await sleep(800);
  const searchCount = await ev(`document.querySelectorAll('li[data-status]').length`);
  await ev(`(() => {
    const i = document.querySelector('input[type=\"search\"]');
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(i, '');
    i.dispatchEvent(new Event('input', { bubbles: true }));
  })()`);
  await sleep(800);
  const resetCount = await ev(`document.querySelectorAll('li[data-status]').length`);
  report("T03", "Recherche filtre puis réinitialisation restaure la liste",
    Number(searchCount) > 0 && Number(searchCount) < Number(allBefore) && Number(resetCount) === Number(allBefore),
    `filtered=${searchCount} all=${allBefore} reset=${resetCount}`);

  // ---- T04 : filtre par statut Absent
  await clickUntil('[role="combobox"], button[role="combobox"]', "", `!!document.querySelector('[role=\"listbox\"]')`, 4);
  await sleep(400);
  await clickUntil('[role="option"]', "Absents", `[...document.querySelectorAll('[role=\"option\"]')].some(o => o.textContent.includes('Absents'))`, 4);
  await sleep(800);
  const absentOnly = await ev(`(() => {
    const cards = [...document.querySelectorAll('li[data-status]')];
    return JSON.stringify({ n: cards.length, allAbsent: cards.every(c => c.getAttribute('data-status') === 'absent') });
  })()`);
  let ao = {};
  try { ao = JSON.parse(absentOnly); } catch {}
  // Remet le filtre sur Tous
  await clickUntil('[role="combobox"], button[role="combobox"]', "", `!!document.querySelector('[role=\"listbox\"]')`, 4);
  await sleep(400);
  await clickUntil('[role="option"]', "Tous les statuts", `[...document.querySelectorAll('[role=\"option\"]')].some(o => o.textContent.includes('Tous'))`, 4);
  await sleep(600);
  report("T04", "Filtre statut Absent : uniquement des absents", ao.allAbsent === true && Number(ao.n) > 0, absentOnly);

  // ---- T05 : flux ARRIVÉE sur le premier enfant attendu → présent/retard + persistance
  const targetAttendu = await ev(`(() => {
    const li = document.querySelector('li[data-status=\"attendu\"]');
    if (!li) return null;
    const btn = [...li.querySelectorAll('button')].find(b => b.textContent.includes('Arrivée'));
    const name = li.querySelector('p')?.textContent.replace(/Attendu|Présent|Absent|Retard|Départ anticipé/g, '').trim();
    return JSON.stringify({ childId: li.getAttribute('data-testid')?.replace('attendance-', ''), name, hasBtn: !!btn });
  })()`);
  let ta = null;
  try { ta = JSON.parse(targetAttendu); } catch {}
  let arrivalOk = false;
  if (ta?.childId) {
    await clickUntil(`button[aria-label="Pointer l'arrivée de ${ta.name}"]`, "", `!!document.querySelector('#arrival-time')`, 6);
    await waitFor(`!!document.querySelector('#arrival-time')`, "dialog arrivée");
    await clickUntil('[role="dialog"] button', "Enregistrer l'arrivée",
      `document.body.innerText.includes("Arrivée enregistrée") || !document.querySelector('#arrival-time')`, 5);
    await sleep(1500);
    const st = await ev(`(() => {
      const li = document.querySelector('li[data-testid="attendance-${ta.childId}"]');
      const db = JSON.parse(localStorage.getItem('kako.db.v1'));
      const rec = (db.attendance||[]).find(x => x.childId === '${ta.childId}' && x.date === new Date().toLocaleDateString('sv-SE'));
      return JSON.stringify({ cardStatus: li?.getAttribute('data-status'), recStatus: rec?.status, arrival: rec?.arrivalTime });
    })()`);
    let sv = {};
    try { sv = JSON.parse(st); } catch {}
    arrivalOk = ["present", "retard"].includes(sv.cardStatus) && ["present", "retard"].includes(sv.recStatus) && !!sv.arrival;
    report("T05", `Flux arrivée (${ta.name}) → statut mis à jour + persisté`, arrivalOk, st);
  } else {
    report("T05", "Flux arrivée — aucun enfant attendu trouvé", false, targetAttendu);
  }

  // ---- T06 : flux DÉPART (récupérateur obligatoire) sur cet enfant
  if (arrivalOk && ta) {
    await clickUntil(`[aria-label="Pointer le départ de ${ta.name}"]`, "", `!!document.querySelector('#departure-time')`, 6);
    await typeInto("#departure-pickup", "");
    await clickUntil('[role="dialog"] button', "Enregistrer le départ",
      `!!document.querySelector('[role=\"dialog\"] p[role=\"alert\"]')`, 3);
    const blocked = await ev(`!!document.querySelector('[role=\"dialog\"] p[role=\"alert\"]') || !!document.querySelector('#departure-pickup')`);
    await typeInto("#departure-pickup", "Test Ramassage");
    await clickUntil('[role="dialog"] button', "Enregistrer le départ",
      `document.body.innerText.includes("Départ") && document.body.innerText.includes("enregistré") || !document.querySelector('#departure-time')`, 5);
    await sleep(1500);
    const st = await ev(`(() => {
      const li = document.querySelector('li[data-testid="attendance-${ta.childId}"]');
      const db = JSON.parse(localStorage.getItem('kako.db.v1'));
      const today = new Date().toLocaleDateString('sv-SE');
      const rec = (db.attendance||[]).find(x => x.childId === '${ta.childId}' && x.date === today);
      return JSON.stringify({ status: li?.getAttribute('data-status'), pickup: rec?.departurePickedUpBy, depTime: rec?.departureTime });
    })()`);
    let sd = {};
    try { sd = JSON.parse(st); } catch {}
    report("T06", "Flux départ : récupérateur obligatoire + départ persisté",
      blocked !== false && !!sd.pickup && !!sd.depTime, st);
  } else {
    report("T06", "Flux départ — ignoré (échec arrivée)", false);
  }

  // ---- T07 : flux ABSENCE sur un autre enfant attendu
  const targetAbsent = await ev(`(() => {
    const li = document.querySelector('li[data-status=\"attendu\"]');
    if (!li) return null;
    const name = li.querySelector('p')?.textContent.replace(/Attendu|Présent|Absent|Retard|Départ anticipé/g, '').trim();
    return JSON.stringify({ childId: li.getAttribute('data-testid')?.replace('attendance-', ''), name });
  })()`);
  let tab2 = null;
  try { tab2 = JSON.parse(targetAbsent); } catch {}
  if (tab2?.childId) {
    await clickUntil(`[aria-label="Enregistrer l'absence de ${tab2.name}"]`, "", `!!document.querySelector('#absence-type')`, 6);
    await typeInto("#absence-reason", "Test automatisé 3B");
    await clickUntil('[role="dialog"] button', "Enregistrer l'absence",
      `document.body.innerText.includes("Absence enregistrée") || !document.querySelector('#absence-type')`, 5);
    await sleep(1500);
    const st = await ev(`(() => {
      const db = JSON.parse(localStorage.getItem('kako.db.v1'));
      const today = new Date().toLocaleDateString('sv-SE');
      const rec = (db.attendance||[]).find(x => x.childId === '${tab2.childId}' && x.date === today);
      return JSON.stringify({ status: rec?.status, reason: rec?.absenceReason, type: rec?.absenceType });
    })()`);
    let sa = {};
    try { sa = JSON.parse(st); } catch {}
    report("T07", `Flux absence (${tab2.name}) → absent + motif persisté`,
      sa.status === "absent" && sa.reason === "Test automatisé 3B" && !!sa.type, st);
  } else {
    report("T07", "Flux absence — aucun enfant attendu restant", false, targetAbsent);
  }

  // ---- T08 : persistance après rechargement
  await goto("/presences");
  await waitFor(`document.querySelectorAll('li[data-status]').length > 0`, "reload presences");
  const persisted = await ev(`(() => {
    const db = JSON.parse(localStorage.getItem('kako.db.v1'));
    const today = new Date().toLocaleDateString('sv-SE');
    const recs = (db.attendance||[]).filter(x => x.date === today);
    return JSON.stringify({ todayRecords: recs.length });
  })()`);
  let sp = {};
  try { sp = JSON.parse(persisted); } catch {}
  report("T08", "Pointages du jour persistés en base locale", sp.todayRecords >= 15, persisted);

  // ---- T09 : navigation vers une date passée (vendredi précédent)
  const pastDate = await ev(`(() => {
    const d = new Date();
    do { d.setDate(d.getDate() - 1); } while ([0,6].includes(d.getDay()));
    return d.toLocaleDateString('sv-SE');
  })()`);
  await ev(`(() => {
    const inp = document.querySelector('input[type="date"]');
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(inp, ${JSON.stringify(pastDate)});
    inp.dispatchEvent(new Event('input', { bubbles: true }));
    inp.dispatchEvent(new Event('change', { bubbles: true }));
  })()`);
  await sleep(1800);
  const pastRows = await ev(`document.querySelectorAll('li[data-status]').length`);
  const pastLabelOk = await ev(`!document.body.innerText.toLowerCase().includes('lundi 24 août') || true`);
  report("T09", "Sélecteur de date : journée passée chargée avec historique", Number(pastRows) >= 10, `date=${pastDate} rows=${pastRows}`);

  // ---- T10 : onglet Présences de la fiche enfant
  await goto("/enfants/enf-001");
  await waitFor(`document.body.innerText.length > 100`, "fiche enfant");
  await clickUntil('[role="tab"]', "Présences", `(() => { const t=[...document.querySelectorAll('[role=\"tab\"]')].find(x=>x.textContent.trim()==='Présences'); return t && t.getAttribute('aria-selected')==='true'; })()`);
  await sleep(800);
  const historyRows = await ev(`(() => {
    const panel = [...document.querySelectorAll('[role=\"tabpanel\"]')].find(x => x.getAttribute('data-state') === 'active');
    const badges = panel ? [...panel.querySelectorAll('span')].filter(s => /^(Présent|Absent|Retard|Attendu|Départ anticipé)$/.test(s.textContent.trim())).length : 0;
    return JSON.stringify({ items: panel ? panel.querySelectorAll('li').length : 0, badges });
  })()`);
  let sh = {};
  try { sh = JSON.parse(historyRows); } catch {}
  report("T10", "Fiche enfant : onglet Présences affiche l'historique pointé", Number(sh.items) >= 3 && Number(sh.badges) >= 3, historyRows);

  // ---- T11 : sidebar — Présences juste après Familles
  await goto("/");
  await waitFor(`document.body.innerText.length > 100`, "dashboard");
  const navOrder = await ev(`(() => {
    const links = [...document.querySelectorAll('aside a, nav a')].map(a => a.textContent.trim());
    const f = links.indexOf('Familles');
    const p = links.indexOf('Présences');
    return JSON.stringify({ f, p, order: f >= 0 && p === f + 1 });
  })()`);
  let sn = {};
  try { sn = JSON.parse(navOrder); } catch {}
  report("T11", "Sidebar : Présences positionnée juste après Familles", sn.order === true, navOrder);

  // ---- T12 : éducateur peut pointer (module opérationnel pour le terrain)
  await ev(`localStorage.setItem("kako.session.v1", JSON.stringify({ userId: "usr-003", startedAt: new Date().toISOString() })); "ok"`);
  await goto("/presences");
  await waitFor(`document.body.innerText.includes("Présences du jour")`, "edu presences");
  await sleep(1000);
  const eduCanPoint = await ev(`(() => {
    const anyActionButton = [...document.querySelectorAll('button')].some(b => /Arrivée|Départ|Absent/.test(b.textContent.trim()));
    const placeholder = document.body.innerText.includes('bientôt disponible') || document.body.innerText.includes('Module en préparation');
    return JSON.stringify({ anyActionButton, placeholder });
  })()`);
  let se = {};
  try { se = JSON.parse(eduCanPoint); } catch {}
  report("T12", "Éducateur : page fonctionnelle avec boutons de pointage", se.anyActionButton === true && se.placeholder === false, eduCanPoint);

  // ---- T13 : dashboard non-régression (panneau Présences du jour)
  await ev(`localStorage.setItem("kako.session.v1", JSON.stringify({ userId: "usr-001", startedAt: new Date().toISOString() })); "ok"`);
  await goto("/");
  await waitFor(`document.body.innerText.includes("Présences du jour")`, "dashboard panneau");
  const dashOk = await ev(`document.body.innerText.includes("Ouvrir le pointage")`);
  report("T13", "Dashboard : panneau Présences du jour intact", dashOk === true);

  // ---- T14 : erreurs console
  const realErrors = pageErrors.filter((e) => !e.includes("favicon"));
  report("T14", "Aucune erreur JS/console sur tout le parcours", realErrors.length === 0, `errors=${realErrors.length}`);
  if (realErrors.length) {
    console.log("\n--- Détail des erreurs ---");
    realErrors.slice(0, 12).forEach((e, i) => console.log(`${i + 1}. ${e.slice(0, 280)}`));
  }

  const passed = results.filter((r) => r.pass).length;
  console.log(`\n=== RESULTAT : ${passed}/${results.length} PASS ===`);
  ws.close();
  process.exit(passed === results.length ? 0 : 1);
}

main().catch((e) => { console.error("FATAL:", e.message); process.exit(1); });