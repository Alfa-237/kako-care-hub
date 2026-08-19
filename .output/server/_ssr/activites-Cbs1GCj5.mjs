import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as AppShell } from "./page-header-COfasL3l.mjs";
import { t as ModulePlaceholder } from "./module-placeholder-CZ6wxjWz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/activites-Cbs1GCj5.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		permission: "activities.manage",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePlaceholder, {
			title: "Activités pédagogiques",
			description: "Ateliers, catégories et observations.",
			planned: [
				"Création d'activité",
				"Catégories pédagogiques",
				"Sélection des enfants",
				"Observations",
				"Compétences observées",
				"Photos locales"
			]
		})
	});
}
//#endregion
export { Page as component };
