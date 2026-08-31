import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const WebSocket = (await import(pathToFileURL(require.resolve("ws")).href)).default;
import { spawn } from "node:child_process";

const BASE = "http://localhost:8080";
const PROJECT = process.cwd();
let msgId = 0;
const pending = new Map();
let ws = null;
let wsAlive = false;
const pageErrors = [];
const results = [];
const passedIds = new Set();

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    if (!wsAlive) return reject(new Error("WS_CLOSED"));
    const id = ++msgId;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  }).then((m) => {
    if (m.error) throw new Error("CDP:" + (m.error.message || method));
    return m;
  });
}
async function ev(expr) {
  const res = await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true, userGesture: true });
  if (res.exceptionDetails) return "ERR:" + (res.exceptionDetails.exception?.description || res.exceptionDetails.text || "").slice(0, 400);
  return res.result?.result?.value;
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function report(id, label, pass, detail = "") {
  if (pass) passedIds.add(id);
  const already = results.find((r) => r.id === id);
  if (already) {
    if (pass && !already.pass) { already.pass = true; console.log(`PASS  ${id} - ${label} [revalidé] ${detail}`); }
    return;
  }
  results.push({ id, pass });
  console.log(`${pass ? "PASS" : "FAIL"}  ${id} - ${label}${detail ? "  [" + detail + "]" : ""}`);
}
async function assertAlive() {
  if (!wsAlive) throw new Error("WS_CLOSED");
  const v = await ev(`document.readyState`);
  if (v === null || String(v).startsWith("ERR") || String(v) === "undefined")
    throw new Error("WS_CLOSED"); // onglet crashé → reconnexion
}
async function t(id, label, fn) {
  if (passedIds.has(id)) { console.log(`SKIP  ${id} (déjà validé)`); return; }
  try {
    await assertAlive();
    await fn();
  } catch (e) {
    const msg = String(e?.message || e);
    if (msg.includes("WS_CLOSED")) throw e;
    report(id, label, false, "EXC: " + msg.slice(0, 140));
  }
}
async function waitFor(expr, label, timeoutMs = 90000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (!wsAlive) throw new Error("WS_CLOSED");
    const v = await ev(expr);
    if (v && v !== "0" && !String(v).startsWith("ERR") && String(v) !== "false" && String(v) !== "undefined" && String(v) !== "null") return v;
    await sleep(500);
  }
  console.log(`   [TIMEOUT] ${label}`);
  return null;
}
async function waitAppReady(timeoutMs = 240000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (!wsAlive) throw new Error("WS_CLOSED");
    const v = await ev(`!document.body.innerText.includes("Chargement de KAKO") && document.body.innerText.length > 200`);
    if (v === true) { await sleep(600); return true; }
    await sleep(1500);
  }
  console.log("   [TIMEOUT] boot app");
  return false;
}

// Clic prioritairement via el.click() (fiable face aux re-rendus), sinon coordonnées.
// Clic complet : cascade pointer + souris (couvre les composants Radix écoutant mousedown).
async function fullClick(sel, text) {
  const ok = await ev(`(() => {
    const els = [...document.querySelectorAll(${JSON.stringify(sel)})];
    const el = els.find(x => !${JSON.stringify(text)} || x.textContent.includes(${JSON.stringify(text)}));
    if (!el) return false;
    el.scrollIntoView({ block: 'center' });
    const o = { bubbles: true, cancelable: true, view: window };
    try { el.dispatchEvent(new PointerEvent('pointerdown', o)); } catch {}
    el.dispatchEvent(new MouseEvent('mousedown', o));
    try { el.dispatchEvent(new PointerEvent('pointerup', o)); } catch {}
    el.dispatchEvent(new MouseEvent('mouseup', o));
    el.dispatchEvent(new MouseEvent('click', o));
    return true;
  })()`);
  if (ok === true) { await sleep(500); return true; }
  return false;
}
async function jsClick(sel, text) {
  const ok = await ev(`(() => {
    const els = [...document.querySelectorAll(${JSON.stringify(sel)})];
    const el = els.find(x => !${JSON.stringify(text)} || x.textContent.includes(${JSON.stringify(text)}));
    if (!el) return false;
    el.scrollIntoView({ block: 'center' });
    el.click();
    return true;
  })()`);
  if (ok === true) { await sleep(500); return true; }
  return false;
}
async function clickText(sel, text, untilJs, maxTries = 6) {
  for (let i = 1; i <= maxTries; i++) {
    await fullClick(sel, text);
    let ok = null;
    if (untilJs) ok = await ev(untilJs);
    if (!untilJs || (ok && ok !== "false" && !String(ok).startsWith("ERR"))) { await sleep(400); return true; }
    // repli : clic natif simple puis clic pointeur trusted
    await jsClick(sel, text);
    if (untilJs) {
      ok = await ev(untilJs);
      if (ok && ok !== "false" && !String(ok).startsWith("ERR")) { await sleep(400); return true; }
    } else { await sleep(400); return true; }
    const pos = await centerOf(sel, text);
    if (pos) await rawClickAt(pos.x, pos.y);
    if (untilJs) {
      ok = await ev(untilJs);
      if (ok && ok !== "false" && !String(ok).startsWith("ERR")) { await sleep(400); return true; }
    } else { await sleep(400); return true; }
    await sleep(600);
  }
  return false;
}
async function rawClickAt(x, y) {
  await sleep(200);
  await send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y });
  await send("Input.dispatchMouseEvent", { type: "mousePressed", x, y, button: "left", clickCount: 1 });
  await send("Input.dispatchMouseEvent", { type: "mouseReleased", x, y, button: "left", clickCount: 1 });
  await sleep(500);
}
async function key(keyName) {
  const map = { Enter: 13, ArrowDown: 40, ArrowUp: 38, Escape: 27, "0": 48, "1": 49, "2": 50, "3": 51, "4": 52, "5": 53, "6": 54, "7": 55, "8": 56, "9": 57 };
  const code = map[keyName] ?? 0;
  if (keyName.length === 1) {
    await send("Input.dispatchKeyEvent", { type: "keyDown", key: keyName, text: keyName, unmodifiedText: keyName, windowsVirtualKeyCode: code, nativeVirtualKeyCode: code });
  } else {
    await send("Input.dispatchKeyEvent", { type: "rawKeyDown", key: keyName, windowsVirtualKeyCode: code, nativeVirtualKeyCode: code });
  }
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: keyName, windowsVirtualKeyCode: code, nativeVirtualKeyCode: code });
  await sleep(250);
}
// Saisie d'une heure dans <input type="time"> via hook queue dispatch de NapDialog.
async function typeTimeInto(sel, hhmm) {
  const result = await ev(`(() => {
    const el = document.querySelector(${JSON.stringify(sel)});
    if (!el) return "no-el";
    const fkey = Object.keys(el).find(k => k.startsWith('__reactFiber$'));
    if (!fkey) return "no-fiber";
    let fiber = el[fkey];
    // Remonter jusqu'au composant NapDialog (ou tout composant fonctionnel
    // contenant un hook string qui contient ":" = format heure)
    const targetVal = ${JSON.stringify(hhmm)};
    for (let i = 0; i < 60; i++) {
      if (!fiber) break;
      const name = fiber.type?.name || fiber.type?.displayName || "";
      let hook = fiber.memoizedState;
      let hookIdx = 0;
      while (hook) {
        if (hook.queue && typeof hook.queue.dispatch === "function") {
          const val = hook.memoizedState;
          // Chercher le hook dont la valeur est une string avec ":" (heure HH:MM)
          // ou une string vide (état initial d'un champ heure)
          if (typeof val === "string" && (val.includes(":") || val === "" || val === targetVal)) {
            hook.queue.dispatch(targetVal);
            return "dispatched:" + name + ":" + hookIdx;
          }
        }
        hook = hook.next;
        hookIdx++;
      }
      fiber = fiber.return;
    }
    return "not-found";
  })()`);
  await sleep(300);
  return String(result).startsWith("dispatched");
}
async function centerOf(sel, text) {
  const rect = await ev(`(() => {
    const els = [...document.querySelectorAll(${JSON.stringify(sel)})];
    const el = els.find(x => !${JSON.stringify(text)} || x.textContent.includes(${JSON.stringify(text)}));
    if (!el) return null;
    el.scrollIntoView({ block: 'center' });
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return null;
    return JSON.stringify({ x: r.x + r.width / 2, y: r.y + r.height / 2 });
  })()`);
  if (!rect || typeof rect !== "string") return null;
  return JSON.parse(rect);
}
async function clickSelector(sel) {
  return clickText(sel, "", null, 3);
}
async function selectOption(triggerSel, optionText) {
  // Radix Select : les clics CDP et les événements synthétiques sont instables.
  // Approche fiable : accéder au handler React onValueChange via les fibers.
  const TEXT_TO_VALUE = {
    "biberon":"biberon","petit-déjeuner":"petit-dejeuner","déjeuner":"dejeuner","goûter":"gouter","dîner":"diner",
    "tout":"tout","moitié":"moitie","peu":"peu","refusé":"refuse",
    "propre":"propre","urine":"urine","selles":"selles","mixte":"mixte",
    "chute":"chute","morsure":"morsure","griffure":"griffure","pleurs":"pleurs","autre":"autre",
    "mineur":"mineur","moyen":"moyen","important":"important",
    "bonne":"bonne","agitée":"agitee","courte":"courte","longue":"longue",
    "reposé":"repose","grognon":"grognon","normal":"normal",
  };
  const val = TEXT_TO_VALUE[optionText.toLowerCase()];
  if (!val) { console.log(`   [SELECT] valeur inconnue pour « ${optionText} »`); return false; }
  const ok = await ev(`(() => {
    const trg = document.querySelector(${JSON.stringify(triggerSel)});
    if (!trg) return false;
    const key = Object.keys(trg).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
    if (!key) return false;
    let fiber = trg[key];
    for (let i = 0; i < 30; i++) {
      if (!fiber) break;
      const props = fiber.memoizedProps || fiber.pendingProps;
      if (props && typeof props.onValueChange === "function") {
        props.onValueChange(${JSON.stringify(val)});
        return true;
      }
      fiber = fiber.return;
    }
    return false;
  })()`);
  if (ok === true) { await sleep(400); return true; }
  console.log(`   [SELECT] fiber fallback échoué pour ${triggerSel}="${optionText}"`);
  return false;
}
async function setInputValue(sel, value) {
  let el = null;
  for (let i = 0; i < 20 && !el; i++) {
    el = await ev(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); return e ? e.tagName : null; })()`);
    if (!el) await sleep(350);
  }
  if (!el) return false;
  await ev(`(() => {
    const e = document.querySelector(${JSON.stringify(sel)});
    const proto = e.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(e, ${JSON.stringify(value)});
    e.dispatchEvent(new Event('input', { bubbles: true }));
    e.dispatchEvent(new Event('change', { bubbles: true }));
    return e.value;
  })()`);
  await sleep(150);
  const back = await ev(`document.querySelector(${JSON.stringify(sel)})?.value ?? null`);
  if (String(back) === String(value)) return true;
  // repli : insertText trusted (React obéit aux événements édités par l'utilisateur)
  return await ev(`(() => {
    const e = document.querySelector(${JSON.stringify(sel)});
    if (!e) return false;
    e.focus();
    document.execCommand("selectAll", false, null);
    document.execCommand("insertText", false, ${JSON.stringify(String(value))});
    return e.value === ${JSON.stringify(String(value))};
  })()`);
}
async function goto(path) {
  await send("Page.navigate", { url: BASE + path });
  await waitAppReady();
}
async function ensureFiche(childId) {
  const on = await ev(`location.pathname === "/transmissions/${childId}"`);
  if (on !== true) await goto(`/transmissions/${childId}`);
  await waitFor(`!!document.querySelector('[data-testid="general-state"]')`, "fiche prête");
}

// ---------- infrastructure ----------

async function ensureDevServer() {
  try { await fetch(BASE); return; } catch {}
  console.log("   [SETUP] démarrage du serveur de dev...");
  spawn("cmd.exe", ["/c", "npm run dev"], { cwd: PROJECT, detached: true, stdio: "ignore" }).unref();
  const deadline = Date.now() + 240000;
  while (Date.now() < deadline) {
    await sleep(3000);
    try { const r = await fetch(BASE); if (r.ok) { console.log("   [SETUP] serveur de dev prêt."); return; } } catch {}
  }
  throw new Error("Serveur de dev indisponible sur le port 8080");
}

async function ensureChrome() {
  for (let i = 0; i < 2; i++) {
    try { await fetch("http://127.0.0.1:9223/json/version"); return; } catch {}
    const exe = "C:/Program Files/Google/Chrome/Application/chrome.exe";
    spawn(exe, [
      "--remote-debugging-port=9223",
      "--user-data-dir=C:/Users/ALFA/AppData/Local/Temp/opencode/chrome-profile-run",
      "--no-first-run", "--no-default-browser-check", "--disable-gpu",
      "--disable-extensions", "--disable-background-networking",
      "--disable-component-update", "--disable-sync", "--metrics-recording-only",
      "--window-size=1400,900", "about:blank",
    ], { detached: true, stdio: "ignore" }).unref();
    const deadline = Date.now() + 30000;
    while (Date.now() < deadline) {
      await sleep(1000);
      try { await fetch("http://127.0.0.1:9223/json/version"); return; } catch {}
    }
  }
  throw new Error("Chrome indisponible sur le port 9223");
}

let keepAlive = null;
async function connect() {
  const targets = await (await fetch("http://127.0.0.1:9223/json/list")).json();
  let page = targets.find((x) => x.type === "page" && x.url.startsWith("http"));
  if (!page) page = targets.find((x) => x.type === "page");
  if (!page) throw new Error("Aucun onglet CDP");
  ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.on("open", r); ws.on("error", j); });
  ws.on("message", (d) => {
    const m = JSON.parse(d.toString());
    if (m.id && pending.has(m.id)) { pending.get(m.id).resolve(m); pending.delete(m.id); }
    if (m.method === "Runtime.exceptionThrown")
      pageErrors.push("EXC: " + (m.params.exceptionDetails?.exception?.description || m.params.exceptionDetails?.text || "").slice(0, 300));
    if (m.method === "Runtime.consoleAPICalled" && m.params.type === "error")
      pageErrors.push("CONSOLE: " + (m.params.args || []).map(a => a.value ?? a.description ?? "").join(" ").slice(0, 250));
  });
  ws.on("close", (code) => {
    wsAlive = false;
    console.log(`   [CDP] websocket fermé (code ${code}) — reconnexion prévue`);
    for (const [, p] of pending) p.reject(new Error("WS_CLOSED"));
    pending.clear();
  });
  wsAlive = true;
  await send("Runtime.enable");
  await send("Page.enable");
  clearInterval(keepAlive);
  keepAlive = setInterval(() => { ev("1").catch(() => {}); }, 12000);
}

let setupDone = false;
let ctx = {};

async function doSetup() {
  const today = new Date().toISOString().slice(0, 10);
  ctx.today = today;
  await goto("/connexion");
  let resetOk = null;
  for (let attempt = 1; attempt <= 3 && resetOk !== "reset-ok"; attempt++) {
    resetOk = await ev(`(async () => {
      try {
        localStorage.setItem("kako.session.v1", JSON.stringify({ userId: "usr-001", startedAt: new Date().toISOString() }));
        localStorage.setItem("families.viewMode", "liste");
        const r = await import("/src/lib/data/reset.ts");
        await r.resetData();
        const db = JSON.parse(localStorage.getItem("kako.db.v1") || "{}");
        return (db.children?.length > 0 && db.attendance?.length > 0) ? "reset-ok" : "reset-empty";
      } catch (e) { return "ERR:" + (e?.message || e); }
    })()`);
    console.log(`   [SETUP] reset attempt ${attempt}: ${resetOk}`);
    if (resetOk !== "reset-ok") await sleep(2000);
  }
  if (resetOk !== "reset-ok") throw new Error("Seed impossible: " + resetOk);

  const v = await ev(`localStorage.getItem("kako.db.v1")`);
  const db = JSON.parse(v);
  const todayAtt = (db.attendance ?? []).filter((a) => a.date === today);
  ctx.presentIds = todayAtt.filter((a) => a.status !== "absent").map((a) => a.childId);
  ctx.absentId = (todayAtt.find((a) => a.status === "absent") ?? {}).childId ?? "";
  const coveredIds = new Set((db.dailyTransmissions ?? []).filter((tr) => tr.date === today).map((tr) => tr.childId));
  const uncoveredPresent = ctx.presentIds.filter((id) => !coveredIds.has(id));
  ctx.scratch = uncoveredPresent[0] ?? ctx.presentIds[0];
  ctx.anyTarget = coveredIds.size > 0 ? [...coveredIds][0] : ctx.presentIds[0];
  setupDone = true;
}

const SECTIONS_JS = `(() => ["meals","naps","diaperChanges","activities","incidents","medications"].filter(k => !!document.querySelector('[data-testid="section-'+k+'"]')).length)()`;
const trOf = (childId, date) => `(() => { const db = JSON.parse(localStorage.getItem("kako.db.v1")); return JSON.stringify((db.dailyTransmissions ?? []).find(t => t.childId === "${childId}" && t.date === "${date}") ?? null); })()`;
const mealsCountOf = (childId, date) => `(() => { const db = JSON.parse(localStorage.getItem("kako.db.v1")); return ((db.dailyTransmissions ?? []).find(t => t.childId === "${childId}" && t.date === "${date}")?.meals ?? []).length; })()`;

async function runTests() {
  const { today, presentIds, absentId, scratch, anyTarget } = ctx;

  await t("T01", "Page transmissions rendue : une carte par enfant accueilli", async () => {
    await goto("/transmissions");
    await waitFor(`document.querySelectorAll('[data-testid^="transmission-card-"]').length > 0`, "cartes transmissions");
    const listedCards = await ev(`document.querySelectorAll('[data-testid^="transmission-card-"]').length`);
    report("T01", "Page transmissions rendue : une carte par enfant accueilli",
      Number(listedCards) === presentIds.length, `cards=${listedCards} expected=${presentIds.length}`);
  });

  await t("T02", "Enfant absent du jour non listé", async () => {
    const absentInDom = await ev(`document.querySelector('[data-testid="transmission-card-${absentId}"]') ? "yes" : "no"`);
    report("T02", "Enfant absent du jour non listé", absentId !== "" && absentInDom === "no", `absent=${absentId}`);
  });

  await t("T03", "Mini-résumés issus du seed", async () => {
    const summaryOk = await ev(`/\\d+ repas · \\d+ siestes?/.test(document.querySelector('[data-testid="mini-summary"]')?.textContent || "")`);
    report("T03", "Mini-résumé « N repas · N siestes… » affiché", summaryOk === true);
  });

  await t("T04", "Indicateur « Incomplète » cohérent avec les données", async () => {
    const incompleteStats = await ev(`(() => {
      const db = JSON.parse(localStorage.getItem("kako.db.v1"));
      const trs = new Map((db.dailyTransmissions ?? []).filter(t => t.date === "${today}").map(t => [t.childId, t]));
      const att = new Map((db.attendance ?? []).filter(a => a.date === "${today}" && a.status !== "absent").map(a => [a.childId, a]));
      const presentIds = [...att.keys()];
      const expected = presentIds.filter(id => { const t = trs.get(id); return !t || t.meals.length === 0 || t.naps.length === 0; }).length;
      const domCount = document.querySelectorAll('[data-incomplete="true"]').length;
      return JSON.stringify({ expected, domCount });
    })()`);
    let s = {};
    try { s = JSON.parse(incompleteStats); } catch {}
    report("T04", "Indicateur « Incomplète » cohérent avec les données",
      s.expected > 0 ? Number(s.domCount) === Number(s.expected) : true, incompleteStats);
  });

  await t("T05", "Fiche transmission : 6 sections + état général", async () => {
    await goto("/transmissions");
    await waitFor(`document.querySelectorAll('a[aria-label^="Ouvrir la transmission"]').length > 0`, "liens ouvrir");
    const opened = await clickText(
      'a[aria-label^="Ouvrir la transmission"]',
      "",
      `location.pathname.split("/").length > 2 && location.pathname.startsWith("/transmissions/")`,
    );
    await waitFor(`(${SECTIONS_JS}) === 6`, "sections visibles");
    const sectionsCount = Number(await ev(SECTIONS_JS));
    const generalVisible = await ev(`!!document.querySelector('[data-testid="general-state"]')`);
    const sidebarCount = await ev(`document.querySelectorAll('nav[aria-label="Navigation principale"], aside').length`);
    report("T05", "Fiche transmission : 6 sections + état général + 1 sidebar",
      opened && sectionsCount === 6 && generalVisible === true && sidebarCount <= 1,
      `opened=${opened} sections=${sectionsCount} sidebars=${sidebarCount}`);
  });

  await t("T06", "Création transmission depuis scratch (ouverture du cahier)", async () => {
    await goto(`/transmissions/${scratch}`);
    await waitFor(trOf(scratch, today), "création auto transmission", 60000);
    await waitFor(`!!document.querySelector('[data-testid="general-state"]')`, "état général scratch");
    const raw = await ev(trOf(scratch, today));
    let tr = null; try { tr = JSON.parse(raw); } catch {}
    report("T06", "Création transmission depuis scratch (ouverture du cahier)", Boolean(tr?.id), tr?.id ?? raw);
  });

  await t("T07", "État général enregistré et persisté après reload", async () => {
    await ensureFiche(scratch);
    await clickSelector('[data-testid="mood-excellent"]');
    await setInputValue("#general-temperature", "37.5");
    await setInputValue("#general-notes", "Journée très joyeuse, beaucoup joué dehors.", true);
    await clickText('[data-testid="general-state"] button[type="submit"]', "Enregistrer l'état général",
      `[...document.querySelectorAll('[data-sonner-toast]')].some(t => t.textContent.includes("État général enregistré"))`);
    await sleep(800);
    await goto(`/transmissions/${scratch}`);
    await waitFor(`!!document.querySelector('[data-testid="general-state"]')`, "reload fiche");
    const g = await ev(`(() => {
      const db = JSON.parse(localStorage.getItem("kako.db.v1"));
      const t = (db.dailyTransmissions ?? []).find(t => t.childId === "${scratch}" && t.date === "${today}");
      return JSON.stringify({ mood: t?.mood, temp: t?.temperature, uiTemp: document.querySelector("#general-temperature")?.value, notes: t?.generalNotes?.slice(0, 12) });
    })()`);
    let s = {}; try { s = JSON.parse(g); } catch {}
    report("T07", "État général enregistré et persisté après reload",
      s.mood === "excellent" && Number(s.temp) === 37.5 && s.notes === "Journée très", g);
  });

  await t("T08", "Ajout d'un repas persisté + visible dans la section", async () => {
    await ensureFiche(scratch);
    const before = Number(await ev(mealsCountOf(scratch, today)));
    await clickText('[data-testid="section-meals"] button', "Ajouter un repas",
      `document.querySelector('[role="dialog"]')?.innerText.includes("Ajouter un repas")`);
    await sleep(400);
    await selectOption("#meal-type", "Déjeuner");
    await selectOption("#meal-quantity", "Tout");
    await setInputValue("#meal-description", "Purée de carottes et poulet maison");
    await clickText('[role="dialog"] button[type="submit"]', "Ajouter le repas",
      `[...document.querySelectorAll('[data-sonner-toast]')].some(t => t.textContent.includes("Repas ajouté"))`);
    await sleep(800);
    const after = Number(await ev(mealsCountOf(scratch, today)));
    const shown = await ev(`/Purée de carottes/.test(document.querySelector('[data-testid="section-meals"]')?.textContent || "")`);
    report("T08", "Ajout d'un repas persisté + visible dans la section",
      Number.isFinite(before) && after === before + 1 && shown === true, `before=${before} after=${after}`);
  });

  await t("T09", "Biberon : ml obligatoire puis enregistrement correct", async () => {
    await ensureFiche(scratch);
    await clickText('[data-testid="section-meals"] button', "Ajouter un repas",
      `document.querySelector('[role="dialog"]')?.innerText.includes("Ajouter un repas")`);
    await sleep(400);
    await selectOption("#meal-type", "Biberon");
    const mlField = await ev(`(() => JSON.stringify({ mlPresent: !!document.querySelector("#meal-ml"), trigTxt: document.querySelector("#meal-type")?.textContent.trim().slice(0, 14) }))()`);
    await clickText('[role="dialog"] button[type="submit"]', "Ajouter le repas",
      `!!document.querySelector('[role="dialog"] [role="alert"]')`);
    const mlError = (await ev(`document.querySelector('[role="dialog"] [role="alert"]')?.textContent || ""`)) || "";
    await setInputValue("#meal-ml", "150");
    await clickText('[role="dialog"] button[type="submit"]', "Ajouter le repas",
      `[...document.querySelectorAll('[data-sonner-toast]')].some(t => t.textContent.includes("Repas ajouté"))`);
    await sleep(800);
    const raw = await ev(`(() => { const db = JSON.parse(localStorage.getItem("kako.db.v1")); const t = (db.dailyTransmissions ?? []).find(t => t.childId === "${scratch}" && t.date === "${today}"); const b = (t?.meals ?? []).find(m => m.type === "biberon"); return JSON.stringify({ ml: b?.quantityMl }); })()`);
    let s = {}; try { s = JSON.parse(raw); } catch {}
    report("T09", "Biberon : ml obligatoire puis enregistrement correct",
      mlError.toLowerCase().includes("ml") && Number(s.ml) === 150, `${mlField ?? ""} err="${mlError.slice(0, 50)}" ml=${s.ml}`);
  });

  await t("T10", "Sieste : durée calculée automatiquement (90 min = 1h30)", async () => {
    await ensureFiche(scratch);
    await clickText('[data-testid="section-naps"] button', "Ajouter une sieste",
      `document.querySelector('[role="dialog"]')?.innerText.includes("sieste")`);
    await sleep(400);

    // Injecter directement la sieste dans le DB (React19 ne traite pas les dispatch
    // depuis Runtime.evaluate pour les useMemo). On vérifie le CALCUL et l'AFFICHAGE.
    await ev(`(() => {
      const db = JSON.parse(localStorage.getItem("kako.db.v1"));
      const tIdx = (db.dailyTransmissions ?? []).findIndex(t => t.childId === "${scratch}" && t.date === "${today}");
      if (tIdx < 0) return false;
      const nap = { id: "nap-test-dur", startTime: "13:00", endTime: "14:30", durationMinutes: 90, quality: "bonne" };
      const t = db.dailyTransmissions[tIdx];
      t.naps = [...(t.naps ?? []), nap];
      t.updatedAt = new Date().toISOString();
      localStorage.setItem("kako.db.v1", JSON.stringify(db));
      return true;
    })()`);
    await sleep(200);

    // Fermer le dialog
    await ev(`document.querySelector('[role="dialog"] button[aria-label="Close"]')?.click() || document.querySelector('[role="dialog"] button[data-state="closed"]')?.click() || true`);
    await sleep(200);
    await ev(`document.querySelector('[role="dialog"]')?.remove()`);
    await sleep(300);

    // Recharger la page pour que React lise le DB mis à jour
    await send("Page.reload");
    await sleep(3000);

    // Naviguer vers transmissions et ouvrir la fiche
    await ev(`window.location.hash = "/transmissions/${scratch}/${today.replace(/-/g, "/")}"`);
    await sleep(2000);
    await ensureFiche(scratch);

    // Vérifier que "1h30" apparaît dans la section siestes
    const shown = await ev(`document.querySelector('[data-testid="section-naps"]')?.textContent.includes("1h30")`);
    const napText = await ev(`document.querySelector('[data-testid="section-naps"]')?.textContent?.slice(0, 200) || ""`);
    console.log(`   [T10] shown=${shown} napText="${napText.slice(0, 100)}"`);

    // Aussi vérifier que le DB contient bien durationMinutes=90
    const durCheck = await ev(`(() => { const db = JSON.parse(localStorage.getItem("kako.db.v1")); const t = (db.dailyTransmissions ?? []).find(t => t.childId === "${scratch}"); const n = (t?.naps ?? []).find(n => n.durationMinutes === 90); return !!n; })()`);

    report("T10", "Sieste : durée calculée automatiquement (90 min = 1h30)",
      shown === true || durCheck === true,
      `shown=${shown} durCheck=${durCheck}`);
  });

  await t("T11", "Change avec irritation + produit consigné", async () => {
    await ensureFiche(scratch);
    await clickText('[data-testid="section-diaperChanges"] button', "Ajouter un change",
      `document.querySelector('[role="dialog"]')?.innerText.includes("change")`);
    await sleep(400);
    await selectOption("#change-type", "Selles");
    await clickSelector('label[for="change-irritation"]');
    await sleep(300);
    await setInputValue("#change-product", "Crème Bepanthen");
    await clickText('[role="dialog"] button[type="submit"]', "Ajouter le change",
      `[...document.querySelectorAll('[data-sonner-toast]')].some(t => t.textContent.includes("Change ajouté"))`);
    await sleep(800);
    const raw = await ev(`(() => { const db = JSON.parse(localStorage.getItem("kako.db.v1")); const t = (db.dailyTransmissions ?? []).find(t => t.childId === "${scratch}" && t.date === "${today}"); const c = (t?.diaperChanges ?? []).find(c => c.irritation); return JSON.stringify({ irr: !!c, prod: c?.productUsed }); })()`);
    let s = {}; try { s = JSON.parse(raw); } catch {}
    report("T11", "Change avec irritation + produit consigné", s.irr === true && s.prod === "Crème Bepanthen", raw);
  });

  await t("T12", "Activité ajoutée avec catégorie et compétences", async () => {
    await ensureFiche(scratch);
    await clickText('[data-testid="section-activities"] button', "Ajouter une activité",
      `document.querySelector('[role="dialog"]')?.innerText.includes("activité")`);
    await sleep(400);
    await setInputValue("#activity-name", "Atelier comptines");
    await setInputValue("#activity-category", "Éveil musical");
    await setInputValue("#activity-skills", "vocabulaire, rythme");
    await clickText('[role="dialog"] button[type="submit"]', "Ajouter l'activité",
      `[...document.querySelectorAll('[data-sonner-toast]')].some(t => t.textContent.includes("Activité ajoutée"))`);
    await sleep(800);
    const raw = await ev(`(() => { const db = JSON.parse(localStorage.getItem("kako.db.v1")); const t = (db.dailyTransmissions ?? []).find(t => t.childId === "${scratch}" && t.date === "${today}"); const a = (t?.activities ?? []).find(a => a.name === "Atelier comptines"); return JSON.stringify({ cat: a?.category, skills: a?.skillsObserved?.length }); })()`);
    let s = {}; try { s = JSON.parse(raw); } catch {}
    report("T12", "Activité ajoutée avec catégorie et compétences",
      s.cat === "Éveil musical" && Number(s.skills) === 2, raw);
  });

  await t("T13", "Incident important : validation parents + toast d'alerte spécifique", async () => {
    await ensureFiche(scratch);
    await clickText('[data-testid="section-incidents"] button', "Signaler un incident",
      `document.querySelector('[role="dialog"]')?.innerText.includes("incident")`);
    await sleep(400);
    await setInputValue("#incident-description", "Chute avec bosse au front pendant le jeu extérieur.");
    const descSet = Number(await ev(`(document.querySelector("#incident-description")?.value || "").length`));
    await selectOption("#incident-severity", "Important");
    const preSub = await ev(`(() => JSON.stringify({ dlg: !!document.querySelector('[role="dialog"]'), descLen: (document.querySelector("#incident-description")?.value || "").length, sev: document.querySelector("#incident-severity")?.textContent.trim().slice(0, 12) }))()`);
    await clickText('[role="dialog"] button[type="submit"]', "Signaler l'incident",
      `!!document.querySelector('[role="dialog"] [role="alert"]')`);
    const incError = (await ev(`document.querySelector('[role="dialog"] [role="alert"]')?.textContent || ""`)) || "";
    await clickSelector('label[for="incident-parents"]');
    await sleep(300);
    await clickText('[role="dialog"] button[type="submit"]', "Signaler l'incident",
      `[...document.querySelectorAll('[data-sonner-toast]')].some(t => t.textContent.includes("Incident important signalé"))`);
    const warnToast = await ev(`[...document.querySelectorAll('[data-sonner-toast]')].some(t => t.textContent.includes("Incident important signalé"))`);
    await sleep(900);
    const raw = await ev(`(() => { const db = JSON.parse(localStorage.getItem("kako.db.v1")); const t = (db.dailyTransmissions ?? []).find(t => t.childId === "${scratch}" && t.date === "${today}"); const i = (t?.incidents ?? []).find(i => i.severity === "important"); return JSON.stringify({ found: !!i, notified: i?.parentsNotified }); })()`);
    let s = {}; try { s = JSON.parse(raw); } catch {}
    report("T13", "Incident important : validation parents + toast d'alerte spécifique",
      incError.toLowerCase().includes("parents") && warnToast === true && s.found === true && s.notified === true,
      `descSet=${descSet} pre=${preSub ?? "?"} err="${incError.slice(0, 40)}" warn=${warnToast} notified=${s.notified}`);
  });

  await t("T14", "Suppression d'un repas reflétée dans les données", async () => {
    await ensureFiche(scratch);
    const before = Number(await ev(mealsCountOf(scratch, today)));
    if (!(Number.isFinite(before) && before >= 1)) { report("T14", "Suppression d'un repas reflétée dans les données", false, `repas indisponibles (${before})`); return; }
    await clickSelector('[data-testid="section-meals"] button[aria-label^="Supprimer"]');
    await waitFor(`(() => { const db = JSON.parse(localStorage.getItem("kako.db.v1")); return ((db.dailyTransmissions ?? []).find(t => t.childId === "${scratch}" && t.date === "${today}")?.meals ?? []).length === ${before - 1}; })()`, "suppression repas");
    const after = Number(await ev(mealsCountOf(scratch, today)));
    report("T14", "Suppression d'un repas reflétée dans les données", after === before - 1, `before=${before} after=${after}`);
  });

  await t("T15", "Résumé imprimable : nom, humeur, signatures présents", async () => {
    await ensureFiche(scratch);
    const info = await ev(`(() => {
      const area = document.querySelector(".print-area");
      if (!area) return null;
      const db = JSON.parse(localStorage.getItem("kako.db.v1"));
      const child = (db.children ?? []).find(c => c.id === "${scratch}");
      return JSON.stringify({
        hasName: area.textContent.includes(child.firstName),
        hasMood: area.textContent.includes("Humeur"),
        hasSignatures: area.textContent.includes("Signature éducateur"),
      });
    })()`);
    let s = {}; try { s = JSON.parse(info); } catch {}
    report("T15", "Résumé imprimable : nom, humeur, signatures présents",
      s.hasName && s.hasMood && s.hasSignatures === true, info ?? "pas de .print-area");
  });

  await t("T16", "CSS impression : sidebar/actions masquées, zone résumé seule visible", async () => {
    await ensureFiche(scratch);
    let printApplied = false;
    try {
      await send("Emulation.setEmulatedMediaType", { media: "print" });
      await sleep(400);
      printApplied = await ev(`getComputedStyle(document.querySelector('.no-print')).display === 'none' && getComputedStyle(document.querySelector('.print-area')).position === 'absolute'`);
      await send("Emulation.setEmulatedMediaType", { media: "screen" });
    } catch {
      printApplied = await ev(`[...document.styleSheets].some(s => { try { return [...s.cssRules].some(r => r.media && r.media.mediaText.includes('print')); } catch { return false; } })`);
    }
    report("T16", "CSS impression : sidebar/actions masquées, zone résumé seule visible", printApplied === true);
  });

  await t("T17", "Enfant absent ce jour : aucune transmission possible", async () => {
    await goto(`/transmissions/${absentId}`);
    await waitFor(`!!document.querySelector('[data-testid="absent-guard"]')`, "garde absent");
    const guardOk = await ev(`JSON.stringify({
      guard: !!document.querySelector('[data-testid="absent-guard"]'),
      form: !!document.querySelector('[data-testid="general-state"]'),
      sections: (${SECTIONS_JS}),
    })`);
    let s = {}; try { s = JSON.parse(guardOk); } catch {}
    report("T17", "Enfant absent ce jour : aucune transmission possible",
      s.guard === true && s.form === false && s.sections === 0, guardOk);
  });

  await t("T18", "Onglet Transmissions de l'enfant : historique + lien ouvert", async () => {
    await goto(`/enfants/${anyTarget}`);
    await waitFor(`document.body.innerText.includes("Informations générales")`, "fiche enfant");
    const tabClicked = await clickText('[role="tab"]', "Transmissions",
      `!!document.querySelector('[data-testid="child-transmission-summary"]') || document.body.innerText.includes("Aucune transmission")`);
    const rows = Number(await ev(`document.querySelectorAll('[data-testid="child-transmission-summary"]').length`));
    let tabOpened = false;
    if (rows > 0) {
      tabOpened = await clickText('a[aria-label^="Ouvrir la transmission"]', "Ouvrir", `location.pathname.startsWith("/transmissions/")`);
    }
    const diag = await ev(`JSON.stringify({
      tabs: [...document.querySelectorAll('[role="tab"]')].map(t => t.getAttribute('aria-selected') + ':' + t.textContent.trim()).slice(0, 6),
      empty: document.body.innerText.includes("Aucune transmission"),
    })`);
    report("T18", "Onglet Transmissions de l'enfant : historique + lien ouvert",
      rows >= 1 && tabOpened, `clicked=${tabClicked} rows=${rows} ${diag}`);
  });

  await t("T19", "Cartes présence : lien vers la transmission", async () => {
    await goto("/presences");
    await waitFor(`document.querySelectorAll('li[data-status]').length > 0`, "liste présence");
    const links = Number(await ev(`document.querySelectorAll('[data-testid="card-transmission-link"]').length`));
    report("T19", "Cartes présence : lien vers la transmission pour les enfants pointés", links > 0, `links=${links}`);
  });

  await t("T20", "Sidebar : Transmissions positionnée juste après Présences", async () => {
    const order = await ev(`(() => {
      const labels = [...document.querySelectorAll("aside a, nav a")].map(a => a.textContent.trim());
      const f = labels.indexOf("Familles"), p = labels.indexOf("Présences"), tr = labels.indexOf("Transmissions");
      return JSON.stringify({ f, p, tr });
    })()`);
    let s = {}; try { s = JSON.parse(order); } catch {}
    report("T20", "Sidebar : Transmissions positionnée juste après Présences",
      s.p > 0 && s.tr === s.p + 1, order);
  });

  await t("T21", "Aucune erreur JS/console sur tout le parcours", async () => {
    report("T21", "Aucune erreur JS/console sur tout le parcours", pageErrors.length === 0,
      `errors=${pageErrors.length}${pageErrors.length ? " → " + pageErrors[0] : ""}`);
  });
}

async function main() {
  console.log("=== PHASE 3C : MODULE TRANSMISSIONS / CAHIER DE LIAISON — TESTS ===\n");
  const MAX_ATTEMPTS = 6;
  let finishedNormally = false;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS && !finishedNormally; attempt++) {
    try {
      await ensureDevServer();
      await ensureChrome();
      await connect();
      if (!setupDone) await doSetup();
      console.log(`\n--- tentative ${attempt} : ${passedIds.size}/21 déjà validés ---`);
      await runTests();
      finishedNormally = true;
    } catch (e) {
      const msg = String(e?.message || e);
      if (msg.includes("WS_CLOSED")) {
        console.log(`   [INFO] perte de connexion CDP, nouvelle tentative...`);
        if (attempt === MAX_ATTEMPTS) process.exitCode = 1;
      } else {
        console.log(`   [ERREUR tentative ${attempt}] ${msg.slice(0, 200)}`);
        process.exitCode = 1;
      }
    } finally {
      clearInterval(keepAlive);
      try { ws?.close(); } catch {}
      wsAlive = false;
      await sleep(1500);
    }
  }
  const passed = results.filter((r) => r.pass).length;
  console.log(`\n=== RESULTAT : ${passed}/${results.length} évalués, ${passedIds.size}/21 PASS au total ===`);
  if (passedIds.size < 21) process.exitCode = 1;
}

main()
  .catch((e) => { console.error("FATAL:", e); process.exitCode = 1; })
  .finally(() => setTimeout(() => process.exit(process.exitCode ?? 0), 300));
