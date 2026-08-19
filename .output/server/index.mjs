globalThis.__nitro_main__ = import.meta.url;
import { n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-08-19T18:50:31.252Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-08-19T18:50:31.252Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/activites-Ca_8u-W3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ec-Bg3DrrkcGxdz/9NMiLaWzCVOISg\"",
		"mtime": "2026-08-19T18:50:29.311Z",
		"size": 492,
		"path": "../public/assets/activites-Ca_8u-W3.js"
	},
	"/assets/circle-check-DfiTsA49.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a7-ELoiiFLt39+TdX341NMtXG1iRBQ\"",
		"mtime": "2026-08-19T18:50:29.311Z",
		"size": 167,
		"path": "../public/assets/circle-check-DfiTsA49.js"
	},
	"/assets/connexion-wHSmwOxd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e5c-ESVjmHGKZkwKGTxM8VD3drX8RXQ\"",
		"mtime": "2026-08-19T18:50:29.311Z",
		"size": 7772,
		"path": "../public/assets/connexion-wHSmwOxd.js"
	},
	"/assets/documents-CdBL1T5c.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1bc-2+jXQZFQPvAfbUPlxmFJE+gwHKo\"",
		"mtime": "2026-08-19T18:50:29.311Z",
		"size": 444,
		"path": "../public/assets/documents-CdBL1T5c.js"
	},
	"/assets/enfants-1-C_Uj68VI.jpg": {
		"type": "image/jpeg",
		"etag": "\"24949-RoJB9bplctZmibUihgfwCacVlW8\"",
		"mtime": "2026-08-19T18:50:29.312Z",
		"size": 149833,
		"path": "../public/assets/enfants-1-C_Uj68VI.jpg"
	},
	"/assets/enfants-2-DEQG8d65.jpg": {
		"type": "image/jpeg",
		"etag": "\"19746-iTYNBe2BUudP737SEARi8phz/+g\"",
		"mtime": "2026-08-19T18:50:29.312Z",
		"size": 104262,
		"path": "../public/assets/enfants-2-DEQG8d65.jpg"
	},
	"/assets/enfants-3-Bu-O8Obt.jpg": {
		"type": "image/jpeg",
		"etag": "\"20d3d-dHHJjDP6oqlkx8uGFKu5TXauHg4\"",
		"mtime": "2026-08-19T18:50:29.312Z",
		"size": 134461,
		"path": "../public/assets/enfants-3-Bu-O8Obt.jpg"
	},
	"/assets/enfants-4-OJvgxZzX.jpg": {
		"type": "image/jpeg",
		"etag": "\"30e3f-UXrXgQvejNMI8gtq7Iqwx0JNWdQ\"",
		"mtime": "2026-08-19T18:50:29.312Z",
		"size": 200255,
		"path": "../public/assets/enfants-4-OJvgxZzX.jpg"
	},
	"/assets/enfants-puO915Zk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15a8c-5eQDCYL5Ok/HFqL/Ja9my39hHRY\"",
		"mtime": "2026-08-19T18:50:29.311Z",
		"size": 88716,
		"path": "../public/assets/enfants-puO915Zk.js"
	},
	"/assets/equipe-1-CAsEgWHg.jpg": {
		"type": "image/jpeg",
		"etag": "\"22285-URPw2nDlxaZJxJo2xPN5t/DMbcM\"",
		"mtime": "2026-08-19T18:50:29.312Z",
		"size": 139909,
		"path": "../public/assets/equipe-1-CAsEgWHg.jpg"
	},
	"/assets/equipe-2-BIr0UzCv.jpg": {
		"type": "image/jpeg",
		"etag": "\"1cb13-5nbMSoN7pZLFjIkxoI2vcCtKQA8\"",
		"mtime": "2026-08-19T18:50:29.313Z",
		"size": 117523,
		"path": "../public/assets/equipe-2-BIr0UzCv.jpg"
	},
	"/assets/equipe-3-B_vjMvLZ.jpg": {
		"type": "image/jpeg",
		"etag": "\"23332-GwWNUU6gkIDAaAzQ5D4anP8NPjM\"",
		"mtime": "2026-08-19T18:50:29.313Z",
		"size": 144178,
		"path": "../public/assets/equipe-3-B_vjMvLZ.jpg"
	},
	"/assets/equipe-4-4qZISyoj.jpg": {
		"type": "image/jpeg",
		"etag": "\"1de52-ZGnvV7g3x3ADEX1bdL1CkfshyVg\"",
		"mtime": "2026-08-19T18:50:29.313Z",
		"size": 122450,
		"path": "../public/assets/equipe-4-4qZISyoj.jpg"
	},
	"/assets/eye-Bq3xZg8K.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f5-HNTEcLILAlWmsEqhZkC3wf09f3Q\"",
		"mtime": "2026-08-19T18:50:29.311Z",
		"size": 245,
		"path": "../public/assets/eye-Bq3xZg8K.js"
	},
	"/assets/facturation-CTwGtrbn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c4-WOhcT4sU2T3+dM2/B4PUYvNt6Ho\"",
		"mtime": "2026-08-19T18:50:29.311Z",
		"size": 452,
		"path": "../public/assets/facturation-CTwGtrbn.js"
	},
	"/assets/familles-B21X0gJU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"202-ein/TPb11+NU/uPsclhbPCOmhqg\"",
		"mtime": "2026-08-19T18:50:29.311Z",
		"size": 514,
		"path": "../public/assets/familles-B21X0gJU.js"
	},
	"/assets/index-CFKL00sk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"61f2d-LTgVQxuP/0EXoJpsgceYUX5WwBc\"",
		"mtime": "2026-08-19T18:50:29.311Z",
		"size": 401197,
		"path": "../public/assets/index-CFKL00sk.js"
	},
	"/assets/inscription-CGqhJjoy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"21f0-7idKq6+C2zpiyE/8DvqsTVsFZNY\"",
		"mtime": "2026-08-19T18:50:29.311Z",
		"size": 8688,
		"path": "../public/assets/inscription-CGqhJjoy.js"
	},
	"/assets/inscriptions-BN8atLhs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ed-7LCvAeuVGv5Gz2+MnefUv9jq6fM\"",
		"mtime": "2026-08-19T18:50:29.311Z",
		"size": 493,
		"path": "../public/assets/inscriptions-BN8atLhs.js"
	},
	"/assets/label-9LnE93ZW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8946-viEfCvH/M8hvwIIxBRSo2ym0LBE\"",
		"mtime": "2026-08-19T18:50:29.311Z",
		"size": 35142,
		"path": "../public/assets/label-9LnE93ZW.js"
	},
	"/assets/mail-4hXRLJLo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ca-9F+Lr9ZserdnYrHhI+6bvkueKVc\"",
		"mtime": "2026-08-19T18:50:29.312Z",
		"size": 202,
		"path": "../public/assets/mail-4hXRLJLo.js"
	},
	"/assets/module-placeholder-hw1oSugi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"701-f2KiF5Ac6ffkFdk15oVlsDqaJwk\"",
		"mtime": "2026-08-19T18:50:29.312Z",
		"size": 1793,
		"path": "../public/assets/module-placeholder-hw1oSugi.js"
	},
	"/assets/page-header-CkxjtfWE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c3fe-Yp7QJGbnx2u65VAj8ZnBWcNH5j4\"",
		"mtime": "2026-08-19T18:50:29.312Z",
		"size": 115710,
		"path": "../public/assets/page-header-CkxjtfWE.js"
	},
	"/assets/paiements-5GT-i8B9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b8-muF+w/exDuzDUd+jY3ktFH2VhNc\"",
		"mtime": "2026-08-19T18:50:29.312Z",
		"size": 440,
		"path": "../public/assets/paiements-5GT-i8B9.js"
	},
	"/assets/parametres-BFKI4nkx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f9-O77AJs3syQALFrUWiV2XGvp89r4\"",
		"mtime": "2026-08-19T18:50:29.312Z",
		"size": 505,
		"path": "../public/assets/parametres-BFKI4nkx.js"
	},
	"/assets/personnel-SEw5C1Rg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ad-cYrvINqp0LzDq1h8P1SeKc4yJYk\"",
		"mtime": "2026-08-19T18:50:29.312Z",
		"size": 429,
		"path": "../public/assets/personnel-SEw5C1Rg.js"
	},
	"/assets/planning-BpLAnXsm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e0-8KffDaOLKMHscT5nnNBdkDwMSJ0\"",
		"mtime": "2026-08-19T18:50:29.312Z",
		"size": 480,
		"path": "../public/assets/planning-BpLAnXsm.js"
	},
	"/assets/presences-B6pMG6YM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e1-PWr09cjrl8ZFwZoDCUazbCiqVrE\"",
		"mtime": "2026-08-19T18:50:29.312Z",
		"size": 481,
		"path": "../public/assets/presences-B6pMG6YM.js"
	},
	"/assets/rapports-aBp8c23c.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1bc-kbtUi16Xs8zysUmFNdXjkqmVo3A\"",
		"mtime": "2026-08-19T18:50:29.312Z",
		"size": 444,
		"path": "../public/assets/rapports-aBp8c23c.js"
	},
	"/assets/repas-hygiene-D5ujITop.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1b1-qlHrMIpkrtmpZR6GuctR19lot3Y\"",
		"mtime": "2026-08-19T18:50:29.312Z",
		"size": 433,
		"path": "../public/assets/repas-hygiene-D5ujITop.js"
	},
	"/assets/routes-BMknkYvY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"38f4-OywtAABh0l63dTe4ZuG74cakxeg\"",
		"mtime": "2026-08-19T18:50:29.312Z",
		"size": 14580,
		"path": "../public/assets/routes-BMknkYvY.js"
	},
	"/assets/sauvegarde-okzpcjt3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e6-OCoBWgW8oH3NnMqjJGof/Ex/tGY\"",
		"mtime": "2026-08-19T18:50:29.312Z",
		"size": 486,
		"path": "../public/assets/sauvegarde-okzpcjt3.js"
	},
	"/assets/shield-check-CAj9Qbmv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ce-ZPFmrPjxAe1Nqw/twbxTkExdUUA\"",
		"mtime": "2026-08-19T18:50:29.312Z",
		"size": 462,
		"path": "../public/assets/shield-check-CAj9Qbmv.js"
	},
	"/assets/slides-D4l00xn7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e9b-M6ImO/xMoraMWoi/0hB5wKpySSA\"",
		"mtime": "2026-08-19T18:50:29.312Z",
		"size": 3739,
		"path": "../public/assets/slides-D4l00xn7.js"
	},
	"/assets/stat-card-B7G9Q4SW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9ef-+lZ3Uqz8XhS80NioTE6tDMAao8A\"",
		"mtime": "2026-08-19T18:50:29.312Z",
		"size": 2543,
		"path": "../public/assets/stat-card-B7G9Q4SW.js"
	},
	"/assets/styles-lxGCre9a.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"18628-5fYEyR8mHcOlu0kZWdrPHATPEp8\"",
		"mtime": "2026-08-19T18:50:29.313Z",
		"size": 99880,
		"path": "../public/assets/styles-lxGCre9a.css"
	},
	"/assets/transmissions-CmBe2lFO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c9-UmiOgEVwxBkfUcT8xB2VJWoh2jI\"",
		"mtime": "2026-08-19T18:50:29.312Z",
		"size": 457,
		"path": "../public/assets/transmissions-CmBe2lFO.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_IO091Z = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_IO091Z
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
