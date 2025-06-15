import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
    private url = "https://backendge.onrender.com"
              // private url = "http://localhost:8000"

  private apiUrl = `${this.url}/reservation/demande`; 
  
  private apiUrl1 = `${this.url}/reservation/getAllReservationServicesOnly`; 
  private apiUrl9 = `${this.url}/reservation/getAllReservationPacksOnly`; 
  private apiUrl2 = `${this.url}/reservation/deleteById/`; 
  private apiUrl3 = `${this.url}/reservation/confirm/`; 
  private apiUrl4 = `${this.url}/reservation/cancel/`; 
  private apiUrl5 = `${this.url}/reservation/countReservation/`; 
  private apiUrl6 = `${this.url}/reservation/countReservationS/`; 
  private apiUrl7 = `${this.url}/reservation/countReservations`; 
  private apiUrl8 = `${this.url}/reservation/countPaidReservations`; 
  private apiUrlA = `${this.url}/reservation/getAll`;
  private apiUrl10 = `${this.url}/reservation/prestataire/`;

  constructor(private http: HttpClient) {}

  createReservation(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
  getAll(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl1}`);
    }
  getAllP(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl9}`);
  }
  count(Prestataireid: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl5}${Prestataireid}`);
  }
  countS(serviceId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl6}${serviceId}`);
  }
  deletereservationById(id: string): Observable<any> {
      return this.http.delete<any>(`${this.apiUrl2}${id}`);
    }

  confirmReservation(reservationId: string): Observable<any> {
    return this.http.put(`${this.apiUrl3}${reservationId}/confirm`, {});
  }
  cancelReservation(reservationId: string): Observable<any> {
    return this.http.put(`${this.apiUrl4}${reservationId}`, {});
  }



getOrganizerReservations(organizerId: string): Observable<any> {
  return this.http.get(`${this.apiUrl7}/${organizerId}`);
}
getcountPaidReservations(organizerId: string): Observable<any> {
  return this.http.get(`${this.apiUrl8}/${organizerId}`);
}
 getServiceReservationsByPrestataireId(prestataireId: string): Observable<any> {
    return this.http.get(`${this.url}/reservation/getServiceReservationsByPrestataireId/${prestataireId}`);
  }
  getPackReservationsByPrestataireId(prestataireId: string): Observable<any> {
    return this.http.get(`${this.url}/reservation/getPackReservationsByPrestataireId/${prestataireId}`);
  }
   getpendingRes(): Observable<any> {
    const token = localStorage.getItem('token');  
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.get<any>(`${this.apiUrlA}`, { headers });
  }
    getReservationsByPrestataireId(prestataireId: string): Observable<any> {
    return this.http.get(`${this.apiUrl10}${prestataireId}`);
  }
}
