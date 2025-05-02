import { Component } from '@angular/core';
import { NavbarORComponent } from '../navbar-or/navbar-or.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  faInfoCircle,faCalendarAlt,faChartBar,faCog,faTrash 
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OrganizerService } from '../../../Services/organizer.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile-or',
  standalone: true,
  imports: [NavbarORComponent,ReactiveFormsModule,CommonModule,FormsModule,FontAwesomeModule,HttpClientModule],
  providers: [DatePipe],
  templateUrl: './profile-or.component.html',
  styleUrl: './profile-or.component.css'
})
export class ProfileOrComponent {

  faInfoCircle = faInfoCircle; 
  faCalendarAlt = faCalendarAlt;
  faChartBar = faChartBar; 
  faCog = faCog; 
  faTrash =faTrash ;

  organisateur: any = {};  

  formData = { ...this.organisateur };
  isEditing = false;
  activeTab = "infos";
  constructor(private authService: OrganizerService,
    authServiceA: AuthService,     
     private fb: FormBuilder,
    private router: Router
  ) {}

    passwordForm!: FormGroup; 
    submitted = false;
    loading = false;
    passwordSuccessMessage: string = '';
    passwordErrorMessage: string = '';
  ngOnInit(): void {
    this.fetchOrganizerData();  
    this.passwordForm = this.fb.group({
          oldPassword: ['', Validators.required],
          newPassword: ['', [Validators.required, Validators.minLength(8)]],
          confirmPassword: ['', Validators.required]
        }, {
          validators: this.passwordMatchValidator
        });
  }
  fetchOrganizerData() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');  
    const id = user.Id;  

    if (id) {
      this.authService.getOrganizerById(id).subscribe(
        (response) => {
          this.organisateur = response.organizer;  
          this.formData = { ...this.organisateur };  
        },
        (error) => {
          console.error('Erreur lors de la récupération des données:', error);
        }
      );
    } else {
      console.error('Utilisateur non trouvé dans le localStorage');
    }
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const id = user.Id;
    if (id) {
      this.authService.updateOrganizer(id, this.formData).subscribe(
        (response) => {
          console.log('Réponse après mise à jour :', response);
          this.organisateur = response.updatedOrganiser; 
          // this.authService.afficherAlertSuccess('Modification avec succées','alert-success');

          this.formData = { ...this.organisateur };  
          this.isEditing = false;
        },
        (error) => {
          console.log('Erreur détaillée :', error.error?.errors); 
          console.error('Erreur lors de la mise à jour:', error);
        }
      );
    }
  }

  handleCancel() {
    this.formData = { ...this.organisateur };
    this.isEditing = false;
  }

  handleChange(event: Event, field: string) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.formData = { ...this.formData, [field]: target.value };
  }

  triggerFileInput() {
    document.getElementById('fileInput')?.click();
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.type.startsWith('image/')) {
        this.formData.pdProfile = file;  
      } else {
        alert('Veuillez télécharger un fichier image valide.');
      }
    }
  }

  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  onSubmit() {
    this.submitted = true;
    this.passwordSuccessMessage = '';
    this.passwordErrorMessage = '';
  
    if (this.passwordForm.invalid) {
      return;
    }
  
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const id = user.Id;
  
    if (!id) {
      this.passwordErrorMessage = 'Utilisateur non trouvé.';
      return;
    }
  
    const { oldPassword, newPassword } = this.passwordForm.value;
  
    this.loading = true;
    this.authService.changePassword(id, { oldPassword, newPassword }).subscribe(
      (res) => {
        this.passwordSuccessMessage = 'Mot de passe modifié avec succès.';
        this.passwordForm.reset();
        this.submitted = false;
        this.loading = false;
      },
      (err) => {
        this.passwordErrorMessage = err.error?.message || 'Erreur inconnue.';
        this.loading = false;
      }
    );
  }
  
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  deleteAccount() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const id = user.Id;
  
    if (!id) {
      this.passwordErrorMessage = 'Utilisateur non trouvé.';
      this.isDeleteDialogOpen = false;
      return;
    }
  
    this.loading = true;
    this.authService.deleteOrganizerById(id).subscribe(
      (response) => {
        this.loading = false;
        this.isDeleteDialogOpen = false;
        localStorage.removeItem('user');
        this.router.navigate(['/']);
      },
      (error) => {
        this.loading = false;
        this.passwordErrorMessage = error.error?.message || 'Une erreur est survenue lors de la suppression de votre compte.';
        console.error('Erreur lors de la suppression du compte:', error);
      }
    );
  }
  isDeleteDialogOpen : boolean = false
  confirmDelete() {
    this.isDeleteDialogOpen = true;
    this.passwordSuccessMessage = '';
    this.passwordErrorMessage = '';
  }

}
