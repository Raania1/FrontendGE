import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:8000/admin'; 

  constructor(private http: HttpClient) { }

  getAdminById(id: string): Observable<any> {
    const token = localStorage.getItem('token');  
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any>(`${this.apiUrl}/getById/${id}`,{ headers });
  }
  updateAdmin(id: string, formData: any): Observable<any> { 
   const token = localStorage.getItem('token');  
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, formData ,  { headers });
  }
}
