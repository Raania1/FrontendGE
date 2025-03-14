import { Component } from '@angular/core';
import { NavbarORComponent } from '../navbar-or/navbar-or.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  faInfoCircle,faCalendarAlt,faChartBar,faCog,faTrash 
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
@Component({
  selector: 'app-profile-or',
  standalone: true,
  imports: [NavbarORComponent,CommonModule,FormsModule,FontAwesomeModule],
  templateUrl: './profile-or.component.html',
  styleUrl: './profile-or.component.css'
})
export class ProfileOrComponent {

  faInfoCircle = faInfoCircle; 
  faCalendarAlt = faCalendarAlt;
  faChartBar = faChartBar; 
  faCog = faCog; 
  faTrash =faTrash ;

  organisateur = {
    nom: "Boujneh",
    prenom: "Rania",
    email: "boujnehrania3@gmail.com",
    numTel: "12345678",
    numCin: "09876543",
    ville: "Tunis",
    adress: "123 Rue Soudan",
    pdProfile: "https://www.missnumerique.com/blog/wp-content/uploads/reussir-sa-photo-de-profil-michael-dam.jpg",
  };

  formData = { ...this.organisateur };
  isEditing = false;
  activeTab = "infos";

  handleSubmit(event: Event) {
    event.preventDefault();
    this.organisateur = { ...this.formData };
    this.isEditing = false;
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
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.organisateur.pdProfile = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
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

  //events = [
    //   {
    //     id: 1,
    //     title: "Conférence Tech 2023",
    //     description: "Une conférence sur les dernières technologies et innovations.",
    //     date: new Date(2023, 11, 15),
    //     location: "Centre de Conférences, Tunis",
    //     image: "/placeholder.svg?height=300&width=500",
    //     participants: 120,
    //     status: "completed",
    //   }
    // ];
}
