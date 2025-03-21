import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faUser, faTrash, faSearch, faCheck, faTimes, faFilePdf, faUsersSlash } from '@fortawesome/free-solid-svg-icons';
import { PrestataireService } from '../../../Services/prestataire.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-prestataire',
  standalone: true,
  imports: [CommonModule,FontAwesomeModule,FormsModule],
  templateUrl: './list-prestataire.component.html',
  styleUrl: './list-prestataire.component.css'
})
export class ListPrestataireComponent {
faBell = faBell;
    faUser = faUser;
      faTrash =faTrash;
    faSearch = faSearch;
    faCheck = faCheck; 
    faTimes = faTimes;
    faUsersSlash=faUsersSlash;
    faFilePdf=faFilePdf;
    showAll: boolean = true; 
  constructor(private presService: PrestataireService,) {}

  pres : any[] = [];
  presA : any[] = [];
  ngOnInit(): void {
    this.fetchPres();
    this.fetchPresN();
  }
  fetchPres() {
    this.presService.getAllPres().subscribe(
      (response) => {
        this.pres = response.pres;
      },
      (error) => {
        console.error('Erreur lors de la récupération des organisateurs:', error);
      }
    );
  }
  searchTerm: string = '';

  get filteredPrestataires() {
    if (!this.searchTerm) {
      return this.pres;
    }

    return this.pres.filter(p =>
      p.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.ville.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  fetchPresN() {
    this.presService.getAllPresN().subscribe(
      (response) => {
        this.presA = response.prestataires;
      },
      (error) => {
        console.error('Erreur lors de la récupération des organisateurs:', error);
      }
    );
  }
  searchTermN: string = '';
  get filteredPrestatairesN() {
    if (!this.searchTermN) {
      return this.presA;
    }
    return this.presA.filter(p =>
      p.nom.toLowerCase().includes(this.searchTermN.toLowerCase()) ||
      p.prenom.toLowerCase().includes(this.searchTermN.toLowerCase()) ||
      p.email.toLowerCase().includes(this.searchTermN.toLowerCase()) ||
      p.ville.toLowerCase().includes(this.searchTermN.toLowerCase())
    );
  }

  deletePres(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet organisateur ?')) {
      this.presService.deletePresById(id).subscribe(
        (response) => {
          alert('Organisateur supprimé avec succès !');
          this.fetchPres(); 
        },
        (error) => {
          console.error('Erreur:', error);
        }
      );
    }
  }
  approoved: boolean = true;
  onApprove(id:string) {
    this.presService.approoved(id,this.approoved).subscribe(
      (response) => {
        console.log('Prestataire approuvé avec succès :', response);
        alert('Prestataire approuvé avec succès !');
      },
      (error) => {
        console.error('Erreur lors de l\'approbation du prestataire :', error);
        alert('Erreur lors de l\'approbation du prestataire.');
      }
    );
  }
 
   getFileName(fileUrl: string): string {
    return fileUrl.split('/').pop() || 'Fichier PDF';
  }
    showAllPrestataires() {
      this.showAll = true;
    }
  
    showPendingPrestataires() {
      this.showAll = false;
    }
}
