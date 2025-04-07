import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavbarORComponent } from "../navbar-or/navbar-or.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-acceuil-or',
  standalone: true,
  imports: [NavbarORComponent,FontAwesomeModule,RouterLink],
 
  templateUrl: './acceuil-or.component.html',
  styleUrl: './acceuil-or.component.css'
})
export class AcceuilORComponent implements OnInit, OnDestroy {
  backgroundImages = [
    'https://media.istockphoto.com/id/625147696/fr/photo/fond-musique-dj-night-club-deejay-record-player-retro.jpg?s=612x612&w=0&k=20&c=NyiFv2WxhqHC1ukEpGW3XvnD4-0wq2qKHulwcIEVUso=' ,
    'https://media.istockphoto.com/id/1051348282/fr/photo/enregistrement-dappareil-photo-num%C3%A9rique-professionnel-vid%C3%A9o-au-festival-de-musique-de.jpg?s=612x612&w=0&k=20&c=SYXBfu-Tj2H83dm6A88wySfUByKIBgxhrAZWQ3REDLo=',
    'https://media.istockphoto.com/id/1056074028/fr/photo/gar%C3%A7on-portant-des-plaques-avec-plat-de-viande.jpg?s=612x612&w=0&k=20&c=QZmA01XJlJirGiPJU_mtkPsDmf6llfoKrYB9qpkkTS4=',
    'https://media.istockphoto.com/id/1387884589/fr/photo/r%C3%A9glage-de-la-table-pour-un-%C3%A9v%C3%A9nement.jpg?s=612x612&w=0&k=20&c=ahdHTQL5LebXUPY3IybN1B3zPwAfUJFenjvYLR_Gnjk=',
    'https://media.istockphoto.com/id/964358520/fr/photo/table-riche-en-restaurant-verre-verres-couverts-plats-blancs-vides.jpg?s=612x612&w=0&k=20&c=gdNv-sVogOz8xSGGcPYjjQPxPQnn7TOIFHfVdOixSp4='
  ];
  
  currentIndex = 0;
  currentImage = this.backgroundImages[0];
  private intervalId: any;

  ngOnInit() {
    this.preloadImages();
    this.startSlideshow();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private preloadImages() {
    this.backgroundImages.forEach(img => {
      const image = new Image();
      image.src = img;
    });
  }

  private startSlideshow() {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.backgroundImages.length;
      this.currentImage = this.backgroundImages[this.currentIndex];
    }, 2000);
  }
}
