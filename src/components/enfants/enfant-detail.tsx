import { useMemo } from "react";
import { useDatabase } from "@/lib/data/db";
import type { Child, Parent, ChildParent, Section, Attendance, Invoice, Payment, Activity, AuditLog } from "@/lib/data/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, Calendar, MapPin, Languages, FileText, AlertCircle, AlertTriangle, 
  Phone, Mail, Relationship, Stethoscope, ClipboardList, TrendingUp, 
  DollarSign, CreditCard, FolderOpen, History, Edit, Archive, 
  UserX, UserCheck, Trash2, ChevronRight, Clock, CheckCircle, 
  XCircle, HelpCircle, Utensils, BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EnfantDetailProps {
  child: Child;
  onEdit?: (childId: string) => void;
  onArchive?: (childId: string) => void;
  onSuspend?: (childId: string) => void;
  onReactivate?: (childId: string) => void;
  onDelete?: (childId: string) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  canArchive?: boolean;
}

export function EnfantDetail({
  child,
  onEdit,
  onArchive,
  onSuspend,
  onReactivate,
  onDelete,
  canEdit = false,
  canDelete = false,
  canArchive = false,
}: EnfantDetailProps) {
  const db = useDatabase();

  // Calcul de l'âge
  const age = useMemo(() => {
    const birth = new Date(child.birthDate);
    const today = new Date();
    let ageYears = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      ageYears--;
    }
    return ageYears;
  }, [child.birthDate]);

  // Section
  const section = useMemo(() => {
    if (!child.sectionId || !db) return null;
    return db.sections.find(s => s.id === child.sectionId);
  }, [child.sectionId, db]);

  // Parents liés
  const parents = useMemo<(Parent & { relation: string; isPrimary: boolean })[]>(() => {
    if (!db) return [];
    const childParents = db.childParents.filter(cp => cp.childId === child.id);
    return childParents.map(cp => {
      const parent = db.parents.find(p => p.id === cp.parentId);
      if (!parent) return null;
      return {
        ...parent,
        relation: cp.relation,
        isPrimary: cp.relation === "parent-principal",
      };
    }).filter((p): p is NonNullable<typeof p> => p !== null);
  }, [child.id, db]);

  // Présences récentes (7 derniers jours)
  const recentAttendances = useMemo<Attendance[]>(() => {
    if (!db) return [];
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return db.attendance
      .filter(a => a.childId === child.id && new Date(a.date) >= sevenDaysAgo)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [child.id, db]);

  // Statistiques de présence
  const attendanceStats = useMemo(() => {
    if (!db) return { total: 0, presents: 0, absents: 0, retards: 0, rate: 0 };
    const attendances = db.attendance.filter(a => a.childId === child.id);
    const total = attendances.length;
    const presents = attendances.filter(a => a.state === "present").length;
    const absents = attendances.filter(a => a.state === "absent").length;
    const retards = attendances.filter(a => a.late).length;
    const rate = total > 0 ? Math.round((presents / total) * 100) : 0;
    return { total, presents, absents, retards, rate };
  }, [child.id, db]);

  // Factures liées
  const invoices = useMemo<Invoice[]>(() => {
    if (!db) return [];
    return db.invoices
      .filter(i => i.childId === child.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5); // 5 dernières factures
  }, [child.id, db]);

  // Total payé et restant
  const financialSummary = useMemo(() => {
    if (!db) return { totalInvoiced: 0, totalPaid: 0, remaining: 0 };
    const childInvoices = db.invoices.filter(i => i.childId === child.id);
    const totalInvoiced = childInvoices.reduce((sum, i) => sum + i.total, 0);
    const totalPaid = childInvoices.reduce((sum, i) => sum + i.paidAmount, 0);
    return {
      totalInvoiced,
      totalPaid,
      remaining: totalInvoiced - totalPaid,
    };
  }, [child.id, db]);

  // Activités récentes
  const recentActivities = useMemo<Activity[]>(() => {
    if (!db) return [];
    return db.activities
      .filter(a => a.childIds.includes(child.id))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5); // 5 dernières activités
  }, [child.id, db]);

  // Audit logs liés à l'enfant
  const auditLogs = useMemo<AuditLog[]>(() => {
    if (!db) return [];
    return db.auditLogs
      .filter(log => log.detail.toLowerCase().includes(child.firstName.toLowerCase()) || 
                       log.detail.toLowerCase().includes(child.lastName.toLowerCase()))
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
      .slice(0, 10); // 10 derniers logs
  }, [child.firstName, child.lastName, db]);

  // Statut badge
  const statusBadge = useMemo(() => {
    const statusConfig: Record<string, { label: string; variant: "default" | "success" | "warning" | "destructive" | "secondary" }> = {
      "Inscrit": { label: "Inscrit", variant: "success" },
      "Préinscrit": { label: "Préinscrit", variant: "info" },
      "Suspendu": { label: "Suspendu", variant: "warning" },
      "Sorti": { label: "Sorti", variant: "secondary" },
    };
    const config = statusConfig[child.status] || { label: child.status, variant: "default" as const };
    return (
      <Badge variant={config.variant} className="text-sm">
        {config.label}
      </Badge>
    );
  }, [child.status]);

  // Format date
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: db?.establishment.currency || "EUR",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec photo et informations principales */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative h-32 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
          <div className="relative px-6 pb-6">
            <div className="-mt-12 flex items-end justify-between">
              <div className="flex items-end gap-4">
                <Avatar className="size-24 border-4 border-background shadow-lg">
                  {child.photo ? (
                    <AvatarImage src={child.photo} alt={`${child.firstName} ${child.lastName}`} />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                      {child.firstName[0]}{child.lastName[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="pb-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">{child.firstName} {child.lastName}</h1>
                    {statusBadge}
                  </div>
                  <p className="text-muted-foreground">N° dossier: {child.fileNumber}</p>
                </div>
              </div>
              <div className="flex gap-2 pb-2">
                {canEdit && (
                  <Button variant="outline" size="sm" onClick={() => onEdit?.(child.id)}>
                    <Edit className="mr-2 size-4" />
                    Modifier
                  </Button>
                )}
                {canArchive && child.status === "Inscrit" && (
                  <Button variant="outline" size="sm" onClick={() => onArchive?.(child.id)}>
                    <Archive className="mr-2 size-4" />
                    Archiver
                  </Button>
                )}
                {canArchive && child.status === "Inscrit" && (
                  <Button variant="outline" size="sm" onClick={() => onSuspend?.(child.id)}>
                    <UserX className="mr-2 size-4" />
                    Suspendre
                  </Button>
                )}
                {canArchive && child.status === "Suspendu" && (
                  <Button variant="outline" size="sm" onClick={() => onReactivate?.(child.id)}>
                    <UserCheck className="mr-2 size-4" />
                    Réactiver
                  </Button>
                )}
                {canDelete && (
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="mr-2 size-4" />
                    Supprimer
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onglets principaux */}
      <Tabs defaultValue="identity" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid lg:grid-cols-4">
          <TabsTrigger value="identity">Identité</TabsTrigger>
          <TabsTrigger value="health">Santé</TabsTrigger>
          <TabsTrigger value="family">Famille</TabsTrigger>
          <TabsTrigger value="attendance">Présences</TabsTrigger>
          <TabsTrigger value="activities">Activités</TabsTrigger>
          <TabsTrigger value="billing">Facturation</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        {/* Identité */}
        <TabsContent value="identity" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <InfoCard
              icon={User}
              label="Nom complet"
              value={`${child.lastName.toUpperCase()} ${child.firstName}`}
            />
            <InfoCard
              icon={Calendar}
              label="Date de naissance"
              value={formatDate(child.birthDate)}
              secondary={`${age} an${age > 1 ? 's' : ''}`}
            />
            <InfoCard
              icon={User}
              label="Sexe"
              value={child.gender === "F" ? "Fille" : "Garçon"}
            />
            <InfoCard
              icon={MapPin}
              label="Adresse"
              value={child.address || "—"}
            />
            <InfoCard
              icon={Languages}
              label="Langue"
              value={child.language || "—"}
            />
            <InfoCard
              icon={FileText}
              label="Numéro de dossier"
              value={child.fileNumber}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informations d'inscription</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <InfoCard
                icon={Calendar}
                label="Date d'inscription"
                value={formatDate(child.registrationDate)}
              />
              <InfoCard
                icon={Calendar}
                label="Date de début"
                value={formatDate(child.startDate)}
              />
              <InfoCard
                icon={ClipboardList}
                label="Section actuelle"
                value={section?.name || "—"}
                secondary={section ? `Âge: ${section.ageMin}-${section.ageMax} ans` : undefined}
              />
              <InfoCard
                icon={FileText}
                label="Statut"
                value={child.status}
              />
              {child.contractEndDate && (
                <InfoCard
                  icon={Calendar}
                  label="Date de fin de contrat"
                  value={formatDate(child.contractEndDate)}
                />
              )}
              {child.notes && (
                <div className="md:col-span-2 lg:col-span-3">
                  <div className="rounded-lg border bg-muted/50 p-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm">{child.notes}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Santé */}
        <TabsContent value="health" className="space-y-4">
          {child.medicalAlert && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="size-5 text-destructive mt-0.5" />
                  <div>
                    <p className="font-semibold text-destructive">Alerte médicale</p>
                    <p className="text-sm text-muted-foreground mt-1">{child.medicalAlert}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Stethoscope className="size-4" />
                Informations médicales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {child.medicalAlert ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                  <p className="text-sm font-medium text-destructive mb-2">⚠️ Alerte médicale active</p>
                  <p className="text-sm">{child.medicalAlert}</p>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="size-4 text-success" />
                  <span className="text-sm">Aucune alerte médicale signalée</span>
                </div>
              )}

              {child.missingDocuments.length > 0 && (
                <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
                  <p className="text-sm font-medium text-warning mb-2">📄 Documents médicaux manquants</p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {child.missingDocuments.map((doc, idx) => (
                      <li key={idx}>{doc}</li>
                    ))}
                  </ul>
                </div>
              )}

              {!child.medicalAlert && child.missingDocuments.length === 0 && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="size-4 text-success" />
                  <span className="text-sm">Dossier médical complet</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Famille */}
        <TabsContent value="family" className="space-y-4">
          {parents.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <HelpCircle className="size-4" />
                  <span className="text-sm">Aucun parent/tuteur enregistré</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {parents.map((parent) => (
                <Card key={parent.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {parent.firstName} {parent.lastName}
                      </CardTitle>
                      {parent.isPrimary && (
                        <Badge variant="default" className="text-xs">Parent principal</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground capitalize">{parent.relation}</p>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {parent.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="size-4 text-muted-foreground" />
                        <span>{parent.phone}</span>
                      </div>
                    )}
                    {parent.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="size-4 text-muted-foreground" />
                        <span>{parent.email}</span>
                      </div>
                    )}
                    {parent.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="size-4 text-muted-foreground mt-0.5" />
                        <span>{parent.address}</span>
                      </div>
                    )}
                    {parent.job && (
                      <div className="flex items-center gap-2">
                        <User className="size-4 text-muted-foreground" />
                        <span>{parent.job}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Présences */}
        <TabsContent value="attendance" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatMiniCard
              icon={ClipboardList}
              label="Total présences"
              value={attendanceStats.total}
              tone="primary"
            />
            <StatMiniCard
              icon={CheckCircle}
              label="Présents"
              value={attendanceStats.presents}
              tone="success"
            />
            <StatMiniCard
              icon={XCircle}
              label="Absents"
              value={attendanceStats.absents}
              tone="destructive"
            />
            <StatMiniCard
              icon={Clock}
              label="Retards"
              value={attendanceStats.retards}
              tone="warning"
            />
          </div>

          {attendanceStats.rate > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="size-4" />
                  Taux de présence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-3 rounded-full bg-muted overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all" 
                        style={{ width: `${attendanceStats.rate}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-lg font-bold">{attendanceStats.rate}%</span>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Présences récentes (7 derniers jours)</CardTitle>
            </CardHeader>
            <CardContent>
              {recentAttendances.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune présence enregistrée récemment</p>
              ) : (
                <div className="space-y-2">
                  {recentAttendances.map((attendance) => (
                    <div 
                      key={attendance.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "grid size-8 place-items-center rounded-full",
                          attendance.state === "present" ? "bg-success/15 text-success" :
                          attendance.state === "absent" ? "bg-destructive/15 text-destructive" :
                          "bg-muted text-muted-foreground"
                        )}>
                          {attendance.state === "present" ? <CheckCircle className="size-4" /> :
                           attendance.state === "absent" ? <XCircle className="size-4" /> :
                           <Clock className="size-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {new Date(attendance.date).toLocaleDateString("fr-FR", {
                              weekday: "long",
                              day: "numeric",
                              month: "numeric",
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {attendance.arrivalTime && `Arrivée: ${attendance.arrivalTime}`}
                            {attendance.departureTime && ` - Départ: ${attendance.departureTime}`}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={attendance.state === "present" ? "success" : 
                                 attendance.state === "absent" ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {attendance.state === "present" ? "Présent" :
                         attendance.state === "absent" ? "Absent" :
                         attendance.state}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activités */}
        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="size-4" />
                Activités récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivities.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune activité enregistrée</p>
              ) : (
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div 
                      key={activity.id}
                      className="rounded-lg border p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(activity.date).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                          {activity.description && (
                            <p className="text-sm mt-2">{activity.description}</p>
                          )}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {activity.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Facturation */}
        <TabsContent value="billing" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-xs font-semibold text-muted-foreground">Total facturé</p>
                  <p className="text-2xl font-bold mt-1">{formatCurrency(financialSummary.totalInvoiced)}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-xs font-semibold text-muted-foreground">Total payé</p>
                  <p className="text-2xl font-bold text-success mt-1">{formatCurrency(financialSummary.totalPaid)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className={financialSummary.remaining > 0 ? "border-warning/50 bg-warning/5" : ""}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-xs font-semibold text-muted-foreground">Restant à payer</p>
                  <p className={cn(
                    "text-2xl font-bold mt-1",
                    financialSummary.remaining > 0 ? "text-warning" : "text-success"
                  )}>
                    {formatCurrency(financialSummary.remaining)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="size-4" />
                Dernières factures
              </CardTitle>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune facture trouvée</p>
              ) : (
                <div className="space-y-2">
                  {invoices.map((invoice) => (
                    <div 
                      key={invoice.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">Facture n°{invoice.number}</p>
                        <p className="text-xs text-muted-foreground">
                          Échéance: {formatDate(invoice.dueDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{formatCurrency(invoice.total)}</p>
                        <Badge 
                          variant={invoice.status === "Payée" ? "success" : 
                                   invoice.status === "En retard" ? "destructive" : "secondary"}
                          className="text-xs mt-1"
                        >
                          {invoice.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FolderOpen className="size-4" />
                État des documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {child.missingDocuments.length === 0 ? (
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle className="size-4" />
                  <span className="text-sm">Tous les documents sont à jour</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-lg border border-warning/30 bg-warning/5 p-4">
                    <p className="text-sm font-medium text-warning mb-3">
                      📄 {child.missingDocuments.length} document{child.missingDocuments.length > 1 ? 's' : ''} manquant{child.missingDocuments.length > 1 ? 's' : ''}
                    </p>
                    <ul className="space-y-2">
                      {child.missingDocuments.map((doc, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <AlertCircle className="size-4 text-warning" />
                          {doc}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Historique */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <History className="size-4" />
                Journal d'activité
              </CardTitle>
            </CardHeader>
            <CardContent>
              {auditLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun événement dans l'historique</p>
              ) : (
                <div className="space-y-3">
                  {auditLogs.map((log) => (
                    <div 
                      key={log.id}
                      className="flex items-start gap-3 rounded-lg border p-3"
                    >
                      <div className="grid size-8 place-items-center rounded-full bg-muted">
                        <History className="size-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{log.action}</p>
                        <p className="text-xs text-muted-foreground mt-1">{log.detail}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.at).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {log.userId && (
                            <>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground">{log.userName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Composant helper pour les cartes d'information
interface InfoCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  secondary?: string;
}

function InfoCard({ icon: Icon, label, value, secondary }: InfoCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="size-4 text-muted-foreground" />
        <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      </div>
      <p className="text-sm font-medium">{value}</p>
      {secondary && (
        <p className="text-xs text-muted-foreground mt-1">{secondary}</p>
      )}
    </div>
  );
}

// Composant helper pour les mini statistiques
interface StatMiniCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  tone: "primary" | "success" | "warning" | "destructive";
}

function StatMiniCard({ icon: Icon, label, value, tone }: StatMiniCardProps) {
  const toneClasses: Record<string, string> = {
    primary: "bg-primary/15 text-primary",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    destructive: "bg-destructive/15 text-destructive",
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className={cn("grid size-10 place-items-center rounded-lg", toneClasses[tone])}>
            <Icon className="size-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">{label}</p>
            <p className="text-xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
