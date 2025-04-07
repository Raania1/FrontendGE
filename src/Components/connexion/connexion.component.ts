import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";
import { AuthService } from '../../Services/auth.service';
import {  HttpClientModule } from '@angular/common/http';
import { EmailPasswordComponent } from "../email-password/email-password.component";
import { afficherAlertFailure } from '../../js/alert';
@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, NavbarComponent, HttpClientModule, EmailPasswordComponent],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})
export class ConnexionComponent {
  showResetModal: boolean = false;
  openResetModal() {
    this.showResetModal = true;
  }

  closeResetModal() {
    this.showResetModal = false;
  }
  constructor (private _FormBuilder: FormBuilder,private authService: AuthService,private router: Router) {
      console.log(this.userData)
    }
    userData: FormGroup = this._FormBuilder.group({
      email:['',[Validators.required, Validators.email]],
      password:['',[Validators.required]],
    })
    submitted = false;
    onSubmit() {
      this.submitted = true;
      ;
      if (this.userData.invalid) {
        this.userData.markAllAsTouched(); 
        return;
      }

      this.authService.login(this.userData.value.email, this.userData.value.password).subscribe(
      (response) => {
        console.log('Connexion réussie', response);
        this.authService.afficherAlertSuccess('Connexion Réussie, Bienvennue ...','alert-success');
        const userRole = response.user.role;

        if (userRole === 'organizer') {
          this.router.navigate(['/navOR']); 
        } else if (userRole === 'prestataire') {
          this.router.navigate(['/prestataire/parametre']); 
        } else if (userRole === 'admin') {
          this.router.navigate(['/administrateur/profile']); 
        } else {
          console.error('Rôle non reconnu');
        }
      },      
      (error) => {
        console.error('Erreur de connexion', error);

        if (error.error?.errors?.email === "No user found with this email." || error.error?.errors?.email === "Invalid Credentials.") {
          this.authService.afficherAlertFailure('Email ou mot de passe incorrect.','alert-failure');
        } else if (error.error?.errors?.message === "Account not approved yet.") {
          this.authService.afficherAlertWarning('Votre compte n\'est pas encore approuvé. Réessayez dès que vous êtes accepté comme prestataire.','alert-warning');
        } else {
          this.authService.afficherAlertFailure('Email ou mot de passe incorrect.','alert-failure');

        }
      }
    );
  }
    
  get email (){return this.userData.get('email');}
  get password (){return this.userData.get('password');}

  
}
