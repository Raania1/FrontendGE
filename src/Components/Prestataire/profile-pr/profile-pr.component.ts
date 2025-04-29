import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener  } from '@angular/core';
import { SidebarPRComponent } from "../sidebar-pr/sidebar-pr.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faUser,faCheck, faBriefcase, faLaptop, faTools, faUserTie, faEnvelope, faMapMarkerAlt, faPhone, faInfoCircle, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PrestataireService } from '../../../Services/prestataire.service';
import { CommentService } from '../../../Services/comment.service';
import { ReservationService } from '../../../Services/reservation.service';
interface Comment {
  id: string;
  content: string;
  organisateurid: string;
  prestataireid: string;
  createdAt: Date;
  updatedAt: Date;
  Organisateur?: {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    // Ajoutez d'autres propriétés si nécessaire
  };
  // Ajoutez d'autres propriétés si nécessaire
}
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
    private commentService: CommentService,
    private reservation: ReservationService,
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
  avis: any[]=[];
  organisateurs: any = {};
  reservationCount: number=0;
  ngOnInit(): void {
    this.fetchPresData(); 
    this.fetchServicePhotos() 
  }
  fetchPresData() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');  
    const id = user.Id;  

    if (id) {
      this.prestataireService.getPrestataireById(id).subscribe(
        (response) => {
          this.prestataire = response.pres; 
          this.avis = this.prestataire.Comments;
          this.reservation.count(id).subscribe(
            (response)=>{
              this.reservationCount = response.count
            }
          )
          console.log('Prestataire:', this.prestataire);
          console.log('Avis:', this.avis);
          
          this.fetchOrganisateursForComments();
        },
        (error) => {
          console.error('Erreur lors de la récupération des données:', error);
        }
      );
    } else {
      console.error('Utilisateur non trouvé dans le localStorage');
    }
  }
  fetchOrganisateursForComments() {
    if (!this.avis || this.avis.length === 0) return;

    this.avis.forEach(comment => {
      if (comment.organisateurid && !this.organisateurs[comment.organisateurid]) {
        this.commentService.getCommentById(comment.id).subscribe(
          (commentWithDetails) => {
            if (commentWithDetails.Organisateur) {
              comment.Organisateur = commentWithDetails.Organisateur;

              this.organisateurs[comment.organisateurid] = commentWithDetails.Organisateur;
              console.log(commentWithDetails.Organisateur)
            }
          },
          (error) => {
            console.error('Erreur lors de la récupération des détails du commentaire:', error);
          }
        );
      }
    });}

    selectedComment: Comment | any = null;
    isDeleteDialogOpen: boolean = false;
    openDeleteDialog(comment: Comment): void {
      this.selectedComment= comment;
      this.isDeleteDialogOpen = true;
    }
    isLoading: boolean = false;
    successMessage: string = '';
    errorMessage: string = '';
deleteComment(): void {
  if (!this.selectedComment) return;

  const commentId = this.selectedComment.id;
  this.isLoading = true;

  this.commentService.deleteComment(commentId).subscribe({
    next: (res) => {
      this.isLoading = false;
      this.successMessage = res.message || 'Commentaire supprimé avec succès';
      
      this.avis = this.avis.filter(
        comment => comment.id !== commentId
      );

      this.isDeleteDialogOpen = false;
      this.selectedComment = null;

      setTimeout(() => this.successMessage = '', 4000);
    },
    error: (err) => {
      this.isLoading = false;
      this.errorMessage = err?.error?.error || 'Erreur lors de la suppression';
      
      setTimeout(() => this.errorMessage = '', 4000);
    }
  });
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
    fetchServicePhotos() {
      const user = JSON.parse(localStorage.getItem('user') || '{}');  
    const id = user.Id; 
      if (id) {
        this.prestataireService.getServicePhotosByPrestataire(id).subscribe(
          (response) => {
            if (response.status === 200) {
              this.items = response.photos.map((url, index) => ({ id: index + 1, url }));
              this.totalPhotos = response.photos.length;
              console.log(this.items)
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
    items: { id: number, url: string }[] = []; 
    totalPhotos: number | null = null;
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

}
