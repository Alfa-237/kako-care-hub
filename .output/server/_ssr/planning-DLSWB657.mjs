import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as AppShell } from "./page-header-COfasL3l.mjs";
import { t as ModulePlaceholder } from "./module-placeholder-CZ6wxjWz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/planning-DLSWB657.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		permission: "planning.view",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePlaceholder, {
			title: "Planning",
			description: "Planning des enfants et du personnel.",
			planned: [
				"Vue jour / semaine / mois",
				"Planning par section",
				"Horaires prévus",
				"Planning du personnel",
				"Congés et remplacements",
				"Alertes de capacité"
			]
		})
	});
}
//#endregion
export { Page as component };
