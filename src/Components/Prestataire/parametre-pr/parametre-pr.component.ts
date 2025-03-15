import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-parametre-pr',
  standalone: true,
  imports: [FontAwesomeModule,FormsModule],
  templateUrl: './parametre-pr.component.html',
  styleUrl: './parametre-pr.component.css'
})
export class ParametrePRComponent {
faBell = faBell;
  faUser = faUser;
  compte = {
    nom: "Boujneh",
    prenom: "Rania",
    verified: true,
    location: "Tunisie, Monastir-Moknine",
    adresse: "Moknine, Rue Sudan 5050",
    telephone: "27991857",
    email: "boujnehrania@gmail.com",
    description: "Groupe de musique traditionnelle de Provence spécialisé dans l'animation de mariages, fêtes privées et événements d'entreprise. Notre répertoire varié saura s'adapter à toutes vos demandes pour faire de votre événement un moment inoubliable.",
    photo: "https://www.missnumerique.com/blog/wp-content/uploads/reussir-sa-photo-de-profil-michael-dam.jpg",
  };

  saveChanges() {
    console.log("Modifications sauvegardées :", this.compte);
    alert("Les modifications ont été sauvegardées avec succès !");
  }
}
