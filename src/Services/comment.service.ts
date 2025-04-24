import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:8000/comment/getById'; 
  private apiUrl1 = 'http://localhost:8000/comment/DeleteById/'; 

  constructor(private http: HttpClient) { }

  getCommentById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  deleteComment(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl1}${id}`);
  }
}
