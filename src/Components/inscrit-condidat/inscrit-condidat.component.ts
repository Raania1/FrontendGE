import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";
import { AuthService } from '../../Services/auth.service'; 
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-inscrit-condidat',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, NavbarComponent,HttpClientModule],
  templateUrl: './inscrit-condidat.component.html',
  styleUrl: './inscrit-condidat.component.css'
})
export class InscritCondidatComponent {
  constructor(
    private _FormBuilder: FormBuilder,
    private authService: AuthService ,
    private router: Router
  ) {
    console.log(this.organizeData);
  }

  organizeData: FormGroup = this._FormBuilder.group({
    nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15), Validators.pattern(/^[a-zA-Z\s]*$/)]],
    prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15), Validators.pattern(/^[a-zA-Z\s]*$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
    password_confirmation: ['', Validators.required],
    numTel: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    numCin: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    ville: ['', Validators.required],
    adress: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s,'-]*$/)]],
    pdProfile: [null, Validators.required],
  }, { validators: this.passwordNotmatch });

  passwordNotmatch(form: AbstractControl): null | { [key: string]: boolean } {
    const pass = form.get('password')?.value;
    const repass = form.get('password_confirmation')?.value;
    if (repass !== pass) {
      return { passNotMatch: true };
    } else return null;
  }

selectedProfilePicture: File | null = null;
profilePreviewUrl: string | null = null;

onFileChange(event: any) {
  const file = event.target.files[0];
  if (file) {
    this.selectedProfilePicture = file;  
    this.organizeData.get('pdProfile')?.setValue(file); 
    this.organizeData.get('pdProfile')?.markAsTouched();

    const reader = new FileReader();
    reader.onload = () => {
      this.profilePreviewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}

  submitted = false;
  errorMessage: string | null = null;
  successMessage: string | null = null; 
  onSubmit() {
  this.submitted = true;
  this.errorMessage = null; 
  
  if (this.organizeData.invalid) {
    this.organizeData.markAllAsTouched();
    return;
  }

  const formData = new FormData();
  Object.keys(this.organizeData.controls).forEach((key) => {
    const controlValue = this.organizeData.get(key)?.value;
    if (key === 'pdProfile' && this.selectedProfilePicture) {
      formData.append('pdProfile', this.selectedProfilePicture, this.selectedProfilePicture.name); 
    } else {
      formData.append(key, controlValue);
    }
  });

  formData.forEach((value, key) => {
    console.log(`${key}: ${value}`); 
  });

  this.authService.registerOrganizer(formData).subscribe(
    (response) => {
      console.log('Inscription réussie', response);
      this.successMessage = 'Inscription réussie ! Redirection en cours...';

      // Après 3 secondes on vide le message et on redirige
      setTimeout(() => {
        this.successMessage = null;
        this.router.navigate(['/connexion']);
      }, 3000);
    },
    (error) => {
      console.error('Erreur lors de l\'inscription', error);
      console.log('Erreur détaillée :', error.error?.errors); 
      if (error.error?.errors?.email === "Email already taken. please use another one.") {
        this.errorMessage = 'Cet email est déjà utilisé. Veuillez en choisir un autre.';
      } else {
        this.errorMessage = 'Une erreur s\'est produite. Veuillez réessayer.';
      }

      // Efface le message d'erreur après 3 secondes
      setTimeout(() => {
        this.errorMessage = null;
      }, 3000);
    }
  );
}

  
  get nom() { return this.organizeData.get('nom'); }
  get prenom() { return this.organizeData.get('prenom'); }
  get email() { return this.organizeData.get('email'); }
  get password() { return this.organizeData.get('password'); }
  get password_confirmation() { return this.organizeData.get('password_confirmation'); }
  get numTel() { return this.organizeData.get('numTel'); }
  get numCin() { return this.organizeData.get('numCin'); }
  get ville() { return this.organizeData.get('ville'); }
  get adress() { return this.organizeData.get('adress'); }
  get pdProfile() { return this.organizeData.get('pdProfile'); }
}