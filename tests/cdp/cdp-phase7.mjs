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

// Clic JavaScript fiable (type: boutons, Radix tabs, selects, options).
// Radix (tabs/select) ne réagit pas aux clics souris bruts CDP ; on dispatche
// la séquence pointer/mouse/click complète sur l'élément cible.
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

async function jsClickScoped(liText, title) {
  const r = await ev(`(() => {
    const li = [...document.querySelectorAll('li')].find((x) => x.textContent.includes(${JSON.stringify(liText)}));
    if (!li) return 'NO';
    const el = [...li.querySelectorAll('button')].find((b) => (b.getAttribute('title')||'').includes(${JSON.stringify(title)}));
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

async function typeInto(sel, text) {
  await ev(
    `(() => { const i = document.querySelector(${JSON.stringify(sel)}); if (i) i.value=''; i.focus(); })()`,
  );
  await sleep(200);
  await send("Input.insertText", { text });
  await sleep(250);
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

async function seedWithFixtures() {
  await ev(`(async () => {
    const mod = await import("/src/lib/data/seed.ts");
    const db = await mod.buildSeedDatabase();
    const today = new Date().toLocaleDateString('sv-SE');
    // Pointages « départ » de démo : on garantit un enregistrement présent+arrivée
    // aujourd'hui pour les enfants des familles à contacts (par-001, par-003).
    const famByPrimary = {};
    (db.families||[]).forEach(f => famByPrimary[f.primaryParentId] = f.id);
    const childOfFam = {};
    (db.childParents||[]).forEach(cp => { const fid = famByPrimary[cp.parentId]; if (!childOfFam[fid]) childOfFam[fid] = cp.childId; });
    const now = new Date().toISOString();
    for (const [fid, seq] of [["par-001", 9000], ["par-003", 9001]]) {
      const cid = childOfFam[fid];
      if (!cid) continue;
      let rec = (db.attendance||[]).find(a => a.childId === cid && a.date === today);
      if (!rec) {
        rec = { id: "att-fixture-" + seq, childId: cid, familyId: fid, date: today, status: "present", arrivalTime: "08:15", arrivalAccompaniedBy: "Mère", departureTime: null, departurePickedUpBy: null, absenceReason: null, absenceType: null, notes: "", recordedBy: "usr-001", createdAt: now, updatedAt: now, isDemo: true, pickupAuthorized: undefined };
        (db.attendance = db.attendance || []).push(rec);
      } else {
        rec.status = "present"; rec.arrivalTime = "08:15"; rec.departureTime = null; rec.departurePickedUpBy = null; rec.pickupAuthorized = undefined;
      }
    }
    localStorage.setItem("kako.db.v1", JSON.stringify(db));
    return db.users.length;
  })()`);
}

async function openContactsTab() {
  await goto(`/familles/${FAMILY_ID}`);
  await waitFor(
    `document.body.innerText.includes("Autorisations & contacts")`,
    "fiche famille",
    60000,
  );
  await jsClick("[role=tab]", "Autorisations & contacts");
  return waitFor(
    `(document.querySelector('[role="tab"][data-state="active"]')||{textContent:''}).textContent.includes('Autorisations')`,
    "onglet contacts actif",
    15000,
  );
}

// Candidat départ : enfant d'une famille à contacts, avec pointage présent+arrivée
// aujourd'hui et pas encore de départ.
async function departureCandidate(excludeFamilyId) {
  const t = await ev(`(() => {
    const db = JSON.parse(localStorage.getItem("kako.db.v1"));
    const today = new Date().toLocaleDateString('sv-SE');
    const famByPrimary = {};
    (db.families||[]).forEach(f => famByPrimary[f.primaryParentId] = f.id);
    const pickupByFam = {};
    (db.authorizedPersons||[]).forEach(a => { if (a.canPickup && !pickupByFam[a.familyId]) pickupByFam[a.familyId] = a.firstName + ' ' + a.lastName; });
    const childrenByFam = {};
    (db.childParents||[]).forEach(cp => { const fid = famByPrimary[cp.parentId]; (childrenByFam[fid] = childrenByFam[fid] || []).push(cp.childId); });
    const fams = (db.families||[]).slice();
    fams.sort((a,b) => (b.id === ${JSON.stringify(FAMILY_ID)} ? 1 : 0) - (a.id === ${JSON.stringify(FAMILY_ID)} ? 1 : 0));
    for (const f of fams) {
      if (String(f.id) === String(${JSON.stringify(excludeFamilyId)})) continue;
      const pick = pickupByFam[f.id];
      if (!pick) continue;
      const cids = childrenByFam[f.id] || [];
      const rec = (db.attendance||[]).find(a => cids.includes(a.childId) && a.date === today && a.arrivalTime !== null && a.departureTime === null && (a.status === 'present' || a.status === 'retard'));
      if (!rec) continue;
      const ch = (db.children||[]).find(c => c.id === rec.childId);
      return JSON.stringify({ childId: rec.childId, name: ch ? ch.firstName + ' ' + ch.lastName : rec.childId, pick, familyId: f.id });
    }
    return null;
  })()`);
  let o = null;
  try {
    o = JSON.parse(t);
  } catch {}
  return o;
}

let FAMILY_ID = "par-001";

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

  console.log("=== PHASE 7 : CONTACTS & AUTORISATIONS DE RÉCUPÉRATION - TESTS ===\n");

  await goto("/connexion");
  await waitFor(`document.body.innerText.length > 50`, "connexion page");
  await seedWithFixtures();
  FAMILY_ID =
    JSON.parse(
      await ev(
        `JSON.stringify(((() => { const db = JSON.parse(localStorage.getItem("kako.db.v1")); return (db.families&&db.families.length)?db.families[0].id:null; })()))`,
      ),
    ) || "par-001";
  console.log(`   (famille de référence : ${FAMILY_ID})`);

  await setSession("usr-001");

  // ---------- T01 : onglet + lecture des contacts seed
  {
    await openContactsTab();
    const hasPack = await waitFor(
      `document.body.innerText.includes("Personnes autorisées")`,
      "panneau contacts",
    );
    const hasMarie = await ev(`document.body.innerText.includes("Marie")`);
    const hasPaul = await ev(`document.body.innerText.includes("Paul Mbarga")`);
    const hasAmina = await ev(`document.body.innerText.includes("Amina")`);
    const hasPickupBadge = await ev(`document.body.innerText.includes("Récupération")`);
    const hasUrgence = await ev(`document.body.innerText.includes("Urgence")`);
    report(
      "T01",
      "Onglet « Autorisations & contacts » + contacts seed lus",
      hasPack && hasMarie && hasAmina && hasPaul && hasPickupBadge && hasUrgence,
      `Marie=${hasMarie} Amina=${hasAmina} badges(P/U)=${hasPickupBadge}/${hasUrgence}`,
    );
  }

  // ---------- T02 : création contact (autorisation Récupération)
  {
    const before = Number(
      await ev(`(JSON.parse(localStorage.getItem("kako.db.v1")).authorizedPersons||[]).length`),
    );
    const opened = await jsClick("button", "Ajouter un contact");
    await waitFor(`!!document.querySelector('#ap-first-name')`, "dialog ajout");
    await typeInto("#ap-first-name", "Kenza");
    await typeInto("#ap-last-name", "Benali");
    await typeInto("#ap-relation", "Tante");
    await typeInto("#ap-phone", "+237 600 12 34 56");
    await jsClick("#ap-canPickup", "");
    const checked = await ev(
      `(document.querySelector('#ap-canPickup')||{}).getAttribute ? document.querySelector('#ap-canPickup').getAttribute('aria-checked') : 'none'`,
    );
    await jsClick('[role="dialog"] button', "Ajouter le contact");
    // la fermeture du dialogue est gérée par l'animation Radix ; on vérifie la
    // persistance métier + l'affichage plutôt qu'un unmount strict.
    await sleep(1200);
    const after = Number(
      await ev(`(JSON.parse(localStorage.getItem("kako.db.v1")).authorizedPersons||[]).length`),
    );
    const shown = await ev(
      `document.body.innerText.includes("Kenza") && document.body.innerText.includes("Benali")`,
    );
    const relink = await waitFor(
      `document.body.innerText.includes("Tante")`,
      "nouveau contact",
      8000,
    );
    await waitFor(`!document.querySelector('#ap-first-name')`, "dialog fermé (T02)");
    report(
      "T02",
      "Création contact (autorisation Récupération) persisté + affiché",
      opened && checked === "true" && after === before + 1 && shown && relink,
      `before=${before} after=${after} checked=${checked} shown=${shown}`,
    );
  }

  // ---------- T03 : validation Zod — 0 autorisation → message FR
  {
    await jsClick("button", "Ajouter un contact");
    await waitFor(`!!document.querySelector('#ap-first-name')`, "dialog ajout");
    await typeInto("#ap-first-name", "Zod");
    await typeInto("#ap-last-name", "Test");
    await typeInto("#ap-relation", "Grand-mère");
    await typeInto("#ap-phone", "+237 699 00 00 00");
    await ev(
      `['#ap-canPickup','#ap-emergencyContact','#ap-receivesDocuments','#ap-canSign'].forEach(s => { const el = document.querySelector(s); if (el && el.getAttribute('aria-checked') === 'true') { for (const t of ['pointerdown','mousedown','pointerup','mouseup','click']) { const e = t.startsWith('pointer') ? new PointerEvent(t,{bubbles:true,button:0,pointerId:1}) : new MouseEvent(t,{bubbles:true,button:0}); el.dispatchEvent(e); } } }); "ok"`,
    );
    await jsClick('[role="dialog"] button', "Ajouter le contact");
    const msg = await waitFor(
      `document.body.innerText.includes("Au moins une autorisation")`,
      "message validation",
      8000,
    );
    await jsClick('[role="dialog"] button', "Annuler");
    await waitFor(`!document.querySelector('#ap-first-name')`, "dialog fermé (T03)");
    report("T03", "Validation : ≥1 autorisation requise (message FR)", !!msg);
  }

  // ---------- T04 : édition (renommage) + suppression d'un contact
  {
    const before = Number(
      await ev(`(JSON.parse(localStorage.getItem("kako.db.v1")).authorizedPersons||[]).length`),
    );
    const editOk = await jsClickScoped("Kenza", "Modifier ce contact");
    await waitFor(`!!document.querySelector('#ap-first-name')`, "dialog édition");
    await typeInto("#ap-first-name", "KenzaM");
    await jsClick('[role="dialog"] button', "Enregistrer");
    const edited = await waitFor(`document.body.innerText.includes("KenzaM")`, "prénom modifié");
    const delOk = await jsClickScoped("KenzaM", "Supprimer ce contact");
    await waitFor(`!!document.querySelector('[role="alertdialog"]')`, "confirm suppression");
    await jsClick('[role="alertdialog"] button', "Supprimer");
    await sleep(1200);
    const after = Number(
      await ev(`(JSON.parse(localStorage.getItem("kako.db.v1")).authorizedPersons||[]).length`),
    );
    await waitFor(`!document.body.innerText.includes("KenzaM")`, "contact supprimé");
    report(
      "T04",
      "Édition + suppression d'un contact (confirmation) persistés",
      editOk && edited && delOk && after === before - 1,
      `edit=${editOk} del=${delOk} before=${before} after=${after}`,
    );
  }

  // ---------- T05 : le SELECT du départ liste les personnes autorisées
  {
    const cand = await departureCandidate(null);
    if (!cand) {
      report("T05", "Départ : SELECT des personnes autorisées", false, "aucun candidat départ");
    } else {
      await goto("/presences");
      await waitFor(`document.body.innerText.includes("Présences")`, "presences");
      await jsClick(`[aria-label]`, `Pointer le départ de ${cand.name}`);
      await waitFor(`!!document.querySelector('#departure-pickup')`, "dialog départ");
      await jsClick("#departure-pickup", "");
      await waitFor(`!!document.querySelector('[role="listbox"]')`, "listbox ouvert");
      const opts = JSON.parse(
        await ev(
          `JSON.stringify([...document.querySelectorAll('[role="option"]')].map(o => o.textContent.trim()))`,
        ),
      );
      const ok =
        opts.some((o) => o.includes(cand.pick)) && opts.some((o) => o.includes("Autre personne"));
      await jsClick('[role="dialog"] button', "Annuler");
      report(
        "T05",
        "Départ : SELECT des personnes autorisées de la famille",
        ok,
        ok ? "ok" : `opts=${JSON.stringify(opts)}`,
      );
    }
  }

  // ---------- T06 : « Autre personne… » → alerte + identité obligatoire
  {
    const cand = await departureCandidate(null);
    if (!cand) {
      report("T06", "« Autre personne »", false, "aucun candidat départ");
    } else {
      await goto("/presences");
      await waitFor(`document.body.innerText.includes("Présences")`, "presences");
      await jsClick(`[aria-label]`, `Pointer le départ de ${cand.name}`);
      await waitFor(`!!document.querySelector('#departure-pickup')`, "dialog départ");
      await jsClick("#departure-pickup", "");
      await waitFor(`!!document.querySelector('[role="listbox"]')`, "listbox ouvert");
      const otherPicked = await jsClickOption("Autre personne");
      const hasAlert = await waitFor(
        `[...document.querySelectorAll('[role="alert"]')].some(a => a.textContent.includes("Personne non autorisée"))`,
        "alerte non autorisée",
      );
      const hasIdentityField = await ev(`!!document.querySelector('#departure-identity')`);
      // tente de valider sans identité → le dialogue reste ouvert, aucun départ enregistré
      await jsClick('[role="dialog"] button', "Enregistrer le départ");
      await sleep(800);
      const dialogStillOpen = await ev(`!!document.querySelector('#departure-pickup')`);
      const st = JSON.parse(
        await ev(`(() => {
        const db = JSON.parse(localStorage.getItem("kako.db.v1"));
        const today = new Date().toLocaleDateString('sv-SE');
        const rec = (db.attendance||[]).find(x => x.childId === ${JSON.stringify(cand.childId)} && x.date === today);
        return JSON.stringify({ auth: rec && rec.pickupAuthorized, dep: rec && rec.departureTime });
      })()`),
      );
      const blocked = dialogStillOpen && st.dep === null;
      await jsClick('[role="dialog"] button', "Annuler");
      report(
        "T06",
        "« Autre personne » : alerte + identité obligatoire (départ bloqué)",
        otherPicked && hasAlert && hasIdentityField && blocked,
        `other=${otherPicked} alert=${hasAlert} field=${hasIdentityField} blocked=${blocked}`,
      );
    }
  }

  // ---------- T07 : départ « Autre personne » → pickupAuthorized=false + badge
  {
    const cand = await departureCandidate(null);
    if (!cand) {
      report("T07", "Départ non autorisé", false, "aucun candidat départ");
    } else {
      await goto("/presences");
      await waitFor(`document.body.innerText.includes("Présences")`, "presences");
      await jsClick(`[aria-label]`, `Pointer le départ de ${cand.name}`);
      await waitFor(`!!document.querySelector('#departure-pickup')`, "dialog départ");
      await jsClick("#departure-pickup", "");
      await waitFor(`!!document.querySelector('[role="listbox"]')`, "listbox ouvert");
      await jsClickOption("Autre personne");
      await waitFor(`!!document.querySelector('#departure-identity')`, "champ identité");
      await typeInto("#departure-other-name", "Inconnu Passant");
      await typeInto("#departure-identity", "CNI-000000");
      await jsClick('[role="dialog"] button', "Enregistrer le départ");
      await sleep(1800);
      const st = JSON.parse(
        await ev(`(() => {
        const db = JSON.parse(localStorage.getItem("kako.db.v1"));
        const today = new Date().toLocaleDateString('sv-SE');
        const rec = (db.attendance||[]).find(x => x.childId === ${JSON.stringify(cand.childId)} && x.date === today);
        return JSON.stringify({ auth: rec && rec.pickupAuthorized, pickup: rec && rec.departurePickedUpBy, dep: rec && rec.departureTime });
      })()`),
      );
      const persisted = st.auth === false && st.pickup === "Inconnu Passant" && !!st.dep;
      await goto("/presences");
      const badge = await waitFor(
        `document.querySelectorAll('[data-testid="unauthorized-departure"]').length > 0`,
        "badge départ non autorisé",
        15000,
      );
      report(
        "T07",
        "Départ non autorisé : pickupAuthorized=false + badge ⚠",
        persisted && badge,
        `db=${JSON.stringify(st)} badge=${badge}`,
      );
    }
  }

  // ---------- T08 : départ avec personne autorisée → pickupAuthorized=true
  {
    const cand = await departureCandidate(null);
    if (!cand) {
      report("T08", "Départ avec personne autorisée", false, "aucun candidat départ");
    } else {
      await goto("/presences");
      await waitFor(`document.body.innerText.includes("Présences")`, "presences");
      await jsClick(`[aria-label]`, `Pointer le départ de ${cand.name}`);
      await waitFor(`!!document.querySelector('#departure-pickup')`, "dialog départ");
      await jsClick("#departure-pickup", "");
      await waitFor(`!!document.querySelector('[role="listbox"]')`, "listbox ouvert");
      const picked = await jsClickOption(cand.pick);
      await jsClick('[role="dialog"] button', "Enregistrer le départ");
      await sleep(1800);
      const st = JSON.parse(
        await ev(`(() => {
        const db = JSON.parse(localStorage.getItem("kako.db.v1"));
        const today = new Date().toLocaleDateString('sv-SE');
        const rec = (db.attendance||[]).find(x => x.childId === ${JSON.stringify(cand.childId)} && x.date === today);
        return JSON.stringify({ auth: rec && rec.pickupAuthorized, pickup: rec && rec.departurePickedUpBy, dep: rec && rec.departureTime });
      })()`),
      );
      report(
        "T08",
        "Départ avec personne autorisée : pickupAuthorized=true",
        picked && st.auth === true && !!st.pickup && !!st.dep,
        `picked=${picked} db=${JSON.stringify(st)}`,
      );
    }
  }

  // ---------- T09 : éducateur → lecture seule des contacts
  {
    await setSession("usr-003");
    await goto(`/familles/${FAMILY_ID}`);
    await openContactsTab();
    await waitFor(
      `document.body.innerText.includes("Personnes autorisées")`,
      "panneau contacts (éducateur)",
    );
    const seesMarie = await ev(`document.body.innerText.includes("Marie")`);
    const noAdd = await ev(
      `![...document.querySelectorAll('button')].some(b => b.textContent.includes("Ajouter un contact"))`,
    );
    const noManage = await ev(
      `[...document.querySelectorAll('[title="Modifier ce contact"], [title="Supprimer ce contact"]')].length === 0`,
    );
    report(
      "T09",
      "Éducateur : contacts en lecture seule",
      seesMarie && noAdd && noManage,
      `vue=${seesMarie} add=${noAdd} manage=${noManage}`,
    );
  }

  // ---------- T10 : journal d'audit création/suppression contact
  {
    const arr = JSON.parse(
      await ev(
        `JSON.stringify((JSON.parse(localStorage.getItem("kako.db.v1")).auditLogs||[]).map(l => l.action))`,
      ),
    );
    const hasCreate = arr.some((a) => String(a).includes("Création contact"));
    const hasDelete = arr.some((a) => String(a).includes("Suppression contact"));
    report(
      "T10",
      "Journal d'audit : création + suppression de contact",
      hasCreate && hasDelete,
      arr.join(" | "),
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
