import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ServiceService } from '../../../Services/service.service';
import { PrestataireService } from '../../../Services/prestataire.service';
import { faBell, faUser, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-edit-service',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule,FontAwesomeModule,RouterModule],
  templateUrl: './edit-service.component.html',
  styleUrl: './edit-service.component.css'
})
export class EditServiceComponent implements OnInit {
  serviceForm: FormGroup;
  isLoading = false;
  formSubmitted = false;
  successMessage = '';
  errorMessage = '';
  serviceId: string;
    faBell = faBell;
    faUser = faUser;
    faTrash =faTrash;
  
      
    prestataire: any = {};
    formData = { ...this.prestataire };
    constructor(
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private service: ServiceService,
      private prestataireService: PrestataireService,
    ) {
      this.serviceId = this.route.snapshot.paramMap.get('id') || '';
      this.serviceForm = this.fb.group({
        nom: ['', Validators.required],
        description: ['', Validators.required],
        prix: [0, [Validators.required, Validators.min(0)]],
        promo: [0, [Validators.min(0), Validators.max(100)]],
        type: ['default_type']
      });
    }
  
    fetchPresData() {
      const user = JSON.parse(localStorage.getItem('user') || '{}');  
      const id = user.Id;  
  
      if (id) {
        this.prestataireService.getPrestataireById(id).subscribe(
          (response) => {
            this.prestataire = response.pres;  
            this.formData = { ...this.prestataire };  
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
  
  currentService: any = {};
  
  currentCoverPhoto: string | null = null;
  existingPhotos: { url: string, id?: string }[] = [];
  hoverCover = false;
  hoverGallery = false;
  
  previewUrls = {
    cover: '',
    gallery: [] as string[]
  };
  
  coverPhoto: File | null = null;
  galleryPhotos: File[] = [];
  
  // serviceTypes = [
  //   { value: 'default_type', label: 'Type par défaut' },
  //   { value: 'premium', label: 'Premium' },
  //   { value: 'standard', label: 'Standard' },
  //   { value: 'basique', label: 'Basique' }
  // ];

  

  ngOnInit(): void {
    this.loadServiceData();
    this.fetchPresData();  

  }

  loadServiceData(): void {
    if (this.serviceId) {
      this.isLoading = true;
      this.service.getServiceById(this.serviceId).subscribe({
        next: (response) => {
          this.currentService = response.service;
          console.log('Service récupéré:', this.currentService);
          
          this.currentCoverPhoto = this.currentService.photoCouverture;
          this.existingPhotos = this.currentService.Photos.map((url: string) => ({ url }));
          
          this.serviceForm.patchValue({
            nom: this.currentService.nom,
            description: this.currentService.description,
            prix: this.currentService.prix,
            promo: this.currentService.promo,
            type: this.currentService.type
          });
          
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur lors de la récupération du service:', err);
          this.errorMessage = 'Impossible de charger les données du service';
          this.isLoading = false;
        }
      });
    }
  }

  onCoverPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.coverPhoto = input.files[0];
      this.previewCoverPhoto();
    }
  }

  onCoverDrop(event: DragEvent): void {
    event.preventDefault();
    this.hoverCover = false;
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.coverPhoto = event.dataTransfer.files[0];
      this.previewCoverPhoto();
    }
  }

  previewCoverPhoto(): void {
    if (!this.coverPhoto) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrls.cover = reader.result as string;
    };
    reader.readAsDataURL(this.coverPhoto);
  }

  removeCoverPhoto(): void {
    this.coverPhoto = null;
    this.previewUrls.cover = '';
  }

  onGalleryPhotosSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.addGalleryPhotos(Array.from(input.files));
    }
  }

  onGalleryDrop(event: DragEvent): void {
    event.preventDefault();
    this.hoverGallery = false;
    if (event.dataTransfer?.files) {
      this.addGalleryPhotos(Array.from(event.dataTransfer.files));
    }
  }

  addGalleryPhotos(files: File[]): void {
    const remainingSlots = 30 - (this.existingPhotos.length + this.previewUrls.gallery.length);
    const filesToAdd = files.slice(0, remainingSlots);
    
    filesToAdd.forEach(file => {
      if (!file.type.match('image.*')) return;
      
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrls.gallery.push(reader.result as string);
        this.galleryPhotos.push(file);
      };
      reader.readAsDataURL(file);
    });
  }

  removeGalleryPhoto(index: number): void {
    this.previewUrls.gallery.splice(index, 1);
    this.galleryPhotos.splice(index, 1);
  }

  removeExistingPhoto(index: number): void {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) {
    return;
  }

  this.errorMessage = '';
  
  this.service.deleteServicePhoto(this.serviceId, index).subscribe({
    next: (response) => {
      this.existingPhotos.splice(index, 1);
      this.successMessage = 'Photo supprimée avec succès';
      
      this.loadServiceData();
      
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    },
    error: (err) => {
      this.errorMessage = err.error?.message || 'Erreur lors de la suppression de la photo';
      console.error('Erreur de suppression:', err);
      
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
    }
  });
}

addToExistingPhotos(): void {
  if (this.galleryPhotos.length === 0) {
    this.errorMessage = 'Aucune photo à ajouter';
    setTimeout(() => this.errorMessage = '', 3000);
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';
  this.successMessage = '';

  this.service.addServicePhotos(this.serviceId, this.galleryPhotos).subscribe({
    next: (response) => {
      this.isLoading = false;
      this.successMessage = 'Photos ajoutées avec succès';
      this.previewUrls.gallery = [];
      this.galleryPhotos = [];
      
      // Recharger les données pour afficher les nouvelles photos
      this.loadServiceData();
      
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    },
    error: (err) => {
      this.isLoading = false;
      this.errorMessage = err.error?.message || 'Erreur lors de l\'ajout des photos';
      console.error('Erreur d\'ajout:', err);
      
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
    }
  });
}
replaceAllPhotos(): void {
  if (this.galleryPhotos.length === 0) {
    this.errorMessage = 'Veuillez sélectionner des photos à ajouter';
    setTimeout(() => this.errorMessage = '', 3000);
    return;
  }

  if (!confirm('Êtes-vous sûr de vouloir remplacer toutes les photos existantes ? Cette action est irréversible.')) {
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';
  this.successMessage = '';

  this.service.replaceServicePhotos(this.serviceId, this.galleryPhotos).subscribe({
    next: (response) => {
      this.isLoading = false;
      this.successMessage = 'Toutes les photos ont été remplacées avec succès';
      this.previewUrls.gallery = [];
      this.galleryPhotos = [];
      
      this.loadServiceData();
      
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    },
    error: (err) => {
      this.isLoading = false;
      this.errorMessage = err.error?.message || 'Erreur lors du remplacement des photos';
      console.error('Erreur:', err);
      
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
    }
  });
}

onSubmit(): void {
    this.formSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    if (this.serviceForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    
    const formData = {
      ...this.serviceForm.value,
      photoCouverture: this.coverPhoto 
    };
  
    this.service.updateService(this.serviceId, formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Service mis à jour avec succès';
        
        if (this.previewUrls.cover) {
          this.currentCoverPhoto = this.previewUrls.cover;
          this.previewUrls.cover = '';
          this.coverPhoto = null;
        }
        
        this.loadServiceData();
        
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors de la mise à jour du service';
        console.error('Erreur de mise à jour:', err);
      }
    });
  }

confirmDelete() {
    if(confirm('Voulez-vous vraiment supprimer ce service ? Cette action est irréversible.')) {
      this.isLoading = true;
      
      this.service.deleteService(this.serviceId).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Service supprimé avec succès';
          
          setTimeout(() => {
            this.router.navigate(['/prestataire/servicePR']);
            this.successMessage = '';
  
          }, 1500);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Erreur lors de la suppression du service';
          console.error('Erreur:', err);
          
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
    }
  }
onCancel(): void {
    this.router.navigate(['/services']);
  }
}