import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MessageService {
    private url = "https://backendge.onrender.com"
              // private url = "http://localhost:8000"

  private apiUrl = `${this.url}/message/create`;
  private apiUrl1 = `${this.url}/message/getAllPublic`;
  private apiUrl2 = `${this.url}/message/getAll`;
  private apiUrl3 = `${this.url}/message/delete`;
  private apiUrl4 = `${this.url}/message/update`;
  private apiUrl5 = `${this.url}/message/reply`;

  
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
