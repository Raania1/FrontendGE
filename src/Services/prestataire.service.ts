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
  private apiUrlA ='http://localhost:8000/prestataire/prestataires';
  private apiUrlN ='http://localhost:8000/prestataire/notProovided';
  private apiUrlP ='http://localhost:8000/prestataire/approovedPrestataire/';
  private apiUrlPS ='http://localhost:8000/prestataire/';

  private apiUrl2 ='http://localhost:8000/prestataire/changePass';


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

  deletePresById(id: string): Observable<any> {
    const token = localStorage.getItem('token');  
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.delete<any>(`${this.apiUrlS}${id}`, { headers });
  }
  getAllPres(): Observable<any> {
    const token = localStorage.getItem('token');  
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.get<any>(`${this.apiUrlA}`, { headers });
  }
  getAllPresN(): Observable<any> {
    const token = localStorage.getItem('token');  
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.get<any>(`${this.apiUrlN}`, { headers });
  }
  approoved(prestataireId: string,approoved: boolean): Observable<any> {
    const token = localStorage.getItem('token');  
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put<any>(`${this.apiUrlP}${prestataireId}`, {approoved},{ headers });
  }
  getServicePhotosByPrestataire(id: string) {
    return this.http.get<{ status: number; photos: string[] }>(`${this.apiUrlPS}/${id}/service-photos`);
  }

  // getAllPrestataires(travail: string = '', page: number = 1, limit: number = 6) {
  //   let query = `?page=${page}&limit=${limit}`;
  //   if (travail) query += `&travail=${encodeURIComponent(travail)}`;
  
  //   return this.http.get<any>(`http://localhost:8000/prestataire/presP${query}`);
  // }
  getAllPrestataires(
    travail: string = '', 
    nom: string = '', 
    prenom: string = '', 
    ville: string = '', 
    page: number = 1, 
    limit: number = 6
  ) {
    let query = `?page=${page}&limit=${limit}`;
    if (travail) query += `&travail=${encodeURIComponent(travail)}`;
    if (nom) query += `&nom=${encodeURIComponent(nom)}`;
    if (prenom) query += `&prenom=${encodeURIComponent(prenom)}`;
    if (ville) query += `&ville=${encodeURIComponent(ville)}`;
  
    return this.http.get<any>(`http://localhost:8000/prestataire/presP${query}`);
  }

  changePassword(id: string, data: any) {
    return this.http.put<any>(`${this.apiUrl2}/${id}`, data);
  }
  
}
