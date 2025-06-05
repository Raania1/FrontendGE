import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError, timeout } from 'rxjs';
import $ from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = "https://backendge.onrender.com"
              // private url = "http://localhost:8000"

  private apiUrlL = `${this.url}/user/auth/login`; 
  private apiUrl = `${this.url}/organizer/auth`; 
  private apiUrl1 = `${this.url}/prestataire/auth`; 
  private apiUrlF = `${this.url}/user/fogetpassword`; 
  private apiUrlR = `${this.url}/user/resetPasswor`; 


  constructor(private http: HttpClient) {}

 login(email: string, password: string): Observable<any> {
  const body = { email, password };
  return this.http.post(this.apiUrlL, body).pipe(
    timeout(300000), // Timeout de 5 minutes
    catchError(error => {
      if (error.name === 'TimeoutError') {
        console.error('La requête de login a expiré (5 minutes dépassées)');
      }
      return throwError(error);
    }),
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
    headers: { 
               'Accept': 'application/json' } 
  }).pipe(
    timeout(30000), // Timeout de 5 minutes
    catchError(error => {
      if (error.name === 'TimeoutError') {
        console.error('L\'enregistrement Organizer a expiré (5 minutes dépassées)');
      }
      return throwError(error);
    })
  );
}

registerPrestataire(formData: FormData): Observable<any> {
  return this.http.post(`${this.apiUrl1}/register`, formData, {
    headers: { 
      'Accept': 'application/json' } 
  }).pipe(
    timeout(30000), // Timeout de 5 minutes
    catchError(error => {
      if (error.name === 'TimeoutError') {
        console.error('L\'enregistrement Prestataire a expiré (5 minutes dépassées)');
      }
      return throwError(error);
    })
  );
}

  forgetPassword(email: string): Observable<any> {
    return this.http.post<any>(this.apiUrlF, { email });
  }

  resetPassword(id: string, token: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrlR}/${id}/${token}`, { password });
  }



  afficherAlertSuccess(message: string, alertId: string): void {
    this.showAlert(alertId, "alert-success", message, "bi bi-check2-circle", 1500);
  }

  afficherAlertWarning(message: string, alertId: string): void {
    this.showAlert(alertId, "alert-warning", message, "bi bi-exclamation-triangle", 1500);
  }

  afficherAlertFailure(message: string, alertId: string): void {
    this.showAlert(alertId, "alert-failure", message, "bi bi-x-circle-fill", 3000);
  }

  private showAlert(alertId: string, alertClass: string, message: string, icon: string, duration: number): void {
    const alertElement = document.getElementById(alertId);
    if (alertElement) {
      alertElement.innerHTML = `<i class="${icon}"></i> &nbsp;&nbsp;${message}`;
      $(alertElement).fadeIn(300);
      setTimeout(() => {
        $(alertElement).fadeOut(400);
      }, duration);
    }
  }
}
