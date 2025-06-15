import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBullhorn, faListAlt, faFileInvoice, faBoxOpen, faUsers, faUserFriends,
  faCheckCircle, faClock, faTimesCircle, faStar, faStarHalfAlt,
  faHourglassHalf, faMoneyCheckAlt
} from '@fortawesome/free-solid-svg-icons';

import { PrestataireService } from '../../../Services/prestataire.service';
import { OrganizerService } from '../../../Services/organizer.service';
import { ReservationService } from '../../../Services/reservation.service';
import { PaiementService } from '../../../Services/paiement.service';
import { ServiceService } from '../../../Services/service.service';
import { PubliciteService } from '../../../Services/publicite.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashbord-a',
  standalone: true,
  imports: [FontAwesomeModule,CommonModule],
  templateUrl: './dashbord-a.component.html',
  styleUrl: './dashbord-a.component.css'
})
export class DashbordAComponent implements OnInit {

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

  // Données
  totalConfirmedPres = 0;
  totalOrganizers = 0;
  totalpendRes = 0;
  totalconfRes = 0;
  totalrefRes = 0;
  totalpaidRes = 0;
  totalRes = 0;
  totalPaidCommission = 0;
  totalPaidPubAmount = 0;
  totalConfirmedServices = 0;
  totalPendingServices = 0;
  totalPendingPubs = 0;
  totalConfirmedPaidPubs = 0;
topPrestataires: any[] = [];

  constructor(
    private pres: PrestataireService,
    private orga: OrganizerService,
    private res: ReservationService,
    private paiementService: PaiementService,
    private serviceService: ServiceService,
    private pubService: PubliciteService
  ) {}

  ngOnInit(): void {
    this.loadConfirmedPrestataires();
    this.loadOrganisateurs();
    this.loadReservations();
    this.loadTotalPaidPubAmount();
    this.loadServices();
    this.loadPublicites();
    this.loadTopPrestataires();
  }

  loadConfirmedPrestataires(): void {
    this.pres.getAllPres().subscribe({
      next: response => {
        const confirmedPres = response.pres?.filter((p: any) => p.Status === 'CONFIRMED') || [];
        this.totalConfirmedPres = confirmedPres.length;
      },
      error: err => console.error('Erreur chargement prestataires', err)
    });
  }

  loadOrganisateurs(): void {
    this.orga.getAllOrganizers().subscribe({
      next: response => {
        this.totalOrganizers = response.organizers?.length || 0;
      },
      error: err => console.error('Erreur chargement organisateurs', err)
    });
  }

  loadReservations(): void {
    this.res.getpendingRes().subscribe({
      next: response => {
        const reservations = response.reservations || [];
        this.totalRes = reservations.length;

        this.totalpendRes = reservations.filter((r: any) => r.Status === 'PENDING').length;
        this.totalconfRes = reservations.filter((r: any) => r.Status === 'CONFIRMED').length;
        this.totalrefRes = reservations.filter((r: any) => r.Status === 'CANCELED').length;
        this.totalpaidRes = reservations.filter((r: any) => r.Status === 'PAID').length;

        this.totalPaidCommission = reservations
          .filter((r: any) => r.Status === 'PAID')
          .reduce((sum: number, r: any) => {
            const prixNum = parseFloat(r.prix?.replace(/[^\d.]/g, '').replace(/\s/g, '')) || 0;
            const paymentRate = r.packid != null ? 0.2 : 0.3;
            const revenue = prixNum * paymentRate;
            const commission = revenue * 0.2;
            return sum + commission;
          }, 0);
      },
      error: err => console.error('Erreur chargement réservations', err)
    });
  }

  loadTotalPaidPubAmount(): void {
    this.paiementService.getAllPaymentPub().subscribe({
      next: response => {
        this.totalPaidPubAmount = response.totalPaidAmount || 0;
      },
      error: err => console.error('Erreur chargement paiements pubs', err)
    });
  }

  loadServices(): void {
    this.serviceService.getServices({}).subscribe({
      next: response => {
        const services = response.services || [];
        this.totalConfirmedServices = services.filter((s: any) => s.Status === 'CONFIRMED').length;
        this.totalPendingServices = services.filter((s: any) => s.Status === 'PENDING').length;
      },
      error: err => console.error('Erreur chargement services', err)
    });
  }

  loadPublicites(): void {
    this.pubService.getAll().subscribe({
      next: response => {
        const pubs = response.pubs || [];
        this.totalConfirmedPaidPubs = pubs.filter((p: any) => p.Status === 'CONFIRMED' && p.paid).length;
        this.totalPendingPubs = pubs.filter((p: any) => p.Status === 'PENDING').length;
      },
      error: err => console.error('Erreur chargement publicités', err)
    });
  }

  formatPrice(amount: number): string {
    return new Intl.NumberFormat('fr-TN').format(amount) + ' DT';
  }

  calculatePercentage(count: number, total: number): string {
    if (total === 0) return '0%';
    return ((count / total) * 100).toFixed(2) + '%';
  }

  loadTopPrestataires(): void {
  this.pres.getTopPrestataires().subscribe({
    next: response => {
      this.topPrestataires = response.pres || [];
      console.log("Top prestataires :", this.topPrestataires);
    },
    error: err => console.error('Erreur chargement top prestataires', err)
  });
}
getFullStars(rating: number): number[] {
  const fullStars = Math.floor(rating);
  return Array(fullStars).fill(0);
}

hasHalfStar(rating: number): boolean {
  return rating - Math.floor(rating) >= 0.5;
}


}
