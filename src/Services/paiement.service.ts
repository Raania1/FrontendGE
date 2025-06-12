import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
@Injectable({
  providedIn: 'root'
})
export class PaiementService {

  private baseUrl = 'https://backendge.onrender.com/payment';

  constructor(private http: HttpClient) {}

  payerReservation(reservationId: string) {
    return this.http.post(`${this.baseUrl}/add`, { reservationId });
  }
  verifierPaiement(payment_id: string) {
    return this.http.post(`${this.baseUrl}/verify/${payment_id}`, {});
  }
getPaymentByReservationId(reservationId: string): Observable<any> {
  return this.http.get(`${this.baseUrl}/getByIdreservation/${reservationId}`);
}
 // paiement pub
  payerPub(pubId: string) {
    return this.http.post(`${this.baseUrl}/addPB`, { pubId });
  }
 verifyPayementPub(payment_id: string) {
    return this.http.post(`${this.baseUrl}/verifyPub/${payment_id}`, {});
  }
getAllPaymentPub(): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/all`);
}

 
}
