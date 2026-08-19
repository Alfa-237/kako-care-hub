import { r as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime, a as Overlay2, c as Title2, d as DialogContent$1, f as DialogDescription$1, h as DialogTitle$1, i as Description2, l as Dialog$1, m as DialogPortal$1, n as Cancel, o as Portal2, p as DialogOverlay$1, r as Content2, s as Root2, t as Action, u as DialogClose } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as mutate, i as logAction, n as useAuth, o as useDatabase } from "./router-8tilUPKM.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as cn, i as buttonVariants, n as Input, t as Button } from "./label-Brx6oFEd.mjs";
import { $ as Clock, A as MapPin, B as History, C as Phone, Dt as Activity, Et as Archive, I as ListFilter, L as LayoutGrid, St as BookOpen, Tt as Baby, U as FolderOpen, W as FileText, Y as EllipsisVertical, Z as CreditCard, a as Users, at as CirclePause, b as Search, c as UserRound, ct as CircleAlert, d as TrendingUp, dt as ChevronUp, et as ClipboardList, gt as Calendar, h as SquarePen, i as Utensils, it as CirclePlay, j as Mail, l as UserCheck, m as Stethoscope, mt as Check, nt as CircleX, o as User, p as Trash2, pt as ChevronDown, q as Eye, rt as CircleQuestionMark, s as UserX, st as CircleCheckBig, t as X, u as TriangleAlert, vt as CalendarDays, w as Pencil, wt as BadgeCheck, yt as CalendarCheck, z as Languages } from "../_libs/lucide-react.mjs";
import { a as DropdownMenuLabel, c as PageHeader, i as DropdownMenuItem, n as DropdownMenu, o as DropdownMenuSeparator, r as DropdownMenuContent, s as DropdownMenuTrigger, t as AppShell } from "./page-header-COfasL3l.mjs";
import { t as StatCard } from "./stat-card-B743zsoB.mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
import { n as AvatarFallback$1, r as AvatarImage$1, t as Avatar$1 } from "../_libs/radix-ui__react-avatar.mjs";
import { i as Trigger, n as List, r as Root2$1, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/enfants-BblSfHuD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var defaultFilters = {
	search: "",
	status: "all",
	sectionId: "all",
	gender: "all",
	language: "all",
	hasMedicalAlert: "all",
	hasMissingDocuments: "all"
};
function useEnfants() {
	const db = useDatabase();
	const { user } = useAuth();
	const [filters, setFilters] = (0, import_react.useState)(defaultFilters);
	const [viewMode, setViewMode] = (0, import_react.useState)("table");
	const sectionsMap = (0, import_react.useMemo)(() => {
		if (!db) return /* @__PURE__ */ new Map();
		return new Map(db.sections.map((s) => [s.id, s]));
	}, [db]);
	const stats = (0, import_react.useMemo)(() => {
		if (!db) return {
			total: 0,
			inscrits: 0,
			preinscrits: 0,
			suspendus: 0,
			sortis: 0,
			nouveauxRecemment: 0,
			avecAlertesMedicales: 0,
			avecDocumentsManquants: 0
		};
		const thirtyDaysAgo = /* @__PURE__ */ new Date((/* @__PURE__ */ new Date()).getTime() - 2592e6);
		return {
			total: db.children.length,
			inscrits: db.children.filter((c) => c.status === "Inscrit").length,
			preinscrits: db.children.filter((c) => c.status === "Préinscrit").length,
			suspendus: db.children.filter((c) => c.status === "Suspendu").length,
			sortis: db.children.filter((c) => c.status === "Sorti").length,
			nouveauxRecemment: db.children.filter((c) => new Date(c.registrationDate) >= thirtyDaysAgo).length,
			avecAlertesMedicales: db.children.filter((c) => c.medicalAlert).length,
			avecDocumentsManquants: db.children.filter((c) => c.missingDocuments.length > 0).length
		};
	}, [db]);
	const filteredChildren = (0, import_react.useMemo)(() => {
		if (!db) return [];
		return db.children.filter((child) => {
			if (filters.search) {
				const searchLower = filters.search.toLowerCase();
				const matchName = child.firstName.toLowerCase().includes(searchLower) || child.lastName.toLowerCase().includes(searchLower);
				const matchFileNumber = child.fileNumber.toLowerCase().includes(searchLower);
				const childParentIds = db.childParents.filter((cp) => cp.childId === child.id).map((cp) => cp.parentId);
				const matchParent = db.parents.filter((p) => childParentIds.includes(p.id)).some((p) => p.firstName.toLowerCase().includes(searchLower) || p.lastName.toLowerCase().includes(searchLower));
				const matchSection = (child.sectionId ? sectionsMap.get(child.sectionId) : null)?.name.toLowerCase().includes(searchLower);
				if (!matchName && !matchFileNumber && !matchParent && !matchSection) return false;
			}
			if (filters.status !== "all" && child.status !== filters.status) return false;
			if (filters.sectionId !== "all" && child.sectionId !== filters.sectionId) return false;
			if (filters.gender !== "all" && child.gender !== filters.gender) return false;
			if (filters.language !== "all" && child.language !== filters.language) return false;
			if (filters.hasMedicalAlert !== "all") {
				if (!!child.medicalAlert !== filters.hasMedicalAlert) return false;
			}
			if (filters.hasMissingDocuments !== "all") {
				if (child.missingDocuments.length > 0 !== filters.hasMissingDocuments) return false;
			}
			return true;
		});
	}, [
		db,
		filters,
		sectionsMap
	]);
	const availableLanguages = (0, import_react.useMemo)(() => {
		if (!db) return [];
		const langs = new Set(db.children.map((c) => c.language));
		return Array.from(langs).sort();
	}, [db]);
	const resetFilters = () => setFilters(defaultFilters);
	const calculateAge = (0, import_react.useCallback)((birthDate) => {
		const birth = new Date(birthDate);
		const today = /* @__PURE__ */ new Date();
		let age = today.getFullYear() - birth.getFullYear();
		const monthDiff = today.getMonth() - birth.getMonth();
		if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birth.getDate()) age--;
		return age;
	}, []);
	const getPrimaryParent = (0, import_react.useCallback)((childId) => {
		if (!db) return null;
		const childParent = db.childParents.find((cp) => cp.childId === childId && cp.relation === "parent-principal");
		if (childParent) return db.parents.find((p) => p.id === childParent.parentId) || null;
		const firstChildParent = db.childParents.find((cp) => cp.childId === childId);
		if (firstChildParent) return db.parents.find((p) => p.id === firstChildParent.parentId) || null;
		return null;
	}, [db]);
	const hasAttendanceToday = (0, import_react.useCallback)((childId) => {
		if (!db) return false;
		const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
		return db.attendance.some((a) => a.childId === childId && a.date === today && a.state === "present");
	}, [db]);
	const archiveChild = (0, import_react.useCallback)(async (childId) => {
		await mutate((draft) => {
			const child = draft.children.find((c) => c.id === childId);
			if (child) {
				child.status = "Sorti";
				child.contractEndDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
			}
		});
		await logAction(user, "enfant.archive", `Enfant ${childId} archivé`);
	}, [user]);
	const suspendChild = (0, import_react.useCallback)(async (childId) => {
		await mutate((draft) => {
			const child = draft.children.find((c) => c.id === childId);
			if (child && child.status !== "Sorti") child.status = "Suspendu";
		});
		await logAction(user, "enfant.suspend", `Enfant ${childId} suspendu`);
	}, [user]);
	const reactivateChild = (0, import_react.useCallback)(async (childId) => {
		await mutate((draft) => {
			const child = draft.children.find((c) => c.id === childId);
			if (child && child.status === "Suspendu") child.status = "Inscrit";
		});
		await logAction(user, "enfant.reactivate", `Enfant ${childId} réactivé`);
	}, [user]);
	const deleteChild = (0, import_react.useCallback)(async (childId) => {
		await mutate((draft) => {
			const hasInvoices = draft.invoices.some((i) => i.childId === childId);
			const hasAttendance = draft.attendance.some((a) => a.childId === childId);
			const hasActivities = draft.activities.some((a) => a.childIds.includes(childId));
			if (!hasInvoices && !hasAttendance && !hasActivities) {
				draft.children = draft.children.filter((c) => c.id !== childId);
				draft.childParents = draft.childParents.filter((cp) => cp.childId !== childId);
			}
		});
		await logAction(user, "enfant.delete", `Enfant ${childId} supprimé`);
	}, [user]);
	return {
		children: filteredChildren,
		allChildren: db?.children ?? [],
		stats,
		filters,
		setFilters,
		viewMode,
		setViewMode,
		sections: db?.sections ?? [],
		sectionsMap,
		availableLanguages,
		resetFilters,
		loading: !db,
		calculateAge,
		getPrimaryParent,
		hasAttendanceToday,
		archiveChild,
		suspendChild,
		reactivateChild,
		deleteChild,
		canDelete: (childId) => {
			if (!db) return false;
			const hasInvoices = db.invoices.some((i) => i.childId === childId);
			const hasAttendance = db.attendance.some((a) => a.childId === childId);
			const hasActivities = db.activities.some((a) => a.childIds.includes(childId));
			return !hasInvoices && !hasAttendance && !hasActivities;
		}
	};
}
var Avatar = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar$1, {
	ref,
	className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
	...props
}));
Avatar.displayName = Avatar$1.displayName;
var AvatarImage = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage$1, {
	ref,
	className: cn("aspect-square h-full w-full", className),
	...props
}));
AvatarImage.displayName = AvatarImage$1.displayName;
var AvatarFallback = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback$1, {
	ref,
	className: cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className),
	...props
}));
AvatarFallback.displayName = AvatarFallback$1.displayName;
var Card = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
	...props
}));
Card.displayName = "Card";
var CardHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex flex-col space-y-1.5 p-6", className),
	...props
}));
CardHeader.displayName = "CardHeader";
var CardTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("font-semibold leading-none tracking-tight", className),
	...props
}));
CardTitle.displayName = "CardTitle";
var CardDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
CardDescription.displayName = "CardDescription";
var CardContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("p-6 pt-0", className),
	...props
}));
CardContent.displayName = "CardContent";
var CardFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex items-center p-6 pt-0", className),
	...props
}));
CardFooter.displayName = "CardFooter";
var Table = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "relative w-full overflow-auto",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
		ref,
		className: cn("w-full caption-bottom text-sm", className),
		...props
	})
}));
Table.displayName = "Table";
var TableHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
	ref,
	className: cn("[&_tr]:border-b", className),
	...props
}));
TableHeader.displayName = "TableHeader";
var TableBody = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
	ref,
	className: cn("[&_tr:last-child]:border-0", className),
	...props
}));
TableBody.displayName = "TableBody";
var TableFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", {
	ref,
	className: cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
	...props
}));
TableFooter.displayName = "TableFooter";
var TableRow = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
	ref,
	className: cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className),
	...props
}));
TableRow.displayName = "TableRow";
var TableHead = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
	ref,
	className: cn("h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}));
TableHead.displayName = "TableHead";
var TableCell = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
	ref,
	className: cn("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}));
TableCell.displayName = "TableCell";
var TableCaption = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("caption", {
	ref,
	className: cn("mt-4 text-sm text-muted-foreground", className),
	...props
}));
TableCaption.displayName = "TableCaption";
function EnfantsListView({ children, sectionsMap, calculateAge, getPrimaryParent, hasAttendanceToday, canEdit, canDelete, canArchive, onViewChild, onEditChild, onArchiveChild, onSuspendChild, onReactivateChild, onDeleteChild, canUserDelete }) {
	const getStatusBadge = (status) => {
		switch (status) {
			case "Inscrit": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "default",
				className: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
				children: "Inscrit"
			});
			case "Préinscrit": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "secondary",
				className: "bg-blue-500/10 text-blue-600 border-blue-200",
				children: "Préinscrit"
			});
			case "Suspendu": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "secondary",
				className: "bg-amber-500/10 text-amber-600 border-amber-200",
				children: "Suspendu"
			});
			case "Sorti": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "outline",
				className: "text-muted-foreground",
				children: "Sorti"
			});
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "outline",
				children: status
			});
		}
	};
	const getGenderIcon = (gender) => {
		return gender === "F" ? "👧" : "👦";
	};
	const getChildPhoto = (child) => {
		if (child.photo) return child.photo;
		return null;
	};
	const getChildInitials = (child) => {
		return `${child.firstName[0]}${child.lastName[0]}`.toUpperCase();
	};
	const renderActionsMenu = (child) => {
		const isDeletable = canUserDelete(child.id);
		const canSuspend = canArchive && child.status === "Inscrit";
		const canReactivate = canArchive && child.status === "Suspendu";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "icon",
				className: "h-8 w-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sr-only",
					children: "Actions"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
			align: "end",
			className: "w-56",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, { children: "Actions" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					onClick: () => onViewChild(child.id),
					className: "cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "mr-2 h-4 w-4" }), "Voir la fiche"]
				}),
				canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					onClick: () => onEditChild(child.id),
					className: "cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "mr-2 h-4 w-4" }), "Modifier"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
				canSuspend && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					onClick: () => onSuspendChild(child.id),
					className: "cursor-pointer text-amber-600",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePause, { className: "mr-2 h-4 w-4" }), "Suspendre"]
				}),
				canReactivate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					onClick: () => onReactivateChild(child.id),
					className: "cursor-pointer text-emerald-600",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "mr-2 h-4 w-4" }), "Réactiver"]
				}),
				canArchive && child.status !== "Sorti" && !canSuspend && !canReactivate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					onClick: () => onArchiveChild(child.id),
					className: "cursor-pointer text-orange-600",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "mr-2 h-4 w-4" }), "Archiver / Sortir"]
				}),
				canDelete && isDeletable && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					onClick: () => onDeleteChild(child.id),
					className: "cursor-pointer text-destructive",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-2 h-4 w-4" }), "Supprimer"]
				})] }),
				!isDeletable && canDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					disabled: true,
					className: "cursor-not-allowed",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-2 h-4 w-4" }), "Supprimer (données liées)"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					className: "cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "mr-2 h-4 w-4" }), "Ajouter une présence"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					className: "cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mr-2 h-4 w-4" }), "Voir les parents"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					className: "cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "mr-2 h-4 w-4" }), "Voir les paiements"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					className: "cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "mr-2 h-4 w-4" }), "Voir les activités"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					className: "cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Utensils, { className: "mr-2 h-4 w-4" }), "Voir les repas"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					className: "cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "mr-2 h-4 w-4" }), "Voir les documents"]
				})
			]
		})] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl border bg-card shadow-sm overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
			className: "bg-muted/30",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "w-[60px]",
					children: "Photo"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Enfant" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "w-[80px]",
					children: "Âge"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "w-[70px]",
					children: "Sexe"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Section" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Parent principal" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "w-[100px]",
					children: "Statut"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "w-[90px]",
					children: "Présence"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "w-[70px]",
					children: "Alertes"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "w-[100px] text-right",
					children: "Actions"
				})
			]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: children.map((child) => {
			const section = child.sectionId ? sectionsMap.get(child.sectionId) : null;
			const primaryParent = getPrimaryParent(child.id);
			const isPresentToday = hasAttendanceToday(child.id);
			const age = calculateAge(child.birthDate);
			const photoUrl = getChildPhoto(child);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
				className: "group hover:bg-muted/30",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
						className: "h-10 w-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
							src: photoUrl || void 0,
							alt: child.firstName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
							className: "bg-primary/10 text-primary text-xs font-semibold",
							children: getChildInitials(child)
						})]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-medium text-foreground",
							children: [
								child.firstName,
								" ",
								child.lastName
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground",
							children: ["N° ", child.fileNumber]
						})]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm text-muted-foreground",
						children: [age, " ans"]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-lg",
						title: child.gender === "F" ? "Fille" : "Garçon",
						children: getGenderIcon(child.gender)
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: section ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-2 w-2 rounded-full",
							style: { backgroundColor: section.color }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium",
							children: section.name
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted-foreground",
						children: "—"
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: primaryParent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm",
							children: [
								primaryParent.firstName,
								" ",
								primaryParent.lastName
							]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted-foreground",
						children: "Aucun"
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: getStatusBadge(child.status) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: isPresentToday ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "default",
						className: "bg-emerald-500/10 text-emerald-600 border-emerald-200 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "mr-1 h-3 w-3" }), "Présent"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "Absent"
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: child.medicalAlert ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "destructive",
						className: "text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "mr-1 h-3 w-3" }), "Oui"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "—"
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right",
						children: renderActionsMenu(child)
					})
				]
			}, child.id);
		}) })] })
	});
}
function EnfantsCardsView({ children, sectionsMap, calculateAge, getPrimaryParent, hasAttendanceToday, canEdit, canDelete, canArchive, onViewChild, onEditChild, onArchiveChild, onSuspendChild, onReactivateChild, onDeleteChild, canUserDelete }) {
	const getStatusBadge = (status) => {
		switch (status) {
			case "Inscrit": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "default",
				className: "bg-emerald-500/10 text-emerald-600 border-emerald-200 text-xs",
				children: "Inscrit"
			});
			case "Préinscrit": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "secondary",
				className: "bg-blue-500/10 text-blue-600 border-blue-200 text-xs",
				children: "Préinscrit"
			});
			case "Suspendu": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "secondary",
				className: "bg-amber-500/10 text-amber-600 border-amber-200 text-xs",
				children: "Suspendu"
			});
			case "Sorti": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "outline",
				className: "text-muted-foreground text-xs",
				children: "Sorti"
			});
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "outline",
				className: "text-xs",
				children: status
			});
		}
	};
	const getGenderIcon = (gender) => {
		return gender === "F" ? "👧" : "👦";
	};
	const getChildPhoto = (child) => {
		if (child.photo) return child.photo;
		return null;
	};
	const getChildInitials = (child) => {
		return `${child.firstName[0]}${child.lastName[0]}`.toUpperCase();
	};
	const renderActionsMenu = (child) => {
		const isDeletable = canUserDelete(child.id);
		const canSuspend = canArchive && child.status === "Inscrit";
		const canReactivate = canArchive && child.status === "Suspendu";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "icon",
				className: "h-8 w-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sr-only",
					children: "Actions"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
			align: "end",
			className: "w-56",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, { children: "Actions" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					onClick: () => onViewChild(child.id),
					className: "cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "mr-2 h-4 w-4" }), "Voir la fiche"]
				}),
				canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					onClick: () => onEditChild(child.id),
					className: "cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "mr-2 h-4 w-4" }), "Modifier"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
				canSuspend && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					onClick: () => onSuspendChild(child.id),
					className: "cursor-pointer text-amber-600",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePause, { className: "mr-2 h-4 w-4" }), "Suspendre"]
				}),
				canReactivate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					onClick: () => onReactivateChild(child.id),
					className: "cursor-pointer text-emerald-600",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "mr-2 h-4 w-4" }), "Réactiver"]
				}),
				canArchive && child.status !== "Sorti" && !canSuspend && !canReactivate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					onClick: () => onArchiveChild(child.id),
					className: "cursor-pointer text-orange-600",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "mr-2 h-4 w-4" }), "Archiver / Sortir"]
				}),
				canDelete && isDeletable && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					onClick: () => onDeleteChild(child.id),
					className: "cursor-pointer text-destructive",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-2 h-4 w-4" }), "Supprimer"]
				})] }),
				!isDeletable && canDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					disabled: true,
					className: "cursor-not-allowed",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-2 h-4 w-4" }), "Supprimer (données liées)"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					className: "cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "mr-2 h-4 w-4" }), "Ajouter présence"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					className: "cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mr-2 h-4 w-4" }), "Voir parents"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					className: "cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "mr-2 h-4 w-4" }), "Paiements"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					className: "cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "mr-2 h-4 w-4" }), "Activités"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					className: "cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Utensils, { className: "mr-2 h-4 w-4" }), "Repas"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					className: "cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "mr-2 h-4 w-4" }), "Documents"]
				})
			]
		})] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
		children: children.map((child) => {
			const section = child.sectionId ? sectionsMap.get(child.sectionId) : null;
			const primaryParent = getPrimaryParent(child.id);
			const isPresentToday = hasAttendanceToday(child.id);
			const age = calculateAge(child.birthDate);
			const photoUrl = getChildPhoto(child);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "group relative overflow-hidden transition-all hover:shadow-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-4 pb-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
									className: "h-12 w-12 ring-2 ring-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
										src: photoUrl || void 0,
										alt: child.firstName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
										className: "bg-primary/10 text-primary font-semibold",
										children: getChildInitials(child)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "font-semibold text-base truncate",
										children: [
											child.firstName,
											" ",
											child.lastName
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground truncate",
										children: ["N° ", child.fileNumber]
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-lg",
									title: child.gender === "F" ? "Fille" : "Garçon",
									children: getGenderIcon(child.gender)
								}), renderActionsMenu(child)]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 mb-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Âge"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-medium",
										children: [age, " ans"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Section"
									}), section ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-2 w-2 rounded-full",
											style: { backgroundColor: section.color }
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: section.name
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "—"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Parent"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate max-w-[120px] text-right",
										children: primaryParent ? `${primaryParent.firstName} ${primaryParent.lastName}` : "Aucun"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pt-2 border-t",
							children: [getStatusBadge(child.status), isPresentToday ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "default",
								className: "bg-emerald-500/10 text-emerald-600 border-emerald-200 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "mr-1 h-3 w-3" }), "Présent"]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "Absent"
							})]
						}),
						child.medicalAlert && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-center gap-1.5 text-xs text-destructive bg-destructive/5 px-2 py-1 rounded-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: "Alerte médicale"
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, {
					className: "px-4 py-2 bg-muted/30 border-t",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "sm",
						className: "w-full text-xs h-8",
						onClick: () => onViewChild(child.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "mr-1.5 h-3.5 w-3.5" }), "Voir la fiche"]
					})
				})]
			}, child.id);
		})
	});
}
var Tabs = Root2$1;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
function EnfantDetail({ child, onEdit, onArchive, onSuspend, onReactivate, onDelete, canEdit = false, canDelete = false, canArchive = false }) {
	const db = useDatabase();
	const age = (0, import_react.useMemo)(() => {
		const birth = new Date(child.birthDate);
		const today = /* @__PURE__ */ new Date();
		let ageYears = today.getFullYear() - birth.getFullYear();
		const monthDiff = today.getMonth() - birth.getMonth();
		if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birth.getDate()) ageYears--;
		return ageYears;
	}, [child.birthDate]);
	const section = (0, import_react.useMemo)(() => {
		if (!child.sectionId || !db) return null;
		return db.sections.find((s) => s.id === child.sectionId);
	}, [child.sectionId, db]);
	const parents = (0, import_react.useMemo)(() => {
		if (!db) return [];
		return db.childParents.filter((cp) => cp.childId === child.id).map((cp) => {
			const parent = db.parents.find((p) => p.id === cp.parentId);
			if (!parent) return null;
			return {
				...parent,
				relation: cp.relation,
				isPrimary: cp.relation === "parent-principal"
			};
		}).filter((p) => p !== null);
	}, [child.id, db]);
	const recentAttendances = (0, import_react.useMemo)(() => {
		if (!db) return [];
		const sevenDaysAgo = /* @__PURE__ */ new Date((/* @__PURE__ */ new Date()).getTime() - 6048e5);
		return db.attendance.filter((a) => a.childId === child.id && new Date(a.date) >= sevenDaysAgo).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	}, [child.id, db]);
	const attendanceStats = (0, import_react.useMemo)(() => {
		if (!db) return {
			total: 0,
			presents: 0,
			absents: 0,
			retards: 0,
			rate: 0
		};
		const attendances = db.attendance.filter((a) => a.childId === child.id);
		const total = attendances.length;
		const presents = attendances.filter((a) => a.state === "present").length;
		return {
			total,
			presents,
			absents: attendances.filter((a) => a.state === "absent").length,
			retards: attendances.filter((a) => a.late).length,
			rate: total > 0 ? Math.round(presents / total * 100) : 0
		};
	}, [child.id, db]);
	const invoices = (0, import_react.useMemo)(() => {
		if (!db) return [];
		return db.invoices.filter((i) => i.childId === child.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
	}, [child.id, db]);
	const financialSummary = (0, import_react.useMemo)(() => {
		if (!db) return {
			totalInvoiced: 0,
			totalPaid: 0,
			remaining: 0
		};
		const childInvoices = db.invoices.filter((i) => i.childId === child.id);
		const totalInvoiced = childInvoices.reduce((sum, i) => sum + i.total, 0);
		const totalPaid = childInvoices.reduce((sum, i) => sum + i.paidAmount, 0);
		return {
			totalInvoiced,
			totalPaid,
			remaining: totalInvoiced - totalPaid
		};
	}, [child.id, db]);
	const recentActivities = (0, import_react.useMemo)(() => {
		if (!db) return [];
		return db.activities.filter((a) => a.childIds.includes(child.id)).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
	}, [child.id, db]);
	const auditLogs = (0, import_react.useMemo)(() => {
		if (!db) return [];
		return db.auditLogs.filter((log) => log.detail.toLowerCase().includes(child.firstName.toLowerCase()) || log.detail.toLowerCase().includes(child.lastName.toLowerCase())).sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()).slice(0, 10);
	}, [
		child.firstName,
		child.lastName,
		db
	]);
	const statusBadge = (0, import_react.useMemo)(() => {
		const config = {
			"Inscrit": {
				label: "Inscrit",
				variant: "success"
			},
			"Préinscrit": {
				label: "Préinscrit",
				variant: "info"
			},
			"Suspendu": {
				label: "Suspendu",
				variant: "warning"
			},
			"Sorti": {
				label: "Sorti",
				variant: "secondary"
			}
		}[child.status] || {
			label: child.status,
			variant: "default"
		};
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: config.variant,
			className: "text-sm",
			children: config.label
		});
	}, [child.status]);
	const formatDate = (dateStr) => {
		if (!dateStr) return "—";
		return new Date(dateStr).toLocaleDateString("fr-FR", {
			day: "numeric",
			month: "long",
			year: "numeric"
		});
	};
	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("fr-FR", {
			style: "currency",
			currency: db?.establishment.currency || "EUR"
		}).format(amount);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "relative h-32 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative px-6 pb-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "-mt-12 flex items-end justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-end gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
								className: "size-24 border-4 border-background shadow-lg",
								children: child.photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
									src: child.photo,
									alt: `${child.firstName} ${child.lastName}`
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AvatarFallback, {
									className: "bg-primary/10 text-primary text-2xl font-bold",
									children: [child.firstName[0], child.lastName[0]]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
										className: "text-2xl font-bold",
										children: [
											child.firstName,
											" ",
											child.lastName
										]
									}), statusBadge]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-muted-foreground",
									children: ["N° dossier: ", child.fileNumber]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 pb-2",
							children: [
								canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => onEdit?.(child.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "mr-2 size-4" }), "Modifier"]
								}),
								canArchive && child.status === "Inscrit" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => onArchive?.(child.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "mr-2 size-4" }), "Archiver"]
								}),
								canArchive && child.status === "Inscrit" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => onSuspend?.(child.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserX, { className: "mr-2 size-4" }), "Suspendre"]
								}),
								canArchive && child.status === "Suspendu" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => onReactivate?.(child.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "mr-2 size-4" }), "Réactiver"]
								}),
								canDelete && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									className: "text-destructive hover:text-destructive",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-2 size-4" }), "Supprimer"]
								})
							]
						})]
					})
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "identity",
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "grid w-full grid-cols-2 lg:w-auto lg:inline-grid lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "identity",
							children: "Identité"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "health",
							children: "Santé"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "family",
							children: "Famille"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "attendance",
							children: "Présences"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "activities",
							children: "Activités"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "billing",
							children: "Facturation"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "documents",
							children: "Documents"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "history",
							children: "Historique"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "identity",
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoCard, {
								icon: User,
								label: "Nom complet",
								value: `${child.lastName.toUpperCase()} ${child.firstName}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoCard, {
								icon: Calendar,
								label: "Date de naissance",
								value: formatDate(child.birthDate),
								secondary: `${age} an${age > 1 ? "s" : ""}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoCard, {
								icon: User,
								label: "Sexe",
								value: child.gender === "F" ? "Fille" : "Garçon"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoCard, {
								icon: MapPin,
								label: "Adresse",
								value: child.address || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoCard, {
								icon: Languages,
								label: "Langue",
								value: child.language || "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoCard, {
								icon: FileText,
								label: "Numéro de dossier",
								value: child.fileNumber
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Informations d'inscription"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoCard, {
								icon: Calendar,
								label: "Date d'inscription",
								value: formatDate(child.registrationDate)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoCard, {
								icon: Calendar,
								label: "Date de début",
								value: formatDate(child.startDate)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoCard, {
								icon: ClipboardList,
								label: "Section actuelle",
								value: section?.name || "—",
								secondary: section ? `Âge: ${section.ageMin}-${section.ageMax} ans` : void 0
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoCard, {
								icon: FileText,
								label: "Statut",
								value: child.status
							}),
							child.contractEndDate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoCard, {
								icon: Calendar,
								label: "Date de fin de contrat",
								value: formatDate(child.contractEndDate)
							}),
							child.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "md:col-span-2 lg:col-span-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border bg-muted/50 p-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold text-muted-foreground mb-1",
										children: "Notes"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm",
										children: child.notes
									})]
								})
							})
						]
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "health",
					className: "space-y-4",
					children: [child.medicalAlert && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "border-destructive/50 bg-destructive/5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "pt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-5 text-destructive mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold text-destructive",
									children: "Alerte médicale"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground mt-1",
									children: child.medicalAlert
								})] })]
							})
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-base flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stethoscope, { className: "size-4" }), "Informations médicales"]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-4",
						children: [
							child.medicalAlert ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-destructive/30 bg-destructive/5 p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium text-destructive mb-2",
									children: "⚠️ Alerte médicale active"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm",
									children: child.medicalAlert
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "size-4 text-success" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm",
									children: "Aucune alerte médicale signalée"
								})]
							}),
							child.missingDocuments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-warning/30 bg-warning/5 p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium text-warning mb-2",
									children: "📄 Documents médicaux manquants"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "list-disc list-inside text-sm space-y-1",
									children: child.missingDocuments.map((doc, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: doc }, idx))
								})]
							}),
							!child.medicalAlert && child.missingDocuments.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "size-4 text-success" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm",
									children: "Dossier médical complet"
								})]
							})
						]
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "family",
					className: "space-y-4",
					children: parents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "pt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm",
								children: "Aucun parent/tuteur enregistré"
							})]
						})
					}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-4 md:grid-cols-2",
						children: parents.map((parent) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
							className: "pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
									className: "text-base",
									children: [
										parent.firstName,
										" ",
										parent.lastName
									]
								}), parent.isPrimary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "default",
									className: "text-xs",
									children: "Parent principal"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground capitalize",
								children: parent.relation
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "space-y-2 text-sm",
							children: [
								parent.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: parent.phone })]
								}),
								parent.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: parent.email })]
								}),
								parent.address && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4 text-muted-foreground mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: parent.address })]
								}),
								parent.job && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: parent.job })]
								})
							]
						})] }, parent.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "attendance",
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatMiniCard, {
									icon: ClipboardList,
									label: "Total présences",
									value: attendanceStats.total,
									tone: "primary"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatMiniCard, {
									icon: CircleCheckBig,
									label: "Présents",
									value: attendanceStats.presents,
									tone: "success"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatMiniCard, {
									icon: CircleX,
									label: "Absents",
									value: attendanceStats.absents,
									tone: "destructive"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatMiniCard, {
									icon: Clock,
									label: "Retards",
									value: attendanceStats.retards,
									tone: "warning"
								})
							]
						}),
						attendanceStats.rate > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-base flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-4" }), "Taux de présence"]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-3 rounded-full bg-muted overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full bg-primary transition-all",
										style: { width: `${attendanceStats.rate}%` }
									})
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-lg font-bold",
								children: [attendanceStats.rate, "%"]
							})]
						}) })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base",
							children: "Présences récentes (7 derniers jours)"
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: recentAttendances.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Aucune présence enregistrée récemment"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: recentAttendances.map((attendance) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-lg border p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cn("grid size-8 place-items-center rounded-full", attendance.state === "present" ? "bg-success/15 text-success" : attendance.state === "absent" ? "bg-destructive/15 text-destructive" : "bg-muted text-muted-foreground"),
										children: attendance.state === "present" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "size-4" }) : attendance.state === "absent" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: new Date(attendance.date).toLocaleDateString("fr-FR", {
											weekday: "long",
											day: "numeric",
											month: "numeric"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [attendance.arrivalTime && `Arrivée: ${attendance.arrivalTime}`, attendance.departureTime && ` - Départ: ${attendance.departureTime}`]
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: attendance.state === "present" ? "success" : attendance.state === "absent" ? "destructive" : "secondary",
									className: "text-xs",
									children: attendance.state === "present" ? "Présent" : attendance.state === "absent" ? "Absent" : attendance.state
								})]
							}, attendance.id))
						}) })] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "activities",
					className: "space-y-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-base flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" }), "Activités récentes"]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: recentActivities.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Aucune activité enregistrée"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: recentActivities.map((activity) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-lg border p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: activity.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-1",
										children: new Date(activity.date).toLocaleDateString("fr-FR", {
											day: "numeric",
											month: "long",
											year: "numeric"
										})
									}),
									activity.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm mt-2",
										children: activity.description
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: "text-xs",
									children: activity.category
								})]
							})
						}, activity.id))
					}) })] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "billing",
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
								className: "pt-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Total facturé"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-2xl font-bold mt-1",
										children: formatCurrency(financialSummary.totalInvoiced)
									})]
								})
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
								className: "pt-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Total payé"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-2xl font-bold text-success mt-1",
										children: formatCurrency(financialSummary.totalPaid)
									})]
								})
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
								className: financialSummary.remaining > 0 ? "border-warning/50 bg-warning/5" : "",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
									className: "pt-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-muted-foreground",
											children: "Restant à payer"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: cn("text-2xl font-bold mt-1", financialSummary.remaining > 0 ? "text-warning" : "text-success"),
											children: formatCurrency(financialSummary.remaining)
										})]
									})
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-base flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "size-4" }), "Dernières factures"]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: invoices.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Aucune facture trouvée"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: invoices.map((invoice) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-lg border p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-medium",
								children: ["Facture n°", invoice.number]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: ["Échéance: ", formatDate(invoice.dueDate)]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-bold",
									children: formatCurrency(invoice.total)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: invoice.status === "Payée" ? "success" : invoice.status === "En retard" ? "destructive" : "secondary",
									className: "text-xs mt-1",
									children: invoice.status
								})]
							})]
						}, invoice.id))
					}) })] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "documents",
					className: "space-y-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-base flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { className: "size-4" }), "État des documents"]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: child.missingDocuments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-success",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm",
							children: "Tous les documents sont à jour"
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-warning/30 bg-warning/5 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-medium text-warning mb-3",
								children: [
									"📄 ",
									child.missingDocuments.length,
									" document",
									child.missingDocuments.length > 1 ? "s" : "",
									" manquant",
									child.missingDocuments.length > 1 ? "s" : ""
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-2",
								children: child.missingDocuments.map((doc, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-4 text-warning" }), doc]
								}, idx))
							})]
						})
					}) })] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "history",
					className: "space-y-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-base flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "size-4" }), "Journal d'activité"]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: auditLogs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Aucun événement dans l'historique"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: auditLogs.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3 rounded-lg border p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-8 place-items-center rounded-full bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "size-4 text-muted-foreground" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: log.action
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-1",
										children: log.detail
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 mt-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: new Date(log.at).toLocaleDateString("fr-FR", {
												day: "numeric",
												month: "short",
												hour: "2-digit",
												minute: "2-digit"
											})
										}), log.userId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: "•"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: log.userName
										})] })]
									})
								]
							})]
						}, log.id))
					}) })] })
				})
			]
		})]
	});
}
function InfoCard({ icon: Icon, label, value, secondary }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 mb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-semibold text-muted-foreground",
					children: label
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium",
				children: value
			}),
			secondary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground mt-1",
				children: secondary
			})
		]
	});
}
function StatMiniCard({ icon: Icon, label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
		className: "pt-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("grid size-10 place-items-center rounded-lg", {
					primary: "bg-primary/15 text-primary",
					success: "bg-success/15 text-success",
					warning: "bg-warning/15 text-warning",
					destructive: "bg-destructive/15 text-destructive"
				}[tone]),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xl font-bold",
				children: value
			})] })]
		})
	}) });
}
var AlertDialog = Root2;
var AlertDialogPortal = Portal2;
var AlertDialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, {
	className: cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
AlertDialogOverlay.displayName = Overlay2.displayName;
var AlertDialogContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props
})] }));
AlertDialogContent.displayName = Content2.displayName;
var AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
AlertDialogHeader.displayName = "AlertDialogHeader";
var AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
AlertDialogFooter.displayName = "AlertDialogFooter";
var AlertDialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
	ref,
	className: cn("text-lg font-semibold", className),
	...props
}));
AlertDialogTitle.displayName = Title2.displayName;
var AlertDialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
AlertDialogDescription.displayName = Description2.displayName;
var AlertDialogAction = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
	ref,
	className: cn(buttonVariants(), className),
	...props
}));
AlertDialogAction.displayName = Action.displayName;
var AlertDialogCancel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
	ref,
	className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
	...props
}));
AlertDialogCancel.displayName = Cancel.displayName;
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
function Page() {
	const { can } = useAuth();
	const { children, stats, filters, setFilters, viewMode, setViewMode, sections, availableLanguages, resetFilters, loading, calculateAge, getPrimaryParent, hasAttendanceToday, archiveChild, suspendChild, reactivateChild, deleteChild, canDelete: checkCanDelete } = useEnfants();
	const [childToAction, setChildToAction] = (0, import_react.useState)(null);
	const [selectedChildId, setSelectedChildId] = (0, import_react.useState)(null);
	const selectedChild = (0, import_react.useMemo)(() => {
		if (!selectedChildId) return null;
		return children.find((c) => c.id === selectedChildId) || null;
	}, [children, selectedChildId]);
	const hasActiveFilters = (0, import_react.useMemo)(() => {
		return filters.search !== "" || filters.status !== "all" || filters.sectionId !== "all" || filters.gender !== "all" || filters.language !== "all" || filters.hasMedicalAlert !== "all" || filters.hasMissingDocuments !== "all";
	}, [filters]);
	const statusLabels = {
		all: "Tous les statuts",
		Inscrit: "Inscrits",
		Préinscrit: "Préinscrits",
		Suspendu: "Suspendus",
		Sorti: "Sortis"
	};
	const genderLabels = {
		all: "Tous les sexes",
		F: "Filles",
		M: "Garçons"
	};
	const handleArchiveChild = (0, import_react.useCallback)(async (childId) => {
		await archiveChild(childId);
		toast.success("Enfant archivé avec succès");
		setChildToAction(null);
	}, [archiveChild]);
	const handleSuspendChild = (0, import_react.useCallback)(async (childId) => {
		await suspendChild(childId);
		toast.success("Enfant suspendu avec succès");
		setChildToAction(null);
	}, [suspendChild]);
	const handleReactivateChild = (0, import_react.useCallback)(async (childId) => {
		await reactivateChild(childId);
		toast.success("Enfant réactivé avec succès");
		setChildToAction(null);
	}, [reactivateChild]);
	const handleDeleteChild = (0, import_react.useCallback)(async (childId) => {
		await deleteChild(childId);
		toast.success("Enfant supprimé avec succès");
		setChildToAction(null);
	}, [deleteChild]);
	const onViewChild = (0, import_react.useCallback)((childId) => {
		setSelectedChildId(childId);
	}, []);
	const onEditChild = (0, import_react.useCallback)((childId) => {
		toast.info(`Modification enfant ${childId} - à implémenter`);
	}, []);
	const confirmAction = (0, import_react.useCallback)((childId, action) => {
		setChildToAction({
			id: childId,
			action
		});
	}, []);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		permission: "children.view",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center py-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Chargement..."
			})
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		permission: "children.view",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
					title: "Enfants",
					description: "Gérez les dossiers de tous les enfants inscrits à la crèche",
					actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							onClick: () => setViewMode(viewMode === "table" ? "cards" : "table"),
							children: viewMode === "table" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListFilter, { className: "size-4" })
						}), can("children.create") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Baby, { className: "mr-2 size-4" }), "Ajouter un enfant"] })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Total enfants",
							value: stats.total,
							icon: Users,
							tone: "primary",
							hint: `${stats.inscrits} inscrits`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Inscrits",
							value: stats.inscrits,
							icon: BadgeCheck,
							tone: "success",
							hint: "Actifs en ce moment"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Préinscrits",
							value: stats.preinscrits,
							icon: ClipboardList,
							tone: "info",
							hint: "En attente"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Nouveaux (30j)",
							value: stats.nouveauxRecemment,
							icon: CalendarDays,
							tone: "neutral",
							hint: "Récemment inscrits"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("flex items-center gap-3 rounded-lg border p-3", stats.suspendus > 0 ? "border-warning/30 bg-warning/5" : "border-border"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("grid size-9 place-items-center rounded-lg", stats.suspendus > 0 ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Suspendus"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg font-bold",
								children: stats.suspendus
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("flex items-center gap-3 rounded-lg border p-3", stats.sortis > 0 ? "border-border bg-muted/30" : "border-border"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-9 place-items-center rounded-lg bg-muted text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Sortis"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg font-bold",
								children: stats.sortis
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("flex items-center gap-3 rounded-lg border p-3", stats.avecAlertesMedicales > 0 ? "border-destructive/30 bg-destructive/5" : "border-border"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("grid size-9 place-items-center rounded-lg", stats.avecAlertesMedicales > 0 ? "bg-destructive/15 text-destructive" : "bg-muted text-muted-foreground"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Alertes médicales"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-lg font-bold",
								children: stats.avecAlertesMedicales
							})] })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border bg-card p-4 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4 lg:flex-row lg:items-end",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "search",
									className: "mb-1.5 block text-xs font-semibold text-muted-foreground",
									children: "Rechercher"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "search",
										placeholder: "Nom, prénom, n° dossier, parent...",
										value: filters.search,
										onChange: (e) => setFilters({
											...filters,
											search: e.target.value
										}),
										className: "pl-9"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "w-full sm:w-[180px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "status",
									className: "mb-1.5 block text-xs font-semibold text-muted-foreground",
									children: "Statut"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: filters.status,
									onValueChange: (value) => setFilters({
										...filters,
										status: value
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										id: "status",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: Object.entries(statusLabels).map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: key,
										children: label
									}, key)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "w-full sm:w-[180px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "section",
									className: "mb-1.5 block text-xs font-semibold text-muted-foreground",
									children: "Section"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: filters.sectionId,
									onValueChange: (value) => setFilters({
										...filters,
										sectionId: value
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										id: "section",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "Toutes sections"
									}), sections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: section.id,
										children: section.name
									}, section.id))] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "w-full sm:w-[140px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "gender",
									className: "mb-1.5 block text-xs font-semibold text-muted-foreground",
									children: "Sexe"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: filters.gender,
									onValueChange: (value) => setFilters({
										...filters,
										gender: value
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										id: "gender",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: Object.entries(genderLabels).map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: key,
										children: label
									}, key)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "w-full sm:w-[140px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "language",
									className: "mb-1.5 block text-xs font-semibold text-muted-foreground",
									children: "Langue"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: filters.language,
									onValueChange: (value) => setFilters({
										...filters,
										language: value
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										id: "language",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "Toutes langues"
									}), availableLanguages.map((lang) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: lang,
										children: lang
									}, lang))] })]
								})]
							}),
							hasActiveFilters && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								onClick: resetFilters,
								className: "shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "mr-2 size-4" }), "Réinitialiser"]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap items-center gap-3 pt-4 border-t",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Filtres avancés :"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: filters.hasMedicalAlert === true ? "default" : "outline",
								size: "sm",
								onClick: () => setFilters({
									...filters,
									hasMedicalAlert: filters.hasMedicalAlert === true ? "all" : true
								}),
								className: cn(filters.hasMedicalAlert === true && "bg-destructive hover:bg-destructive/90"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "mr-1.5 size-3.5" }), "Alertes médicales"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: filters.hasMissingDocuments === true ? "default" : "outline",
								size: "sm",
								onClick: () => setFilters({
									...filters,
									hasMissingDocuments: filters.hasMissingDocuments === true ? "all" : true
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "mr-1.5 size-3.5" }), "Documents manquants"]
							}),
							hasActiveFilters && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "secondary",
								className: "ml-auto",
								children: [
									children.length,
									" résultat",
									children.length > 1 ? "s" : ""
								]
							})
						]
					})]
				}),
				!loading && children.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center rounded-xl border border-dashed bg-card p-12 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid size-16 place-items-center rounded-full bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Baby, { className: "size-8 text-muted-foreground" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-4 text-lg font-semibold",
							children: "Aucun enfant trouvé"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 max-w-sm text-sm text-muted-foreground",
							children: hasActiveFilters ? "Essayez de modifier ou réinitialiser vos filtres de recherche." : "Commencez par ajouter un premier enfant à la crèche."
						}),
						hasActiveFilters ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: resetFilters,
							className: "mt-4",
							children: "Réinitialiser les filtres"
						}) : can("children.create") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Baby, { className: "mr-2 size-4" }), "Ajouter un enfant"]
						}) : null
					]
				}),
				!loading && children.length > 0 && viewMode === "table" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnfantsListView, {
					children,
					sectionsMap,
					calculateAge,
					getPrimaryParent,
					hasAttendanceToday,
					canEdit: can("children.edit"),
					canDelete: can("children.delete"),
					canArchive: can("children.archive"),
					onViewChild,
					onEditChild,
					onArchiveChild: (id) => confirmAction(id, "archive"),
					onSuspendChild: (id) => confirmAction(id, "suspend"),
					onReactivateChild: (id) => confirmAction(id, "reactivate"),
					onDeleteChild: (id) => confirmAction(id, "delete"),
					canUserDelete: checkCanDelete
				}),
				!loading && children.length > 0 && viewMode === "cards" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnfantsCardsView, {
					children,
					sectionsMap,
					calculateAge,
					getPrimaryParent,
					hasAttendanceToday,
					canEdit: can("children.edit"),
					canDelete: can("children.delete"),
					canArchive: can("children.archive"),
					onViewChild,
					onEditChild,
					onArchiveChild: (id) => confirmAction(id, "archive"),
					onSuspendChild: (id) => confirmAction(id, "suspend"),
					onReactivateChild: (id) => confirmAction(id, "reactivate"),
					onDeleteChild: (id) => confirmAction(id, "delete"),
					canUserDelete: checkCanDelete
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
					open: childToAction !== null,
					onOpenChange: () => setChildToAction(null),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, { children: [
						childToAction?.action === "archive" && "Archiver / Sortir l'enfant",
						childToAction?.action === "suspend" && "Suspendre l'enfant",
						childToAction?.action === "reactivate" && "Réactiver l'enfant",
						childToAction?.action === "delete" && "Supprimer l'enfant"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
						childToAction?.action === "archive" && "Cet enfant sera marqué comme 'Sorti'. Ses données resteront dans le système pour l'historique.",
						childToAction?.action === "suspend" && "Cet enfant sera temporairement suspendu. Vous pourrez le réactiver ultérieurement.",
						childToAction?.action === "reactivate" && "Cet enfant sera réactivé et reprendra sa place dans la crèche.",
						childToAction?.action === "delete" && "Cette action est irréversible. Toutes les données liées à cet enfant seront supprimées."
					] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Annuler" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
						onClick: () => {
							if (childToAction?.action === "archive") handleArchiveChild(childToAction.id);
							else if (childToAction?.action === "suspend") handleSuspendChild(childToAction.id);
							else if (childToAction?.action === "reactivate") handleReactivateChild(childToAction.id);
							else if (childToAction?.action === "delete") handleDeleteChild(childToAction.id);
						},
						className: childToAction?.action === "delete" ? "bg-destructive hover:bg-destructive/90" : void 0,
						children: "Confirmer"
					})] })] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
					open: !!selectedChild,
					onOpenChange: (open) => !open && setSelectedChildId(null),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
						className: "max-w-5xl max-h-[90vh] overflow-y-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "sr-only",
							children: "Fiche de l'enfant"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "sr-only",
							children: "Détails complets de l'enfant"
						})] }), selectedChild && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnfantDetail, {
							child: selectedChild,
							onEdit: onEditChild,
							onArchive: (id) => {
								setSelectedChildId(null);
								confirmAction(id, "archive");
							},
							onSuspend: (id) => {
								setSelectedChildId(null);
								confirmAction(id, "suspend");
							},
							onReactivate: (id) => {
								setSelectedChildId(null);
								confirmAction(id, "reactivate");
							},
							onDelete: (id) => {
								setSelectedChildId(null);
								confirmAction(id, "delete");
							},
							canEdit: can("children.edit"),
							canDelete: can("children.delete") && checkCanDelete(selectedChild.id),
							canArchive: can("children.archive")
						})]
					})
				})
			]
		})
	});
}
//#endregion
export { Page as component };
