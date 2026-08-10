# KAKO Care Suite

PROJET — KAKO MANAGER

Tu es un architecte logiciel senior, UX/UI designer et développeur full-stack expérimenté.

Je veux développer une application professionnelle de gestion de crèche appelée KAKO Manager.

L'objectif n'est pas de créer une simple maquette ou une landing page. Je veux construire progressivement une véritable application de gestion, avec une interface moderne, une logique métier cohérente, une base de données structurée et des fonctionnalités réellement utilisables.

1. VISION DU PRODUIT

KAKO Manager est un logiciel destiné aux crèches et établissements de petite enfance.

Il doit permettre de gérer dans une seule application :

les enfants ;

les parents et tuteurs ;

les inscriptions ;

les dossiers administratifs ;

les contrats ;

les présences et absences ;

les arrivées et départs ;

les plannings ;

les transmissions quotidiennes ;

les repas ;

les changes ;

les siestes ;

les activités pédagogiques ;

les informations médicales ;

les incidents ;

les médicaments ;

la facturation ;

les paiements ;

les impayés ;

le personnel ;

les congés ;

les documents ;

les rapports ;

les statistiques ;

les utilisateurs et permissions ;

les sauvegardes.

Le logiciel doit avoir une identité propre appelée KAKO Manager.

Ne copie pas visuellement une autre application existante.

2. PRIORITÉ ABSOLUE

Je ne veux PAS que tu construises immédiatement toutes les fonctionnalités en profondeur.

Construis le projet comme un véritable produit logiciel, par étapes.

La priorité est :

Architecture générale

Navigation

Authentification

Tableau de bord

Gestion des enfants

Gestion des familles

Présences / pointage

Transmissions

Planning

Facturation

Personnel

Documents

Rapports

Paramètres

Sauvegarde

Chaque module devra être réellement connecté aux autres.

Évite les écrans remplis de données fictives qui donnent l'impression que le logiciel fonctionne alors que les actions ne font rien.

3. ARCHITECTURE

Construis une architecture propre, modulaire et évolutive.

Sépare clairement :

interface utilisateur ;

composants réutilisables ;

logique métier ;

modèles de données ;

services ;

gestion de l'état ;

authentification ;

permissions ;

stockage des données ;

génération de documents ;

statistiques.

Le projet doit être facilement maintenable.

Évite de mettre toute la logique dans un seul fichier.

4. APPLICATION DESKTOP / OFFLINE-FIRST

Le produit final est destiné à devenir une application Windows.

L'objectif fonctionnel est donc :

fonctionnement local ;

utilisation sans Internet ;

conservation des données après fermeture ;

possibilité de sauvegarder les données ;

possibilité de restaurer une sauvegarde ;

aucune dépendance obligatoire à un service en ligne pour les fonctions principales.

Pour le prototype Lovable, utilise une architecture permettant ensuite de transformer facilement l'application en application desktop Windows.

Privilégie une architecture local-first / offline-first.

Ne rends pas les fonctions principales dépendantes d'une API Internet.

Prévois une couche de stockage abstraite afin qu'une base locale puisse être utilisée.

5. DESIGN UI/UX

Je veux une interface extrêmement professionnelle, moderne, propre et agréable.

L'application doit ressembler à un véritable logiciel professionnel et non à un simple site web.

Style :

moderne ;

minimaliste ;

professionnel ;

chaleureux ;

adapté au domaine de la petite enfance ;

très lisible ;

espaces bien équilibrés ;

cartes modernes ;

tableaux propres ;

icônes cohérentes ;

animations très discrètes ;

excellente hiérarchie visuelle.

Évite :

les interfaces surchargées ;

les énormes cartes inutiles ;

les textes minuscules ;

les tableaux trop serrés ;

les espaces vides excessifs ;

les couleurs criardes ;

les dégradés excessifs ;

les boutons géants ;

les interfaces ressemblant à des dashboards génériques.

L'interface doit être utilisable sur un écran d'ordinateur classique.

Elle doit également rester confortable sur des écrans plus petits.

6. STRUCTURE GÉNÉRALE

Créer une application avec :

SIDEBAR

Tableau de bord

Enfants

Familles

Inscriptions

Planning

Présences

Transmissions

Activités

Repas & Hygiène

Facturation

Paiements

Personnel

Rapports

Documents

Paramètres

Sauvegarde

La sidebar doit être claire et pouvoir être réduite.

Afficher le profil de l'utilisateur connecté en bas.

7. TABLEAU DE BORD

Créer un véritable dashboard opérationnel.

Afficher notamment :

Enfants inscrits

Présents aujourd'hui

Absents aujourd'hui

Enfants attendus

Retards

Départs prévus

Factures impayées

Documents manquants

Alertes médicales

Personnel présent

Taux d'occupation

Anniversaires proches

Contrats arrivant à expiration

Créer également une section :

ACTIONS RAPIDES

Ajouter un enfant

Enregistrer une arrivée

Enregistrer un départ

Ajouter une absence

Ajouter une transmission

Créer une facture

Enregistrer un paiement

Faire une sauvegarde

Créer également :

activité récente ;

alertes importantes ;

résumé de la journée ;

statistiques simples.

Les statistiques doivent être calculées à partir des données de l'application et non simplement affichées comme du texte fictif.

8. MODULE ENFANTS

Créer une page professionnelle de gestion des enfants.

Elle doit proposer :

recherche ;

filtres ;

tri ;

vue liste ;

vue cartes/mosaïque ;

ajout ;

modification ;

suppression/archivage ;

consultation détaillée.

Chaque enfant doit posséder une fiche complète.

FICHE ENFANT

Informations :

numéro de dossier ;

nom ;

prénom ;

date de naissance ;

sexe ;

photo ;

adresse ;

date d'inscription ;

date de début d'accueil ;

section/groupe ;

statut ;

langue ;

observations.

Statuts :

Préinscrit

Inscrit

Suspendu

Sorti

Créer une fiche enfant moderne avec des onglets.

Onglets :

Informations générales

Famille

Santé

Présences

Transmissions

Repas

Sommeil

Changes

Activités

Incidents

Médicaments

Documents

Facturation

Historique

9. MODULE FAMILLES

Permettre de gérer plusieurs responsables pour un même enfant.

Informations :

nom ;

prénom ;

relation avec l'enfant ;

téléphone ;

adresse ;

profession ;

contact d'urgence ;

pièce d'identité ;

autorisation de sortie ;

autorisation de récupération.

Permettre d'indiquer précisément :

qui peut récupérer l'enfant ;

qui peut être contacté en urgence ;

qui reçoit les documents ;

qui peut signer certains documents.

10. PRÉSENCES ET POINTAGE

Créer une interface extrêmement rapide pour les éducateurs.

Afficher les enfants du jour.

Chaque enfant doit avoir une action :

ARRIVÉE

ou

DÉPART

Enregistrer automatiquement :

date ;

heure ;

utilisateur ;

accompagnateur ;

personne récupérant l'enfant ;

retard ;

départ anticipé ;

absence.

Prévoir une interface visuelle permettant de voir immédiatement :

présents ;

absents ;

attendus ;

arrivés ;

partis ;

en retard.

Les modifications doivent être enregistrées dans un historique.

11. TRANSMISSIONS

Créer un véritable cahier de transmission quotidien.

Pour chaque enfant :

repas ;

quantité consommée ;

biberon ;

quantité du biberon ;

change ;

sieste ;

durée ;

humeur ;

température ;

activité ;

observation pédagogique ;

incident ;

médicament ;

commentaire.

Créer automatiquement un résumé quotidien.

Prévoir un bouton :

IMPRIMER LA TRANSMISSION DU JOUR

12. PLANNING

Créer deux systèmes :

Planning enfants

jour ;

semaine ;

mois ;

section ;

enfant ;

horaires ;

présence prévue ;

absence prévue ;

changement temporaire.

Planning personnel

employés ;

horaires ;

sections ;

congés ;

absences ;

remplacements ;

heures supplémentaires.

Afficher des alertes si :

capacité dépassée ;

personnel insuffisant ;

horaires incompatibles.

13. FACTURATION

Créer une vraie logique de facturation.

Paramètres :

tarif mensuel ;

tarif journalier ;

tarif horaire ;

tarif par section ;

frais d'inscription ;

repas ;

frais supplémentaires ;

réduction fratrie ;

réduction exceptionnelle ;

pénalité ;

devise.

Une facture doit posséder :

numéro ;

date ;

enfant ;

responsable ;

lignes ;

montant ;

réduction ;

total ;

montant payé ;

reste à payer ;

statut.

Statuts :

Non payée

Partiellement payée

Payée

En retard

Annulée

Remboursée

14. PAIEMENTS

Permettre l'enregistrement manuel de :

espèces ;

virement ;

chèque ;

carte ;

mobile money ;

autre.

Afficher :

historique ;

montant ;

date ;

facture associée ;

utilisateur ;

moyen de paiement.

Calculer automatiquement le reste à payer.

15. PERSONNEL

Créer une gestion complète des employés.

Informations :

nom ;

prénom ;

fonction ;

téléphone ;

adresse ;

qualification ;

date d'embauche ;

contrat ;

horaires ;

heures travaillées ;

congés ;

absences ;

documents ;

notes internes.

Créer également :

planning ;

pointage ;

demandes de congés ;

validation ;

historique.

Ne pas développer la paie complète dans cette première version.

16. ACTIVITÉS

Créer un module pédagogique.

Permettre de :

créer une activité ;

choisir une catégorie ;

ajouter une description ;

sélectionner les enfants ;

ajouter une observation ;

ajouter une photo locale ;

indiquer les compétences observées.

Catégories :

Motricité

Langage

Éveil musical

Jeux sensoriels

Arts plastiques

Lecture

Jeux collectifs

Activités extérieures

17. REPAS / CHANGES / SIESTES

Créer trois sous-modules.

Repas

menus ;

menus par jour ;

menus par section ;

quantités ;

allergies ;

historique.

Changes

heure ;

type ;

observation ;

irritation ;

incident ;

produit.

Siestes

début ;

fin ;

durée automatique ;

qualité ;

réveil ;

observation.

18. DOCUMENTS

Créer un centre documentaire.

Documents :

contrat d'accueil ;

fiche d'inscription ;

fiche sanitaire ;

autorisation de sortie ;

autorisation photo ;

autorisation médicale ;

règlement intérieur ;

fiche de renseignements ;

reçu ;

attestation ;

certificat de présence ;

fiche de départ.

Chaque document doit pouvoir être :

généré ;

imprimé ;

exporté en PDF ;

associé au dossier de l'enfant ;

réouvert ultérieurement.

Prévoir une personnalisation :

logo ;

nom de la crèche ;

adresse ;

téléphone ;

devise ;

mentions légales ;

signatures.

19. RAPPORTS

Créer un centre de rapports.

Rapports :

enfants inscrits ;

présents ;

absents ;

taux d'occupation ;

présences ;

absences ;

répartition par section ;

chiffre d'affaires ;

paiements ;

impayés ;

activités ;

incidents ;

personnel ;

inscriptions.

Prévoir :

aperçu ;

impression ;

PDF ;

CSV ;

Excel lorsque techniquement disponible.

20. UTILISATEURS ET PERMISSIONS

Créer les rôles :

ADMINISTRATEUR
DIRECTEUR
SECRÉTAIRE
ÉDUCATEUR
COMPTABLE
CONSULTATION

Chaque utilisateur possède :

nom d'utilisateur ;

mot de passe ;

rôle ;

permissions ;

statut ;

date de création ;

dernière connexion.

Les permissions doivent être réellement appliquées.

Exemple :

Un éducateur ne doit pas pouvoir consulter la facturation ou modifier des informations médicales auxquelles il n'a pas accès.

21. SÉCURITÉ

Prévoir :

authentification ;

déconnexion ;

verrouillage automatique ;

permissions ;

journal des actions ;

limitation des tentatives ;

archivage ;

protection des données médicales.

Ne jamais afficher les mots de passe en clair.

22. SAUVEGARDE

Créer un module de sauvegarde.

Permettre :

sauvegarde manuelle ;

sauvegarde automatique ;

restauration ;

sélection du dossier ;

historique des sauvegardes.

Destinations possibles :

disque local ;

clé USB ;

disque externe ;

dossier réseau local.

Avant une restauration, créer automatiquement une sauvegarde de sécurité.

23. BASE DE DONNÉES

Prévoir une structure relationnelle propre avec notamment :

users
roles
permissions
establishments
sections
children
parents
child_parents
authorized_persons
emergency_contacts
documents
contracts
attendance
absences
child_schedules
employees
employee_schedules
leave_requests
daily_reports
meals
diaper_changes
naps
activities
observations
incidents
medications
pricing
invoices
invoice_items
payments
unpaid_invoices
backups
audit_logs
settings

Les relations entre les données doivent être cohérentes.

Par exemple :

UN ENFANT → plusieurs parents

UN PARENT → plusieurs enfants

UN ENFANT → plusieurs présences

UN ENFANT → plusieurs transmissions

UN ENFANT → plusieurs factures

UNE FACTURE → plusieurs lignes

UNE FACTURE → plusieurs paiements

24. DONNÉES DE TEST

Pour le développement initial, créer quelques données de démonstration réalistes :

enfants ;

parents ;

employés ;

sections ;

présences ;

factures ;

paiements ;

activités.

Mais séparer clairement les données de démonstration des vraies données.

Prévoir également une possibilité de vider/réinitialiser les données de démonstration.

25. RESPONSIVE ET ERGONOMIE

L'application doit fonctionner correctement :

avec souris ;

clavier ;

écran tactile.

Les formulaires doivent être simples.

Éviter les formulaires interminables.

Utiliser :

onglets ;

sections ;

accordéons lorsque pertinent ;

étapes pour les formulaires complexes.

Toujours afficher clairement :

Enregistrer

Annuler

Modifier

Supprimer

Imprimer

Retour

26. RÈGLES DE DÉVELOPPEMENT

IMPORTANT :

Ne crée pas uniquement des écrans statiques.

Chaque bouton important doit avoir une fonction réelle.

Ne crée pas plusieurs pages qui répètent la même interface.

Réutilise les composants.

Créer des composants cohérents pour :

tableaux ;

formulaires ;

modales ;

cartes ;

badges ;

boutons ;

filtres ;

notifications ;

dialogues de confirmation.

Gérer les états :

chargement ;

vide ;

erreur ;

succès ;

validation.

Afficher des messages compréhensibles en français.

27. IDENTITÉ VISUELLE

Nom :

KAKO Manager

Créer une identité visuelle professionnelle.

Je veux un design :

moderne ;

élégant ;

chaleureux ;

professionnel ;

adapté à une crèche ;

pas enfantin au point de perdre l'aspect professionnel.

Créer une palette cohérente.

Les couleurs doivent servir à identifier les états :

Présence
Absence
Alerte
Succès
Attention
Information

Ne pas utiliser une multitude de couleurs sans raison.

28. LANGUE

Toute l'application doit être en français.

Les textes d'interface, boutons, messages, erreurs, formulaires et tableaux doivent être en français.

Utiliser un vocabulaire professionnel mais simple.

29. IMPORTANT — MÉTHODE DE TRAVAIL

Ne tente pas de générer toute l'application en une seule étape.

Commence par :

PHASE 1 :

architecture ;

système de navigation ;

sidebar ;

header ;

authentification ;

tableau de bord ;

système de thème ;

structure des données ;

composants UI réutilisables.

Ensuite attends ma validation avant de développer les modules suivants.

Lorsque je valide une phase, conserve exactement l'architecture existante et ajoute la fonctionnalité suivante sans casser les fonctionnalités précédentes.

Ne remplace jamais une fonctionnalité fonctionnelle par une simple maquette.

Avant chaque modification importante, vérifie les dépendances entre les modules.

30. PREMIÈRE TÂCHE

Pour commencer, construis uniquement le socle professionnel de KAKO Manager :

écran de connexion ;

layout principal ;

sidebar ;

header ;

profil utilisateur ;

tableau de bord ;

navigation entre les pages ;

composants UI réutilisables ;

structure initiale de données ;

système de rôles et permissions ;

responsive desktop ;

thème visuel KAKO Manager.

Le résultat doit déjà donner l'impression d'utiliser un véritable logiciel professionnel de gestion de crèche.

NE PAS encore développer en profondeur la facturation, les transmissions, les activités, le personnel ou les rapports.

Construis d'abord une base solide et propre.

Après cette première phase, indique clairement :

PHASE 1 TERMINÉE — PRÊT POUR LE MODULE ENFANTS

Puis attends mes prochaines instructions.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d2e5a37e-aec5-4e27-a8b2-b056c405d589).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
