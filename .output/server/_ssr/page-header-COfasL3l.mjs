import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime, d as DialogContent, f as DialogDescription, g as DialogTrigger, h as DialogTitle, l as Dialog, m as DialogPortal, p as DialogOverlay, u as DialogClose } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useAuth, o as useDatabase, r as ROLE_LABELS } from "./router-8tilUPKM.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as cn, n as Input, r as Label, t as Button } from "./label-Brx6oFEd.mjs";
import { Ct as Bell, D as Palette, E as PanelLeftClose, F as LoaderCircle, M as LogOut, O as NotebookPen, P as Lock, R as LayoutDashboard, T as PanelLeftOpen, Tt as Baby, W as FileText, X as DatabaseBackup, a as Users, b as Search, et as ClipboardList, ft as ChevronRight, g as SquareCheckBig, ht as ChartColumn, i as Utensils, k as Menu, lt as ChevronsRight, mt as Check, r as Wallet, t as X, tt as Circle, ut as ChevronsLeft, v as ShieldCheck, vt as CalendarDays, x as ReceiptText, xt as Briefcase, y as Settings } from "../_libs/lucide-react.mjs";
import { a as Label2, c as Root2, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Separator2, n as Content2, o as Portal2, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/page-header-COfasL3l.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAV_ITEMS = [
	{
		label: "Tableau de bord",
		to: "/",
		icon: LayoutDashboard,
		permission: "dashboard.view",
		group: "Pilotage"
	},
	{
		label: "Enfants",
		to: "/enfants",
		icon: Baby,
		permission: "children.view",
		group: "Pilotage"
	},
	{
		label: "Familles",
		to: "/familles",
		icon: Users,
		permission: "families.view",
		group: "Pilotage"
	},
	{
		label: "Inscriptions",
		to: "/inscriptions",
		icon: ClipboardList,
		permission: "enrollment.manage",
		group: "Pilotage"
	},
	{
		label: "Planning",
		to: "/planning",
		icon: CalendarDays,
		permission: "planning.view",
		group: "Vie de la crèche"
	},
	{
		label: "Présences",
		to: "/presences",
		icon: SquareCheckBig,
		permission: "attendance.view",
		group: "Vie de la crèche"
	},
	{
		label: "Transmissions",
		to: "/transmissions",
		icon: NotebookPen,
		permission: "transmissions.view",
		group: "Vie de la crèche"
	},
	{
		label: "Activités",
		to: "/activites",
		icon: Palette,
		permission: "activities.manage",
		group: "Vie de la crèche"
	},
	{
		label: "Repas & Hygiène",
		to: "/repas-hygiene",
		icon: Utensils,
		permission: "care.manage",
		group: "Vie de la crèche"
	},
	{
		label: "Facturation",
		to: "/facturation",
		icon: ReceiptText,
		permission: "billing.view",
		group: "Gestion"
	},
	{
		label: "Paiements",
		to: "/paiements",
		icon: Wallet,
		permission: "payments.manage",
		group: "Gestion"
	},
	{
		label: "Personnel",
		to: "/personnel",
		icon: Briefcase,
		permission: "staff.view",
		group: "Gestion"
	},
	{
		label: "Rapports",
		to: "/rapports",
		icon: ChartColumn,
		permission: "reports.view",
		group: "Gestion"
	},
	{
		label: "Documents",
		to: "/documents",
		icon: FileText,
		permission: "documents.view",
		group: "Gestion"
	},
	{
		label: "Paramètres",
		to: "/parametres",
		icon: Settings,
		permission: "settings.manage",
		group: "Système"
	},
	{
		label: "Sauvegarde",
		to: "/sauvegarde",
		icon: DatabaseBackup,
		permission: "backup.manage",
		group: "Système"
	}
];
var NAV_GROUPS = [
	"Pilotage",
	"Vie de la crèche",
	"Gestion",
	"Système"
];
function AppSidebar({ collapsed, onToggle }) {
	const { user, can, signOut } = useAuth();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: cn("flex h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-out", collapsed ? "w-[76px]" : "w-[262px]"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("flex h-16 items-center gap-3 border-b border-sidebar-border px-4", collapsed && "justify-center px-0"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid size-10 shrink-0 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Baby, { className: "size-5" })
				}), !collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "truncate text-[15px] font-extrabold leading-tight tracking-tight",
						children: ["KAKO ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sidebar-primary",
							children: "MANAGER"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-[11px] text-sidebar-foreground/55",
						children: "Gestion de crèche"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex-1 space-y-5 overflow-y-auto px-3 py-4",
				children: NAV_GROUPS.map((group) => {
					const items = NAV_ITEMS.filter((i) => i.group === group && can(i.permission));
					if (!items.length) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mb-2 h-px w-8 bg-sidebar-border" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-sidebar-foreground/40",
						children: group
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-0.5",
						children: items.map((item) => {
							const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								title: collapsed ? item.label : void 0,
								"aria-current": active ? "page" : void 0,
								className: cn("group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13.5px] font-medium transition-colors duration-150", active ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_0_0_0_1px_var(--sidebar-border)]" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/55 hover:text-sidebar-accent-foreground", collapsed && "justify-center px-0"),
								children: [
									active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-sidebar-primary" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: cn("size-[18px] shrink-0 transition-colors", active ? "text-sidebar-primary" : "group-hover:text-sidebar-primary/80") }),
									!collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: item.label
									})
								]
							}) }, item.to);
						})
					})] }, group);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-sidebar-border p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("flex items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-sidebar-accent/40", collapsed && "justify-center"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid size-9 shrink-0 place-items-center rounded-full bg-sidebar-accent text-xs font-bold text-sidebar-accent-foreground",
							children: user?.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("")
						}),
						!collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-semibold",
								children: user?.fullName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-[11px] text-sidebar-foreground/55",
								children: user ? ROLE_LABELS[user.role] : ""
							})]
						}),
						!collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => void signOut(),
							title: "Se déconnecter",
							className: "rounded-md p-1.5 text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "ghost",
					size: "sm",
					onClick: onToggle,
					title: collapsed ? "Déployer le menu" : "Réduire le menu",
					className: cn("mt-2 w-full justify-center text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"),
					children: [collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsRight, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronsLeft, { className: "size-4" }), !collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-2 text-xs",
						children: "Réduire le menu"
					})]
				})]
			})
		]
	});
}
var todayISO = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
function fullName(c) {
	return `${c.firstName} ${c.lastName}`;
}
function initials(c) {
	return `${c.firstName[0] ?? ""}${c.lastName[0] ?? ""}`.toUpperCase();
}
function ageLabel(birthDate) {
	const b = new Date(birthDate);
	const now = /* @__PURE__ */ new Date();
	let months = (now.getFullYear() - b.getFullYear()) * 12 + (now.getMonth() - b.getMonth());
	if (now.getDate() < b.getDate()) months -= 1;
	if (months < 24) return `${months} mois`;
	return `${Math.floor(months / 12)} ans`;
}
function formatMoney(amount, currency) {
	return `${new Intl.NumberFormat("fr-FR").format(Math.round(amount))} ${currency}`;
}
function formatDateTime(d) {
	return new Date(d).toLocaleString("fr-FR", {
		day: "2-digit",
		month: "2-digit",
		hour: "2-digit",
		minute: "2-digit"
	});
}
function computeDashboard(db) {
	const today = todayISO();
	const enrolledChildren = db.children.filter((c) => c.status === "Inscrit");
	const att = db.attendance.filter((a) => a.date === today);
	const unpaid = db.invoices.filter((i) => i.status === "Non payée" || i.status === "Partiellement payée" || i.status === "En retard");
	const now = /* @__PURE__ */ new Date();
	const in30 = /* @__PURE__ */ new Date();
	in30.setDate(in30.getDate() + 30);
	const birthdays = enrolledChildren.filter((c) => {
		const b = new Date(c.birthDate);
		const next = new Date(now.getFullYear(), b.getMonth(), b.getDate());
		if (next < new Date(now.getFullYear(), now.getMonth(), now.getDate())) next.setFullYear(now.getFullYear() + 1);
		return (next.getTime() - now.getTime()) / 864e5 <= 30;
	});
	const expiringContracts = enrolledChildren.filter((c) => c.contractEndDate && new Date(c.contractEndDate) <= in30);
	return {
		enrolled: enrolledChildren.length,
		present: att.filter((a) => a.state === "present").length,
		absent: att.filter((a) => a.state === "absent").length,
		expected: att.filter((a) => a.state === "attendu").length,
		late: att.filter((a) => a.late).length,
		departed: att.filter((a) => a.state === "parti").length,
		unpaidInvoices: unpaid.length,
		unpaidAmount: unpaid.reduce((s, i) => s + (i.total - i.discount - i.paidAmount), 0),
		missingDocuments: db.children.filter((c) => c.missingDocuments.length > 0).length,
		medicalAlerts: db.children.filter((c) => c.medicalAlert).length,
		staffPresent: db.employees.filter((e) => e.presentToday).length,
		staffTotal: db.employees.length,
		occupancy: db.establishment.capacity ? Math.round(enrolledChildren.length / db.establishment.capacity * 100) : 0,
		birthdays,
		expiringContracts,
		todayAttendance: att
	};
}
var Sheet = Dialog;
var SheetTrigger = DialogTrigger;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
function AppHeader({ collapsed = false, onToggleSidebar }) {
	const { user, signOut } = useAuth();
	const db = useDatabase();
	const [query, setQuery] = (0, import_react.useState)("");
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const stats = db ? computeDashboard(db) : null;
	const alerts = stats ? stats.medicalAlerts + stats.missingDocuments + stats.unpaidInvoices : 0;
	const results = query.length > 1 && db ? db.children.filter((c) => fullName(c).toLowerCase().includes(query.toLowerCase())).slice(0, 5) : [];
	const today = (/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-card/90 px-3 backdrop-blur-md md:px-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
				open: mobileOpen,
				onOpenChange: setMobileOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						className: "md:hidden",
						"aria-label": "Ouvrir le menu",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
					side: "left",
					className: "w-[262px] border-0 p-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
						className: "sr-only",
						children: "Navigation"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSidebar, {
						collapsed: false,
						onToggle: () => setMobileOpen(false)
					})]
				})]
			}),
			onToggleSidebar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "icon",
				onClick: onToggleSidebar,
				"aria-label": collapsed ? "Déployer le menu" : "Réduire le menu",
				title: collapsed ? "Déployer le menu" : "Réduire le menu",
				className: "hidden text-muted-foreground hover:text-foreground md:inline-flex",
				children: collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftOpen, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftClose, { className: "size-5" })
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative min-w-0 flex-1 max-w-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "Rechercher un enfant, une famille…",
						className: "h-9 rounded-full bg-muted/50 pl-9 transition-colors focus-visible:bg-card"
					}),
					results.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute left-0 right-0 top-11 z-40 animate-fade-in overflow-hidden rounded-xl border bg-popover shadow-lg",
						children: results.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/enfants",
							onClick: () => setQuery(""),
							className: "flex items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: fullName(c)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: c.fileNumber
							})]
						}, c.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "ml-2 hidden shrink-0 text-xs font-medium text-muted-foreground lg:block first-letter:uppercase",
				children: today
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ml-auto flex shrink-0 items-center gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						className: "relative text-muted-foreground hover:text-foreground",
						"aria-label": "Alertes",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-5" }), alerts > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground ring-2 ring-card",
								children: alerts > 9 ? "9+" : alerts
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						className: "hidden text-muted-foreground hover:text-foreground sm:inline-flex",
						"aria-label": "Paramètres",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/parametres",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-5" })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-1 hidden h-6 w-px bg-border sm:block" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							className: "h-10 gap-2 px-1.5 sm:pr-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-8 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary",
								children: user?.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "hidden text-left leading-tight sm:block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-[13px] font-semibold",
									children: user?.fullName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-[11px] font-normal text-muted-foreground",
									children: user ? ROLE_LABELS[user.role] : ""
								})]
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
						align: "end",
						className: "w-56",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuLabel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold",
								children: user?.fullName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-1 text-xs font-normal text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3" }),
									" ",
									user ? ROLE_LABELS[user.role] : ""
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/parametres",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "mr-2 size-4" }), " Paramètres"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onClick: () => window.dispatchEvent(new Event("kako:lock")),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "mr-2 size-4" }), " Verrouiller la session"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								onClick: () => void signOut(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-2 size-4" }), " Se déconnecter"]
							})
						]
					})] })
				]
			})
		]
	});
}
function FullScreenLoader() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm",
				children: "Chargement de KAKO Manager…"
			})]
		})
	});
}
function LockScreen() {
	const { user, unlock, signOut } = useAuth();
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-sidebar px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: async (e) => {
				e.preventDefault();
				if (!await unlock(password)) setError("Mot de passe incorrect.");
				else {
					setError("");
					setPassword("");
				}
			},
			className: "w-full max-w-sm rounded-xl border border-sidebar-border bg-card p-6 shadow-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-10 place-items-center rounded-xl bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold",
							children: "Session verrouillée"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs text-muted-foreground",
							children: user?.fullName
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "lock-pass",
					children: "Mot de passe"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "lock-pass",
					type: "password",
					autoFocus: true,
					value: password,
					onChange: (e) => setPassword(e.target.value),
					className: "mt-1.5"
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-destructive",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: "mt-4 w-full",
					children: "Déverrouiller"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					className: "mt-2 w-full",
					onClick: () => void signOut(),
					children: "Changer d'utilisateur"
				})
			]
		})
	});
}
function AppShell({ children, permission }) {
	const { ready, user, locked, can } = useAuth();
	const navigate = useNavigate();
	const [collapsed, setCollapsed] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		setCollapsed(window.localStorage.getItem("kako:sidebar-collapsed") === "1");
	}, []);
	const toggleSidebar = () => setCollapsed((c) => {
		const next = !c;
		if (typeof window !== "undefined") window.localStorage.setItem("kako:sidebar-collapsed", next ? "1" : "0");
		return next;
	});
	(0, import_react.useEffect)(() => {
		if (ready && !user) navigate({
			to: "/connexion",
			replace: true
		});
	}, [
		ready,
		user,
		navigate
	]);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FullScreenLoader, {});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FullScreenLoader, {});
	if (locked) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockScreen, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen w-full bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hidden md:block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sticky top-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSidebar, {
					collapsed,
					onToggle: toggleSidebar
				})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {
				collapsed,
				onToggleSidebar: toggleSidebar
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto w-full max-w-[1500px] flex-1 px-4 py-5 md:px-7 md:py-6",
				children: permission && !can(permission) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessDenied, {}) : children
			})]
		})]
	});
}
function AccessDenied() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md rounded-xl border bg-card p-8 text-center shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid size-12 place-items-center rounded-xl bg-destructive/10 text-destructive",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Baby, { className: "size-6" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-4 text-lg font-semibold",
				children: "Accès non autorisé"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Votre rôle ne vous permet pas de consulter ce module. Contactez un administrateur si vous pensez qu'il s'agit d'une erreur."
			})
		]
	});
}
function PageHeader({ title, description, actions, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: cn("grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:items-center sm:justify-between", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "truncate text-[22px] font-bold leading-tight tracking-tight md:text-[26px]",
				children: title
			}), description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 truncate text-[13px] text-muted-foreground",
				children: description
			}) : null]
		}), actions ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex shrink-0 flex-wrap gap-2",
			children: actions
		}) : null]
	});
}
//#endregion
export { DropdownMenuLabel as a, PageHeader as c, formatDateTime as d, formatMoney as f, DropdownMenuItem as i, ageLabel as l, initials as m, DropdownMenu as n, DropdownMenuSeparator as o, fullName as p, DropdownMenuContent as r, DropdownMenuTrigger as s, AppShell as t, computeDashboard as u };
