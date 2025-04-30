import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private apiUrl = 'http://localhost:8000/message/create';
  private apiUrl1 = 'http://localhost:8000/message/getAllPublic';
  private apiUrl2 = 'http://localhost:8000/message/getAll';
  private apiUrl3 = 'http://localhost:8000/message/delete';
  private apiUrl4 = 'http://localhost:8000/message/update';
  private apiUrl5 = 'http://localhost:8000/message/reply';

  
  constructor(private http: HttpClient) { }

  sendMessage(messageData: any): Observable<any> {
    return this.http.post(this.apiUrl, messageData);
  }

  getPublicMessages(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl1}`);
  }
  getAll(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl2}`);
    }
  delete(id: string):Observable<any> {
    return this.http.delete(`${this.apiUrl3}/${id}`);
  }

  updateStatus(id: string):Observable<any> {
    return this.http.put(`${this.apiUrl4}/${id}`, {});
  }
  replyToMessage(id: string, subject: string, body: string): Observable<any> {
    return this.http.post(`${this.apiUrl5}/${id}`, { subject, body });
  }
  
}
