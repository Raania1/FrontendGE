import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  private apiUrl = 'http://localhost:8000/rating/ratingPrestataire'; 

  constructor(private http: HttpClient) { }

  getRatingsByPrestataire(prestataireId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${prestataireId}`);
  }
}
