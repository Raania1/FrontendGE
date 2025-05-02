import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class PaiementService {

  private baseUrl = 'http://localhost:8000/payment';

  constructor(private http: HttpClient) {}

  payerReservation(reservationId: string) {
    return this.http.post(`${this.baseUrl}/add`, { reservationId });
  }
  verifierPaiement(payment_id: string) {
    return this.http.post(`${this.baseUrl}/verify/${payment_id}`, {});
}
  
}
