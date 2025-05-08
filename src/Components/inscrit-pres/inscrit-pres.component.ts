import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";
import { AuthService } from '../../Services/auth.service'; 
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-inscrit-pres',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule,FontAwesomeModule, CommonModule, NavbarComponent, HttpClientModule],
  templateUrl: './inscrit-pres.component.html',
  styleUrl: './inscrit-pres.component.css'
})
export class InscritPresComponent {
  selectedFiles: File[] = [];
  selectedProfilePicture: File | null = null;
  submitted = false;
  errorMessage: string | null = null;
  keywords: string[] = [];
  isGenerating: boolean = false;
  apiError: string | null = null;

  constructor(
    private _FormBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  pressData: FormGroup = this._FormBuilder.group({
    nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15), Validators.pattern(/^[a-zA-Z\s]*$/)]],
    prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15), Validators.pattern(/^[a-zA-Z\s]*$/)]],
    email: ['', [Validators.required, Validators.email]],
    travail: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15), Validators.pattern(/^[a-zA-Z\s]*$/)]],
    description: ['', [Validators.required, Validators.minLength(20)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
    password_confirmation: ['', Validators.required],
    numTel: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    numCin: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    ville: ['', Validators.required],
    adress: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9\s,'-]*$/)]],
    pdProfile: [null, Validators.required],
    fichierConfirmation: [null, Validators.required],
  }, { validators: this.passwordNotmatch });

  passwordNotmatch(form: AbstractControl): null | { [key: string]: boolean } {
    const pass = form.get('password')?.value;
    const repass = form.get('password_confirmation')?.value;
    return repass !== pass ? { passNotMatch: true } : null;
  }

  addKeyword(keywordInput: HTMLInputElement) {
    const value = keywordInput.value.trim();
    if (value && !this.keywords.includes(value)) {
      this.keywords.push(value);
      keywordInput.value = '';
      this.apiError = null; 
    }
  }

  removeKeyword(index: number) {
    this.keywords.splice(index, 1);
  }

  async generateDescription() {
    if (this.keywords.length === 0) {
      this.apiError = "Veuillez ajouter au moins un mot-clé";
      return;
    }

    this.isGenerating = true;
    this.apiError = null;

    try {
      const response: any = await this.http.post('http://localhost:8000/ia/generate', { 
        keywords: this.keywords 
      }).toPromise();

      if (response.description) {
        this.pressData.patchValue({
          description: response.description
        });
      } else {
        this.apiError = "Aucune description n'a été générée. Veuillez essayer avec d'autres mots-clés.";
      }
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      this.apiError = "Erreur lors de la génération. Veuillez réessayer plus tard.";
    } finally {
      this.isGenerating = false;
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedProfilePicture = file;
    }
  }

  onFilesChange(event: any) {
    const files = event.target.files;
    
    if (files.length > 5) {
      alert('Vous ne pouvez sélectionner que 5 fichiers maximum.');
      return;
    }

    this.selectedFiles = Array.from(files);
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = null;
    
    if (this.pressData.invalid) {
      this.pressData.markAllAsTouched();
      return;
    }
  
    const formData = new FormData();
    Object.keys(this.pressData.controls).forEach((key) => {
      const controlValue = this.pressData.get(key)?.value;
      if (controlValue && key !== 'pdProfile' && key !== 'fichierConfirmation') { 
        formData.append(key, controlValue);
      }
    });
  
    if (this.selectedProfilePicture) {
      formData.append('pdProfile', this.selectedProfilePicture, this.selectedProfilePicture.name);
    }
  
    if (this.selectedFiles.length > 0) {
      this.selectedFiles.forEach((file) => {
        formData.append('fichierConfirmation', file, file.name);
      });
    }
  
    this.authService.registerPrestataire(formData).subscribe(
      (response) => {
        console.log('Inscription réussie', response);
        alert('Inscription réussie ! Nous reviendrons vers vous bientôt. Ne ratez pas votre email, nous vous répondrons sur celui-ci.');
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Erreur lors de l\'inscription', error);
        if (error.error) {
          console.error('Détail de l\'erreur (error.error) :', error.error);
        }
        
        if (error.error?.errors?.email === "Email already taken. please use another one.") {
          this.errorMessage = 'Cet email est déjà utilisé. Veuillez en choisir un autre.';
        } else {
          this.errorMessage = 'Une erreur s\'est produite. Veuillez réessayer.';
        }
      }
    );
  }

  get nom() { return this.pressData.get('nom'); }
  get prenom() { return this.pressData.get('prenom'); }
  get email() { return this.pressData.get('email'); }
  get travail() { return this.pressData.get('travail'); }
  get description() { return this.pressData.get('description'); }
  get numTel() { return this.pressData.get('numTel'); }
  get numCin() { return this.pressData.get('numCin'); }
  get password() { return this.pressData.get('password'); }
  get confirmPassword() { return this.pressData.get('password_confirmation'); }
  get ville() { return this.pressData.get('ville'); }
  get adress() { return this.pressData.get('adress'); }
  get pdProfile() { return this.pressData.get('pdProfile'); }
  get fichierConfirmation() { return this.pressData.get('fichierConfirmation'); }
}