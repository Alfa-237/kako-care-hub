import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as AppShell } from "./page-header-COfasL3l.mjs";
import { t as ModulePlaceholder } from "./module-placeholder-CZ6wxjWz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/familles-BQArkf6e.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		permission: "families.view",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePlaceholder, {
			title: "Familles et responsables",
			description: "Responsables légaux, contacts d'urgence et autorisations.",
			planned: [
				"Responsables multiples",
				"Autorisations de récupération",
				"Contacts d'urgence",
				"Pièces d'identité",
				"Liens enfant / parent",
				"Coordonnées"
			]
		})
	});
}
//#endregion
export { Page as component };
