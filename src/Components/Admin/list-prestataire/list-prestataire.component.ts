import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faUser, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-list-prestataire',
  standalone: true,
  imports: [CommonModule,FontAwesomeModule],
  templateUrl: './list-prestataire.component.html',
  styleUrl: './list-prestataire.component.css'
})
export class ListPrestataireComponent {
faBell = faBell;
    faUser = faUser;
      faTrash =faTrash;
    faSearch = faSearch;
    showAll: boolean = true; // Par défaut, afficher "Tous les Prestataires"

  pres = [
    {
      nom: 'Boujneh',
      prenom:'Rania',
      travail:"photographe",
      email: 'lindsay.walton@example.com',
      numTel: 'Front-end Developer',
      numCin: 'Optimization',
      Ville: 'Active',
      adress: 'Member',
      aprooved:true,
      createdAt:'2022-05-22',
      pdProfile: 'https://randomuser.me/api/portraits/women/44.jpg',
      nbrS:5,
      nbrR:8
    },
    {
      nom: 'Boujneh',
      prenom:'Rania',
      travail:"photographe",
      email: 'lindsay.walton@example.com',
      numTel: 'Front-end Developer',
      numCin: 'Optimization',
      Ville: 'Active',
      adress: 'Member',
      aprooved:false,
      createdAt:'2022-05-22',
      pdProfile: 'https://randomuser.me/api/portraits/women/44.jpg',
      nbrS:5,
      nbrR:8
    }
  ];
  presA = [
    {
      nom: 'Boujneh',
      prenom:'Rania',
      travail:"photographe",
      email: 'lindsay.walton@example.com',
      numTel: 'Front-end Developer',
      numCin: 'Optimization',
      aprooved:false,
      createdAt:'2022-05-22',
      pdProfile: 'https://randomuser.me/api/portraits/women/44.jpg',
      fichierConfirmation :[
        'https://randomuser.me/api/portraits/women/44.jpg',
        'https://randomuser.me/api/portraits/women/44.jpg'
      ]
    },
    {
      nom: 'Boujneh',
      prenom:'Rania',
      travail:"photographe",
      email: 'lindsay.walton@example.com',
      numTel: 'Front-end Developer',
      numCin: 'Optimization',
      aprooved:false,
      createdAt:'2022-05-22',
      pdProfile: 'https://randomuser.me/api/portraits/women/44.jpg',
      fichierConfirmation :[
        'https://randomuser.me/api/portraits/women/44.jpg'      ]
    }
  ];
    // Afficher "Tous les Prestataires"
    showAllPrestataires() {
      this.showAll = true;
    }
  
    // Afficher "Prestataires en attente"
    showPendingPrestataires() {
      this.showAll = false;
    }
}
