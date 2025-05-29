import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class PubliciteService {
baseUrl = "https://backendge.onrender.com/pub/"
  
constructor(private http: HttpClient) { }
  createPubliciteForPack(packid: string) {
  return this.http.post(`${this.baseUrl}create`, { packid });
}
 getAll(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}pubs`);
    }

    acceptAdvertisement(id: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}confirmer/${id}`, {});
  }

  refuseAdvertisement(id: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}annuler/${id}`, {});
  }
  deleteAdvertisement(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}delete/${id}`);
  }
   getAllPublicites(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}pubC`)
  }
}
