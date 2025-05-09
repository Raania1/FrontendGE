import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faUser, faTrash, faSearch, faCheck, faTimes, faFilePdf, faUsersSlash, faCheckCircle, faClock, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { PrestataireService } from '../../../Services/prestataire.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-prestataire',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule],
  templateUrl: './list-prestataire.component.html',
  styleUrls: ['./list-prestataire.component.css']
})
export class ListPrestataireComponent {
  // Icônes
  faBell = faBell;
  faUser = faUser;
  faTrash = faTrash;
  faSearch = faSearch;
  faCheck = faCheck;
  faTimes = faTimes;
  faUsersSlash = faUsersSlash;
  faFilePdf = faFilePdf;
  faLayerGroup = faLayerGroup;
  faCheckCircle = faCheckCircle;
  faClock = faClock;

  // Données
  pres: any[] = []; // Tous les prestataires
  presA: any[] = []; // Prestataires en attente
  currentFilter: 'TOUS' | 'PENDING' | 'CONFIRMED' | 'DISABLED'  = 'TOUS';
  searchTerm: string = '';
  showAll: boolean = true;

  constructor(private presService: PrestataireService) {}

  ngOnInit(): void {
    this.fetchPres();
    this.fetchPresN();
  }

  // Récupération des données
  fetchPres() {
    this.presService.getAllPres().subscribe(
      (response) => {
        this.pres = response.pres;
        console.log(this.pres);
      },
      (error) => {
        console.error('Erreur lors de la récupération des prestataires:', error);
      }
    );
  }

  fetchPresN() {
    this.presService.getAllPresN().subscribe(
      (response) => {
        this.presA = response.prestataires;
      },
      (error) => {
        console.error('Erreur lors de la récupération des prestataires en attente:', error);
      }
    );
  }

  // Filtrage et recherche
  setFilter(filter: 'TOUS' | 'PENDING' | 'CONFIRMED' | 'DISABLED'): void {
    this.currentFilter = filter;
    this.showAll = filter === 'TOUS' || filter === 'CONFIRMED';
  }

  get filteredPrestataires() {
    let list: any[];
    if (this.currentFilter === 'PENDING') {
      list = this.presA;
    } else if (this.currentFilter === 'CONFIRMED') {
      list = this.pres.filter(p => p.Status === 'CONFIRMED');
    } 
    else if (this.currentFilter === 'DISABLED') {
      list = this.pres.filter(p => p.Status === 'DISABLED');
    }else {
      list = this.pres;
    }
    return this.filterList(list);
  }

  private filterList(list: any[]) {
    if (!this.searchTerm) {
      return list;
    }

    return list.filter(p =>
      (p.nom && p.nom.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (p.prenom && p.prenom.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (p.email && p.email.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (p.ville && p.ville.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  get pendingCount(): number {
    return this.presA.length;
  }

  get activeCount(): number {
    return this.pres.filter(p => p.Status === 'CONFIRMED').length;
  }

  // Actions
  deletePres(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce prestataire ?')) {
      this.presService.deletePresById(id).subscribe(
        (response) => {
          alert('Prestataire supprimé avec succès !');
          this.fetchPres();
          this.fetchPresN();
        },
        (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      );
    }
  }
prestataireToApprove: any = null;
  isApproveDialogOpen: boolean = false;
  onApprove(id: string) {
    // Find the prestataire by ID
    this.prestataireToApprove = this.pres.find(p => p.id === id) || this.presA.find(p => p.id === id);
    if (this.prestataireToApprove) {
      this.isApproveDialogOpen = true;
    } else {
      alert('Prestataire non trouvé.');
    }
  }
  confirmApprove() {
    if (this.prestataireToApprove) {
      this.presService.approoved(this.prestataireToApprove.id).subscribe(
        (response) => {
          console.log('Prestataire approuvé avec succès :', response);
          this.fetchPres();
          this.fetchPresN();
          // Close modal and reset
          this.isApproveDialogOpen = false;
          this.prestataireToApprove = null;
        },
        (error) => {
          console.error('Erreur lors de l\'approbation du prestataire :', error);
          alert('Erreur lors de l\'approbation du prestataire.');
          this.isApproveDialogOpen = false;
          this.prestataireToApprove = null;
        }
      );
    }
  }
  prestataireToDisabl: any = null;
  isDisablDialogOpen: boolean = false;
  onDisabl(id: string) {
    this.prestataireToDisabl = this.pres.find(p => p.id === id) || this.presA.find(p => p.id === id);
    if (this.prestataireToDisabl) {
      this.isDisablDialogOpen = true;
    } else {
      alert('Prestataire non trouvé.');
    }
  }
  confirmDisabl() {
    if (this.prestataireToDisabl) {
      this.presService.disabl(this.prestataireToDisabl.id).subscribe(
        (response) => {
          console.log('Prestataire approuvé avec succès :', response);
          this.fetchPres();
          this.fetchPresN();
          this.isDisablDialogOpen = false;
          this.prestataireToDisabl = null;
        },
        (error) => {
          console.error('Erreur lors de l\'approbation du prestataire :', error);
          alert('Erreur lors de l\'approbation du prestataire.');
          this.isDisablDialogOpen = false;
          this.prestataireToDisabl = null;
        }
      );
    }
  }

  prestataireToActivate: any = null;
  isActivateDialogOpen: boolean = false;
  onActivate(id: string) {
    this.prestataireToActivate = this.pres.find(p => p.id === id) || this.presA.find(p => p.id === id);
    if (this.prestataireToActivate) {
      this.isActivateDialogOpen = true;
    } else {
      alert('Prestataire non trouvé.');
    }
  }
  confirmActivate() {
    if (this.prestataireToActivate) {
      this.presService.activate(this.prestataireToActivate.id).subscribe(
        (response) => {
          console.log('Prestataire approuvé avec succès :', response);
          this.fetchPres();
          this.fetchPresN();
          this.isActivateDialogOpen = false;
          this.prestataireToActivate = null;
        },
        (error) => {
          console.error('Erreur lors de l\'approbation du prestataire :', error);
          alert('Erreur lors de l\'approbation du prestataire.');
          this.isActivateDialogOpen = false;
          this.prestataireToActivate = null;
        }
      );
    }
  }


  prestataireToRefuse: any = null;
  isRefuseDialogOpen: boolean = false;
  onRefuse(id: string) {
    this.prestataireToRefuse = this.pres.find(p => p.id === id) || this.presA.find(p => p.id === id);
    if (this.prestataireToRefuse) {
      this.isRefuseDialogOpen = true;
    } else {
      alert('Prestataire non trouvé.');
    }
  }

  confirmRefuse() {
    if (this.prestataireToRefuse) {
      this.presService.refusePrestataire(this.prestataireToRefuse.id).subscribe(
        (response) => {
          this.fetchPres();   
          this.fetchPresN();  
          this.isRefuseDialogOpen = false;
          this.prestataireToRefuse = null;
        },
        (error) => {
          console.error('Erreur lors du refus du prestataire :', error);
          alert('Erreur lors du refus du prestataire.');
          this.isRefuseDialogOpen = false;
          this.prestataireToRefuse = null;
        }
      );
    }
  }
  

  // Utilitaires
  getFileName(fileUrl: string): string {
    return fileUrl.split('/').pop() || 'Fichier PDF';
  }

  showAllPrestataires() {
    this.showAll = true;
    this.currentFilter = 'TOUS';
  }

  showPendingPrestataires() {
    this.showAll = false;
    this.currentFilter = 'PENDING';
  }
}