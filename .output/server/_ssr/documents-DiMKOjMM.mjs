import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as AppShell } from "./page-header-COfasL3l.mjs";
import { t as ModulePlaceholder } from "./module-placeholder-CZ6wxjWz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/documents-DiMKOjMM.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		permission: "documents.view",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePlaceholder, {
			title: "Documents",
			description: "Centre documentaire et modèles.",
			planned: [
				"Contrats d'accueil",
				"Fiches sanitaires",
				"Autorisations",
				"Attestations",
				"Reçus",
				"Personnalisation du modèle"
			]
		})
	});
}
//#endregion
export { Page as component };
