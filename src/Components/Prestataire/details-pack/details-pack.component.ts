import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PrestataireService } from '../../../Services/prestataire.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-details-pack',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule,RouterLink],
  templateUrl: './details-pack.component.html',
  styleUrls: ['./details-pack.component.css']
})
export class DetailsPackComponent implements OnInit {
  packForm: FormGroup;
  newServiceForm: FormGroup;
  packId: string;
  faTrash = faTrash;
  formSubmitted = false;
  previewUrl: string | null = null;
 prestataire: any = {};
  formData = { ...this.prestataire };
 isDeleting = false;
 isAdding = false;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private prestataireService: PrestataireService
  ) {
    this.packId = this.route.snapshot.paramMap.get('id') || '';
    
    this.packForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      promo: [0, [Validators.min(0), Validators.max(100)]],
      services: this.fb.array([])
    });

    this.newServiceForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.fetchPresData();
    this.loadPack();
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

  private loadPack(): void {
    if (!this.packId) {
      return;
    }

    this.prestataireService.getPackById(this.packId).subscribe({
      next: (pack) => {
        this.packForm.patchValue({
          title: pack.title,
          description: pack.description,
          price: pack.price,
          promo: pack.promo
        });

        this.services.clear();
        if (pack.services && pack.services.length) {
          pack.services.forEach((service: any) => {
            this.services.push(this.fb.group({
              id: service.id,
              name: service.name,
              description: service.description || ''
            }));
          });
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement du pack', err);
      }
    });
  }

  get services(): FormArray {
    return this.packForm.get('services') as FormArray;
  }

  addService(): void {
  if (this.newServiceForm.invalid) {
    this.newServiceForm.markAllAsTouched();
    return;
  }

  this.isAdding = true;
  const serviceData = {
    name: this.newServiceForm.value.name,
    description: this.newServiceForm.value.description
  };

  this.prestataireService.addServiceToPack(this.packId, serviceData).subscribe({
    next: (newService) => {
      this.services.push(this.fb.group({
        id: newService.id,
        name: newService.name,
        description: newService.description
      }));
      this.newServiceForm.reset();
      this.isAdding = false;
    },
    error: (err) => {
      console.error('Erreur lors de l\'ajout du service:', err);
      this.isAdding = false;
      // Ajoutez ici une notification d'erreur si nécessaire
    }
  });
}

    removeService(index: number): void {
    const service = this.services.at(index).value;
    
    if (service.id) {
      this.isDeleting = true;
      this.prestataireService.deleteServiceFromPack(service.id).subscribe({
        next: () => {
          this.services.removeAt(index);
          this.isDeleting = false;
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du service:', err);
          this.isDeleting = false;
        }
      });
    } else {
      this.services.removeAt(index);
    }
  }
isUpdating = false;
selectedFile: File | null = null;

onCoverPhotoChange(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length) {
    this.selectedFile = input.files[0];
    this.previewUrl = URL.createObjectURL(this.selectedFile);
  } else {
    this.selectedFile = null;
    this.previewUrl = null;
  }
}

onSubmit(): void {
  this.formSubmitted = true;
  if (this.packForm.invalid) {
    return;
  }

  this.isUpdating = true;
  
  const packData = {
    title: this.packForm.value.title,
    description: this.packForm.value.description,
    price: this.packForm.value.price,
    promo: this.packForm.value.promo
  };

  const coverPhoto = this.selectedFile || undefined;

  this.prestataireService.updatePack(this.packId, packData, coverPhoto).subscribe({
    next: (updatedPack) => {
      this.isUpdating = false;
      console.log('Pack mis à jour avec succès', updatedPack);
    },
    error: (err) => {
      this.isUpdating = false;
      console.error('Erreur lors de la mise à jour du pack:', err);
    }
  });
}

  onCancel(): void {
    this.router.navigate(['/prestataire/packPr']);
  }
}