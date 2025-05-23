import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8000/event'; 
  private apiUrlS = 'http://localhost:8000/service/servicesP'; 

  constructor(private http: HttpClient) {}
  createEvent(eventData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, eventData);
  }

  getAllEventsWithServices(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllEventsWithServices`);
  }
  getAllservices(): Observable<any> {
    return this.http.get<any>(`${this.apiUrlS}`);
    }
addServiceToEvent(payload: { eventId: string, serviceId: string }): Observable<any> {
  return this.http.post(`${this.apiUrl}/addService`, payload);
}
removeServiceFromEvent(eventId: string, serviceId: string) {
  return this.http.post(`${this.apiUrl}/removeService`, {eventId,serviceId});
}
deleteEvent(eventId: string) {
  return this.http.delete(`${this.apiUrl}/delete/${eventId}`);
}
  getOrganizerEvents(organizerId: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/countEvents/${organizerId}`);
}
}
