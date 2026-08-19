import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as AppShell } from "./page-header-COfasL3l.mjs";
import { t as ModulePlaceholder } from "./module-placeholder-CZ6wxjWz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inscriptions-BtcNJKzl.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		permission: "enrollment.manage",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePlaceholder, {
			title: "Inscriptions",
			description: "Préinscriptions, dossiers administratifs et contrats.",
			planned: [
				"Préinscriptions",
				"Dossier administratif",
				"Contrats d'accueil",
				"Pièces obligatoires",
				"Validation d'inscription",
				"Liste d'attente"
			]
		})
	});
}
//#endregion
export { Page as component };
