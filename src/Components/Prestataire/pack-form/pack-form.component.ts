import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PrestataireService } from '../../../Services/prestataire.service';

interface Service {
  id: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-pack-form',
  standalone: true,
    imports: [FontAwesomeModule,FormsModule,CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './pack-form.component.html',
  styleUrls: ['./pack-form.component.css']
})
export class PackFormComponent {
  title = '';
  description = '';
  price = '';
  promo : number =0;
  services: Service[] = [];
  serviceName = '';
  serviceDescription = '';
  isSubmitting = false;
  formSubmitted = false;
  successMessage = '';
  errorMessage = '';
  
  prestataire: any = {};
  formData = { ...this.prestataire };
  
  hoverCover = false;
  coverPhoto: File | null = null;
  previewUrls = {
    cover: '',
    gallery: [] as string[]
  };

  constructor(private router: Router,    private prestataireService: PrestataireService,
  ) {}
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

  navigateToDashboard() {
    this.router.navigate(['/prestataire/dashboard']);
  }

  handleAddServiceForm(event: Event) {
    event.preventDefault();
    
    if (this.serviceName.trim() && this.serviceDescription.trim()) {
      this.handleAddService({
        name: this.serviceName.trim(),
        description: this.serviceDescription.trim(),
      });
      
      // Reset form
      this.serviceName = '';
      this.serviceDescription = '';
    }
  }

  handleAddService(service: Omit<Service, 'id'>) {
    const newService: Service = {
      id: Date.now().toString(),
      ...service
    };
    this.services = [...this.services, newService];
  }
  
  handleRemoveService(index: number) {
    const newServices = [...this.services];
    newServices.splice(index, 1);
    this.services = newServices;
  }
  
  handleSubmit(event: Event) {
  event.preventDefault();
  this.formSubmitted = true;
  const user = JSON.parse(localStorage.getItem('user') || '{}');  
  const id = user.Id; 

  const numericPrice = Number(this.price);

  if (
    !this.title ||
    !this.description ||
    !this.price ||
    isNaN(numericPrice) ||
    numericPrice <= 0 ||
    numericPrice > 9999 ||
    !this.coverPhoto ||
    this.services.length < 2
  ) {
    this.errorMessage = "Veuillez remplir tous les champs obligatoires. Le prix doit être un nombre entre 1 et 9999 et au moins 2 services doivent être ajoutés.";
    return;
  }

  if (this.promo && (Number(this.promo) < 0 || Number(this.promo) > 100)) {
    this.errorMessage = "La promotion doit être comprise entre 0 et 100%";
    return;
  }

  const formData = new FormData();
  formData.append('title', this.title);
  formData.append('description', this.description);
  formData.append('price', this.price);
  formData.append('promo', this.promo.toString());
  formData.append('prestataireid', id); 
  formData.append('services', JSON.stringify(this.services));
  formData.append('coverPhotoUrl', this.coverPhoto!);

  this.isSubmitting = true;
  this.errorMessage = '';

  this.prestataireService.createPack(formData).subscribe({
    next: (res) => {
      this.successMessage = "Pack créé avec succès! Il sera visible après validation par notre équipe.";
      this.isSubmitting = false;

      setTimeout(() => {
        this.resetForm();
        this.router.navigate(['/prestataire/packs']);
      }, 2000);
    },
    error: (err) => {
      console.error(err);
      this.errorMessage = err.error?.message || "Une erreur s'est produite lors de la création du pack.";
      this.isSubmitting = false;
    }
  });
}


  resetForm() {
    this.title = '';
    this.description = '';
    this.price = '';
    this.promo = 0;
    this.services = [];
    this.serviceName = '';
    this.serviceDescription = '';
    this.coverPhoto = null;
    this.previewUrls.cover = '';
    this.formSubmitted = false;
    this.successMessage = '';
    this.errorMessage = '';
  }

  onCoverDrop(event: DragEvent) {
    event.preventDefault();
    this.hoverCover = false;
    if (event.dataTransfer?.files) {
      this.onCoverPhotoSelected({ target: { files: event.dataTransfer.files } });
    }
  }

  onCoverPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.match('image.*')) {
      this.coverPhoto = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrls.cover = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeCoverPhoto() {
    this.coverPhoto = null;
    this.previewUrls.cover = '';
  }
}