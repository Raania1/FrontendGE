import { Routes } from '@angular/router';
import { AboutComponent } from '../Components/about/about.component';
import { HomeComponent } from '../Components/home/home.component';
import { ContactComponent } from '../Components/contact/contact.component';
import { InscritCondidatComponent } from '../Components/inscrit-condidat/inscrit-condidat.component';
import { InscritPresComponent } from '../Components/inscrit-pres/inscrit-pres.component';
import { ConnexionComponent } from '../Components/connexion/connexion.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    {path: 'about',component:AboutComponent},
    {path: 'contact',component:ContactComponent},
    {path: 'inscritC',component:InscritCondidatComponent},
    {path: 'inscritP',component:InscritPresComponent},
    {path: 'connexion',component:ConnexionComponent},





];
