import { Component,  AfterViewInit,
   ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { NavbarComponent } from "../../navbar/navbar.component";
import { NavbarORComponent } from "../navbar-or/navbar-or.component";
import { ActivatedRoute, RouterModule } from '@angular/router';
import { faBell, faUser, faCheck, faBriefcase, faMapMarkerAlt, faInfoCircle, faChartBar, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { PrestataireService } from '../../../Services/prestataire.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule,Location } from '@angular/common';
interface Service {
  id: number;
  nom: string;
  description: string;
  prix: number;
  promo: number; // Optional (discount)
  photoCouverture: string;
  type: string;
}

@Component({
  selector: 'app-pres-details',
  standalone: true,
  imports: [NavbarORComponent,FontAwesomeModule,CommonModule,RouterModule],
  templateUrl: './pres-details.component.html',
  styleUrl: './pres-details.component.css'
})
export class PresDetailsComponent {
faBell = faBell;
  faUser = faUser;
  faCheck = faCheck;
  faBriefcase = faBriefcase;
  faMapMarkerAlt = faMapMarkerAlt;
  faInfoCircle=faInfoCircle;
  faChartBar=faChartBar;
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  presId: string;
  activeTab: string = 'informations';
  expandedReview: number | null = null;

  constructor(
    private prestataireService: PrestataireService,
    private route: ActivatedRoute,
    private location: Location,

  ) {
    this.presId = this.route.snapshot.paramMap.get('id') || '';

  }

  // prestataire = {
  //   nom: "Boujneh Rania",
  //   verified: true,
  //   location: "Tunisie, Monastir-Moknine",
  //   adresse: "Moknine, Rue Sudan 5050",
  //   telephone: "27991857",
  //   email: "boujnehrania@gmail.com",
  //   description: "Groupe de musique traditionnelle de Provence spécialisé dans l'animation de mariages, fêtes privées et événements d'entreprise. Notre répertoire varié saura s'adapter à toutes vos demandes pour faire de votre événement un moment inoubliable.",
  //   photo: "https://www.missnumerique.com/blog/wp-content/uploads/reussir-sa-photo-de-profil-michael-dam.jpg",
  //   stats: {
  //     services: 5,
  //     reservations: 28,
  //     note: 4.8,
  //     avis: 45,
  //     membreDepuis: "Mars 2022",
  //   },
  //   categories: ["Musique", "Animation"],
  //   avis: [
  //     {
  //       id: 1,
  //       nom: "Sophie et Pierre",
  //       date: "15 juillet 2023",
  //       note: 5,
  //       commentaire: "Un grand merci aux Mélodies du Sud pour avoir animé notre mariage ! Leur musique a créé une ambiance exceptionnelle et tous nos invités ont adoré. Très professionnels et à l'écoute de nos demandes. Nous les recommandons vivement !",
  //       evenement: "Mariage",
  //     },
  //   ],
  //   galerie: [
  //     "/assets/placeholder.svg",
  //   ],
    
  //   reseauxSociaux: {
  //     facebook: "https://facebook.com",
  //     instagram: "https://instagram.com",
  //     youtube: "https://youtube.com",
  //     site: "https://melodiesdusud.fr",
  //   },
  // };

  prestataire: any = {};
  otherServices: Service[] = [];
    ngOnInit(): void {
    this.fetchPresData(); 
    this.fetchServicePhotos(); 
  }
  fetchPresData() {
   

    if (this.presId) {
      this.prestataireService.getPrestataireById(this.presId).subscribe(
        (response) => {
          this.prestataire = response.pres; 
          this.otherServices = this.prestataire.Services || []
          console.log(this.prestataire)
          console.log(this.otherServices)
        },
        (error) => {
          console.error('Erreur lors de la récupération des données:', error);
        }
      );
    } else {
      console.error('Utilisateur non trouvé dans le localStorage');
    }
  }
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  toggleReview(id: number) {
    this.expandedReview = this.expandedReview === id ? null : id;
  }

  renderStars(note: number) {
    return Array(5).fill(0).map((_, i) => i < Math.floor(note) ? '★' : '☆');
  }

  formatReviewCount(count: number) {
    return count > 999 ? `${(count / 1000).toFixed(1)}k` : count;
  }


  @Output() tabChange = new EventEmitter<string>();
  setTab(tab: string) {
    this.activeTab = tab;
    this.tabChange.emit(tab); 
  } 
  renderStars1(note: number): string[] {
      return Array(5)
        .fill(0)
        .map((_, i) => (i < Math.floor(note) ? '★' : '☆'));
    }
  
    formatReviewCount1(count: number): string {
      return count > 999 ? `${(count / 1000).toFixed(1)}k` : count.toString();
    }


    goBack(): void {
      this.location.back();
    }

    items: { id: number, url: string }[] = []; 
    totalPhotos: number | null = null;

    fetchServicePhotos() {
      if (this.presId) {
        this.prestataireService.getServicePhotosByPrestataire(this.presId).subscribe(
          (response) => {
            if (response.status === 200) {
              this.items = response.photos.map((url, index) => ({ id: index + 1, url }));
              this.totalPhotos = response.photos.length;
            }
          },
          (error) => {
            console.error('Erreur lors de la récupération des photos:', error);
          }
        );
      } else {
        console.error('ID du prestataire introuvable');
      }
    }
    isOpen = false;
    selectedItem: any = null;
  
    @ViewChild('carousel') carouselRef!: ElementRef;
  
    openModal(item: any) {
      this.selectedItem = item;
      this.isOpen = true;
      document.body.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');
    }
    closeModal() {
      this.isOpen = false;
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
    }
  
    selectItem(item: any) {
      this.selectedItem = item;
    }
  
    @HostListener('document:keydown.escape', ['$event'])
    handleEscape(event: KeyboardEvent) {
      if (this.isOpen) {
        this.closeModal();
        event.preventDefault();
      }
    }
    // otherServices = [
    //   {
    //     id: '3',
    //     nom: "Salle des fêtes élégante",
    //     description: "Espace moderne pour 150 personnes avec terrasse",
    //     prix: 800,
    //     promo: 15,
    //     type: "salle",
    //     photoCouverture: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf",
    //     Prestataire: {
    //       nom: "Lambert",
    //       prenom: "Élodie"
    //     }
    //   },
    //   {
    //     id: '4',
    //     nom: "Animation musicale",
    //     description: "DJ professionnel avec équipement complet",
    //     prix: 450,
    //     promo: 0,
    //     type: "animation",
    //     photoCouverture: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745",
    //     Prestataire: {
    //       nom: "Girard",
    //       prenom: "Thomas"
    //     }
    //   },
    //   {
    //     id: '1',
    //     nom: "Photographe professionnel",
    //     description: "Capture de moments spéciaux avec matériel haut de gamme",
    //     prix: 350,
    //     promo: 10,
    //     type: "photographe",
    //     photoCouverture: "https://images.unsplash.com/photo-1554080353-a576cf803bda",
    //     Prestataire: {
    //       nom: "Martin",
    //       prenom: "Sophie"
    //     }
    //   },
    //   {
    //     id: '2',
    //     nom: "Traiteur événementiel",
    //     description: "Service traiteur premium pour vos réceptions",
    //     prix: 120,
    //     promo: 0,
    //     type: "traiteur",
    //     photoCouverture: "https://images.unsplash.com/photo-1555244162-803834f70033",
    //     Prestataire: {
    //       nom: "Dubois",
    //       prenom: "Pierre"
    //     }
    //   },
    //   {
    //     id: '3',
    //     nom: "Salle des fêtes élégante",
    //     description: "Espace moderne pour 150 personnes avec terrasse",
    //     prix: 800,
    //     promo: 15,
    //     type: "salle",
    //     photoCouverture: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf",
    //     Prestataire: {
    //       nom: "Lambert",
    //       prenom: "Élodie"
    //     }
    //   },
    //   {
    //     id: '4',
    //     nom: "Animation musicale",
    //     description: "DJ professionnel avec équipement complet",
    //     prix: 450,
    //     promo: 0,
    //     type: "animation",
    //     photoCouverture: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745",
    //     Prestataire: {
    //       nom: "Girard",
    //       prenom: "Thomas"
    //     }
    //   }
    // ];
    
    startIndex = 0;
    visibleCount = 4;
    
    @HostListener('window:resize')
    onResize() {
      this.updateVisibleCount();
    }
    
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
