import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrestataireService {
      private url = "https://backendge.onrender.com"
  private apiUrl = `${this.url}/prestataire/getById/`;  
  private apiUrl1 = `${this.url}/prestataire/update/`;  
  private apiUrlS = `${this.url}/prestataire/deleteprestataire/`;  
  private apiUrlA =`${this.url}/prestataire/prestataires`;
  private apiUrlN =`${this.url}/prestataire/notProovided`;
  private apiUrlP =`${this.url}/prestataire/approovedPrestataire/`;
  private apiUrlPS =`${this.url}/prestataire/`;
  private apiUrlC =`${this.url}/prestataire/refusePrestataire/`;
  private apiUrlD =`${this.url}/prestataire/disablePrestataire/`;
  private apiUrlc =`${this.url}/prestataire/ActivPrestataire/`;
  private apiUrl3 =`${this.url}/pack/create`;
  private apiUrl4 =`${this.url}/pack/getById`;
    private apiUrl5 =`${this.url}/pack/update`;

  private apiUrl2 =`${this.url}/prestataire/changePass`;


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
  approoved(prestataireId: string): Observable<any> {
    const token = localStorage.getItem('token');  
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put<any>(`${this.apiUrlP}${prestataireId}`,{},{ headers });
  }
  disabl(prestataireId: string): Observable<any> {
    const token = localStorage.getItem('token');  
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put<any>(`${this.apiUrlD}${prestataireId}`,{},{ headers });
  }
  activate(prestataireId: string): Observable<any> {
    const token = localStorage.getItem('token');  
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put<any>(`${this.apiUrlc}${prestataireId}`,{},{ headers });
  }

  refusePrestataire(id: string): Observable<any> {
    const token = localStorage.getItem('token');  
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.delete(`${this.apiUrlC}${id}`,{ headers });
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
  createPack(formData: FormData) {
  return this.http.post(`${this.apiUrl3}`, formData);
}


getPackById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl4}/${id}`);
  }
updatePack(packId: string, packData: any, coverPhoto?: File): Observable<any> {
  const formData = new FormData();
  
  Object.keys(packData).forEach(key => {
    formData.append(key, packData[key]);
  });
  
  if (coverPhoto) {
    formData.append('coverPhotoUrl', coverPhoto);
  }

  return this.http.put(`${this.apiUrl5}/${packId}`, formData);
}
deleteServiceFromPack(serviceId: string): Observable<any> {
  return this.http.delete(`http://localhost:8000/pack/services/${serviceId}`);
}
addServiceToPack(packId: string, serviceData: { name: string, description: string }): Observable<any> {
  return this.http.post(`http://localhost:8000/pack/servicesAdd/${packId}`, serviceData);
}

}
