import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as AppShell } from "./page-header-COfasL3l.mjs";
import { t as ModulePlaceholder } from "./module-placeholder-CZ6wxjWz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sauvegarde-DxZNHTY9.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		permission: "backup.manage",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePlaceholder, {
			title: "Sauvegarde et restauration",
			description: "Sauvegardes locales et restauration sécurisée.",
			planned: [
				"Sauvegarde manuelle",
				"Sauvegarde automatique",
				"Restauration",
				"Choix du dossier",
				"Historique",
				"Sauvegarde de sécurité"
			]
		})
	});
}
//#endregion
export { Page as component };
