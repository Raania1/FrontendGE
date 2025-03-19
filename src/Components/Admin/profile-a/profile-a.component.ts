import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faBell, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { PrestataireService } from '../../../Services/prestataire.service';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-profile-a',
  standalone: true,
  imports: [CommonModule,FontAwesomeModule,FormsModule],
  templateUrl: './profile-a.component.html',
  styleUrl: './profile-a.component.css'
})
export class ProfileAComponent {
  faBell = faBell;
  faUser = faUser;
  faTrash =faTrash;
    constructor(
      private prestataireService: PrestataireService,
      private route: ActivatedRoute
    ) {}
    prestataire: any = {};
    formData = { ...this.prestataire };

  ngOnInit(): void {
    this.fetchPresData();  
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

}
