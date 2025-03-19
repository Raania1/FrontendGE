import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrestataireService {
  private apiUrl = 'http://localhost:8000/prestataire/getById/';  
  private apiUrl1 = 'http://localhost:8000/prestataire/update/';  
  private apiUrlS = 'http://localhost:8000/prestataire/deleteprestataire/';  


  constructor(private http: HttpClient) { }
  getPrestataireById(id: string): Observable<any> {
      const token = localStorage.getItem('token');  
      const headers = { Authorization: `Bearer ${token}` };
  
      return this.http.get<any>(`${this.apiUrl}${id}`, { headers });
  }

  updatePres(id: number, formData: any): Observable<any> {

    const formDataWithFile = new FormData();
    formDataWithFile.append('nom', formData.nom);
    formDataWithFile.append('prenom', formData.prenom);
    formDataWithFile.append('email', formData.email);
    formDataWithFile.append('travail', formData.travail);
    formDataWithFile.append('description', formData.description);
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

    return this.http.get<any>(`${this.apiUrlS}${id}`, { headers });
  }
}
