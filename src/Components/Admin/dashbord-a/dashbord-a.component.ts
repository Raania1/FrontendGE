import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBullhorn, faListAlt, faFileInvoice, faBoxOpen, faUsers, faUserFriends, faCheckCircle, faClock, faTimesCircle, faStar, faStarHalfAlt, faHourglassHalf } from '@fortawesome/free-solid-svg-icons';
import { PrestataireService } from '../../../Services/prestataire.service';
import { OrganizerService } from '../../../Services/organizer.service';
import { ReservationService } from '../../../Services/reservation.service';

@Component({
  selector: 'app-dashbord-a',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './dashbord-a.component.html',
  styleUrl: './dashbord-a.component.css'
})
export class DashbordAComponent {
faBullhorn=faBullhorn;
faListAlt=faListAlt;
faFileInvoice=faFileInvoice;
faBoxOpen=faBoxOpen;
faUsers=faUsers;
faUserFriends=faUserFriends;
faTimesCircle=faTimesCircle;
faCheckCircle=faCheckCircle;
faClock=faClock;
faStar=faStar;
faStarHalfAlt=faStarHalfAlt;
faHourglassHalf=faHourglassHalf;
totalConfirmedPres: number = 0;
totalOrganizers: number = 0;
totalpendRes: number = 0;
totalPaidAmount: number = 0;

  constructor(private pres: PrestataireService, private orga: OrganizerService, private res: ReservationService) { }

  ngOnInit(): void {
    this.loadConfirmedPrestataires();
    this.loadOrganisateurs();
    this.loadattenteRes();
  }

  loadConfirmedPrestataires(): void {
    this.pres.getAllPres().subscribe(
      (response) => {
        const allPrestataires = response.pres; 
        const confirmedPres = allPrestataires.filter((pres: any) => pres.Status === 'CONFIRMED');
        this.totalConfirmedPres = confirmedPres.length;
      },
      (error) => {
        console.error('Erreur lors du chargement des prestataires', error);
      }
    );
  }
  loadOrganisateurs(): void {
    this.orga.getAllOrganizers().subscribe(
      (response) => {
        const allOrganizers = response.organizers; 
        this.totalOrganizers = allOrganizers.length;
      },
      (error) => {
        console.error('Erreur lors du chargement des organisateurs', error);
      }
    );
  }
    loadattenteRes(): void {
    this.res.getpendingRes().subscribe(
      (response) => {
        const allReservations = response.reservations;  
        const pendRes = allReservations.filter((res: any) => res.Status === 'PENDING');
        this.totalpendRes = pendRes.length;
      },
      (error) => {
        console.error('Erreur lors du chargement des réservations', error);
      }
    );
}


}
