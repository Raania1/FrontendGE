import { Routes } from '@angular/router';
import { AboutComponent } from '../Components/about/about.component';
import { HomeComponent } from '../Components/home/home.component';
import { ContactComponent } from '../Components/contact/contact.component';
import { InscritCondidatComponent } from '../Components/inscrit-condidat/inscrit-condidat.component';
import { InscritPresComponent } from '../Components/inscrit-pres/inscrit-pres.component';
import { ConnexionComponent } from '../Components/connexion/connexion.component';
import { NavbarORComponent } from '../Components/Organisateur/navbar-or/navbar-or.component';
import { ProfileOrComponent } from '../Components/Organisateur/profile-or/profile-or.component';
import { SidebarPRComponent } from '../Components/Prestataire/sidebar-pr/sidebar-pr.component';
import { ProfilePrComponent } from '../Components/Prestataire/profile-pr/profile-pr.component';
import { ParametrePRComponent } from '../Components/Prestataire/parametre-pr/parametre-pr.component';
import { NewPasswordComponent } from '../Components/new-password/new-password.component';
import { SidebarAdComponent } from '../Components/Admin/sidebar-ad/sidebar-ad.component';
import { ProfileAComponent } from '../Components/Admin/profile-a/profile-a.component';
import { ListOrganisateurComponent } from '../Components/Admin/list-organisateur/list-organisateur.component';
import { ListPrestataireComponent } from '../Components/Admin/list-prestataire/list-prestataire.component';
import { AcceuilORComponent } from '../Components/Organisateur/acceuil-or/acceuil-or.component';
import { ServicePhComponent } from '../Components/Organisateur/service-ph/service-ph.component';
import { CreateSComponent } from '../Components/Prestataire/create-s/create-s.component';
import { ServicesPrComponent } from '../Components/Prestataire/services-pr/services-pr.component';
import { EditServiceComponent } from '../Components/Prestataire/edit-service/edit-service.component';
import { ServicesAdComponent } from '../Components/Admin/services-ad/services-ad.component';
import { ServicesOrComponent } from '../Components/Organisateur/services-or/services-or.component';
import { ServiceDetailsComponent } from '../Components/Organisateur/service-details/service-details.component';
import { CreatEventComponent } from '../Components/Organisateur/creat-event/creat-event.component';
import { PresDetailsComponent } from '../Components/Organisateur/pres-details/pres-details.component';
import { ReservationFormComponent } from '../Components/Organisateur/reservation-form/reservation-form.component';
import { ReservationPrComponent } from '../Components/Prestataire/reservation-pr/reservation-pr.component';
import { ReservationOrComponent } from '../Components/Organisateur/reservation-or/reservation-or.component';
import { MassagesComponent } from '../Components/Admin/massages/massages.component';
import { SuccessComponent } from '../Components/Organisateur/success/success.component';
import { FailComponent } from '../Components/Organisateur/fail/fail.component';
import { ReservationAdComponent } from '../Components/Admin/reservation-ad/reservation-ad.component';
import { ContratAdComponent } from '../Components/Admin/contrat-ad/contrat-ad.component';
import { PackFormComponent } from '../Components/Prestataire/pack-form/pack-form.component';
import { PacksPrComponent } from '../Components/Prestataire/packs-pr/packs-pr.component';
import { DetailsPackComponent } from '../Components/Prestataire/details-pack/details-pack.component';
import { PublicitePrComponent } from '../Components/Prestataire/publicite-pr/publicite-pr.component';
import { PubliciteAdComponent } from '../Components/Admin/publicite-ad/publicite-ad.component';
import { FailPrComponent } from '../Components/Prestataire/fail-pr/fail-pr.component';
import { SuccessPrComponent } from '../Components/Prestataire/success-pr/success-pr.component';
import { PacksORComponent } from '../Components/Organisateur/packs-or/packs-or.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    {path: 'about',component:AboutComponent},
    {path: 'contact',component:ContactComponent},
    {path: 'inscritC',component:InscritCondidatComponent},
    {path: 'inscritP',component:InscritPresComponent},
    {path: 'connexion',component:ConnexionComponent},
    {path: 'reset-password/:id/:token',component:NewPasswordComponent},

    // espace organisateur
    {path: 'navOR',component:NavbarORComponent},
    {path: 'profileOR',component:ProfileOrComponent},
    { path: 'homeOr', component: AcceuilORComponent },
    { path: 'servicePH', component: ServicePhComponent },
    { path: 'servicesOr', component: ServicesOrComponent },
    { path: 'seviceDetail/:id', component: ServiceDetailsComponent },
    { path: 'creatEvent', component: CreatEventComponent },
    { path: 'PresDetails/:id', component: PresDetailsComponent },
    { path: 'reservation/:id', component: ReservationFormComponent },
    { path: 'reservationsOR', component: ReservationOrComponent },
    { path: 'success', component: SuccessComponent },
    { path: 'fail', component: FailComponent },
    { path: 'packsOR', component: PacksORComponent },



    // espace prestataire
    // {path: 'sidePr',component:SidebarPRComponent},
    // {path: 'profilePr',component:ProfilePrComponent},
    {
        path: 'prestataire',
        component: SidebarPRComponent, 
        children: [
          { path: 'profile', component: ProfilePrComponent },
          { path: 'parametre', component: ParametrePRComponent },
          { path: 'creatService', component: CreateSComponent },
          { path: 'servicePR', component: ServicesPrComponent },
          { path: 'EditService/:id', component: EditServiceComponent },
          { path: 'reservations', component: ReservationPrComponent },
          { path: 'calendrier', component: ReservationPrComponent },
          { path: 'packForm', component: PackFormComponent },
          { path: 'packPr', component: PacksPrComponent },
          { path: 'EditPack/:id', component: DetailsPackComponent },
          { path: 'publicitePr', component: PublicitePrComponent },
          { path: 'successPr', component: SuccessPrComponent },
          { path: 'failPr', component: FailPrComponent },
        ],
      },
      {
        path: 'administrateur', 
        component: SidebarAdComponent, 
        children: [
          { path: 'profile', component: ProfileAComponent },
          { path: 'ListOr', component: ListOrganisateurComponent },
          { path: 'ListPr', component: ListPrestataireComponent },
          { path: 'serviceAd', component: ServicesAdComponent },
          { path: 'message', component: MassagesComponent },
          { path: 'reservations', component: ReservationAdComponent },
          { path: 'contrat', component: ContratAdComponent },
          { path: 'publiciteAd', component: PubliciteAdComponent },

        ],
      }

    


    
    




];
