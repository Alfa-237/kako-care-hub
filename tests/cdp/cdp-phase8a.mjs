import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const WebSocket = (await import(pathToFileURL(require.resolve("ws")).href)).default;

let msgId = 0;
const pending = new Map();
let ws;

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
      (res.exceptionDetails.exception?.description || res.exceptionDetails.text || "").slice(0, 400)
    );
  return res.result?.result?.value;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const BASE = "http://localhost:8080";
const results = [];

function report(id, label, pass, detail = "") {
  results.push({ id, pass });
  console.log(`${pass ? "PASS" : "FAIL"}  ${id} - ${label}${detail ? "  [" + detail + "]" : ""}`);
}

async function waitFor(expr, label, timeoutMs = 30000) {
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
    await sleep(400);
  }
  console.log(`   [TIMEOUT] ${label}`);
  return null;
}

async function jsClick(sel, text) {
  const r = await ev(`(() => {
    const el = [...document.querySelectorAll(${JSON.stringify(sel)})].find(
      (x) => x.textContent.includes(${JSON.stringify(text)}) || (x.getAttribute('aria-label')||'').includes(${JSON.stringify(text)}) || (x.getAttribute('title')||'').includes(${JSON.stringify(text)})
    );
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
    if (el.tagName === 'BUTTON') el.click();
    return 'OK';
  })()`);
  await sleep(500);
  return r === "OK";
}

async function jsClickOption(text) {
  const r = await ev(`(() => {
    const el = [...document.querySelectorAll('[role="option"]')].find((o) => o.textContent.trim().includes(${JSON.stringify(text)}));
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
  await sleep(500);
  return r === "OK";
}

async function setInputValue(sel, value) {
  const back = await ev(`(() => {
    const e = document.querySelector(${JSON.stringify(sel)});
    if (!e) return 'NO';
    const proto = e.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(e, ${JSON.stringify(value)});
    e.dispatchEvent(new Event('input', { bubbles: true }));
    e.dispatchEvent(new Event('change', { bubbles: true }));
    return e.value;
  })()`);
  await sleep(250);
  return back === value;
}

async function goto(path) {
  await send("Page.navigate", { url: BASE + path });
  await sleep(1200);
}

async function setSession(userId) {
  await ev(
    `localStorage.setItem("kako.session.v1", JSON.stringify({ userId: ${JSON.stringify(userId)}, startedAt: new Date().toISOString() })); "ok"`,
  );
}

// Re-seed une base propre et la stocke (inclut plannings + exceptions phase 8A).
async function seedWithFixtures() {
  await ev(`(async () => {
    const mod = await import("/src/lib/data/seed.ts");
    const db = await mod.buildSeedDatabase();
    localStorage.setItem("kako.db.v1", JSON.stringify(db));
    return db.users.length;
  })()`);
}

// Nom de l'onglet « Jour / Semaine » via les boutons de bascule (insensible à la casse).
async function switchView(label) {
  const r = await ev(`(() => {
    const el = [...document.querySelectorAll('button')].find((b) => b.textContent.trim().toLowerCase().includes(${JSON.stringify(label.toLowerCase())}));
    if (!el) return 'NO';
    el.scrollIntoView({ block: 'center' });
    const rect = el.getBoundingClientRect();
    const cx = rect.x + rect.width / 2, cy = rect.y + rect.height / 2;
    for (const t of ['pointerdown','mousedown','pointerup','mouseup','click']) {
      const e = t.startsWith('pointer') ? new PointerEvent(t,{bubbles:true,cancelable:true,button:0,pointerId:1,isPrimary:true,clientX:cx,clientY:cy,view:window}) : new MouseEvent(t,{bubbles:true,cancelable:true,button:0,clientX:cx,clientY:cy,view:window});
      el.dispatchEvent(e);
    }
    return 'OK';
  })()`);
  await sleep(500);
  return r === "OK";
}

// Un dialogue est « fermé » si retiré du DOM OU s'il est passé en état fermé Radix.
async function dialogClosed(sel) {
  const v = await ev(`(() => {
    const d = document.querySelector(${JSON.stringify(sel)});
    if (!d) return true;
    const root = d.closest('[role="dialog"]');
    return !!root && root.getAttribute('data-state') === 'closed';
  })()`);
  return v === true;
}

async function waitClosed(sel, label, ms = 20000) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    if (await dialogClosed(sel)) return true;
    await sleep(300);
  }
  console.log(`   [TIMEOUT] fermeture dialog ${label}`);
  return false;
}

// Compte les enfants attendus attendus depuis la copie localStorage (même logique
// que la page) pour la date donnée.
async function expectedTotal(pageDate) {
  const t = await ev(`(() => {
    const db = JSON.parse(localStorage.getItem("kako.db.v1"));
    const date = ${JSON.stringify(pageDate)};
    const dow = new Date(date + 'T12:00:00').getDay();
    const sched = db.childSchedules || [];
    const exc = (db.scheduleExceptions || []).filter(e => e.date === date);
    const absenceChild = new Set(exc.filter(e => e.type === 'absence').map(e => e.childId));
    let count = 0;
    (db.children || []).forEach(c => {
      if (c.status !== 'Inscrit') return;
      if (absenceChild.has(c.id)) return;
      if (sched.some(s => s.childId === c.id && s.days.includes(dow))) count++;
    });
    return count;
  })()`);
  return Number(t);
}

// Premier enfant inscrit avec un planning (nom complet).
async function scheduledChildName() {
  const t = await ev(`(() => {
    const db = JSON.parse(localStorage.getItem("kako.db.v1"));
    const sched = (db.childSchedules || [])[0];
    if (!sched) return null;
    const c = (db.children || []).find(x => x.id === sched.childId);
    return c ? c.firstName + ' ' + c.lastName : null;
  })()`);
  return t;
}

// ID du premier enfant inscrit avec un planning.
async function firstScheduledChildId() {
  const t = await ev(`(() => {
    const db = JSON.parse(localStorage.getItem("kako.db.v1"));
    const sched = (db.childSchedules || [])[0];
    return sched ? sched.childId : null;
  })()`);
  return t;
}

// Sélectionne un enfant dans un Select Radix via le handler React onValueChange
// (les clics d'option synthétiques n'y mettent pas à jour l'état de manière fiable).
async function selectChildById(triggerSel, id) {
  const r = await ev(`(() => {
    const trg = document.querySelector(${JSON.stringify(triggerSel)});
    if (!trg) return 'NO_TRIGGER';
    const key = Object.keys(trg).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
    if (!key) return 'NO_FIBER';
    let fiber = trg[key];
    for (let i = 0; i < 40; i++) {
      if (!fiber) break;
      const props = fiber.memoizedProps || fiber.pendingProps;
      if (props && typeof props.onValueChange === "function") {
        props.onValueChange(${JSON.stringify(id)});
        return 'OK';
      }
      fiber = fiber.return;
    }
    return 'NO_HANDLER';
  })()`);
  await sleep(400);
  return r === "OK";
}

// Attend que la valeur sélectionnée du Select soit effective (le trigger affiche l'enfant).
async function waitSelectValue(triggerSel, text, ms = 8000) {
  return waitFor(
    `(document.querySelector(${JSON.stringify(triggerSel)})?.textContent || '').includes(${JSON.stringify(text)})`,
    "select value réglé",
    ms,
  );
}

// Dé-coche / re-coche les cases « jours » ouvertes dans un dialogue
// (enable=true → coche toutes les cases non cochées ; false → dé-coche les cochées).
async function toggleAllDays(enable) {
  return ev(`(() => {
    const cbs = [...document.querySelectorAll('[role="dialog"] [role="checkbox"]')];
    for (const cb of cbs) {
      const checked = cb.getAttribute('data-state') === 'checked';
      if (checked === ${enable ? "false" : "true"}) {
        cb.scrollIntoView({ block: 'center' });
        const rect = cb.getBoundingClientRect();
        const cx = rect.x + rect.width / 2, cy = rect.y + rect.height / 2;
        for (const t of ['pointerdown','mousedown','pointerup','mouseup','click']) {
          const e = t.startsWith('pointer') ? new PointerEvent(t,{bubbles:true,cancelable:true,button:0,pointerId:1,isPrimary:true,clientX:cx,clientY:cy,view:window}) : new MouseEvent(t,{bubbles:true,cancelable:true,button:0,clientX:cx,clientY:cy,view:window});
          cb.dispatchEvent(e);
        }
      }
    }
    return 'done';
  })()`);
}

// Nombre de jours cochés restants dans le dialogue.
async function countCheckedDays() {
  return Number(
    await ev(`[...document.querySelectorAll('[role="dialog"] [role="checkbox"]')].filter(c => c.getAttribute('data-state') === 'checked').length`),
  );
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
  });
  await send("Runtime.enable");
  await send("Page.enable");
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `(() => { const RD = Date; const FT = new RD("2026-08-25T10:00:00.000Z").getTime(); const FD = function(...a) { return a.length === 0 ? new RD(FT) : new RD(...a); }; FD.now = () => FT; FD.parse = RD.parse; FD.UTC = RD.UTC; FD.prototype = RD.prototype; Object.setPrototypeOf(FD, RD); Date = FD; })()`,
  });

  console.log("=== PHASE 8A : PLANNING ENFANTS (JOUR / SEMAINE + CAPACITÉS) - TESTS ===\n");

  await goto("/connexion");
  await waitFor(`document.body.innerText.length > 50`, "connexion page");
  await seedWithFixtures();

  // Préchauffe : compile les modules de la page Planning (transformation Vite froide
  // ~15 s) pour que les navigations de test se fassent sur des modules à jour.
  await setSession("usr-001");
  await goto("/planning");
  await waitFor(`document.body.innerText.includes("Planning des enfants")`, "warmup page", 90000);
  await waitFor(
    `/\\d{2}:\\d{2}\\s*–\\s*\\d{2}:\\d{2}/.test(document.body.innerText)`,
    "warmup slots",
    90000,
  );
  await goto("/connexion");

  const PAGE_DATE = "2026-08-25";

  // ---------- T01 : la page Planning se charge en vue jour avec les jauges
  {
    await setSession("usr-001");
    await goto("/planning");
    await waitFor(`document.body.innerText.includes("Planning des enfants")`, "page planning");
    const gauges = await waitFor(
      `document.querySelectorAll('[aria-label="Capacités par section"]').length > 0`,
      "jauges par section",
      15000,
    );
    const gaugeCards = await ev(
      `document.querySelectorAll('[aria-label="Capacités par section"] > div').length`,
    );
    const hasSections = await ev(`document.body.innerText.includes("/") && document.body.innerText.includes("places")`);
    report(
      "T01",
      "Page Planning affichée (vue jour) + jauges de capacité par section",
      gauges && Number(gaugeCards) >= 3 && hasSections,
      `jauges=${gauges} cards=${gaugeCards}`,
    );
  }

  // ---------- T02 : le total attendu affiché correspond aux plannings seed
  {
    const exp = await expectedTotal(PAGE_DATE);
    await waitFor(
      `/\\d{2}:\\d{2}\\s*–\\s*\\d{2}:\\d{2}/.test(document.body.innerText)`,
      "slots prêts T02",
      30000,
    );
    await sleep(400);
    const shown = await ev(
      `(() => { const h=[...document.querySelectorAll('h2')].find(x=>x.textContent.includes('Enfants attendus')); if(!h) return null; const m=h.textContent.match(/(\\d+)/); return m ? m[1] : null; })()`,
    );
    report(
      "T02",
      "Total « Enfants attendus » cohérent avec les plannings seed (~90 % couverture)",
      Number(shown) === exp && exp > 4,
      `affiché=${shown} attendu=${exp}`,
    );
  }

  // ---------- T03 : la vue jour liste les enfants avec créneaux horaires
  {
    const hasSlots = await ev(`/\\d{2}:\\d{2}\\s*–\\s*\\d{2}:\\d{2}/.test(document.body.innerText)`);
    const hasRound = await ev(`(document.body.innerText.match(/\\d+ attendu\\(s\\) \\/ \\d+ places/g)||[]).length > 0`);
    report(
      "T03",
      "Vue jour : créneaux horaires (arrivée–départ) + compteurs par section",
      hasSlots && hasRound,
      `slots=${hasSlots} perSection=${hasRound}`,
    );
  }

  // ---------- T04 : bascule en vue semaine → 7 colonnes jour
  {
    await switchView("Semaine");
    await waitFor(`document.body.innerText.includes("Effectifs prévus par jour")`, "vue semaine");
    const cols = await ev(`document.querySelectorAll('table thead th').length`);
    const hasCounts = await ev(`(document.querySelectorAll('table thead th').length >= 7)`);
    report(
      "T04",
      "Vue semaine : tableau 7 jours avec effectifs prévus",
      Number(cols) >= 7 && hasCounts,
      `colonnes=${cols}`,
    );
    await switchView("Jour");
    await waitFor(`document.body.innerText.includes("Enfants attendus")`, "retour vue jour");
  }

  // ---------- T05 : le dialogue « Planning hebdo » ouvre et référence les jours
  {
    const opened = await jsClick("button", "Planning hebdo");
    await waitFor(`!!document.querySelector('#schedule-child')`, "dialog planning");
    const hasDayLabels = await ev(
      `[...document.querySelectorAll('[role="dialog"] [aria-label]')].some(a => ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'].includes(a.getAttribute('aria-label')))`,
    );
    // sélectionne un enfant dans le SELECT (via le handler React onValueChange)
    const id = await firstScheduledChildId();
    const childName = await scheduledChildName();
    const selected = id ? await selectChildById("#schedule-child", id) : false;
    const showedValue = childName ? await waitSelectValue("#schedule-child", childName) : false;
    report(
      "T05",
      "Dialog « Planning hebdo » : jours de présence affichés + enfant sélectionnable",
      opened && hasDayLabels && selected && showedValue,
      `opened=${opened} days=${hasDayLabels} pick=${selected} value=${showedValue} child=${childName}`,
    );
    await jsClick('[role="dialog"] button', "Annuler");
    await waitClosed("#schedule-child", "(T05)");
  }

  // ---------- T06 : validation — au moins un jour + arrivée < départ
  {
    await jsClick("button", "Planning hebdo");
    await waitFor(`!!document.querySelector('#schedule-child')`, "dialog planning");
    const id = await firstScheduledChildId();
    const selected = id ? await selectChildById("#schedule-child", id) : false;
    await sleep(600);
    // dé-coche tous les jours -> erreur « au moins un jour »
    await toggleAllDays(false);
    await sleep(300);
    let n = await countCheckedDays();
    if (n > 0) {
      await toggleAllDays(false);
      await sleep(300);
      n = await countCheckedDays();
    }
    await jsClick('[role="dialog"] button', "Enregistrer le planning");
    const err1 = await waitFor(
      `document.body.innerText.includes("Au moins un jour de présence")`,
      "message at least one day",
      8000,
    );
    // re-coche au moins un jour + heure invalide (arrivée >= départ)
    await toggleAllDays(true);
    await sleep(200);
    await setInputValue("#schedule-start", "14:00");
    await setInputValue("#schedule-end", "08:00");
    await jsClick('[role="dialog"] button', "Enregistrer le planning");
    const err2 = await waitFor(
      `document.body.innerText.includes("après l'heure d'arrivée") || document.body.innerText.includes("Heure d'arrivée invalide")`,
      "message heures",
      8000,
    );
    await jsClick('[role="dialog"] button', "Annuler");
    await waitClosed("#schedule-child", "(T06)");
    report(
      "T06",
      "Validation planning : ≥1 jour requis + arrivée avant départ",
      selected && err1 && err2,
      `sel=${selected} >=1jour=${err1} heures=${err2}`,
    );
  }

  // ---------- T07 : enregistrement d'un planning persiste dans childSchedules
  {
    const before = Number(
      await ev(`(JSON.parse(localStorage.getItem("kako.db.v1")).childSchedules||[]).length`),
    );
    await jsClick("button", "Planning hebdo");
    await waitFor(`!!document.querySelector('#schedule-child')`, "dialog planning");
    const id = await firstScheduledChildId();
    const selected = id ? await selectChildById("#schedule-child", id) : false;
    await sleep(600);
    await toggleAllDays(true); // s'assure qu'au moins un jour est coché
    await sleep(200);
    await jsClick('[role="dialog"] button', "Enregistrer le planning");
    await waitClosed("#schedule-child", "(T07)");
    await sleep(400);
    const after = Number(
      await ev(`(JSON.parse(localStorage.getItem("kako.db.v1")).childSchedules||[]).length`),
    );
    report(
      "T07",
      "Enregistrement d'un planning heures + jours persisté dans childSchedules",
      selected && (after === before || after === before + 1),
      `picked=${selected} before=${before} after=${after}`,
    );
  }

  // ---------- T08 : ajout d'une exception (départ anticipé) persistée
  {
    const before = Number(
      await ev(`(JSON.parse(localStorage.getItem("kako.db.v1")).scheduleExceptions||[]).length`),
    );
    await jsClick("button", "Ajouter une exception");
    await waitFor(`!!document.querySelector('#exception-child')`, "dialog exception");
    const id = await firstScheduledChildId();
    const childName = await scheduledChildName();
    const selected = id ? await selectChildById("#exception-child", id) : false;
    await waitSelectValue("#exception-child", childName);
    await setInputValue("#exception-date", PAGE_DATE);
    await setInputValue("#exception-end", "14:30");
    await jsClick('[role="dialog"] button', "Enregistrer");
    await waitClosed("#exception-child", "(T08)");
    await sleep(400);
    const after = Number(
      await ev(`(JSON.parse(localStorage.getItem("kako.db.v1")).scheduleExceptions||[]).length`),
    );
    const lastType = await ev(
      `(JSON.parse(localStorage.getItem("kako.db.v1")).scheduleExceptions||[]).slice(-1)[0].type`,
    );
    report(
      "T08",
      "Exception « départ anticipé » créée et persistée (type + horaire)",
      selected && after === before + 1 && lastType === "depart-avance",
      `sel=${selected} before=${before} after=${after} type=${lastType}`,
    );
  }

  // ---------- T09 : éducateur → lecture seule (pas de boutons de modification)
  {
    await setSession("usr-003");
    await goto("/planning");
    await waitFor(`document.body.innerText.includes("Planning des enfants")`, "planning éducateur");
    await waitFor(`document.querySelectorAll('[aria-label="Capacités par section"]').length > 0`, "jauges éducateur", 15000);
    const seesGauges = await ev(`document.querySelectorAll('[aria-label="Capacités par section"] > div').length >= 1`);
    const noScheduleBtn = await ev(
      `![...document.querySelectorAll('button')].some(b => b.textContent.includes("Planning hebdo"))`,
    );
    const noExceptionBtn = await ev(
      `![...document.querySelectorAll('button')].some(b => b.textContent.includes("Ajouter une exception"))`,
    );
    const noRowEdit = await ev(
      `[...document.querySelectorAll('[aria-label^="Exception pour"]')].length === 0`,
    );
    report(
      "T09",
      "Éducateur : planning en lecture seule (planning.view, pas planning.update)",
      seesGauges && noScheduleBtn && noExceptionBtn && noRowEdit,
      `vue=${seesGauges} schedBtn=${noScheduleBtn} excBtn=${noExceptionBtn} rowEdit=${noRowEdit}`,
    );
  }

  // ---------- T10 : la liste des attendus reflète une exception « absence »
  {
    await setSession("usr-001");
    // ajoute une exception absence aujourd'hui pour un enfant planifié
    await ev(`(() => {
      const db = JSON.parse(localStorage.getItem("kako.db.v1"));
      const sched = (db.childSchedules || [])[0];
      if (!sched) return; const now = new Date().toISOString();
      (db.scheduleExceptions = db.scheduleExceptions || []).push({ id: 'exc-cdp-abs', childId: sched.childId, date: ${JSON.stringify(PAGE_DATE)}, type: 'absence', reason: 'Test', createdAt: now, updatedAt: now, isDemo: true });
      localStorage.setItem("kako.db.v1", JSON.stringify(db));
    })()`);
    const beforeTotal = await expectedTotal(PAGE_DATE);
    await goto("/planning");
    await waitFor(`document.body.innerText.includes("Enfants attendus")`, "planning");
    await waitFor(
      `/\\d{2}:\\d{2}\\s*–\\s*\\d{2}:\\d{2}/.test(document.body.innerText)`,
      "slots prêts T10",
      30000,
    );
    await sleep(400);
    const shown = await ev(
      `(() => { const h=[...document.querySelectorAll('h2')].find(x=>x.textContent.includes('Enfants attendus')); if(!h) return null; const m=h.textContent.match(/(\\d+)/); return m ? m[1] : null; })()`,
    );
    report(
      "T10",
      "Une exception « absence » retire l'enfant de la liste des attendus",
      Number(shown) === beforeTotal,
      `attendu=${beforeTotal} affiché=${shown}`,
    );
  }

  const passed = results.filter((r) => r.pass).length;
  console.log(`\nRésultat : ${passed}/${results.length} tests réussis`);
  await ws.close();
  process.exit(passed === results.length ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
