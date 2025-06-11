import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBullhorn, faListAlt, faFileInvoice, faBoxOpen, faUsers, faUserFriends, faCheckCircle, faClock, faTimesCircle, faStar, faStarHalfAlt, faHourglassHalf } from '@fortawesome/free-solid-svg-icons';

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
}
