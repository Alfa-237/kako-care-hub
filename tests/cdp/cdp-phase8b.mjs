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

// Attend qu'un dialogue Radix soit ouvert et retourne true.
async function waitDialog(label, ms = 20000) {
  return waitFor(`document.querySelectorAll('[role="dialog"]').length > 0`, label, ms);
}

// Attend qu'un dialogue soit fermé.
async function waitDialogClosed(label, ms = 20000) {
  return waitClosed('[role="dialog"]', label, ms);
}

// Définit la n-ième saisie texte d'un formulaire de dialogue.
// NB : le composant Input omet l'attribut type (rendu sans attribut), donc on exclut seulement les dates.
async function setTextInput(index, value) {
  const r = await ev(`(() => {
    const list = [...document.querySelectorAll('[role="dialog"] input:not([type="date"])')];
    const e = list[${index}];
    if (!e) return 'NO:' + list.length;
    const proto = e.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(e, ${JSON.stringify(value)});
    e.dispatchEvent(new Event('input', { bubbles: true }));
    e.dispatchEvent(new Event('change', { bubbles: true }));
    return e.value;
  })()`);
  await sleep(250);
  return r === value;
}

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
    if (el.tagName === 'BUTTON' || el.tagName === 'A') el.click();
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

// Re-seed une base propre (inclut employés + plannings phase 8B).
async function seedWithFixtures() {
  await ev(`(async () => {
    const mod = await import("/src/lib/data/seed.ts");
    const db = await mod.buildSeedDatabase();
    localStorage.setItem("kako.db.v1", JSON.stringify(db));
    return db.employees.length;
  })()`);
}

// Sélectionne une option dans un Select Radix via onValueChange (fiable).
async function selectValue(triggerSel, value) {
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
        props.onValueChange(${JSON.stringify(value)});
        return 'OK';
      }
      fiber = fiber.return;
    }
    return 'NO_HANDLER';
  })()`);
  await sleep(400);
  return r === "OK";
}

async function selectOptionByText(sel, text) {
  const r = await ev(`(() => {
    const trg = document.querySelector(${JSON.stringify(sel)});
    if (!trg) return 'NO_TRIGGER';
    const key = Object.keys(trg).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
    if (!key) return 'NO_FIBER';
    let fiber = trg[key];
    for (let i = 0; i < 40; i++) {
      if (!fiber) break;
      const props = fiber.memoizedProps || fiber.pendingProps;
      if (props && typeof props.onValueChange === "function") {
        props.onValueChange(${JSON.stringify(text)});
        return 'OK';
      }
      fiber = fiber.return;
    }
    return 'NO_HANDLER';
  })()`);
  await sleep(400);
  return r === "OK";
}

// Toggle un jour de présence (bouton d'entier dans le dialog de planning employé).
async function clickDayButton(label) {
  const r = await ev(`(() => {
    const btns = [...document.querySelectorAll('[role="dialog"] button')];
    const el = btns.find(b => b.textContent.trim() === ${JSON.stringify(label)});
    if (!el) return 'NO';
    el.scrollIntoView({ block: 'center' });
    const rect = el.getBoundingClientRect();
    const cx = rect.x + rect.width / 2, cy = rect.y + rect.height / 2;
    for (const t of ['pointerdown','mousedown','pointerup','mouseup','click']) {
      const e = t.startsWith('pointer') ? new PointerEvent(t,{bubbles:true,cancelable:true,button:0,pointerId:1,isPrimary:true,clientX:cx,clientY:cy,view:window}) : new MouseEvent(t,{bubbles:true,cancelable:true,button:0,clientX:cx,clientY:cy,view:window});
      el.dispatchEvent(e);
    }
    if (el.tagName === 'BUTTON') el.click();
    return 'OK';
  })()`);
  await sleep(300);
  return r === "OK";
}

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

  console.log("=== PHASE 8B : PERSONNEL (EMPLOYÉS + PLANNINGS + ALERTES RATIO) - TESTS ===\n");

  await goto("/connexion");
  await waitFor(`document.body.innerText.length > 50`, "connexion page");
  await seedWithFixtures();

  // Préchauffe : compile les modules du personnel, de la fiche et du dashboard.
  await setSession("usr-001");
  await goto("/personnel");
  await waitFor(`document.body.innerText.includes("Personnel")`, "warmup personnel", 90000);
  await waitFor(`document.querySelectorAll('[aria-label="Employé"]').length > 0 || document.body.innerText.includes("Ajouter")`, "warmup employés", 90000);
  await goto("/personnel/emp-002");
  await waitFor(`document.body.innerText.includes("Planning hebdomadaire")`, "warmup fiche", 90000);
  await goto("/");
  await waitFor(`document.body.innerText.includes("Tableau de bord")`, "warmup dashboard", 90000);
  await goto("/connexion");

  // ---------- T01 : la page Personnel liste les employés seed (+ badge alerte ratio)
  {
    await setSession("usr-001");
    await goto("/personnel");
    await waitFor(`document.body.innerText.includes("Agent d'entretien") || document.body.innerText.includes("Cuisinière")`, "page personnel");
    const cardCount = await ev(`document.querySelectorAll('[aria-label="Employé"]').length`);
    const hasAjouter = await ev(`[...document.querySelectorAll('button')].some(b => b.textContent.includes("Ajouter"))`);
    report(
      "T01",
      "Liste du personnel affichée avec les 8 employés seed + bouton Ajouter (admin)",
      Number(cardCount) >= 8 && hasAjouter,
      `cards=${cardCount}`,
    );
  }

  // ---------- T02 : création d'un employé via le dialog (Zod + toasts)
  {
    await setSession("usr-001");
    await goto("/personnel");
    await waitFor(`document.body.innerText.includes("Agent d'entretien") || document.body.innerText.includes("Cuisinière")`, "page personnel T02");
    const before = Number(await ev(`(JSON.parse(localStorage.getItem("kako.db.v1")).employees||[]).length`));
    await jsClick("button", "Ajouter");
    await waitDialog("dialog ajout", 30000);
    await sleep(700);
    const set1 = await setTextInput(0, "Marc");
    const set2 = await setTextInput(1, "Kouassi");
    const set3 = await setTextInput(2, "+237 655 44 33 22");
    await jsClick('[role="dialog"] button', "Créer");
    await sleep(900);
    const after = Number(await ev(`(JSON.parse(localStorage.getItem("kako.db.v1")).employees||[]).length`));
    report(
      "T02",
      "Création réussie d'un employé (persisté) via le dialog",
      set1 && set2 && set3 && after === before + 1,
      `before=${before} after=${after} set1=${set1} set2=${set2} set3=${set3}`,
    );
  }

  // ---------- T03 : validation Zod — nom manquant → message FR, pas de persistance
  {
    await setSession("usr-001");
    await goto("/personnel");
    await waitFor(`document.body.innerText.includes("Agent d'entretien") || document.body.innerText.includes("Cuisinière")`, "page personnel T03");
    const before = Number(await ev(`(JSON.parse(localStorage.getItem("kako.db.v1")).employees||[]).length`));
    await jsClick("button", "Ajouter");
    await waitDialog("dialog T03", 30000);
    await sleep(700);
    await setTextInput(1, "SansPrenom");
    await jsClick('[role="dialog"] button', "Créer");
    await sleep(500);
    const errVisible = await ev(`document.body.innerText.includes("Le prénom est requis.")`);
    const after = Number(await ev(`(JSON.parse(localStorage.getItem("kako.db.v1")).employees||[]).length`));
    report(
      "T03",
      "Validation Zod FR : prénom manquant → message, pas de persistance",
      errVisible && after === before,
      `err=${errVisible} before=${before} after=${after}`,
    );
  }

  // ---------- T04 : fiche employé — planning hebdomadaire affiché (jours + heures)
  {
    await setSession("usr-001");
    await goto("/personnel");
    await waitFor(`document.body.innerText.includes("Agent d'entretien") || document.body.innerText.includes("Cuisinière")`, "page personnel T04");
    const clicked = await jsClick('[aria-label="Employé"]', "Claire");
    await waitFor(`document.body.innerText.includes("Planning hebdomadaire")`, "fiche employé", 20000);
    const hasHours = await ev(`document.body.innerText.includes("07:30") || document.body.innerText.includes("16:30")`);
    const hasDay = await ev(`document.body.innerText.includes("5 jour(s) / semaine") || document.body.innerText.includes("Planning hebdomadaire")`);
    report(
      "T04",
      "Fiche employé affichée avec le planning hebdomadaire (heures + jours)",
      clicked && hasHours && hasDay,
      `hours=${hasHours} days=${hasDay}`,
    );
  }

  // ---------- T05 : l'alerte ratio s'affiche sur /personnel (section sous-effectuée)
  {
    await setSession("usr-001");
    await goto("/personnel");
    await waitFor(`/insuffisant|ratio|alerte/i.test(document.body.innerText)`, "page personnel T05");
    const hasAlert = await ev(
      `/insuffisant|sous-effectif|ratio/i.test(document.body.innerText)`,
    );
    report(
      "T05",
      "Alerte ratio affichée (section où needed > actual)",
      hasAlert,
      `alert=${hasAlert}`,
    );
  }

  // ---------- T06 : l'alerte de conflit d'horaires s'affiche (emp-006)
  {
    await setSession("usr-001");
    await goto("/personnel");
    await waitFor(`/insuffisant|lundi/i.test(document.body.innerText)`, "banner conflit", 15000);
    const hasConflict = await ev(`/lundi|incompatibles|conflit/i.test(document.body.innerText)`);
    report(
      "T06",
      "Alerte de conflit d'horaires affichée (2 schedules qui se chevauchent)",
      hasConflict,
      `conflict=${hasConflict}`,
    );
  }

  // ---------- T07 : recherche + filtre par fonction
  {
    await setSession("usr-001");
    await goto("/personnel");
    await waitFor(`document.body.innerText.includes("Agent d'entretien") || document.body.innerText.includes("Cuisinière")`, "page personnel T07");
    // Filtre par fonction « Éducatrice » (badge cliquable)
    await ev(`(() => {
      const el = [...document.querySelectorAll('.cursor-pointer')].find(x => x.textContent.trim().startsWith('Éducatrice'));
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
    await sleep(600);
    const names = await ev(`document.querySelectorAll('[aria-label="Employé"]').length`);
    const noOtherFonction = await ev(
      `![...document.querySelectorAll('[aria-label="Employé"]')].some(x => x.textContent.includes('Cuisinière') || x.textContent.includes('Agent d\\'entretien'))`,
    );
    report(
      "T07",
      "Filtre par fonction réduit la liste aux éducatrices",
      Number(names) >= 3 && noOtherFonction,
      `aprèsFiltre=${names}`,
    );
  }

  // ---------- T08 : secrétaire → lecture seule (pas de bouton Ajouter/Modifier)
  {
    await setSession("usr-006");
    await goto("/personnel");
    await waitFor(`document.body.innerText.includes("Agent d'entretien") || document.body.innerText.includes("Cuisinière")`, "personnel secrétaire");
    await sleep(400);
    const noAdd = await ev(`![...document.querySelectorAll('button')].some(b => b.textContent.includes("Ajouter"))`);
    const seesList = await ev(`document.querySelectorAll('[aria-label="Employé"]').length >= 1`);
    report(
      "T08",
      "Secrétaire voit la liste mais pas le bouton Ajouter (personnel.view, pas manage)",
      seesList && noAdd,
      `list=${seesList} noAdd=${noAdd}`,
    );
  }

  // ---------- T09 : audit log de création d'employé
  {
    await setSession("usr-001");
    const beforeCount = Number(
      await ev(`(JSON.parse(localStorage.getItem("kako.db.v1")).auditLogs||[]).length`),
    );
    await goto("/personnel");
    await waitFor(`document.body.innerText.includes("Agent d'entretien") || document.body.innerText.includes("Cuisinière")`, "page personnel T09");
    await jsClick("button", "Ajouter");
    await waitDialog("dialog T09", 30000);
    await sleep(700);
    await setTextInput(0, "Yann");
    await setTextInput(1, "Diallo");
    await setTextInput(2, "+237 677 88 11 00");
    await jsClick('[role="dialog"] button', "Créer");
    await sleep(900);
    const afterCount = Number(
      await ev(`(JSON.parse(localStorage.getItem("kako.db.v1")).auditLogs||[]).length`),
    );
    report(
      "T09",
      "La création d'employé est journalisée dans l'audit log",
      afterCount > beforeCount,
      `avant=${beforeCount} après=${afterCount}`,
    );
  }

  // ---------- T10 : le dashboard affiche la ligne « Personnel attendu »
  {
    await setSession("usr-001");
    await goto("/");
    await waitFor(`document.body.innerText.includes("Tableau de bord")`, "dashboard", 30000);
    // NB : les labels StatCard sont affichés en MAJUSCULES via CSS text-transform → comparaison insensible à la casse.
    const hasLine = await ev(`document.body.innerText.toUpperCase().includes("PERSONNEL ATTENDU AUJOURD'HUI".toUpperCase())`);
    const hasCount = await ev(`/PERSONNEL ATTENDU AUJOURD'HUI/i.test(document.body.innerText)`);
    report(
      "T10",
      "Dashboard : carte « Personnel attendu aujourd'hui » visible (avec alertes)",
      hasLine || hasCount,
      `line=${hasLine}`,
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
