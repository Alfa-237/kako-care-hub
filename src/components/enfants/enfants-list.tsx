import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Child, Section } from "@/lib/data/types";
import { cn } from "@/lib/utils";
import {
  MoreVertical,
  Eye,
  Pencil,
  Archive,
  PauseCircle,
  PlayCircle,
  Trash2,
  CalendarCheck,
  Users,
  CreditCard,
  Activity,
  Utensils,
  FileText,
  AlertCircle,
  UserRound,
} from "lucide-react";

interface EnfantsListViewProps {
  children: Child[];
  sectionsMap: Map<string, Section>;
  calculateAge: (birthDate: string) => number;
  getPrimaryParent: (childId: string) => { id: string; firstName: string; lastName: string } | null;
  hasAttendanceToday: (childId: string) => boolean;
  canEdit: boolean;
  canDelete: boolean;
  canArchive: boolean;
  onViewChild: (childId: string) => void;
  onEditChild: (childId: string) => void;
  onArchiveChild: (childId: string) => void;
  onSuspendChild: (childId: string) => void;
  onReactivateChild: (childId: string) => void;
  onDeleteChild: (childId: string) => void;
  canUserDelete: (childId: string) => boolean;
}

export function EnfantsListView({
  children,
  sectionsMap,
  calculateAge,
  getPrimaryParent,
  hasAttendanceToday,
  canEdit,
  canDelete,
  canArchive,
  onViewChild,
  onEditChild,
  onArchiveChild,
  onSuspendChild,
  onReactivateChild,
  onDeleteChild,
  canUserDelete,
}: EnfantsListViewProps) {
  const getStatusBadge = (status: Child["status"]) => {
    switch (status) {
      case "Inscrit":
        return <Badge variant="default" className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Inscrit</Badge>;
      case "Préinscrit":
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-200">Préinscrit</Badge>;
      case "Suspendu":
        return <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-200">Suspendu</Badge>;
      case "Sorti":
        return <Badge variant="outline" className="text-muted-foreground">Sorti</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getGenderIcon = (gender: "F" | "M") => {
    return gender === "F" ? "👧" : "👦";
  };

  const getChildPhoto = (child: Child) => {
    if (child.photo) return child.photo;
    return null;
  };

  const getChildInitials = (child: Child) => {
    return `${child.firstName[0]}${child.lastName[0]}`.toUpperCase();
  };

  const renderActionsMenu = (child: Child) => {
    const isDeletable = canUserDelete(child.id);
    const canSuspend = canArchive && child.status === "Inscrit";
    const canReactivate = canArchive && child.status === "Suspendu";

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => onViewChild(child.id)} className="cursor-pointer">
            <Eye className="mr-2 h-4 w-4" />
            Voir la fiche
          </DropdownMenuItem>
          
          {canEdit && (
            <DropdownMenuItem onClick={() => onEditChild(child.id)} className="cursor-pointer">
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          {canSuspend && (
            <DropdownMenuItem 
              onClick={() => onSuspendChild(child.id)} 
              className="cursor-pointer text-amber-600"
            >
              <PauseCircle className="mr-2 h-4 w-4" />
              Suspendre
            </DropdownMenuItem>
          )}
          
          {canReactivate && (
            <DropdownMenuItem 
              onClick={() => onReactivateChild(child.id)} 
              className="cursor-pointer text-emerald-600"
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Réactiver
            </DropdownMenuItem>
          )}
          
          {canArchive && child.status !== "Sorti" && !canSuspend && !canReactivate && (
            <DropdownMenuItem 
              onClick={() => onArchiveChild(child.id)} 
              className="cursor-pointer text-orange-600"
            >
              <Archive className="mr-2 h-4 w-4" />
              Archiver / Sortir
            </DropdownMenuItem>
          )}
          
          {canDelete && isDeletable && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDeleteChild(child.id)} 
                className="cursor-pointer text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </>
          )}
          
          {!isDeletable && canDelete && (
            <DropdownMenuItem disabled className="cursor-not-allowed">
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer (données liées)
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem className="cursor-pointer">
            <CalendarCheck className="mr-2 h-4 w-4" />
            Ajouter une présence
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer">
            <Users className="mr-2 h-4 w-4" />
            Voir les parents
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4" />
            Voir les paiements
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer">
            <Activity className="mr-2 h-4 w-4" />
            Voir les activités
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer">
            <Utensils className="mr-2 h-4 w-4" />
            Voir les repas
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer">
            <FileText className="mr-2 h-4 w-4" />
            Voir les documents
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // Vue Tableau
  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="w-[60px]">Photo</TableHead>
            <TableHead>Enfant</TableHead>
            <TableHead className="w-[80px]">Âge</TableHead>
            <TableHead className="w-[70px]">Sexe</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Parent principal</TableHead>
            <TableHead className="w-[100px]">Statut</TableHead>
            <TableHead className="w-[90px]">Présence</TableHead>
            <TableHead className="w-[70px]">Alertes</TableHead>
            <TableHead className="w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {children.map((child) => {
            const section = child.sectionId ? sectionsMap.get(child.sectionId) : null;
            const primaryParent = getPrimaryParent(child.id);
            const isPresentToday = hasAttendanceToday(child.id);
            const age = calculateAge(child.birthDate);
            const photoUrl = getChildPhoto(child);

            return (
              <TableRow key={child.id} className="group hover:bg-muted/30">
                <TableCell>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={photoUrl || undefined} alt={child.firstName} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {getChildInitials(child)}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {child.firstName} {child.lastName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      N° {child.fileNumber}
                    </span>
                  </div>
                </TableCell>
                
                <TableCell>
                  <span className="text-sm text-muted-foreground">{age} ans</span>
                </TableCell>
                
                <TableCell>
                  <span className="text-lg" title={child.gender === "F" ? "Fille" : "Garçon"}>
                    {getGenderIcon(child.gender)}
                  </span>
                </TableCell>
                
                <TableCell>
                  {section ? (
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-2 w-2 rounded-full" 
                        style={{ backgroundColor: section.color }}
                      />
                      <span className="text-sm font-medium">{section.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
                
                <TableCell>
                  {primaryParent ? (
                    <div className="flex items-center gap-2">
                      <UserRound className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">
                        {primaryParent.firstName} {primaryParent.lastName}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Aucun</span>
                  )}
                </TableCell>
                
                <TableCell>
                  {getStatusBadge(child.status)}
                </TableCell>
                
                <TableCell>
                  {isPresentToday ? (
                    <Badge variant="default" className="bg-emerald-500/10 text-emerald-600 border-emerald-200 text-xs">
                      <CalendarCheck className="mr-1 h-3 w-3" />
                      Présent
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">Absent</span>
                  )}
                </TableCell>
                
                <TableCell>
                  {child.medicalAlert ? (
                    <Badge variant="destructive" className="text-xs">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      Oui
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                
                <TableCell className="text-right">
                  {renderActionsMenu(child)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export function EnfantsCardsView({
  children,
  sectionsMap,
  calculateAge,
  getPrimaryParent,
  hasAttendanceToday,
  canEdit,
  canDelete,
  canArchive,
  onViewChild,
  onEditChild,
  onArchiveChild,
  onSuspendChild,
  onReactivateChild,
  onDeleteChild,
  canUserDelete,
}: EnfantsListViewProps) {
  const getStatusBadge = (status: Child["status"]) => {
    switch (status) {
      case "Inscrit":
        return <Badge variant="default" className="bg-emerald-500/10 text-emerald-600 border-emerald-200 text-xs">Inscrit</Badge>;
      case "Préinscrit":
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-200 text-xs">Préinscrit</Badge>;
      case "Suspendu":
        return <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-200 text-xs">Suspendu</Badge>;
      case "Sorti":
        return <Badge variant="outline" className="text-muted-foreground text-xs">Sorti</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{status}</Badge>;
    }
  };

  const getGenderIcon = (gender: "F" | "M") => {
    return gender === "F" ? "👧" : "👦";
  };

  const getChildPhoto = (child: Child) => {
    if (child.photo) return child.photo;
    return null;
  };

  const getChildInitials = (child: Child) => {
    return `${child.firstName[0]}${child.lastName[0]}`.toUpperCase();
  };

  const renderActionsMenu = (child: Child) => {
    const isDeletable = canUserDelete(child.id);
    const canSuspend = canArchive && child.status === "Inscrit";
    const canReactivate = canArchive && child.status === "Suspendu";

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => onViewChild(child.id)} className="cursor-pointer">
            <Eye className="mr-2 h-4 w-4" />
            Voir la fiche
          </DropdownMenuItem>
          
          {canEdit && (
            <DropdownMenuItem onClick={() => onEditChild(child.id)} className="cursor-pointer">
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          {canSuspend && (
            <DropdownMenuItem 
              onClick={() => onSuspendChild(child.id)} 
              className="cursor-pointer text-amber-600"
            >
              <PauseCircle className="mr-2 h-4 w-4" />
              Suspendre
            </DropdownMenuItem>
          )}
          
          {canReactivate && (
            <DropdownMenuItem 
              onClick={() => onReactivateChild(child.id)} 
              className="cursor-pointer text-emerald-600"
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Réactiver
            </DropdownMenuItem>
          )}
          
          {canArchive && child.status !== "Sorti" && !canSuspend && !canReactivate && (
            <DropdownMenuItem 
              onClick={() => onArchiveChild(child.id)} 
              className="cursor-pointer text-orange-600"
            >
              <Archive className="mr-2 h-4 w-4" />
              Archiver / Sortir
            </DropdownMenuItem>
          )}
          
          {canDelete && isDeletable && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDeleteChild(child.id)} 
                className="cursor-pointer text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </>
          )}
          
          {!isDeletable && canDelete && (
            <DropdownMenuItem disabled className="cursor-not-allowed">
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer (données liées)
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem className="cursor-pointer">
            <CalendarCheck className="mr-2 h-4 w-4" />
            Ajouter présence
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer">
            <Users className="mr-2 h-4 w-4" />
            Voir parents
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4" />
            Paiements
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer">
            <Activity className="mr-2 h-4 w-4" />
            Activités
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer">
            <Utensils className="mr-2 h-4 w-4" />
            Repas
          </DropdownMenuItem>
          
          <DropdownMenuItem className="cursor-pointer">
            <FileText className="mr-2 h-4 w-4" />
            Documents
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {children.map((child) => {
        const section = child.sectionId ? sectionsMap.get(child.sectionId) : null;
        const primaryParent = getPrimaryParent(child.id);
        const isPresentToday = hasAttendanceToday(child.id);
        const age = calculateAge(child.birthDate);
        const photoUrl = getChildPhoto(child);

        return (
          <Card key={child.id} className="group relative overflow-hidden transition-all hover:shadow-md">
            <CardContent className="p-4 pb-3">
              {/* En-tête de carte */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-border">
                    <AvatarImage src={photoUrl || undefined} alt={child.firstName} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getChildInitials(child)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate">
                      {child.firstName} {child.lastName}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">
                      N° {child.fileNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-lg" title={child.gender === "F" ? "Fille" : "Garçon"}>
                    {getGenderIcon(child.gender)}
                  </span>
                  {renderActionsMenu(child)}
                </div>
              </div>

              {/* Informations principales */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Âge</span>
                  <span className="font-medium">{age} ans</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Section</span>
                  {section ? (
                    <div className="flex items-center gap-1.5">
                      <div 
                        className="h-2 w-2 rounded-full" 
                        style={{ backgroundColor: section.color }}
                      />
                      <span className="font-medium">{section.name}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Parent</span>
                  <span className="truncate max-w-[120px] text-right">
                    {primaryParent ? `${primaryParent.firstName} ${primaryParent.lastName}` : "Aucun"}
                  </span>
                </div>
              </div>

              {/* Statut et présence */}
              <div className="flex items-center justify-between pt-2 border-t">
                {getStatusBadge(child.status)}
                
                {isPresentToday ? (
                  <Badge variant="default" className="bg-emerald-500/10 text-emerald-600 border-emerald-200 text-xs">
                    <CalendarCheck className="mr-1 h-3 w-3" />
                    Présent
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">Absent</span>
                )}
              </div>

              {/* Alerte médicale */}
              {child.medicalAlert && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-destructive bg-destructive/5 px-2 py-1 rounded-md">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span className="font-medium">Alerte médicale</span>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="px-4 py-2 bg-muted/30 border-t">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-xs h-8"
                onClick={() => onViewChild(child.id)}
              >
                <Eye className="mr-1.5 h-3.5 w-3.5" />
                Voir la fiche
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
