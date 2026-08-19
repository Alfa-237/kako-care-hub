import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as AppShell } from "./page-header-COfasL3l.mjs";
import { t as ModulePlaceholder } from "./module-placeholder-CZ6wxjWz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/presences-GTQ8xZ8Q.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		permission: "attendance.view",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePlaceholder, {
			title: "Présences et pointage",
			description: "Arrivées, départs, retards et absences.",
			planned: [
				"Pointage rapide",
				"Arrivée / départ",
				"Retards",
				"Départs anticipés",
				"Absences justifiées",
				"Historique des modifications"
			]
		})
	});
}
//#endregion
export { Page as component };
