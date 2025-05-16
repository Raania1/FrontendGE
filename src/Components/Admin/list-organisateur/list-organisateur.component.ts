import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faSearch, faTrash, faUser, faUsersSlash, faChevronLeft, faChevronRight, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { OrganizerService } from '../../../Services/organizer.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../Services/event.service';
import { ReservationService } from '../../../Services/reservation.service';
 
@Component({
  selector: 'app-list-organisateur',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './list-organisateur.component.html',
  styleUrl: './list-organisateur.component.css'
})
export class ListOrganisateurComponent {
  // Icons
  faBell = faBell;
  faUser = faUser;
  faTrash = faTrash;
  faSearch = faSearch;
  faUsersSlash = faUsersSlash;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faFilePdf = faFilePdf; // Optional, if organizers have documents

  // Data
  users: any[] = [];
  searchTerm: string = '';
  selectedOrganizer: any = null; // Track selected organizer
  isProfileModalOpen: boolean = false; // Track modal state

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  constructor(private organizerService: OrganizerService , private eventService: EventService, private reservation:ReservationService) {}

  ngOnInit(): void {
    this.fetchOrganizers();
  }

  fetchOrganizers() {
    this.organizerService.getAllOrganizers().subscribe(
      (response) => {
        this.users = response.organizers;
        this.updatePagination();
      },
      (error) => {
        console.error('Erreur lors de la récupération des organisateurs:', error);
      }
    );
  }
eventsCount: number = 0;
ReservationsCount: number = 0;
paidReservationsCount: number = 0;
  openProfileModal(organizer: any) {
    this.selectedOrganizer = organizer;
    this.isProfileModalOpen = true;
    this.eventService.getOrganizerEvents(organizer.id).subscribe(
    (response) => {
      this.eventsCount = response.count;
    },
    (error) => {
      console.error('Erreur:', error);
      this.eventsCount = 0;
    }
  );

  this.reservation.getOrganizerReservations(organizer.id).subscribe(
      (response) => {
        this.ReservationsCount = response.count;
      },
      (error) => {
        console.error('Erreur lors de la récupération du nombre de réservations payées:', error);
        this.ReservationsCount = 0;
      }
    );
      this.reservation.getcountPaidReservations(organizer.id).subscribe(
      (response) => {
        this.paidReservationsCount = response.count;
      },
      (error) => {
        console.error('Erreur lors de la récupération du nombre de réservations payées:', error);
        this.paidReservationsCount = 0;
      }
    );
  }

  

  closeProfileModal() {
    this.isProfileModalOpen = false;
    this.selectedOrganizer = null;
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.totalFilteredOrganisateurs / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.updatePagination();
  }

  get filteredOrganisateurs() {
    let list = this.users;
    if (this.searchTerm) {
      list = this.users.filter(p =>
        (p.nom && p.nom.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (p.prenom && p.prenom.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (p.email && p.email.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (p.ville && p.ville.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }
    return list.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  get totalFilteredOrganisateurs() {
    if (!this.searchTerm) {
      return this.users.length;
    }
    return this.users.filter(p =>
      (p.nom && p.nom.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (p.prenom && p.prenom.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (p.email && p.email.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
      (p.ville && p.ville.toLowerCase().includes(this.searchTerm.toLowerCase()))
    ).length;
  }

organizerToDelete: any = null;
isDeleteDialogOpen: boolean = false;

deleteOrganizer(id: string) {
  this.organizerToDelete = this.users.find(u => u.id === id);
  if (this.organizerToDelete) {
    this.isDeleteDialogOpen = true;
  } else {
    alert('Organisateur non trouvé.');
  }
}
confirmDelete() {
  if (this.organizerToDelete) {
    this.organizerService.deleteOrganizerById(this.organizerToDelete.id).subscribe(
      () => {
        // Supprimer localement sans refaire un appel au backend
        this.users = this.users.filter(u => u.id !== this.organizerToDelete.id);
        this.updatePagination();
        this.isDeleteDialogOpen = false;
        this.organizerToDelete = null;
      },
      (error) => {
        console.error('Erreur lors de la suppression:', error);
        this.isDeleteDialogOpen = false;
        this.organizerToDelete = null;
      }
    );
  }
}


  getFileName(fileUrl: string): string {
    return fileUrl.split('/').pop() || 'Fichier PDF';
  }
}