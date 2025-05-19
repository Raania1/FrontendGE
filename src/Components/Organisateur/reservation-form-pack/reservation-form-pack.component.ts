import { Component } from '@angular/core';
import { NavbarORComponent } from '../navbar-or/navbar-or.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PrestataireService } from '../../../Services/prestataire.service';
import { ReservationService } from '../../../Services/reservation.service';
import { firstValueFrom } from 'rxjs';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reservation-form-pack',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarORComponent, RouterLink],
  templateUrl: './reservation-form-pack.component.html',
  styleUrls: ['./reservation-form-pack.component.css']
})
export class ReservationFormPackComponent {
  dateDebut: string | undefined; // Changed to string for datetime-local input
  dateFin: string | undefined; // Optional, for datetime-local input
  demande: string | undefined; // Optional, for comments
  submitted = false;
  packid: string;
  PackData: any = {};
  isLoading = false;
  prix: string = '';
  dateConflictError = false;
  dateError = false;
  isSubmitting = false;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private prestataireService: PrestataireService,
    private reservationService: ReservationService
  ) {
    this.packid = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.loadPackData();
  }

  async loadPackData(): Promise<void> {
    if (!this.packid) return;

    this.isLoading = true;
    this.PackData = {};
    try {
      const response = await firstValueFrom(this.prestataireService.getPackById(this.packid));
      this.PackData = response;
      this.prix = this.PackData.promo > 0
        ? this.formatPrice(this.getFinalPrice())
        : this.formatPrice(this.PackData.price);

      console.log('Pack récupéré:', this.PackData);

      if (this.PackData?.prestataireid) {
        try {
          const prestataireResponse = await firstValueFrom(
            this.prestataireService.getPrestataireById(this.PackData.prestataireid)
          );
          this.PackData.Prestataire = prestataireResponse.pres;
        } catch (error) {
          console.error('Erreur lors de la récupération du prestataire:', error);
          this.PackData.Prestataire = {};
        }
      }
    } catch (err) {
      console.error('Erreur lors de la récupération du pack:', err);
    } finally {
      this.isLoading = false;
    }
  }

  formatPrice(price: number): string {
    if (isNaN(price)) return '0 DT';
    
    const isWholeNumber = price % 1 === 0;
    return new Intl.NumberFormat('fr-FR', {
      style: isWholeNumber ? 'decimal' : 'currency',
      currency: 'TND',
      minimumFractionDigits: 0,
      maximumFractionDigits: isWholeNumber ? 0 : 3
    }).format(price) + (isWholeNumber ? ' DT' : '');
  }

  getFinalPrice(): number {
    if (this.PackData?.price && this.PackData?.promo) {
      return this.PackData.price - (this.PackData.price * this.PackData.promo) / 100;
    }
    return this.PackData?.price || 0;
  }

  async handleSubmit(event: Event) {
    event.preventDefault();
    this.dateConflictError = false;
    this.dateError = false;
    this.isSubmitting = true;

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const organisateurid = user.Id;

    if (!organisateurid) {
      console.error('Utilisateur non connecté ou ID manquant');
      this.isSubmitting = false;
      this.router.navigate(['/login']);
      return;
    }

    const data = {
      packid: this.packid,
      organisateurid: organisateurid,
      dateDebut: this.dateDebut,
      dateFin: this.dateFin,
      demande: this.demande || '',
      prix: this.prix
    };

    try {
      await firstValueFrom(this.reservationService.createReservation(data));
      console.log('Réservation créée avec succès');
      this.submitted = true;
    } catch (error: any) {
      if (error?.status === 409) {
        this.dateConflictError = true;
        setTimeout(() => {
          this.dateConflictError = false;
        }, 1500);
      } else if (error?.status === 400) {
        this.dateError = true;
        setTimeout(() => {
          this.dateError = false;
        }, 1500);
      } else {
        console.error(error?.error?.error || 'Erreur lors de la demande');
      }
    } finally {
      this.isSubmitting = false;
    }
  }

  goBack(): void {
    this.location.back();
  }

  resetForm() {
    this.submitted = false;
    this.dateDebut = undefined;
    this.dateFin = undefined;
    this.demande = undefined;
  }
}