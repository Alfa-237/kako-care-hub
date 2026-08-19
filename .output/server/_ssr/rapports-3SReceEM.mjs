import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as AppShell } from "./page-header-COfasL3l.mjs";
import { t as ModulePlaceholder } from "./module-placeholder-CZ6wxjWz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rapports-3SReceEM.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		permission: "reports.view",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePlaceholder, {
			title: "Rapports",
			description: "Statistiques et exports.",
			planned: [
				"Taux d'occupation",
				"Présences et absences",
				"Chiffre d'affaires",
				"Impayés",
				"Activités et incidents",
				"Export CSV / PDF"
			]
		})
	});
}
//#endregion
export { Page as component };
