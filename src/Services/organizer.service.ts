import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganizerService {

  private apiUrl = 'http://localhost:8000/organizer/getById/';  
  private apiUrl1 = 'http://localhost:8000/organizer/update/';  
  private apiUrlS = 'http://localhost:8000/organizer/deleteorganizer/';  
  private apiUrlA = 'http://localhost:8000/organizer/organizers';  
  private apiUrlP = 'http://localhost:8000/organizer/changePass';  

  constructor(private http: HttpClient) { }

  getOrganizerById(id: string): Observable<any> {
    const token = localStorage.getItem('token');  
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.get<any>(`${this.apiUrl}${id}`, { headers });
  }

  updateOrganizer(id: number, formData: any): Observable<any> {
    const formDataWithFile = new FormData();
    formDataWithFile.append('nom', formData.nom);
    formDataWithFile.append('prenom', formData.prenom);
    formDataWithFile.append('email', formData.email);
    formDataWithFile.append('numTel', formData.numTel);
    formDataWithFile.append('ville', formData.ville);
    formDataWithFile.append('adress', formData.adress);
    if (formData.pdProfile) {
      formDataWithFile.append('pdProfile', formData.pdProfile);
    }
    const token = localStorage.getItem('token');  
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put<any>(`${this.apiUrl1}${id}`, formDataWithFile ,  { headers });
  }

  deleteOrganizerById(id: string): Observable<any> {
    const token = localStorage.getItem('token');  
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.delete<any>(`${this.apiUrlS}${id}`, { headers });
  }
  getAllOrganizers(): Observable<any> {
    const token = localStorage.getItem('token');  
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.get<any>(`${this.apiUrlA}`, { headers });
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
  changePassword(id: string, data: any) {
    return this.http.put<any>(`${this.apiUrlP}/${id}`, data);
  }
}


