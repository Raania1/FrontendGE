import { Routes } from '@angular/router';
import { AboutComponent } from '../Components/about/about.component';
import { HomeComponent } from '../Components/home/home.component';
import { ContactComponent } from '../Components/contact/contact.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    {path: 'about',component:AboutComponent},
    {path: 'contact',component:ContactComponent},


];
