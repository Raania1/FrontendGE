import { Component, Input, Output, EventEmitter  } from '@angular/core';
import { SidebarPRComponent } from "../sidebar-pr/sidebar-pr.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faUser,faCheck, faBriefcase, faLaptop, faTools, faUserTie, faEnvelope, faMapMarkerAlt, faPhone, faInfoCircle, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PrestataireService } from '../../../Services/prestataire.service';

@Component({
  selector: 'app-profile-pr',
  standalone: true,
  imports: [FontAwesomeModule,CommonModule],
  providers: [DatePipe],
  templateUrl: './profile-pr.component.html',
  styleUrl: './profile-pr.component.css'
})
export class ProfilePrComponent {
  faBell = faBell;
  faUser = faUser;
  faCheck = faCheck;
  faBriefcase = faBriefcase;
  faMapMarkerAlt = faMapMarkerAlt;
  faInfoCircle=faInfoCircle;
  faChartBar=faChartBar;
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  activeTab: string = 'informations';
  expandedReview: number | null = null;

  constructor(
    private prestataireService: PrestataireService,
    private route: ActivatedRoute
  ) {}

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
  ngOnInit(): void {
    this.fetchPresData();  
  }
  fetchPresData() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');  
    const id = user.Id;  

    if (id) {
      this.prestataireService.getPrestataireById(id).subscribe(
        (response) => {
          this.prestataire = response.pres;  
          console.log(this.prestataire)
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
}
