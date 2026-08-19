import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as mutate, i as logAction, n as useAuth, o as useDatabase } from "./router-8tilUPKM.mjs";
import { a as cn, t as Button } from "./label-Brx6oFEd.mjs";
import { $ as Clock, Dt as Activity, G as FilePenLine, H as Gauge, K as FileExclamationPoint, M as LogOut, N as LogIn, O as NotebookPen, S as Plus, Tt as Baby, V as HeartPulse, X as DatabaseBackup, _ as Sparkles, _t as CalendarX, a as Users, bt as Cake, nt as CircleX, ot as CircleCheck, r as Wallet, x as ReceiptText } from "../_libs/lucide-react.mjs";
import { c as PageHeader, d as formatDateTime, f as formatMoney, l as ageLabel, m as initials, p as fullName, t as AppShell, u as computeDashboard } from "./page-header-COfasL3l.mjs";
import { t as StatCard } from "./stat-card-B743zsoB.mjs";
import { n as Root, t as Indicator } from "../_libs/radix-ui__react-progress.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BF5fLfmm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Panel({ title, icon: Icon, action, children, className, bodyClassName }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("overflow-hidden rounded-xl border bg-card shadow-card transition-colors hover:border-primary/25", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3 border-b bg-muted/25 px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "flex min-w-0 items-center gap-2 text-[15px] font-semibold tracking-tight",
				children: [Icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0 text-primary" }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: title
				})]
			}), action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "shrink-0",
				children: action
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("p-4", bodyClassName),
			children
		})]
	});
}
var tones = {
	neutral: "bg-muted text-muted-foreground",
	success: "bg-success/12 text-success",
	danger: "bg-destructive/12 text-destructive",
	warning: "bg-warning/18 text-warning-foreground",
	info: "bg-info/12 text-info",
	primary: "bg-primary/10 text-primary"
};
function StatusPill({ children, tone = "neutral", className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", tones[tone], className),
		children
	});
}
var Progress = import_react.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Indicator, {
		className: "h-full w-full flex-1 bg-primary transition-all",
		style: { transform: `translateX(-${100 - (value || 0)}%)` }
	})
}));
Progress.displayName = Root.displayName;
function DashboardPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		permission: "dashboard.view",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dashboard, {})
	});
}
function Dashboard() {
	const db = useDatabase();
	const { user, can } = useAuth();
	if (!db) return null;
	const s = computeDashboard(db);
	const currency = db.establishment.currency;
	const quickActions = [
		{
			label: "Ajouter un enfant",
			icon: Plus,
			to: "/enfants",
			perm: "children.edit"
		},
		{
			label: "Enregistrer une arrivée",
			icon: LogIn,
			to: "/presences",
			perm: "attendance.edit"
		},
		{
			label: "Enregistrer un départ",
			icon: LogOut,
			to: "/presences",
			perm: "attendance.edit"
		},
		{
			label: "Ajouter une absence",
			icon: CalendarX,
			to: "/presences",
			perm: "attendance.edit"
		},
		{
			label: "Ajouter une transmission",
			icon: NotebookPen,
			to: "/transmissions",
			perm: "transmissions.edit"
		},
		{
			label: "Créer une facture",
			icon: ReceiptText,
			to: "/facturation",
			perm: "billing.edit"
		},
		{
			label: "Enregistrer un paiement",
			icon: Wallet,
			to: "/paiements",
			perm: "payments.manage"
		}
	].filter((a) => can(a.perm));
	async function handleBackup() {
		const label = `Sauvegarde du ${(/* @__PURE__ */ new Date()).toLocaleString("fr-FR")}`;
		await mutate((d) => {
			d.backups.unshift({
				id: `bkp-${Date.now()}`,
				at: (/* @__PURE__ */ new Date()).toISOString(),
				label,
				size: JSON.stringify(d).length,
				kind: "manuelle"
			});
		});
		await logAction(user, "Sauvegarde manuelle", label);
		toast.success("Sauvegarde locale créée", { description: label });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: `Bonjour ${user?.fullName.split(" ")[0]} 👋`,
				description: `${db.establishment.name} — résumé de la journée`,
				actions: can("backup.manage") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => void handleBackup(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatabaseBackup, { className: "mr-2 size-4" }), " Faire une sauvegarde"]
				}) : null
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Enfants inscrits",
						value: s.enrolled,
						icon: Baby,
						tone: "primary",
						hint: `Capacité : ${db.establishment.capacity} places`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Présents aujourd'hui",
						value: s.present,
						icon: CircleCheck,
						tone: "success",
						hint: `${s.departed} déjà partis`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Absents",
						value: s.absent,
						icon: CircleX,
						tone: "danger",
						hint: `${s.expected} encore attendus`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Retards",
						value: s.late,
						icon: Clock,
						tone: "warning",
						hint: "Arrivées après l'horaire prévu"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border bg-card p-5 shadow-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "text-[15px] font-semibold tracking-tight",
											children: "Taux d'occupation"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[13px] text-muted-foreground",
											children: [
												s.enrolled,
												" enfants inscrits sur ",
												db.establishment.capacity,
												" places"
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "shrink-0 text-2xl font-bold tabular-nums text-primary",
										children: [s.occupancy, "%"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
									value: s.occupancy,
									className: "mt-4 h-2"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-5 grid gap-3 sm:grid-cols-3",
									children: db.sections.map((sec) => {
										const count = db.children.filter((c) => c.sectionId === sec.id && c.status === "Inscrit").length;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg border bg-muted/30 p-3 transition-colors hover:border-primary/30 hover:bg-muted/50",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "truncate text-[13px] font-semibold",
													children: sec.name
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "mt-1 text-xs text-muted-foreground tabular-nums",
													children: [
														count,
														" / ",
														sec.capacity,
														" places"
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
													value: Math.round(count / sec.capacity * 100),
													className: "mt-2 h-1.5"
												})
											]
										}, sec.id);
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "overflow-hidden rounded-xl border bg-card shadow-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3 border-b bg-muted/25 px-5 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-[15px] font-semibold tracking-tight",
									children: "Présences du jour"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/presences",
									className: "text-[13px] font-medium text-primary transition-colors hover:underline",
									children: "Ouvrir le pointage"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "divide-y",
								children: [s.todayAttendance.slice(0, 6).map((a) => {
									const child = db.children.find((c) => c.id === a.childId);
									if (!child) return null;
									const tone = a.state === "present" ? "success" : a.state === "absent" ? "danger" : a.state === "parti" ? "info" : "warning";
									const label = a.state === "present" ? "Présent" : a.state === "absent" ? "Absent" : a.state === "parti" ? "Parti" : "Attendu";
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center gap-3 px-5 py-2.5 transition-colors hover:bg-muted/40",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary",
												children: initials(child)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0 flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "truncate text-[13.5px] font-medium",
													children: fullName(child)
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "truncate text-xs text-muted-foreground",
													children: [
														ageLabel(child.birthDate),
														" ·",
														" ",
														db.sections.find((x) => x.id === child.sectionId)?.name ?? "Sans section"
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "hidden shrink-0 text-xs tabular-nums text-muted-foreground sm:block",
												children: a.arrivalTime ? `Arrivée ${a.arrivalTime}` : "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, {
												tone,
												children: label
											})
										]
									}, a.id);
								}), s.todayAttendance.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "px-5 py-8 text-center text-sm text-muted-foreground",
									children: "Aucun pointage enregistré aujourd'hui."
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Factures impayées",
									value: s.unpaidInvoices,
									icon: ReceiptText,
									tone: "danger",
									hint: formatMoney(s.unpaidAmount, currency)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Documents manquants",
									value: s.missingDocuments,
									icon: FileExclamationPoint,
									tone: "warning",
									hint: "Dossiers incomplets"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Alertes médicales",
									value: s.medicalAlerts,
									icon: HeartPulse,
									tone: "danger",
									hint: "Allergies et traitements"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									label: "Personnel présent",
									value: `${s.staffPresent}/${s.staffTotal}`,
									icon: Users,
									tone: "info",
									hint: "Équipe du jour"
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							title: "Actions rapides",
							icon: Sparkles,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2",
								children: [quickActions.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									className: "justify-start",
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: a.to,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(a.icon, { className: "mr-2 size-4 text-primary" }), a.label]
									})
								}, a.label)), can("backup.manage") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									className: "justify-start",
									onClick: () => void handleBackup(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatabaseBackup, { className: "mr-2 size-4 text-primary" }), " Faire une sauvegarde"]
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							title: "Alertes importantes",
							icon: Gauge,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "space-y-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertRow, {
										icon: Gauge,
										tone: s.occupancy > 95 ? "danger" : "success",
										text: s.occupancy > 95 ? "Capacité d'accueil presque atteinte" : "Capacité d'accueil maîtrisée"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertRow, {
										icon: FilePenLine,
										tone: s.expiringContracts.length ? "warning" : "success",
										text: `${s.expiringContracts.length} contrat(s) arrivant à expiration sous 30 jours`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertRow, {
										icon: HeartPulse,
										tone: s.medicalAlerts ? "danger" : "success",
										text: `${s.medicalAlerts} enfant(s) avec alerte médicale`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertRow, {
										icon: ReceiptText,
										tone: s.unpaidInvoices ? "warning" : "success",
										text: `${s.unpaidInvoices} facture(s) en attente de règlement`
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							title: "Anniversaires à venir",
							icon: Cake,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "space-y-1",
								children: [s.birthdays.slice(0, 4).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-muted/50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: fullName(c)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0 text-xs tabular-nums text-muted-foreground",
										children: new Date(c.birthDate).toLocaleDateString("fr-FR", {
											day: "2-digit",
											month: "short"
										})
									})]
								}, c.id)), s.birthdays.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "px-2 py-1.5 text-sm text-muted-foreground",
									children: "Aucun anniversaire sous 30 jours."
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							title: "Activité récente",
							icon: Activity,
							bodyClassName: "p-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "divide-y",
								children: [db.auditLogs.slice(0, 5).map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "px-4 py-2.5 text-sm transition-colors hover:bg-muted/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate font-medium",
										children: log.action
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "truncate text-xs text-muted-foreground",
										children: [
											log.userName,
											" · ",
											formatDateTime(log.at)
										]
									})]
								}, log.id)), db.auditLogs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "px-4 py-6 text-center text-sm text-muted-foreground",
									children: "Aucune action enregistrée."
								})]
							})
						})
					]
				})]
			})
		]
	});
}
function AlertRow({ icon: Icon, tone, text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex items-start gap-2.5 rounded-lg border bg-muted/30 px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `mt-0.5 size-4 shrink-0 ${{
			success: "text-success",
			warning: "text-warning-foreground",
			danger: "text-destructive"
		}[tone]}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm",
			children: text
		})]
	});
}
//#endregion
export { DashboardPage as component };
