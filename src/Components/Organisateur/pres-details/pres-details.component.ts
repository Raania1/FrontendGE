import { Component, AfterViewInit, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { NavbarORComponent } from "../navbar-or/navbar-or.component";
import { ActivatedRoute, RouterModule } from '@angular/router';
import { faBell, faUser, faCheck, faBriefcase, faMapMarkerAlt, faInfoCircle, faChartBar, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { PrestataireService } from '../../../Services/prestataire.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule, Location } from '@angular/common';
import { CommentService } from '../../../Services/comment.service';
import { ReservationService } from '../../../Services/reservation.service';
import { FormsModule } from '@angular/forms';
import { OrganizerService } from '../../../Services/organizer.service';
import { RatingService } from '../../../Services/rating.service';

interface Service {
  id: number;
  nom: string;
  description: string;
  prix: number;
  promo: number; 
  photoCouverture: string;
  type: string;
}

@Component({
  selector: 'app-pres-details',
  standalone: true,
  imports: [NavbarORComponent, FontAwesomeModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './pres-details.component.html',
  styleUrl: './pres-details.component.css'
})
export class PresDetailsComponent {
  faBell = faBell;
  faUser = faUser;
  faCheck = faCheck;
  faBriefcase = faBriefcase;
  faMapMarkerAlt = faMapMarkerAlt;
  faInfoCircle = faInfoCircle;
  faChartBar = faChartBar;
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  presId: string;
  activeTab: string = 'informations';
  expandedReview: number | null = null;
  user = JSON.parse(localStorage.getItem('user') || '{}');  
  id = this.user.Id;

  // Rating Modal
  isRatingModalOpen: boolean = false;
  selectedRating: number | null = null;
  hoverRating: number | null = null;
  isSubmittingRating: boolean = false;
  ratingError: string | null = null;

  constructor(
    private prestataireService: PrestataireService,
    private route: ActivatedRoute,
    private commentService: CommentService,
    private reservation: ReservationService,
    private authService: OrganizerService,
    private ratingService: RatingService,
    private location: Location,
  ) {
    this.presId = this.route.snapshot.paramMap.get('id') || '';
  }

  prestataire: any = {};
  otherServices: Service[] = [];
  avis: any[] = [];
  organisateurs: any = {};
  reservationCount: number = 0;

  ngOnInit(): void {
    this.fetchPresData(); 
    this.fetchServicePhotos(); 
    this.fetchOrganizerData();
  }

  fetchPresData() {
    if (this.presId) {
      this.prestataireService.getPrestataireById(this.presId).subscribe(
        (response) => {
          this.prestataire = response.pres; 
          this.otherServices = this.prestataire.Services || [];
          this.avis = this.prestataire.Comments;
          this.reservation.count(this.presId).subscribe(
            (response) => {
              this.reservationCount = response.count;
            }
          );
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
            }
          },
          (error) => {
            console.error('Erreur lors de la récupération des détails du commentaire:', error);
          }
        );
      }
    });
  }

  selectedComment: Comment | any = null;
  isDeleteDialogOpen: boolean = false;
  openDeleteDialog(comment: Comment): void {
    this.selectedComment = comment;
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

  renderStars(): string[] {
    const rating = this.prestataire.averageRating || 0;
    const fullStars = Math.floor(rating);
    const decimalPart = rating - fullStars;
    const stars: string[] = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    if (decimalPart >= 0.3 && decimalPart <= 0.7) {
      stars.push('⯨');
    } else if (decimalPart > 0.7) {
      stars.push('★');
    }
    while (stars.length < 5) {
      stars.push('☆');
    }
    return stars;
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

  startIndex = 0;
  visibleCount = 4;

  @HostListener('window:resize')
  onResize() {
    this.updateVisibleCount();
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

  editingReviewId: string | null = null;
  editedReviewContent: string = '';
  isSaving: boolean = false;
  saveSuccess: boolean = false;
  saveError: string | null = null;

  toggleEditMode(avi: any) {
    this.editingReviewId = avi.id;
    this.editedReviewContent = avi.content;
    this.saveSuccess = false;
    this.saveError = null;
  }

  saveEditedReview(avi: any) {
    if (!this.editedReviewContent.trim()) {
      this.saveError = "Le commentaire ne peut pas être vide";
      return;
    }
  
    this.isSaving = true;
    this.saveError = null;
  
    this.commentService.updateComment(avi.id, this.editedReviewContent)
      .subscribe({
        next: (updatedComment) => {
          avi.content = this.editedReviewContent;
          this.editingReviewId = null;
          this.isSaving = false;
          this.saveSuccess = true;
          setTimeout(() => this.saveSuccess = false, 3000);
        },
        error: (error) => {
          console.error('Failed to update comment:', error);
          this.isSaving = false;
          this.saveError = error.error?.message || "Échec de la mise à jour du commentaire";
        }
      });
  }

  cancelEdit() {
    this.editingReviewId = null;
    this.editedReviewContent = '';
    this.saveError = null;
  }

  isAddingReview = false;
  newReviewContent = '';
  currentUserPrenom: string = '';
  currentUserNom: string = '';
  currentUserProfilePicture: string = '';

  fetchOrganizerData() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const id = user.Id;

    if (id) {
      this.authService.getOrganizerById(id).subscribe(
        (response) => {
          this.currentUserPrenom = response.organizer?.prenom || '';
          this.currentUserNom = response.organizer?.nom || '';
          this.currentUserProfilePicture = response.organizer?.pdProfile || 'assets/default-avatar.png';
        },
        (error) => {
          console.error('Erreur lors de la récupération des données:', error);
        }
      );
    } else {
      console.error('Utilisateur non trouvé dans le localStorage');
    }
  }

  startAddingReview() {
    this.isAddingReview = true;
    this.newReviewContent = '';
  }

  cancelAddingReview() {
    this.isAddingReview = false;
    this.newReviewContent = '';
  }

  saveNewReview() {
    if (!this.newReviewContent.trim()) {
      this.saveError = "Le commentaire ne peut pas être vide";
      return;
    }

    this.isSaving = true;
  
    this.commentService.createComment(
      this.newReviewContent,
      this.id, 
      this.presId 
    ).subscribe({
      next: (newComment) => {
        this.avis.unshift({
          ...newComment,
          Organisateur: {
            id: this.id,
            prenom: this.currentUserPrenom,
            nom: this.currentUserNom,
            pdProfile: this.currentUserProfilePicture
          }
        });
        
        this.isSaving = false;
        this.isAddingReview = false;
        this.newReviewContent = '';
      },
      error: (error) => {
        console.error('Failed to create comment:', error);
        this.isSaving = false;
        this.saveError = error.error?.error || "Échec de la création du commentaire";
      }
    });
  }

  openRatingModal() {
    this.isRatingModalOpen = true;
    this.selectedRating = null;
    this.hoverRating = null;
    this.ratingError = null;
  }

  closeRatingModal() {
    this.isRatingModalOpen = false;
    this.selectedRating = null;
    this.hoverRating = null;
    this.ratingError = null;
  }

  setRating(rating: number) {
    this.selectedRating = rating;
  }

  getRatingValue(): number {
    return this.hoverRating ?? this.selectedRating ?? 0;
  }

  submitRating() {
    if (!this.selectedRating) {
      this.ratingError = "Veuillez sélectionner une note";
      return;
    }

    this.isSubmittingRating = true;
    const ratingData = {
      organisateurid: this.id,
      prestataireid: this.presId,
      rating: this.selectedRating
    };

    this.ratingService.createRating(ratingData).subscribe({
      next: (response) => {
        this.isSubmittingRating = false;
        this.closeRatingModal();
        this.fetchPresData();
      },
      error: (error) => {
        this.isSubmittingRating = false;
        this.ratingError = error.error?.error || "Échec de l'envoi de la note";
      }
    });
  }
}