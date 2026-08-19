import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { Q as Construction } from "../_libs/lucide-react.mjs";
import { c as PageHeader } from "./page-header-COfasL3l.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/module-placeholder-CZ6wxjWz.js
var import_jsx_runtime = require_jsx_runtime();
function ModulePlaceholder({ title, description, planned }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title,
			description
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "overflow-hidden rounded-xl border bg-card shadow-card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-4 border-b bg-muted/25 px-5 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Construction, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-[15px] font-semibold tracking-tight",
						children: "Module prévu dans une prochaine phase"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[13px] text-muted-foreground",
						children: "La navigation, les permissions et la structure de données de ce module sont déjà en place. Les écrans opérationnels seront développés phase par phase."
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-2 p-5 sm:grid-cols-2",
				children: planned.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-2.5 rounded-lg border bg-muted/30 px-3 py-2.5 text-[13.5px] transition-colors hover:border-primary/30 hover:bg-muted/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 shrink-0 rounded-full bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: item
					})]
				}, item))
			})]
		})]
	});
}
//#endregion
export { ModulePlaceholder as t };
