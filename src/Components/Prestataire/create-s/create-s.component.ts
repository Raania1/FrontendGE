import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { PrestataireService } from '../../../Services/prestataire.service';
import { CommonModule } from '@angular/common';
import { ServiceService } from '../../../Services/service.service';
import { finalize } from 'rxjs/internal/operators/finalize';
@Component({
  selector: 'app-create-s',
  standalone: true,
  imports: [FontAwesomeModule,FormsModule,CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './create-s.component.html',
  styleUrl: './create-s.component.css'
})
export class CreateSComponent {
  faBell = faBell;
  faUser = faUser;
  faTrash = faTrash;

  constructor(
    private prestataireService: PrestataireService,
    private route: ActivatedRoute,
    private apiService: ServiceService,
    private fb: FormBuilder
  ) {
    this.serviceForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      prix: [0, [Validators.required, Validators.min(0)]],
      promo: [0, [Validators.min(0), Validators.max(100)]],
      type: ['default_type']
    });
  }

  prestataire: any = {};
  formData = { ...this.prestataire };
  serviceForm: FormGroup;
  coverPhoto: File | null = null;
  galleryPhotos: File[] = [];
  hoverCover = false;
  hoverGallery = false;
  formSubmitted = false;
  previewUrls: {cover: string | null, gallery: string[]} = {
    cover: null,
    gallery: []
  };
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

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
          this.formData = { ...this.prestataire };  
          console.log(this.prestataire);
        },
        (error) => {
          console.error('Erreur lors de la récupération des données:', error);
        }
      );
    } else {
      console.error('Utilisateur non trouvé dans le localStorage');
    }
  }
  
   
  
    onCoverPhotoSelected(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
        this.coverPhoto = input.files[0];
        this.previewUrls.cover = this.getObjectUrl(this.coverPhoto);
      }
    }
  
    onCoverDrop(event: DragEvent) {
      event.preventDefault();
      this.hoverCover = false;
      if (event.dataTransfer?.files[0]) {
        this.coverPhoto = event.dataTransfer.files[0];
        this.previewUrls.cover = this.getObjectUrl(this.coverPhoto);
      }
    }
  
    onGalleryPhotosSelected(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.files) {
        this.addGalleryPhotos(Array.from(input.files));
      }
    }
  
    onGalleryDrop(event: DragEvent) {
      event.preventDefault();
      this.hoverGallery = false;
      if (event.dataTransfer?.files) {
        this.addGalleryPhotos(Array.from(event.dataTransfer.files));
      }
    }
  
    private addGalleryPhotos(files: File[]) {
      const validFiles = files.filter(file => file.type.match('image.*'));
      const newFiles = [...this.galleryPhotos, ...validFiles].slice(0, 15);
      this.galleryPhotos = newFiles;
      this.previewUrls.gallery = newFiles.map(file => this.getObjectUrl(file));
    }
  
    removeCoverPhoto() {
      this.coverPhoto = null;
      this.previewUrls.cover = null;
    }
  
    removeGalleryPhoto(index: number) {
      this.galleryPhotos.splice(index, 1);
      this.previewUrls.gallery.splice(index, 1);
    }
  
    private getObjectUrl(file: File): string {
      return URL.createObjectURL(file);
    }
    
    onSubmit() {
      this.formSubmitted = true;
      this.errorMessage = null;
      this.successMessage = null;
      const user = JSON.parse(localStorage.getItem('user') || '{}');  
      const id = user.Id; 
      if (this.serviceForm.valid && this.coverPhoto) {
        this.isLoading = true;
  
        const formData = new FormData();
        
        formData.append('nom', this.serviceForm.value.nom);
        formData.append('description', this.serviceForm.value.description);
        formData.append('prix', this.serviceForm.value.prix.toString());
        formData.append('promo', this.serviceForm.value.promo.toString());
        formData.append('type', this.serviceForm.value.type);
        formData.append('Prestataireid',id );

        if (this.coverPhoto) {
          formData.append('photoCouverture', this.coverPhoto, this.coverPhoto.name);
        }
  
        this.galleryPhotos.forEach((photo, index) => {
          formData.append('Photos', photo, photo.name);
        });
  
        this.apiService.createService(formData)
          .pipe(
            finalize(() => this.isLoading = false)
          )
          .subscribe({
            next: (response) => {
              this.successMessage = 'Service créé avec succès!';
              this.resetForm();
            },
            error: (error) => {
              console.error('Erreur lors de la création du service:', error);
              if (error.error?.errors) {
                this.errorMessage = Object.values(error.error.errors).join(', ');
              } else {
                this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
              }
            }
          });
      } else {
        this.errorMessage = 'Veuillez remplir tous les champs obligatoires et ajouter une photo de couverture';
      }
    }
    resetForm() {
      this.serviceForm.reset({
        nom: '',
        description: '',
        prix: 0,
        promo: 0,
        type: 'default_type'
      });
      this.coverPhoto = null;
      this.galleryPhotos = [];
      this.previewUrls = { cover: null, gallery: [] };
      this.formSubmitted = false;
      this.errorMessage = null;
      this.successMessage = null;
    }




  
  }
  

