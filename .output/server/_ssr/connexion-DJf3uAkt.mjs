import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useAuth } from "./router-8tilUPKM.mjs";
import { n as Input, r as Label, t as Button } from "./label-Brx6oFEd.mjs";
import { F as LoaderCircle, J as EyeOff, P as Lock, Tt as Baby, j as Mail, n as WifiOff, q as Eye, v as ShieldCheck } from "../_libs/lucide-react.mjs";
import { n as AuthSlideshow, r as CHILD_SLIDES, t as AuthDecor } from "./slides--aulLHB_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/connexion-DJf3uAkt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const { signIn, user, ready } = useAuth();
	const navigate = useNavigate();
	const [username, setUsername] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [remember, setRemember] = (0, import_react.useState)(true);
	const [show, setShow] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (ready && user) navigate({
			to: "/",
			replace: true
		});
	}, [
		ready,
		user,
		navigate
	]);
	async function handleSubmit(e) {
		e.preventDefault();
		setError("");
		if (!username.trim() || !password) {
			setError("Veuillez renseigner votre identifiant et votre mot de passe.");
			return;
		}
		setLoading(true);
		const res = await signIn(username, password);
		setLoading(false);
		if (!res.ok) setError(res.error ?? "Connexion impossible.");
		else navigate({
			to: "/",
			replace: true
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-h-screen bg-background lg:grid-cols-[55fr_45fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "relative hidden lg:block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthSlideshow, {
				slides: CHILD_SLIDES,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 text-sidebar-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid size-11 place-items-center rounded-2xl bg-sidebar-primary text-sidebar-primary-foreground shadow-lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Baby, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-lg font-bold tracking-tight",
							children: "KAKO Manager"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-lg animate-fade-in text-sidebar-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium uppercase tracking-[0.22em] text-sidebar-primary",
								children: "Grandir. Apprendre. S'épanouir."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-4 text-4xl font-bold leading-[1.12] xl:text-5xl",
								children: "La gestion de votre crèche, simplement."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 max-w-md text-sm leading-relaxed text-sidebar-foreground/80",
								children: "Un espace pensé pour les enfants, les éducateurs et ceux qui les accompagnent."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 grid gap-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2 text-sidebar-foreground/80",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WifiOff, { className: "size-4 text-sidebar-primary" }), " Données conservées sur le poste"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2 text-sidebar-foreground/80",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4 text-sidebar-primary" }), " Rôles et permissions appliqués"]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-sidebar-foreground/50",
						children: "Version prototype — Phase 1"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative flex items-center justify-center px-5 py-10 sm:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthDecor, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-x-0 top-0 h-32 overflow-hidden lg:hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthSlideshow, {
						slides: CHILD_SLIDES,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-sidebar-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-8 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Baby, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-bold",
								children: "KAKO Manager"
							})]
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mt-32 w-full max-w-md animate-fade-in lg:mt-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border bg-card p-6 shadow-[var(--shadow-card)] sm:p-9",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden items-center gap-3 lg:flex",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Baby, { className: "size-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-base font-bold",
									children: "KAKO Manager"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-6 text-2xl font-bold sm:text-3xl",
								children: "Bienvenue 👋"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: "Connectez-vous à votre espace de gestion."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleSubmit,
								className: "mt-7 space-y-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "username",
											className: "text-sm",
											children: "Adresse e-mail ou identifiant"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "username",
												autoComplete: "username",
												value: username,
												onChange: (e) => setUsername(e.target.value),
												placeholder: "vous@creche.com",
												className: "h-12 rounded-xl pl-10 text-base transition-colors"
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "password",
											className: "text-sm",
											children: "Mot de passe"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "password",
													type: show ? "text" : "password",
													autoComplete: "current-password",
													value: password,
													onChange: (e) => setPassword(e.target.value),
													placeholder: "••••••••",
													className: "h-12 rounded-xl pl-10 pr-11 text-base"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setShow((s) => !s),
													"aria-label": show ? "Masquer le mot de passe" : "Afficher le mot de passe",
													className: "absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground",
													children: show ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center justify-between gap-3 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex cursor-pointer items-center gap-2 text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: remember,
												onChange: (e) => setRemember(e.target.checked),
												className: "size-4 rounded border-input accent-primary"
											}), "Se souvenir de moi"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "font-medium text-primary underline-offset-4 hover:underline",
											onClick: () => setError("Contactez l'administrateur de votre établissement pour réinitialiser votre mot de passe."),
											children: "Mot de passe oublié ?"
										})]
									}),
									error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive animate-fade-in",
										children: error
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "submit",
										disabled: loading,
										className: "h-12 w-full rounded-xl text-base font-semibold transition-transform hover:-translate-y-0.5",
										children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 size-4 animate-spin" }), "Se connecter"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "my-6 flex items-center gap-4 text-xs uppercase tracking-widest text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" }),
									"ou",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-border" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/inscription",
								className: "flex h-12 w-full items-center justify-center rounded-xl border border-primary/30 bg-primary/5 text-base font-semibold text-primary transition-all hover:-translate-y-0.5 hover:bg-primary/10",
								children: "Créer un compte"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-center text-xs text-muted-foreground",
								children: "Vous n'avez pas encore de compte ? Créez votre espace KAKO."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 rounded-2xl border bg-muted/40 p-4 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-foreground",
							children: "Comptes de démonstration"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-2 grid gap-1 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "admin / admin123" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "directeur / directeur123" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "educateur / educateur123" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "comptable / comptable123" })
							]
						})]
					})]
				})
			]
		})]
	});
}
//#endregion
export { LoginPage as component };
