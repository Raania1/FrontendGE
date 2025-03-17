import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule,HttpClientModule],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.css'
})
export class NewPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  submitted = false;
  successMessage = '';
  errorMessage = '';
  id: string = '';
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  passwordMatchValidator(formGroup: FormGroup) {
    return formGroup.get('password')?.value === formGroup.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    this.submitted = true;

    if (this.resetPasswordForm.valid) {
      const newPassword = this.resetPasswordForm.value.password;

      this.authService.resetPassword(this.id, this.token, newPassword)
        .subscribe({
          next: (response: any) => {
            this.successMessage = response.message;
            this.errorMessage = '';
            setTimeout(() => {
              this.router.navigate(['/connexion']);
            }, 2000);
          },
          error: (error) => {
            this.errorMessage = error.error.message || "Une erreur est survenue.";
            this.successMessage = '';
          }
        });
    } else {
      this.errorMessage = "Veuillez corriger les erreurs dans le formulaire.";
      this.successMessage = '';
    }
  }
  
  get password() {return this.resetPasswordForm.get('password');}
  get confirmPassword() {return this.resetPasswordForm.get('confirmPassword');}
}