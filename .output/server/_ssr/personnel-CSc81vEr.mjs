import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as AppShell } from "./page-header-COfasL3l.mjs";
import { t as ModulePlaceholder } from "./module-placeholder-CZ6wxjWz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/personnel-CSc81vEr.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		permission: "staff.view",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePlaceholder, {
			title: "Personnel",
			description: "Employés, plannings et congés.",
			planned: [
				"Fiches employés",
				"Contrats",
				"Planning et pointage",
				"Demandes de congés",
				"Validation",
				"Documents"
			]
		})
	});
}
//#endregion
export { Page as component };
