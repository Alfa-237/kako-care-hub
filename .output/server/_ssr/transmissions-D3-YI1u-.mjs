import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as AppShell } from "./page-header-COfasL3l.mjs";
import { t as ModulePlaceholder } from "./module-placeholder-CZ6wxjWz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/transmissions-D3-YI1u-.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		permission: "transmissions.view",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePlaceholder, {
			title: "Transmissions quotidiennes",
			description: "Cahier de transmission par enfant.",
			planned: [
				"Repas et biberons",
				"Changes",
				"Siestes",
				"Humeur et température",
				"Observations",
				"Impression du jour"
			]
		})
	});
}
//#endregion
export { Page as component };
