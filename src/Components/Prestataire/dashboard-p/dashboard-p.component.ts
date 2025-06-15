import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBullhorn, faListAlt,faMoneyCheckAlt, faFileInvoice, faBoxOpen, faUsers, faUserFriends, faTimesCircle, faCheckCircle, faClock, faStar, faStarHalfAlt, faHourglassHalf } from '@fortawesome/free-solid-svg-icons';
import { PrestataireService } from '../../../Services/prestataire.service';
import { PaiementService } from '../../../Services/paiement.service';
import { ReservationService } from '../../../Services/reservation.service'; // <-- on importe le ReservationService
import { NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-p',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './dashboard-p.component.html',
  styleUrl: './dashboard-p.component.css'
}) 
export class DashboardPComponent {
  faBullhorn = faBullhorn;
  faListAlt = faListAlt;
  faFileInvoice = faFileInvoice;
  faBoxOpen = faBoxOpen;
  faUsers = faUsers;
  faUserFriends = faUserFriends;
  faTimesCircle = faTimesCircle;
  faCheckCircle = faCheckCircle;
  faClock = faClock;
  faStar = faStar;
  faStarHalfAlt = faStarHalfAlt;
  faHourglassHalf = faHourglassHalf;
faMoneyCheckAlt = faMoneyCheckAlt;
  prestataire: any = {};
  services: any[] = [];
  servicesPending: any[] = [];
  servicesConfirmed: any[] = [];
  advertisements: any[] = [];
  reservationPayments: any[] = []; 
  pubPayments: any[] = [];
  allReservations: any[] = []; 
  totalReservationsPending: number = 0;
  totalReservationsConfirmed: number = 0;
  totalReservationsCanceled: number = 0;
  totalReservationsPaid: number = 0;
totalReservations: number = 0;
  countPending: number = 0;
  countConfirmed: number = 0;
  countPubConfirmed: number = 0;
  countPubPending: number = 0;
  totalReservationPayments: number = 0;
  totalPubPayments: number = 0;
paidReservationsDetails: any[] = [];

  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private prestataireService: PrestataireService, 
    private payService: PaiementService,
    private reservationService: ReservationService  
  ) {}

  ngOnInit(): void {
    this.fetchPresData();
    this.fetchPrestataireData();
    this.fetchReservationPayments();
    this.fetchPubPayments();
    this.fetchAllReservations(); 
  }

  fetchPresData() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const id = user.Id;

    if (id) {
      this.prestataireService.getPrestataireById(id).subscribe(
        (response) => {
          this.prestataire = response.pres;
          this.services = this.prestataire.Services || [];

          this.servicesPending = this.services.filter(service => service.Status === 'PENDING');
          this.servicesConfirmed = this.services.filter(service => service.Status === 'CONFIRMED');

          this.countPending = this.servicesPending.length;
          this.countConfirmed = this.servicesConfirmed.length;
        },
        (error) => {
          console.error('Erreur lors de la récupération des données:', error);
        }
      );
    } else {
      console.error('Utilisateur non trouvé dans le localStorage');
    }
  }

  fetchPrestataireData(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const id = user.Id;

    if (id) {
      this.isLoading = true;
      this.prestataireService.getPrestataireById(id).subscribe({
        next: (response) => {
          this.prestataire = response.pres;

          const packs = this.prestataire.Pack || [];
          const publicitePacks = packs.flatMap((pack: any) => pack.PublicitePack || []);

          this.countPubConfirmed = publicitePacks.filter((pub: any) => pub.Status === 'CONFIRMED').length;
          this.countPubPending = publicitePacks.filter((pub: any) => pub.Status === 'PENDING').length;

          this.advertisements = publicitePacks.map((ad: any) => ({ ...ad }))
            .sort((a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la récupération des données.';
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'Utilisateur non trouvé dans le localStorage.';
    }
  }

  fetchReservationPayments(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const id = user.Id;

    if (id) {
      this.payService.getReservationPaymentsByPrestataireId(id).subscribe({
        next: (response) => {
          this.reservationPayments = response.payments;
          this.totalReservationPayments = this.reservationPayments.reduce((sum: number, payment: any) => sum + (payment.montant || 0), 0);
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des paiements de réservation:', error);
        }
      });
    } else {
      console.error('Utilisateur non trouvé dans le localStorage');
    }
  }

  fetchPubPayments(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const id = user.Id;

    if (id) {
      this.payService.getpublicitesPaymentsByPrestataireId(id).subscribe({
        next: (response) => {
          this.pubPayments = response.payments;
          this.totalPubPayments = this.pubPayments.reduce((sum: number, payment: any) => sum + (payment.montant || 0), 0);
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des paiements de publicité:', error);
        }
      });
    } else {
      console.error('Utilisateur non trouvé dans le localStorage');
    }
  }

fetchAllReservations(): void {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const id = user.Id;

  if (id) {
    this.reservationService.getReservationsByPrestataireId(id).subscribe({
      next: (response) => {
        this.allReservations = response.reservations;
        this.totalReservations = this.allReservations.length;
        console.log('Toutes les réservations (services et packs):', this.allReservations);

        // Comptage des statuts
        this.totalReservationsPending = this.allReservations.filter((r: any) => r.Status === 'PENDING').length;
        this.totalReservationsConfirmed = this.allReservations.filter((r: any) => r.Status === 'CONFIRMED').length;
        this.totalReservationsCanceled = this.allReservations.filter((r: any) => r.Status === 'CANCELED').length;
        this.totalReservationsPaid = this.allReservations.filter((r: any) => r.Status === 'PAID').length;

        console.log("Total PENDING:", this.totalReservationsPending);
        console.log("Total CONFIRMED:", this.totalReservationsConfirmed);
        console.log("Total CANCELED:", this.totalReservationsCanceled);
        console.log("Total PAID:", this.totalReservationsPaid);

        // Récupération des détails pour les réservations PAYÉES
        this.paidReservationsDetails = this.allReservations
          .filter((r: any) => r.Status === 'PAID')
          .map((r: any) => ({
            paymentDate: r.payment?.createdAt || null,
            montant: r.payment?.montant || 0,
            nomOrganisateur: r.Organisateur?.nom || '',
            prenomOrganisateur: r.Organisateur?.prenom || '',
            emailOrganisateur: r.Organisateur?.email || '',
            phOrganisateur: r.Organisateur?.pdProfile || ''
          }));

        console.log("Détails des paiements PAYÉES :", this.paidReservationsDetails);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des réservations:', error);
      }
    });
  } else {
    console.error('Utilisateur non trouvé dans le localStorage');
  }
}


 calculatePercentage(count: number, total: number): string {
    if (total === 0) return '0%';
    return ((count / total) * 100).toFixed(2) + '%';
  }
  formatMontant(millimes: number): string {
    const dinars = millimes / 1000;
    return dinars.toLocaleString('fr-TN');
  }
}
