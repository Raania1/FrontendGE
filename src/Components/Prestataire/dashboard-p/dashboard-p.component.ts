import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBullhorn, faListAlt, faFileInvoice, faBoxOpen, faUsers, faUserFriends, faTimesCircle, faCheckCircle, faClock, faStar, faStarHalfAlt, faHourglassHalf } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard-p',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './dashboard-p.component.html',
  styleUrl: './dashboard-p.component.css'
})
export class DashboardPComponent {
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
faHourglassHalf=faHourglassHalf
}
