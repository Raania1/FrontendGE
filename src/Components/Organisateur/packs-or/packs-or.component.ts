import { Component, OnInit } from '@angular/core';
import { NavbarORComponent } from "../navbar-or/navbar-or.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
interface Pack {
  title: string;
  description: string;
  price: number;
  oldPrice: number;
  discount: number;
  imageUrl: string;
  provider: string;
  category: string;
  showDetails: boolean; // ✅ Ajouté
  services: {           // ✅ Ajouté
    title: string;
    description: string;
  }[];
}

@Component({
  selector: 'app-packs-or',
  standalone: true,
  imports: [NavbarORComponent,CommonModule,FormsModule],
  templateUrl: './packs-or.component.html',
  styleUrl: './packs-or.component.css'
})
export class PacksORComponent implements OnInit {
  search = '';
  selectedCategory = 'Tous';

  categories = ['Tous', 'Photo', 'Vidéo', 'Web', 'Événement'];

  packs: Pack[] = [
    
  {
    title: 'Pack Photo Premium',
    description: 'Un service photo professionnel pour immortaliser vos moments spéciaux',
    price: 399.99,
    oldPrice: 499.99,
    discount: 20,
    imageUrl: 'assets/photo-pack.jpg',
    provider: 'Studio Lumière',
    category: 'Photo',
    showDetails: false, // <--- AJOUTÉ
    services: [
      {
        title: 'Séance photo 3h',
        description: 'Une séance photo professionnelle de 3 heures avec matériel haut de gamme'
      },
      {
        title: '50 photos retouchées',
        description: 'Livraison de 50 photos retouchées professionnellement'
      },
      {
        title: 'Album photo premium',
        description: 'Album photo imprimé sur papier premium format 30x40cm'
      }
    ]
  },  {
    title: 'Pack Photo Premium',
    description: 'Un service photo professionnel pour immortaliser vos moments spéciaux',
    price: 399.99,
    oldPrice: 499.99,
    discount: 20,
    imageUrl: 'assets/photo-pack.jpg',
    provider: 'Studio Lumière',
    category: 'Photo',
    showDetails: false, // <--- AJOUTÉ
    services: [
      {
        title: 'Séance photo 3h',
        description: 'Une séance photo professionnelle de 3 heures avec matériel haut de gamme'
      },
      {
        title: '50 photos retouchées',
        description: 'Livraison de 50 photos retouchées professionnellement'
      },
      {
        title: 'Album photo premium',
        description: 'Album photo imprimé sur papier premium format 30x40cm'
      }
    ]
  },  {
    title: 'Pack Photo Premium',
    description: 'Un service photo professionnel pour immortaliser vos moments spéciaux',
    price: 399.99,
    oldPrice: 499.99,
    discount: 20,
    imageUrl: 'assets/photo-pack.jpg',
    provider: 'Studio Lumière',
    category: 'Photo',
    showDetails: false, // <--- AJOUTÉ
    services: [
      {
        title: 'Séance photo 3h',
        description: 'Une séance photo professionnelle de 3 heures avec matériel haut de gamme'
      },
      {
        title: '50 photos retouchées',
        description: 'Livraison de 50 photos retouchées professionnellement'
      },
      {
        title: 'Album photo premium',
        description: 'Album photo imprimé sur papier premium format 30x40cm'
      }
    ]
  },
  ];

  get filteredPacks(): Pack[] {
    return this.packs.filter(pack =>
      (this.selectedCategory === 'Tous' || pack.category === this.selectedCategory) &&
      pack.title.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  constructor() {}

  ngOnInit(): void {}
}
