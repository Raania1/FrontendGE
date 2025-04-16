import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NavbarORComponent } from "../navbar-or/navbar-or.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { ServiceService } from '../../../Services/service.service';
import { PrestataireService } from '../../../Services/prestataire.service';
import { firstValueFrom } from 'rxjs'; 

interface ServiceInfo {
  icon: string;
  title: string;
  value: string;
}

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [NavbarORComponent, FormsModule, CommonModule,RouterLink,RouterModule],
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.css']
})
export class ServiceDetailsComponent implements OnInit {
  serviceData: any = {};
  serviceInfos: ServiceInfo[] = [];
  selectedIndex = 0;
  isLightboxOpen = false;
  serviceId: string;
  isLoading = false;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private serviceService: ServiceService ,
    private prestataireService: PrestataireService// <-- éviter le conflit de noms
  ) {
    this.serviceId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.loadServiceData();
    this.updateVisibleCount();
  }


  async loadServiceData(): Promise<void> {
    if (!this.serviceId) return;
  
    this.isLoading = true;
    this.serviceData = {}; // Réinitialisation
    this.otherServices = [];
    try {
      const response = await firstValueFrom(this.serviceService.getServiceById(this.serviceId));
      this.serviceData = response.service;
      this.filterByType();

      console.log('Service récupéré:', this.serviceData);
  
      // Récupération du prestataire si Prestataireid est présent
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
  
      this.serviceInfos = [
        {
          icon: 'map',
          title: 'Adresse',
          value: this.serviceData?.Prestataire?.adress || 'Non disponible'
        },
        {
          icon: 'tag',
          title: 'Catégorie',
          value: this.serviceData?.type || 'Non spécifié'
        },
        {
          icon: 'clock',
          title: 'Dernière mise à jour',
          value: new Date(this.serviceData?.updatedAt).toLocaleDateString()
        }
      ];
    } catch (err) {
      console.error('Erreur lors de la récupération du service:', err);
    } finally {
      this.isLoading = false;
    }
  }
  // Ajoutez cette méthode dans la classe ServiceDetailsComponent
formatPrice(price: number): string {
  if (isNaN(price)) return '0 DT'; // Gère les nombres invalides
  
  // Pour les nombres entiers, ne pas afficher de décimales
  const isWholeNumber = price % 1 === 0;
  
  return new Intl.NumberFormat('fr-FR', {
    style: isWholeNumber ? 'decimal' : 'currency', // Utilise le format décimal pour les nombres entiers
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

  goBack(): void {
    this.location.back();
  }

  openLightbox(index: number): void {
    this.selectedIndex = index;
    this.isLightboxOpen = true;
    document.body.classList.add('overflow-hidden');
  }

  closeLightbox(): void {
    this.isLightboxOpen = false;
    document.body.classList.remove('overflow-hidden');
  }

  @HostListener('window:keydown.escape')
  onEscapeKey(): void {
    if (this.isLightboxOpen) {
      this.closeLightbox();
    }
  }

  @HostListener('window:keydown.arrowleft')
  onArrowLeft(): void {
    if (this.isLightboxOpen) {
      this.navigateLightbox('prev');
    }
  }

  @HostListener('window:keydown.arrowright')
  onArrowRight(): void {
    if (this.isLightboxOpen) {
      this.navigateLightbox('next');
    }
  }

  navigateLightbox(direction: 'prev' | 'next'): void {
    if (!this.serviceData?.Photos?.length) return;

    const length = this.serviceData.Photos.length;
    if (direction === 'prev') {
      this.selectedIndex = (this.selectedIndex - 1 + length) % length;
    } else {
      this.selectedIndex = (this.selectedIndex + 1) % length;
    }
  }

  otherServices: any[] = [];  
  filterByType() {
    if (!this.serviceData?.type) return;
  
    this.serviceService.getServicesByType(this.serviceData.type).subscribe({
      next: (response) => {
        this.otherServices = response.services || response.data || [];
        console.log('Services similaires:', this.otherServices);
        const prestatairePromises = this.otherServices.map((service:any) => {
          if (service.Prestataireid) {
            return this.prestataireService.getPrestataireById(service.Prestataireid)
              .toPromise()
              .then(prestataireResponse => {
                service.prestataire = prestataireResponse.pres;
              })
              .catch(error => {
                console.error('Erreur prestataire:', error);
                service.prestataire = {};
              });
          }
          return Promise.resolve();
        });
        
         Promise.all(prestatairePromises);
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.otherServices = [];
      },
    });
  }
  navigateToService(serviceId: string) {
    if (serviceId !== this.serviceId) {
      this.serviceId = serviceId;
      this.isLoading = true;
      
      // Réinitialise les données avant de recharger
      this.serviceData = {};
      this.otherServices = [];
      
      // Recharge les données
      this.loadServiceData();
      
      // Faire défiler vers le haut
      window.scrollTo(0, 0);
    }
  }

startIndex = 0;
visibleCount = 4;

@HostListener('window:resize')
onResize() {
  this.updateVisibleCount();
}


updateVisibleCount() {
  if (window.innerWidth >= 1280) this.visibleCount = 4;
  else if (window.innerWidth >= 1024) this.visibleCount = 3;
  else if (window.innerWidth >= 768) this.visibleCount = 2;
  else this.visibleCount = 1;
}

handlePrev() {
  this.startIndex = Math.max(0, this.startIndex - 1);
}

handleNext() {
  this.startIndex = Math.min(this.otherServices.length - this.visibleCount, this.startIndex + 1);
}

calculateFinalPrice(price: number, discount: number): number {
  return price - (price * discount) / 100;
}
}
