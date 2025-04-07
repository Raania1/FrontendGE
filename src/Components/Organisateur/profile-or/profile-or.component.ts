import { Component } from '@angular/core';
import { NavbarORComponent } from '../navbar-or/navbar-or.component';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  faInfoCircle,faCalendarAlt,faChartBar,faCog,faTrash 
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OrganizerService } from '../../../Services/organizer.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../Services/auth.service';
@Component({
  selector: 'app-profile-or',
  standalone: true,
  imports: [NavbarORComponent,CommonModule,FormsModule,FontAwesomeModule,HttpClientModule],
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
  constructor(private authService: OrganizerService,authServiceA: AuthService) {}

  ngOnInit(): void {
    this.fetchOrganizerData();  
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

  onPasswordUpdate() {
    if (this.newPassword !== this.confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }
    console.log('Mot de passe actuel :', this.currentPassword);
    console.log('Nouveau mot de passe :', this.newPassword);
  }
  onDeleteAccount() {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      console.log('Suppression du compte...');
    }
  }

}
