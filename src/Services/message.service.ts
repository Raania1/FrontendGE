import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private apiUrl = 'http://localhost:8000/message/create';
  private apiUrl1 = 'http://localhost:8000/message/getAllPublic';

  constructor(private http: HttpClient) { }

  sendMessage(messageData: any): Observable<any> {
    return this.http.post(this.apiUrl, messageData);
  }

  getPublicMessages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl1}`);
  }
}
