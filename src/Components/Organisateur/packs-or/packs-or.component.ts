import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavbarORComponent } from "../navbar-or/navbar-or.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PubliciteService } from '../../../Services/publicite.service';
import { RouterLink } from '@angular/router';

interface Pack {
  id:string;
  title: string;
  description: string;
  price: number;
  promo?: number;
  coverPhotoUrl: string;
  category?: string;
  showDetails: boolean; 
  showFullDescription: boolean; 
  services: service[];
  prestataire:{nom:String; prenom:string}
   DatePublic?: Date;
}
interface Publicite {
  Pack: any; 
}
interface service{
  name:string;
  description:string;
}
@Component({
  selector: 'app-packs-or',
  standalone: true,
  imports: [NavbarORComponent, CommonModule, FormsModule, FontAwesomeModule,RouterLink],
  templateUrl: './packs-or.component.html',
  styleUrls: ['./packs-or.component.css']
})
export class PacksORComponent implements OnInit, OnDestroy {
  search = '';
  faChevronRight = faChevronRight;
  faChevronLeft = faChevronLeft;
  selectedCategory = 'Tous';
  selectedSort = 'plusRecents';
  currentPage: number = 0;
  itemsPerPage: number = 6;
  private autoPageInterval: any;
  packs: Pack[] = [];

  constructor(private apiService: PubliciteService) {}

  ngOnInit(): void {
    this.fetchPacks();
    this.startAutoPage();
  }

  ngOnDestroy(): void {
    this.stopAutoPage();
  }

  truncateDescription(description: string, wordLimit: number = 20): string {
    const words = description.trim().split(/\s+/);
    if (words.length <= wordLimit) {
      return description;
    }
    return words.slice(0, wordLimit).join(' ') + '...';
  }

fetchPacks(): void {
  this.apiService.getAllPublicites().subscribe({
    next: (data: any[]) => { 
      this.packs = data
        .filter((pub: any) => pub.Pack) 
        .map((pub: any) => ({
          id:pub.Pack.id,
          DatePublic: new Date(pub.DatePublic),
          title: pub.Pack.title || 'Untitled Pack',
          description: pub.Pack.description || 'No description available',
          price: pub.Pack.price || 0,
          promo: pub.Pack.promo || undefined,
          coverPhotoUrl: pub.Pack.coverPhotoUrl || 'https://via.placeholder.com/300',
          prestataire: {
            prenom: pub.Pack.Prestataire?.prenom || 'Unknown Provider',
            nom: pub.Pack.Prestataire?.nom || 'Unknown Provider'
          },
          showDetails: false,
          showFullDescription: false,
          services: (pub.Pack.services || []).map((service: any) => ({
            name: service.name || 'Unnamed Service',
            description: service.description || 'No description available'
          })),
        }));
        
      if (this.packs.length === 0) {
        console.log('No publicites found');
      }
    },
    error: (err) => {
      console.error('Error fetching packs:', err);
    }
  });
}


  // Rest of the component remains unchanged (slides, sortPacks, filteredPacks, etc.)
  get slides(): Pack[][] {
    const slides: Pack[][] = [];
    for (let i = 0; i < this.filteredPacks.length; i += this.itemsPerPage) {
      slides.push(this.filteredPacks.slice(i, i + this.itemsPerPage));
    }
    return slides;
  }

  get currentSlide(): Pack[] {
    return this.slides[this.currentPage] || [];
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPacks.length / this.itemsPerPage);
  }

  sortPacks(packs: Pack[]): Pack[] {
    switch (this.selectedSort) {
      case 'plusRecents':
        return [...packs];
      case 'plusAnciens':
        return [...packs].reverse();
      case 'plusCher':
        return [...packs].sort((a, b) => b.price - a.price);
      case 'moinsCher':
        return [...packs].sort((a, b) => a.price - b.price);
      default:
        return packs;
    }
  }

  get filteredPacks(): Pack[] {
    const filtered = this.packs.filter(pack =>
      (this.selectedCategory === 'Tous' || pack.category === this.selectedCategory) &&
      pack.title.toLowerCase().includes(this.search.toLowerCase())
    );
    return this.sortPacks(filtered);
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
    }
  }

  getPages(): number[] {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    const pages: number[] = [];

    pages.push(0);

    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    if (startPage > 1) {
      pages.push(-1);
    }

    for (let i = startPage; i <= endPage; i++) {
      if (i > 0 && i < totalPages - 1) {
        pages.push(i);
      }
    }

    if (endPage < totalPages - 2) {
      pages.push(-1);
    }

    if (totalPages > 1) {
      pages.push(totalPages - 1);
    }

    return pages;
  }

  private startAutoPage(): void {
    this.autoPageInterval = setInterval(() => {
      if (this.currentPage < this.totalPages - 1) {
        this.nextPage();
      } else {
        this.currentPage = 0;
      }
    }, 120000); // 2 minutes
  }

  private stopAutoPage(): void {
    if (this.autoPageInterval) {
      clearInterval(this.autoPageInterval);
    }
  }
}