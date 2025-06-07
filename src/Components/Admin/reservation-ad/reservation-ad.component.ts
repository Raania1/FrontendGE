import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReservationService } from '../../../Services/reservation.service';
import { Observable } from 'rxjs';
import { faBell, faChevronLeft, faChevronRight, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PrestataireService } from '../../../Services/prestataire.service';
import { AdminService } from '../../../Services/admin.service';

type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'PAID';
  
interface Service {
  id: string;
  nom: string;
  description: string;
  prix: number;
  promo: number;
  type: string;
  photoCouverture: string;
  Prestataire: {
    nom: string;
    prenom: string;
    email: string;
    numTel: string;
  };
}

interface Organisateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  numTel: string;
  ville: string;
  adress: string;
  pdProfile: string;
}

interface Reservation {
  id: string;
  Service: Service;
  Organisateur: Organisateur;
  demande?: string;
  dateDebut: string; 
  Status: ReservationStatus;
  createdAt: string; 
  prix: string;
}

@Component({
  selector: 'app-reservation-ad',
  standalone: true,
  imports: [FormsModule, CommonModule, FontAwesomeModule],
  templateUrl: './reservation-ad.component.html',
  styleUrl: './reservation-ad.component.css'
})
export class ReservationAdComponent implements OnInit{
faClipboardList = faClipboardList;
  faBell = faBell;
  Math = Math;
  faChevronRight=faChevronRight;
  faChevronLeft = faChevronLeft;
  reservations: Reservation[] = [];
  searchTerm: string = '';
  statusFilter: string = 'all';
  selectedReservation: Reservation | null = null;
  isDeleteDialogOpen: boolean = false;
  isConfirmDialogOpen: boolean = false;
  isCancelDialogOpen: boolean = false;
  isDetailsDialogOpen: boolean = false;
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10; 
adminInfo: any = {};
formData = {
      nom: '',
      prenom: '',
      email: ''
    };
  constructor(
    private reservation: ReservationService,   
    private prestataireService: PrestataireService,private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.fetchReservations();
    this.fetchPresData();
    this.fetchAdminInfo();
  }

  prestataire: any = {};

  fetchPresData() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');  
    const id = user.Id;  

    if (id) {
      this.prestataireService.getPrestataireById(id).subscribe(
        (response) => {
          this.prestataire = response.pres;  
        },
        (error) => {
          console.error('Erreur lors de la récupération des données:', error);
        }
      );
    } else {
      console.error('Utilisateur non trouvé dans le localStorage');
    }
  }

  fetchReservations(): void {
    this.reservation.getAll().subscribe({
      next: (response) => {
        this.reservations = response.reservations.sort((a: any, b:any) => 
           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },
      error: (err) => {
        console.error('Erreur lors du chargement des réservations :', err);
      }
    });
  }
  fetchAdminInfo() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');  
    const adminId = user.Id; 
  if (adminId) {
    this.adminService.getAdminById(adminId).subscribe(
      (response) => {
        this.adminInfo = response.admin;
                  this.formData = { ...this.adminInfo };  

        console.log('Admin récupéré:', this.adminInfo);
      },
      (error) => {
        console.error('Erreur lors de la récupération de l’admin:', error);
      }
    );
  }
}
  get filteredReservations(): Reservation[] {
    return this.reservations.filter((reservation) => {
      const org = reservation.Organisateur;
      const serv = reservation.Service;
  
      const matchesSearch =
        (org?.email?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false) ||
        (org?.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false) ||
        (org?.prenom?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false) ||
        (serv?.nom?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false);
  
      const matchesStatus =
        this.statusFilter === 'all' || reservation.Status === this.statusFilter;
  
      return matchesSearch && matchesStatus;
    });
  }

  get paginatedReservations(): Reservation[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredReservations.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredReservations.length / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number | string): void {
    if (typeof page === 'string') return;
    this.currentPage = page;
  }
  
  resetPagination(): void {
    this.currentPage = 1;
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1; 
  }

  getPages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      let startPage = Math.max(2, this.currentPage - 1);
      let endPage = Math.min(this.totalPages - 1, this.currentPage + 1);
      
      if (startPage > 2) {
        pages.push('...');
      } 
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < this.totalPages - 1) {
        pages.push('...');
      }
      
      pages.push(this.totalPages);
    }
    
    return pages;
  }

  updateStatus(id: string, newStatus: ReservationStatus): void {
    this.reservations = this.reservations.map(reservation =>
      reservation.id === id ? { ...reservation, Status: newStatus } : reservation
    );
  }

  get pendingCount(): number {
    return this.reservations.filter(m => m.Status === 'PENDING').length;
  }

  get publicCount(): number {
    return this.reservations.filter(m => m.Status === 'CONFIRMED').length;
  }
  
  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }


  openDetailsDialog(reservation: Reservation): void {
    this.selectedReservation = reservation;
    this.isDetailsDialogOpen = true;
  }

  getStatusBadgeClass(status: ReservationStatus): string {
    switch (status) {
      case 'PENDING':
        return 'bg-orange-500 text-white';
      case 'CONFIRMED':
        return 'bg-green-600 text-white';
      case 'CANCELED':
        return 'bg-gray-800 text-white';
     case 'PAID':
      return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-300 text-gray-800';
    }
  }

  getStatusText(status: ReservationStatus): string {
    switch (status) {
      case 'PENDING':
        return 'En attente';
      case 'CONFIRMED':
        return 'Acceptée';
      case 'CANCELED':
        return 'Refusée';
      case 'PAID':
        return 'Payée';
      default:
        return status;
    }
  }
}
