import { Component, HostListener, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NavbarORComponent } from "../navbar-or/navbar-or.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../../../Services/service.service';
import { PrestataireService } from '../../../Services/prestataire.service';
import { firstValueFrom } from 'rxjs'; // À ajouter en haut si ce n’est pas déjà fait

interface ServiceInfo {
  icon: string;
  title: string;
  value: string;
}

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [NavbarORComponent, FormsModule, CommonModule],
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
  
    try {
      const response = await firstValueFrom(this.serviceService.getServiceById(this.serviceId));
      this.serviceData = response.service;
  
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
        }
      }
  
      // Initialiser les infos une fois tout est chargé
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
  .format(price) + (isWholeNumber ? ' DT' : ''); // Ajoute DT pour les nombres entiers
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
  
  // Dans la classe ServiceDetailsComponent
otherServices = [
  {
    id: '3',
    nom: "Salle des fêtes élégante",
    description: "Espace moderne pour 150 personnes avec terrasse",
    prix: 800,
    promo: 15,
    type: "salle",
    photoCouverture: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf",
    Prestataire: {
      nom: "Lambert",
      prenom: "Élodie"
    }
  },
  {
    id: '4',
    nom: "Animation musicale",
    description: "DJ professionnel avec équipement complet",
    prix: 450,
    promo: 0,
    type: "animation",
    photoCouverture: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745",
    Prestataire: {
      nom: "Girard",
      prenom: "Thomas"
    }
  },
  {
    id: '1',
    nom: "Photographe professionnel",
    description: "Capture de moments spéciaux avec matériel haut de gamme",
    prix: 350,
    promo: 10,
    type: "photographe",
    photoCouverture: "https://images.unsplash.com/photo-1554080353-a576cf803bda",
    Prestataire: {
      nom: "Martin",
      prenom: "Sophie"
    }
  },
  {
    id: '2',
    nom: "Traiteur événementiel",
    description: "Service traiteur premium pour vos réceptions",
    prix: 120,
    promo: 0,
    type: "traiteur",
    photoCouverture: "https://images.unsplash.com/photo-1555244162-803834f70033",
    Prestataire: {
      nom: "Dubois",
      prenom: "Pierre"
    }
  },
  {
    id: '3',
    nom: "Salle des fêtes élégante",
    description: "Espace moderne pour 150 personnes avec terrasse",
    prix: 800,
    promo: 15,
    type: "salle",
    photoCouverture: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf",
    Prestataire: {
      nom: "Lambert",
      prenom: "Élodie"
    }
  },
  {
    id: '4',
    nom: "Animation musicale",
    description: "DJ professionnel avec équipement complet",
    prix: 450,
    promo: 0,
    type: "animation",
    photoCouverture: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745",
    Prestataire: {
      nom: "Girard",
      prenom: "Thomas"
    }
  }
];

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
