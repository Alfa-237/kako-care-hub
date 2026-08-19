import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as AppShell } from "./page-header-COfasL3l.mjs";
import { t as ModulePlaceholder } from "./module-placeholder-CZ6wxjWz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/paiements-BP5NmuEs.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		permission: "payments.manage",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePlaceholder, {
			title: "Paiements",
			description: "Encaissements et reste à payer.",
			planned: [
				"Encaissement manuel",
				"Moyens de paiement",
				"Rapprochement facture",
				"Reste à payer",
				"Reçus",
				"Historique"
			]
		})
	});
}
//#endregion
export { Page as component };
