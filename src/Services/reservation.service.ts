import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://localhost:8000/reservation/demande'; 
  private apiUrl1 = 'http://localhost:8000/reservation/getall'; 
  private apiUrl2 = 'http://localhost:8000/reservation/deleteById/'; 
  private apiUrl3 = 'http://localhost:8000/reservation/confirm/'; 
  private apiUrl4 = 'http://localhost:8000/reservation/cancel/'; 
  private apiUrl5 = 'http://localhost:8000/reservation/countReservation/'; 

  constructor(private http: HttpClient) {}

  createReservation(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
  getAll(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl1}`);
    }
  count(Prestataireid: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl5}${Prestataireid}`);
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
}
