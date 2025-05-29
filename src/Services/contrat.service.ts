import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private url = "http://localhost:8000"
  private apiUrl = `${this.url}/contrat/create`; 
  private apiUrlD = `${this.url}/contrat/`; 

  constructor(private http: HttpClient) {}

  createContract(paymentId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { paymentId });
  }
  getContratById(paymentId: string): Observable<any> {
    return this.http.get(`${this.apiUrlD}${paymentId}`);
  }
  downloadContract(paymentId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrlD}${paymentId}/download`, { responseType: 'blob' });
  }
}