import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-email-password',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule,HttpClientModule],
  templateUrl: './email-password.component.html',
  styleUrl: './email-password.component.css'
})
export class EmailPasswordComponent {
  resetForm: FormGroup;
  submitted = false;

  @Output() closeModal = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get email() {
    return this.resetForm.get('email');
  }

 onSubmit() {
    this.submitted = true;

    if (this.resetForm.valid) {
      const emailValue = this.resetForm.value.email;

      this.authService.forgetPassword(emailValue).subscribe({
        next: (response) => {
          this.authService.afficherAlertSuccess('Un lien de réinitialisation a été envoyé à votre email.','alert-successE');
        },
        error: (error: HttpErrorResponse) => {
          if(error.status === 404){
            this.authService.afficherAlertFailure('Utilisateur non trouvé.','alert-failureE');
          }
          else{
            this.authService.afficherAlertFailure('Une erreur est survenue.','alert-failureE');

          }

        }
      });
    } else {
      this.authService.afficherAlertWarning('Veuillez entrer une adresse email valide.','alert-warningE');
    }
  }
}
