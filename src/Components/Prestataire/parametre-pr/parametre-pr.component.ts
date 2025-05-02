import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { PrestataireService } from '../../../Services/prestataire.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-parametre-pr',
  standalone: true,
  imports: [FontAwesomeModule,FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './parametre-pr.component.html',
  styleUrl: './parametre-pr.component.css'
})
export class ParametrePRComponent {
  faBell = faBell;
  faUser = faUser;
  faTrash =faTrash;

    constructor(
      private prestataireService: PrestataireService,
      private route: ActivatedRoute,
      private fb: FormBuilder,
      private router: Router
    ) {}
    prestataire: any = {};
    formData = { ...this.prestataire };

    passwordForm!: FormGroup; 
        submitted = false;
        loading = false;
        passwordSuccessMessage: string = '';
        passwordErrorMessage: string = '';
        
  ngOnInit(): void {
    this.fetchPresData();  
      this.passwordForm = this.fb.group({
          oldPassword: ['', Validators.required],
          newPassword: ['', [Validators.required, Validators.minLength(8)]],
          confirmPassword: ['', Validators.required]
        }, {
          validators: this.passwordMatchValidator
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
  handleSubmit(event: Event) {
    event.preventDefault();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const id = user.Id;
    if (id) {
      this.prestataireService.updatePres(id, this.formData).subscribe(
        (response) => {
          alert("Les modifications ont été sauvegardées avec succès !");
          this.prestataire = response.updatedPrestataire; 
          this.formData = { ...this.prestataire };  
        },
        (error) => {
          console.log('Erreur détaillée :', error.error?.errors); 
          console.error('Erreur lors de la mise à jour:', error);
        }
      );
    }
  }
  handleChange(event: Event, field: string) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.formData = { ...this.formData, [field]: target.value };
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
    this.prestataireService.changePassword(id, { oldPassword, newPassword }).subscribe(
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
    this.prestataireService.deletePresById(id).subscribe(
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
