import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faSearch, faTrash, faUser, faUsersSlash } from '@fortawesome/free-solid-svg-icons';
import { OrganizerService } from '../../../Services/organizer.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-organisateur',
  standalone: true,
  imports: [FontAwesomeModule,CommonModule,HttpClientModule,FormsModule],
  templateUrl: './list-organisateur.component.html',
  styleUrl: './list-organisateur.component.css'
})
export class ListOrganisateurComponent {
  faBell = faBell;
    faUser = faUser;
      faTrash =faTrash;
    faSearch = faSearch;
    faUsersSlash = faUsersSlash;
  users : any[] = [];
  constructor(private organizerService: OrganizerService,) {}
  ngOnInit(): void {
    this.fetchOrganizers();
  }
  fetchOrganizers() {
    this.organizerService.getAllOrganizers().subscribe(
      (response) => {
        this.users = response.organizers;
      },
      (error) => {
        console.error('Erreur lors de la récupération des organisateurs:', error);
      }
    );
  }
   searchTerm: string = '';

   get filteredOrganisateurs() {
     if (!this.searchTerm) {
       return this.users;
     }
 
     return this.users.filter(p =>
       p.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       p.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       p.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       p.ville.toLowerCase().includes(this.searchTerm.toLowerCase())
     );
   }
  deleteOrganizer(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet organisateur ?')) {
      this.organizerService.deleteOrganizerById(id).subscribe(
        (response) => {
          alert('Organisateur supprimé avec succès !');
          this.fetchOrganizers(); 
        },
        (error) => {
          console.error('Erreur:', error);
        }
      );
    }
  }

}
