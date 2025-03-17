import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrlL = 'http://localhost:8000/user/auth/login'; 
  private apiUrl = 'http://localhost:8000/organizer/auth'; 
  private apiUrl1 = 'http://localhost:8000/prestataire/auth'; 


  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(this.apiUrlL, body).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      })
    );
  }
  registerOrganizer(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, formData, {
      headers: { 'Accept': 'application/json' } 
    });
  }

  registerPrestataire(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl1}/register`, formData, {
      headers: { 'Accept': 'application/json' } 
    });
  }
}
