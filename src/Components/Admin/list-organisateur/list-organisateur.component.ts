import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faSearch, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-list-organisateur',
  standalone: true,
  imports: [FontAwesomeModule,CommonModule],
  templateUrl: './list-organisateur.component.html',
  styleUrl: './list-organisateur.component.css'
})
export class ListOrganisateurComponent {
  faBell = faBell;
    faUser = faUser;
      faTrash =faTrash;
    faSearch = faSearch;
  users = [
    {
      nom: 'Boujneh',
      prenom:'Rania',
      email: 'lindsay.walton@example.com',
      numTel: 'Front-end Developer',
      numCin: 'Optimization',
      Ville: 'Active',
      adress: 'Member',
      createdAt:'2022-05-22',
      pdProfile: 'https://randomuser.me/api/portraits/women/44.jpg',
      nbrE:5,
      nbrR:8
    }
  ];
}
