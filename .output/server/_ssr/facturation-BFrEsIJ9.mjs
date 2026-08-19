import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as AppShell } from "./page-header-COfasL3l.mjs";
import { t as ModulePlaceholder } from "./module-placeholder-CZ6wxjWz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/facturation-BFrEsIJ9.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		permission: "billing.view",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePlaceholder, {
			title: "Facturation",
			description: "Tarifs, factures et impayés.",
			planned: [
				"Grille tarifaire",
				"Génération de factures",
				"Lignes de facture",
				"Réductions fratrie",
				"Suivi des impayés",
				"Export PDF"
			]
		})
	});
}
//#endregion
export { Page as component };
