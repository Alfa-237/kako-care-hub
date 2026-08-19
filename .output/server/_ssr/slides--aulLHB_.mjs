import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/slides--aulLHB_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthSlideshow({ slides, interval = 5e3, children }) {
	const [index, setIndex] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (slides.length < 2) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), interval);
		return () => clearInterval(id);
	}, [slides.length, interval]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative isolate h-full w-full overflow-hidden",
		children: [
			slides.map((slide, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: slide.src,
				alt: slide.alt,
				width: 1200,
				height: 1600,
				loading: i === 0 ? "eager" : "lazy",
				className: `absolute inset-0 size-full object-cover transition-all duration-[1600ms] ease-out ${i === index ? "scale-105 opacity-100" : "scale-100 opacity-0"}`,
				style: { transitionProperty: "opacity, transform" }
			}, slide.src)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-sidebar/95 via-sidebar/55 to-sidebar/35" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_10%,transparent_35%,var(--sidebar)_120%)] opacity-70" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative flex h-full flex-col justify-between p-8 xl:p-12",
				children
			}),
			slides.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-6 left-8 flex gap-2 xl:left-12",
				children: slides.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setIndex(i),
					"aria-label": `Image ${i + 1}`,
					"aria-current": i === index,
					className: `h-1.5 rounded-full transition-all duration-500 ${i === index ? "w-8 bg-sidebar-primary" : "w-3 bg-sidebar-foreground/40 hover:bg-sidebar-foreground/70"}`
				}, s.src))
			})
		]
	});
}
/** Éléments décoratifs très subtils (formes organiques, étoiles) pour les écrans d'accueil. */
function AuthDecor() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"aria-hidden": true,
		className: "pointer-events-none absolute inset-0 overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-24 -top-24 size-72 rounded-full bg-accent/12 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-32 -left-20 size-80 rounded-full bg-primary/10 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				className: "absolute right-8 top-10 size-6 text-accent/40",
				viewBox: "0 0 24 24",
				fill: "currentColor",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 0l2.2 7.1L21.6 9l-6 4.4 2.2 7.1L12 16.2 6.2 20.5l2.2-7.1-6-4.4 7.4-1.9z" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				className: "absolute bottom-16 right-16 size-4 text-primary/30",
				viewBox: "0 0 24 24",
				fill: "currentColor",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 0l2.2 7.1L21.6 9l-6 4.4 2.2 7.1L12 16.2 6.2 20.5l2.2-7.1-6-4.4 7.4-1.9z" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
				className: "absolute left-6 top-1/3 size-10 text-success/20",
				viewBox: "0 0 48 48",
				fill: "currentColor",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M40 8C24 8 12 18 10 34c-1 8 2 6 2 6s6-18 28-24c0 0-14 8-20 20 12 4 22-6 24-18 1-6-4-10-4-10z" })
			})
		]
	});
}
var enfants_1_default = "/assets/enfants-1-C_Uj68VI.jpg";
var enfants_2_default = "/assets/enfants-2-DEQG8d65.jpg";
var enfants_3_default = "/assets/enfants-3-Bu-O8Obt.jpg";
var enfants_4_default = "/assets/enfants-4-OJvgxZzX.jpg";
var equipe_1_default = "/assets/equipe-1-CAsEgWHg.jpg";
var equipe_2_default = "/assets/equipe-2-BIr0UzCv.jpg";
var equipe_3_default = "/assets/equipe-3-B_vjMvLZ.jpg";
var equipe_4_default = "/assets/equipe-4-4qZISyoj.jpg";
/**
* Visuels d'accueil KAKO Manager.
* Images générées pour le projet (aucune source tierce, aucun watermark),
* libres de droit et utilisables commercialement.
*/
var CHILD_SLIDES = [
	{
		src: enfants_1_default,
		alt: "Enfants joyeux jouant ensemble dans une salle de crèche"
	},
	{
		src: enfants_2_default,
		alt: "Enfants réalisant une activité de dessin"
	},
	{
		src: enfants_3_default,
		alt: "Groupe d'enfants écoutant une histoire en maternelle"
	},
	{
		src: enfants_4_default,
		alt: "Petite fille souriante jouant avec des cubes en bois"
	}
];
var TEAM_SLIDES = [
	{
		src: equipe_1_default,
		alt: "Éducatrice accompagnant des enfants pendant une activité"
	},
	{
		src: equipe_2_default,
		alt: "Directrice de crèche dans son bureau"
	},
	{
		src: equipe_3_default,
		alt: "Équipe éducative en réunion"
	},
	{
		src: equipe_4_default,
		alt: "Éducateur lisant une histoire à des enfants"
	}
];
//#endregion
export { TEAM_SLIDES as i, AuthSlideshow as n, CHILD_SLIDES as r, AuthDecor as t };
