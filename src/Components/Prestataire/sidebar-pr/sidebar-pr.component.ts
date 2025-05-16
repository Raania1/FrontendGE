import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChartBar, faTools, faBars, faCalendarCheck, faCalendarAlt, faBullhorn, faUser, faCog, faSignOutAlt, faInfoCircle, faChevronRight, faChevronLeft, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { PrestataireService } from '../../../Services/prestataire.service';

@Component({
  selector: 'app-sidebar-pr',
  standalone: true,
  imports: [FontAwesomeModule,FormsModule,CommonModule,RouterModule],
  templateUrl: './sidebar-pr.component.html',
  styleUrl: './sidebar-pr.component.css'
})
export class SidebarPRComponent {
  faChartBar = faChartBar;
  faBoxOpen = faBoxOpen;
  faTools = faTools;
  faCalendarCheck = faCalendarCheck;
  faCalendarAlt = faCalendarAlt;
  faBullhorn = faBullhorn;
  faUser = faUser;
  faCog = faCog;
  faSignOutAlt = faSignOutAlt;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faInfoCircle = faInfoCircle;
  faBars = faBars; 

  isSidebarOpen: boolean = false; 
  isSidebarCollapsed: boolean = false;
  isDesktop: boolean = window.innerWidth >= 768; 

  constructor(
     private prestataireService: PrestataireService,
     private router: Router
   ) {}
   prestataire: any = {};
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
   logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/']); 
  }


  toggleSidebar() {
    if (this.isDesktop) {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    } else {
      this.isSidebarOpen = !this.isSidebarOpen; 
    }
  }

  closeSidebar() {
    if (!this.isDesktop) {
      this.isSidebarOpen = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isDesktop = window.innerWidth >= 768;
    if (this.isDesktop) {
      this.isSidebarOpen = true; 
      this.isSidebarCollapsed = false; 
    } else {
      this.isSidebarCollapsed = false; 
    }
  }
}
