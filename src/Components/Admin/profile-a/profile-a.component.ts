import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faBell, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { PrestataireService } from '../../../Services/prestataire.service';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AdminService } from '../../../Services/admin.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-profile-a',
  standalone: true,
  imports: [CommonModule,FontAwesomeModule,FormsModule,HttpClientModule],
  templateUrl: './profile-a.component.html',
  styleUrl: './profile-a.component.css'
})
export class ProfileAComponent {
  // faBell = faBell;
  faUser = faUser;
  faTrash =faTrash;
    constructor(
      private adminService: AdminService,
      private route: ActivatedRoute
    ) {}
    admin: any = {};
    formData = {
      nom: '',
      prenom: '',
      email: ''
    };
    
  ngOnInit(): void {
    this.fetchAdminData();  
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

 

}
