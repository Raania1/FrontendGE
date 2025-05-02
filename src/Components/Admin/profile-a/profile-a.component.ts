import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faBell, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { PrestataireService } from '../../../Services/prestataire.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AdminService } from '../../../Services/admin.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-profile-a',
  standalone: true,
  imports: [CommonModule,FontAwesomeModule,FormsModule,HttpClientModule,ReactiveFormsModule],
  templateUrl: './profile-a.component.html',
  styleUrl: './profile-a.component.css'
})
export class ProfileAComponent {
  faUser = faUser;
  faTrash =faTrash;
    constructor(
      private adminService: AdminService,
      private route: ActivatedRoute,
      private fb: FormBuilder,
      private router: Router
    ) {}
    admin: any = {};
    formData = {
      nom: '',
      prenom: '',
      email: ''
    };


    passwordForm!: FormGroup; 
    submitted = false;
    loading = false;
    passwordSuccessMessage: string = '';
    passwordErrorMessage: string = '';
    
  ngOnInit(): void {
    this.fetchAdminData();  
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }
  fetchAdminData() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');  
    const id = user.Id;  

    if (id) {
      this.adminService.getAdminById(id).subscribe(
        (response) => {
          this.admin = response.admin;  
          this.formData = { ...this.admin };  
          console.log(this.admin)
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
      this.adminService.updateAdmin(id, this.formData).subscribe(
        (response) => {
          alert("Les modifications ont été sauvegardées avec succès !");
          this.admin = response.updatedAdmin; 
          this.formData = { ...this.admin};  
          console.log("Les modifications ont été sauvegardées avec succès :" ,this.admin)

        },
        (error) => {
          console.log('Erreur détaillée :', error.error?.errors); 
          console.error('Erreur lors de la mise à jour:', error);
        }
      );
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
    this.adminService.changePassword(id, { oldPassword, newPassword }).subscribe(
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
    this.adminService.deleteAdmin(id).subscribe(
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
