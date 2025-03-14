import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../footer/footer.component";
import { NavbarComponent } from "../navbar/navbar.component";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FooterComponent, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  items = [
    { title: 'Trouver les meilleurs prestataires', icon: 'fas fa-users text-green-500', bgColor: 'bg-green-100', description: `Accédez à notre réseau de prestataires qualifiés pour tous types d'évènnements.` },
    { title: 'Réservation simple', icon: 'fa-regular fa-calendar text-purple-500', bgColor: 'bg-purple-100', description: `Réservez vos prestataires en quelques clics et organisez votre planing d'évènnements.` },
    { title: 'Services de qualité', icon: 'fas fa-medal text-blue-500', bgColor: 'bg-blue-100', description: 'Tous nos prestataires sont vérifiés pour vous garantir des services exceptionnels.' },
    { title: 'Sécurité garantie', icon: 'fa-solid fa-shield text-yellow-500', bgColor: 'bg-yellow-100', description: `Paiement sécurisés et contrats protégés pour votre tranquilité d'esprit.` },
    { title: 'Paiement facile', icon: 'fa-solid fa-money-check text-red-500', bgColor: 'bg-red-100', description: 'Plusieurs options de paiement pour régler vos réservations en touts simplicité.' },
    { title: 'Avis vérifiés', icon: 'fa-solid fa-star text-indigo-500', bgColor: 'bg-indigo-100', description: `Consultez les avis authentiques d'autres organisateurs avant de faire votre choix.` },
  ];
  categories = [
    { name: 'Troupe Musicale', image: 'https://th.bing.com/th/id/OIP.5gB7Q-JPF9MHtGh2vQc69wHaHa?w=600&h=600&rs=1&pid=ImgDetMain' },
    { name: 'Salle', image: 'https://th.bing.com/th/id/OIP.bQNZV8Ku5BxIDl54jTdVRwHaEy?w=1920&h=1240&rs=1&pid=ImgDetMain' },
    { name: 'Photographie', image: 'https://images.unsplash.com/photo-1554941829-202a0b2403b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { name: 'Traiteur', image: 'https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { name: 'Décoration', image: 'https://images.unsplash.com/photo-1478146059778-26028b07395a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { name: 'Annimation anniversaire', image: 'https://th.bing.com/th/id/R.450acaa71dd967b124364d3b6699520d?rik=o6f2yIflhpyqyQ&pid=ImgRaw&r=0' },
    { name: 'DJ', image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { name: 'coiffure', image: 'https://th.bing.com/th/id/R.f766515279541677c2cc572a5883dd13?rik=T983qweLbpvukQ&pid=ImgRaw&r=0' },
    { name: 'Location des matériels', image: 'https://th.bing.com/th/id/R.fea15d913ea6a1f354db11761f006e29?rik=QdvQ10hw190npQ&pid=ImgRaw&r=0' },
    { name: 'Conciergerie ', image: 'https://th.bing.com/th/id/R.7298667305022b5a525dbcc06695d782?rik=kKJDfr%2fx5ex98g&pid=ImgRaw&r=0&sres=1&sresct=1' },
  ];
  
  currentIndex = 0;
  testimonials = [
    { text: "J'ai trouvée le parfait traiteur pour mon marriage grace a FLESK EVENT. Le processus de réservation était simple et le service était impeccable.", name: "Moulezem Achref", event: "Evennement Mariage", photo: "https://th.bing.com/th/id/OIP.tjUOUBGnthmW762mbRAFdQHaE8?rs=1&pid=ImgDetMain" },
    { text: "En tant que Photographe, cette plateforme m'a permis de dévelloper ma clientèle et de me faire connaitre. Les outils de gestion sont vraiment pratiques.", name: "Boujneh Rania", event: "Photographe professionnelle", photo: "https://www.missnumerique.com/blog/wp-content/uploads/reussir-sa-photo-de-profil-michael-dam.jpg" },
    { text: "Organisation d'un séminaire d'entreprise simplifiée grace a FLESK EVENT. J'ai pu trouver une salle et tous le sprestataires en un seul endroit.", name: "Hamdi Wahyd", event: "Séminaire d'entreprise", photo: "https://androidayuda.com/wp-content/uploads/2023/01/foto-perfil.jpg" }
  ];
  
  goToSlide(index: number) {
    this.currentIndex = index;
  }
  
  

  
}
