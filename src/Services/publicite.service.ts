import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class PubliciteService {
baseUrl = "http://localhost:8000/pub/"
  
constructor(private http: HttpClient) { }
  createPubliciteForPack(packid: string) {
  return this.http.post(`${this.baseUrl}create`, { packid });
}
 getAll(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}pubs`);
    }
}
