import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private url = "https://backendge.onrender.com"
  private apiUrl = `${this.url}/comment/getById`; 
  private apiUrl1 = `${this.url}/comment/DeleteById/`; 
  private apiUrl2 = `${this.url}/comment/updateById/`; 
  private apiUrl3 = `${this.url}/comment/create`; 

  constructor(private http: HttpClient) { }
  createComment(content: string, organisateurid: string, prestataireid: string): Observable<any> {
    return this.http.post(this.apiUrl3, { content, organisateurid, prestataireid });
  }
  getCommentById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  deleteComment(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl1}${id}`);
  }
  updateComment(id: string, content: string) {
    return this.http.put(`${this.apiUrl2}${id}`, { content });
  }
}
