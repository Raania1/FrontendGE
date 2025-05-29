import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private url = "http://localhost:8000"
  private apiUrl = `${this.url}/rating/ratingPrestataire`; 
  private apiUrlR = `${this.url}/rating/create`; 

  constructor(private http: HttpClient) { }

  getRatingsByPrestataire(prestataireId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${prestataireId}`);
  }
  createRating(ratingData: { organisateurid: string, prestataireid: string, rating: number }): Observable<any> {
    return this.http.post(this.apiUrlR, ratingData);
  }
  
}
