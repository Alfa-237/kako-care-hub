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

async function measure(sel, text) {
  const rect = await ev(`(() => {
    const el = [...document.querySelectorAll(${JSON.stringify(sel)})].find(
      (x) => x.textContent.includes(${JSON.stringify(text)}) || (x.getAttribute('aria-label')||'').includes(${JSON.stringify(text)})
    );
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
  await send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x,
    y,
    button: "left",
    clickCount: 1,
  });
  await send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x,
    y,
    button: "left",
    clickCount: 1,
  });
  await sleep(450);
}

async function clickUntil(sel, text, untilJs, maxTries = 6, settleMs = 500) {
  for (let i = 1; i <= maxTries; i++) {
    const pos = await measure(sel, text);
    if (!pos) {
      await sleep(500);
      continue;
    }
    await rawClick(pos.x, pos.y);
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
    `(() => { const i = document.querySelector(${JSON.stringify(sel)}); if (i) i.value=''; i.focus(); })()`,
  );
  await sleep(200);
  await send("Input.insertText", { text });
  await sleep(250);
}

async function goto(path) {
  await send("Page.navigate", { url: BASE + path });
  await sleep(1300);
}

async function setSession(userId) {
  await ev(
    `localStorage.setItem("kako.session.v1", JSON.stringify({ userId: ${JSON.stringify(userId)}, startedAt: new Date().toISOString() })); "ok"`,
  );
}

async function seed() {
  await ev(`(async () => {
    const mod = await import("/src/lib/data/seed.ts");
    const db = await mod.buildSeedDatabase();
    localStorage.setItem("kako.db.v1", JSON.stringify(db));
    return db.users.length;
  })()`);
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

  console.log("=== PHASE 6 : AUTHENTIFICATION FINE & PERMISSIONS - TESTS ===\n");

  await goto("/connexion");
  await waitFor(`document.body.innerText.length > 50`, "connexion page");
  await seed();

  // ---- T01 : connexion avec identifiant seed + mot de passe jamais en clair
  {
    await setSession("usr-001");
    await goto("/connexion");
    await waitFor(`!!document.querySelector("#username")`, "champ username");
    await typeInto("#username", "admin");
    await typeInto("#password", "admin123");
    await clickUntil("button[type=submit]", "Se connecter", null, 5);
    const logged = await waitFor(
      `location.pathname === "/" || (document.body.innerText.includes("Tableau de bord"))`,
      "connexion admin reussie",
    );
    const hashed = await ev(`(() => {
      const db = JSON.parse(localStorage.getItem("kako.db.v1"));
      const u = db.users.find(x => x.username === "admin");
      return u ? JSON.stringify({ hash: u.passwordHash, plain: u.passwordHash === "admin123" }) : "NOUSER";
    })()`);
    const parsed = JSON.parse(hashed);
    report(
      "T01",
      "Connexion admin/admin123 réussie + mot de passe haché (jamais en clair)",
      Boolean(logged) && parsed.plain === false && parsed.hash.length > 20,
      hashed,
    );
  }

  // ---- T02 : sidebar filtrée par permission (éducateur)
  {
    await setSession("usr-003");
    await goto("/");
    const sidebar = await waitFor(
      `document.body.innerText.includes("Tableau de bord")`,
      "dashboard educateur",
    );
    const hasPresences = await ev(`document.body.innerText.includes("Présences")`);
    const hasPaiements = await ev(`document.body.innerText.includes("Paiements")`);
    const hasFacturation = await ev(`document.body.innerText.includes("Facturation")`);
    report(
      "T02",
      "Sidebar filtrée : Présences visible, Paiements/Facturation masqués pour éducateur",
      Boolean(sidebar) &&
        hasPresences === true &&
        hasPaiements === false &&
        hasFacturation === false,
      `presences=${hasPresences} paiements=${hasPaiements} facturation=${hasFacturation}`,
    );
  }

  // ---- T03 : accès /paiements refusé → redirection /forbidden (éducateur)
  {
    await setSession("usr-003");
    await goto("/paiements");
    const forbidden = await waitFor(
      `document.body.innerText.includes("403") || location.pathname.includes("forbidden")`,
      "redirection forbidden paiements",
    );
    report(
      "T03",
      "Éducateur (sans payments.manage) redirigé vers /forbidden sur /paiements",
      Boolean(forbidden),
      String(forbidden).slice(0, 60),
    );
  }

  // ---- T04 : /audit réservé (admin oui, éducateur non)
  {
    await setSession("usr-003");
    await goto("/audit");
    const eduForbidden = await waitFor(
      `location.pathname.includes("forbidden")`,
      "educateur audit forbidden",
    );
    await setSession("usr-001");
    await goto("/audit");
    const adminAudit = await waitFor(
      `document.body.innerText.includes("Journal d'audit")`,
      "admin audit page",
    );
    report(
      "T04",
      "/audit réservé à audit.view : éducateur forbidden, admin accède",
      eduForbidden === true && Boolean(adminAudit),
      `eduForbidden=${eduForbidden}`,
    );
  }

  // ---- T05 : /utilisateurs — création d'un utilisateur via le dialogue (admin)
  {
    await setSession("usr-001");
    await goto("/utilisateurs");
    const pageOk = await waitFor(
      `document.body.innerText.includes("Gestion des utilisateurs")`,
      "utilisateurs admin",
    );
    if (pageOk) {
      await clickUntil(
        "button",
        "Nouvel utilisateur",
        `!!document.querySelector("#uf-username")`,
        6,
      );
    }
    await waitFor(`!!document.querySelector("#uf-username")`, "dialogue utilisateur");
    await clickUntil("button", "Nouvel utilisateur", `!!document.querySelector("#uf-username")`, 4);
    await typeInto("#uf-username", "secretariefrance");
    await typeInto("#uf-fullname", "France Test");
    await typeInto("#uf-password", "secret123");
    const created = await clickUntil(
      "button[type=submit]",
      "Créer l'utilisateur",
      `document.body.innerText.includes("secretariefrance")`,
      6,
      900,
    );
    const appears = await ev(
      `document.body.innerText.includes("France Test") && document.body.innerText.includes("secretariefrance")`,
    );
    report(
      "T05",
      "Création d'un utilisateur (role par défaut) depuis /utilisateurs",
      created === true && appears === true,
      `appears=${appears}`,
    );
  }

  // ---- T06 : badge de rôle dans l'en-tête
  {
    await setSession("usr-003");
    await goto("/");
    await waitFor(`document.body.innerText.includes("Tableau de bord")`, "dashboard");
    const roleLabel = await ev(`document.body.innerText.includes("Éducateur")`);
    report(
      "T06",
      "Badge de rôle (ROLE_LABELS) affiché dans l'en-tête pour éducateur",
      roleLabel === true,
      `educateurLabel=${roleLabel}`,
    );
  }

  // ---- T07 : action journalisée puis visible dans /audit + boutons d'export
  {
    // Génère une action d'audit via une mutation simple (création d'utilisateur via API data)
    await setSession("usr-001");
    await ev(`(async () => {
      const mod = await import("/src/lib/data/users.ts");
      await mod.createUser({ username: "audittest", fullName: "Audit Test", passwordHash: "abc", role: "SECRETAIRE", status: "actif" });
      return "created";
    })()`);
    await goto("/audit");
    const auditRow = await waitFor(
      `document.body.innerText.includes("Audit Test") || document.body.innerText.includes("Création utilisateur")`,
      "audit row",
    );
    const hasCsv = await ev(
      `[...document.querySelectorAll("button")].some(b => b.textContent.includes("CSV"))`,
    );
    const hasJson = await ev(
      `[...document.querySelectorAll("button")].some(b => b.textContent.includes("JSON"))`,
    );
    report(
      "T07",
      "Action journalisée visible dans /audit + boutons export CSV/JSON",
      Boolean(auditRow) && hasCsv === true && hasJson === true,
      `csv=${hasCsv} json=${hasJson}`,
    );
  }

  // ---- T08 : page /forbidden rend 403
  {
    await goto("/forbidden");
    const rendered = await waitFor(
      `document.body.innerText.includes("403") && document.body.innerText.includes("Accès refusé")`,
      "forbidden page",
    );
    report(
      "T08",
      "Page /forbidden affiche « 403 — Accès refusé »",
      Boolean(rendered),
      String(rendered).slice(0, 40),
    );
  }

  // ---- T09 : le parent ne voit que ses enfants
  {
    await setSession("usr-008");
    await goto("/enfants");
    const total = await ev(`JSON.parse(localStorage.getItem("kako.db.v1")).children.length`);
    const desc = await waitFor(
      `document.body.innerText.includes("votre famille")`,
      "parent famille",
    );
    const shown = await ev(`(() => {
      const db = JSON.parse(localStorage.getItem("kako.db.v1"));
      const pu = db.users.find(u => u.role === "PARENT");
      const fam = db.families.find(f => f.id === pu.familyId);
      const pIds = new Set(db.childParents.filter(cp => cp.parentId === fam.primaryParentId).map(cp => cp.parentId));
      pIds.add(fam.primaryParentId);
      const kids = new Set(db.childParents.filter(cp => pIds.has(cp.parentId)).map(cp => cp.childId));
      return kids.size;
    })()`);
    // Compte les lignes enfants rendues
    const listCount = await ev(`document.querySelectorAll("ul a[href*='/enfants/']").length`);
    report(
      "T09",
      "Le parent ne voit que ses enfants (familyId → childParents)",
      Boolean(desc) && shown > 0 && shown < total && listCount === shown,
      `total=${total} att=${shown} rendus=${listCount}`,
    );
  }

  // ---- T10 : bouton « Supprimer » masqué pour éducateur, visible pour admin
  {
    await setSession("usr-003");
    await goto("/enfants");
    await waitFor(`document.body.innerText.includes("Gestion des enfants")`, "enfants educateur");
    const eduHasDelete = await ev(
      `[...document.querySelectorAll("[aria-label]")].some(a => (a.getAttribute('aria-label')||'').includes("Supprimer"))`,
    );
    await setSession("usr-001");
    await goto("/enfants");
    await waitFor(`document.body.innerText.includes("Gestion des enfants")`, "enfants admin");
    const adminHasDelete = await ev(
      `[...document.querySelectorAll("[aria-label]")].some(a => (a.getAttribute('aria-label')||'').includes("Supprimer"))`,
    );
    report(
      "T10",
      "children.delete : « Supprimer » masqué pour éducateur, visible admin",
      eduHasDelete === false && adminHasDelete === true,
      `edu=${eduHasDelete} admin=${adminHasDelete}`,
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
