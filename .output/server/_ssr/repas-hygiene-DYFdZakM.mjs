import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as AppShell } from "./page-header-COfasL3l.mjs";
import { t as ModulePlaceholder } from "./module-placeholder-CZ6wxjWz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/repas-hygiene-DYFdZakM.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		permission: "care.manage",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePlaceholder, {
			title: "Repas, changes et siestes",
			description: "Suivi quotidien des soins.",
			planned: [
				"Menus par jour",
				"Menus par section",
				"Allergies",
				"Changes",
				"Siestes et durées",
				"Historique"
			]
		})
	});
}
//#endregion
export { Page as component };
