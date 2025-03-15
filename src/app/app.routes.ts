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

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    {path: 'about',component:AboutComponent},
    {path: 'contact',component:ContactComponent},
    {path: 'inscritC',component:InscritCondidatComponent},
    {path: 'inscritP',component:InscritPresComponent},
    {path: 'connexion',component:ConnexionComponent},
    // espace organisateur
    {path: 'navOR',component:NavbarORComponent},
    {path: 'profileOR',component:ProfileOrComponent},
    // espace prestataire
    // {path: 'sidePr',component:SidebarPRComponent},
    // {path: 'profilePr',component:ProfilePrComponent},
    {
        path: 'prestataire',
        component: SidebarPRComponent, 
        children: [
          { path: 'profile', component: ProfilePrComponent },
        ],
      }

    


    
    




];
