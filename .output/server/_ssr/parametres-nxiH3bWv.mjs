import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as AppShell } from "./page-header-COfasL3l.mjs";
import { t as ModulePlaceholder } from "./module-placeholder-CZ6wxjWz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/parametres-nxiH3bWv.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		permission: "settings.manage",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePlaceholder, {
			title: "Paramètres",
			description: "Établissement, sections, utilisateurs et sécurité.",
			planned: [
				"Informations de l'établissement",
				"Sections et capacités",
				"Utilisateurs et rôles",
				"Permissions",
				"Verrouillage automatique",
				"Journal des actions"
			]
		})
	});
}
//#endregion
export { Page as component };
