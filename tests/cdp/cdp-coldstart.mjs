// Smoke test cold-start Vite : vérifie que chaque route clé se charge rapidement.
// À exécuter jusqu'à PASS avant de lancer les suites CDP (voir README.md, règle H).
// Sortie 0 si toutes les routes passent sous le seuil, 1 sinon.
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const WebSocket = (await import(pathToFileURL(require.resolve("ws")).href)).default;

const MAX_MS = Number(process.env.COLDSTART_MAX_MS ?? 20000);
const BASE = "http://localhost:8080";
const ROUTES = [
  "/connexion",
  "/",
  "/transmissions",
  "/presences",
  "/familles/par-001",
  "/enfants/enf-001",
  "/enfants",
  "/tableau-de-bord",
  "/personnel",
];

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
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  // Onglet dédié : un targets.find(page) peut retomber sur un onglet laissé
  // par une suite (état figuré) et fausser les mesures.
  const created = await (
    await fetch("http://127.0.0.1:9223/json/new?about:blank", { method: "PUT" })
  ).json();
  ws = new WebSocket(created.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.on("open", r); ws.on("error", j); });
  ws.on("message", (d) => {
    const m = JSON.parse(d.toString());
    if (m.id && pending.has(m.id)) { pending.get(m.id).resolve(m); pending.delete(m.id); }
  });
  await send("Runtime.enable");
  await send("Page.enable");

  let failed = 0;
  for (const route of ROUTES) {
    const t0 = Date.now();
    await send("Page.navigate", { url: BASE + route });
    let loaded = false;
    for (let i = 0; i < 300; i++) {
      await sleep(250);
      const res = await send("Runtime.evaluate", {
        expression: `!!document.querySelector('nav') || document.body?.innerText.includes('KAKO MANAGER')`,
        returnByValue: true,
      });
      if (res && res.result && (res.result.value === true || res.result.value === "true")) {
        loaded = true;
        break;
      }
    }
    const ms = Date.now() - t0;
    const ok = loaded && ms <= MAX_MS;
    if (!ok) failed++;
    console.log(`${ok ? "PASS" : "FAIL"} ${route} (${ms}ms, max ${MAX_MS}ms)`);
  }
  console.log(`\ncoldstart: ${ROUTES.length - failed}/${ROUTES.length} PASS`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((e) => { console.error(e.message); process.exit(1); });