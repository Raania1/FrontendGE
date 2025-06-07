import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarORComponent } from "../navbar-or/navbar-or.component";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PrestataireService } from '../../../Services/prestataire.service';
import { ServiceService } from '../../../Services/service.service';
import { firstValueFrom } from 'rxjs';
import { Location } from '@angular/common';
import { ReservationService } from '../../../Services/reservation.service';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarORComponent,RouterLink],
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.css'
})
export class ReservationFormComponent {
  date: Date | undefined;
  submitted = false;
  serviceId: string;
  serviceData: any = {};
  isLoading = false;
  prix: string ="";

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private serviceService: ServiceService ,
    private prestataireService : PrestataireService,
    private reservationService: ReservationService 
  ) {
    this.serviceId = this.route.snapshot.paramMap.get('id') || '';
  }
  ngOnInit(): void {
    this.loadServiceData();
  }
    async loadServiceData(): Promise<void> {
      if (!this.serviceId) return;
    
      this.isLoading = true;
      this.serviceData = {}; 
      try {
        const response = await firstValueFrom(this.serviceService.getServiceById(this.serviceId));
        this.serviceData = response.service;
        if (this.serviceData.promo >0){
          this.prix = this.formatPrice(this.getFinalPrice());
        }
        else{
          this.prix= this.formatPrice(this.serviceData.prix)
        }

        console.log('Service récupéré:', this.serviceData);
    
        if (this.serviceData?.Prestataireid) {
          try {
            const prestataireResponse = await firstValueFrom(
              this.prestataireService.getPrestataireById(this.serviceData.Prestataireid)
            );
            this.serviceData.Prestataire = prestataireResponse.pres;
          } catch (error) {
            console.error('Erreur lors de la récupération du prestataire:', error);
            this.serviceData.Prestataire = {};
          }finally {
          this.isLoading = false;
          }
        }
      } catch (err) {
        console.error('Erreur lors de la récupération du service:', err);
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
      })
      .format(price) + (isWholeNumber ? ' DT' : ''); 
    }
    getFinalPrice(): number {
      if (this.serviceData?.prix && this.serviceData?.promo) {
        return this.serviceData.prix - (this.serviceData.prix * this.serviceData.promo) / 100;
      }
      return 0;
    }
   dateConflictError: boolean = false;
datePastError: boolean = false;
dateTodayError: boolean = false;
  dateError: boolean = false; // fallback
isSubmitting: boolean = false;


    handleSubmit(event: Event) {
      event.preventDefault();
      this.dateConflictError = false;
      this.isSubmitting = true;
    
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const organisateurid = user.Id;
    
      if (!organisateurid) {
        console.error('Utilisateur non connecté ou ID manquant');
        this.isSubmitting = false; 
        return;
      }
    
      const data = {
        serviceid: this.serviceId,
        organisateurid: organisateurid,
        dateDebut: this.date,
        prix : this.prix,
        demande: (document.getElementById('comments') as HTMLTextAreaElement)?.value || ''
      };
    
      this.reservationService.createReservation(data).subscribe({
        next: (response) => {
          console.log('Réservation créée avec succès:', response);
          this.submitted = true;
          this.isSubmitting = false; 
        },
        error: (error) => {
  this.isSubmitting = false; 

  if (error?.status === 409) {
    this.dateConflictError = true;
    setTimeout(() => {
      this.dateConflictError = false;
    }, 1500);
  }
  else if (error?.status === 400) {
    const errorMsg = error?.error?.error;

    if (errorMsg?.includes("aujourd'hui")) {
      this.dateTodayError = true;
      setTimeout(() => {
        this.dateTodayError = false;
      }, 1500);
    } else if (errorMsg?.includes("passé")) {
      this.datePastError = true;
      setTimeout(() => {
        this.datePastError = false;
      }, 1500);
    } else {
      this.dateError = true; // fallback
    }
  } else {
    console.error(error?.error?.error || 'Erreur lors de la demande');
  }

  console.error('Erreur lors de la réservation:', error);
}

      });
    }
    
    
    

  goBack(): void {
    this.location.back();
  }

  resetForm() {
    this.submitted = false;
  }
}
