import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
    private url = "https://backendge.onrender.com"
              // private url = "http://localhost:8000"

  private apiUrl = `${this.url}/service/filter`; 
  private apiUrl1 = `${this.url}/service/create`; 
  private apiUrl2 = `${this.url}/service/getById/`; 
  private apiUrl3 = `${this.url}/service/updatewithoutPhotos/`; 
  private apiUrl4 = `${this.url}/service/deletePhoto/`; 
  private apiUrl5 = `${this.url}/service/addPhotos/`; 
  private apiUrl6 = `${this.url}/service/updateServicePhotos/`; 
  private apiUrl7 = `${this.url}/service/deleteService/`; 
  private apiUrl8 = `${this.url}/service/services`; 
  private apiUrl9 = `${this.url}/service/approovedService/`; 
  private apiUrl10 = `${this.url}/service/deleteService/`; 
  private apiUrl11 = `${this.url}/service/getServices`; 
  private apiUrl12 = `${this.url}/service/canceledService/`;
  private apiUrl13 = `${this.url}/service/disableService/`; 
  private apiUrl14 = `${this.url}/service/activateService/`; 


  constructor(private http: HttpClient) {}

  // getServicesByType(type: string, prixMin: number, prixMax: number, page: number = 1, limit: number = 15): Observable<any> {
  //   const params = new HttpParams()
  //   .set('type', type)
  //   .set('prixMin', prixMin.toString())
  //   .set('prixMax', prixMax.toString())
  //   .set('page', page.toString())
  //   .set('limit', limit.toString());
  
  //   return this.http.get<any>(this.apiUrl, { params });
  // }

  createService(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl1}`, formData, {
      headers: { 'Accept': 'application/json' } 
    });
  }
  deleteService(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl7}${id}`);
  }

  getServiceById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl2}${id}`);
}

updateService(id: String, formData: any): Observable<any> {

  const formDataWithFile = new FormData();
  formDataWithFile.append('nom', formData.nom);
  formDataWithFile.append('description', formData.description);
  formDataWithFile.append('prix', formData.prix.toString());
  formDataWithFile.append('promo', formData.promo.toString());
  if (formData.photoCouverture) {
    formDataWithFile.append('photoCouverture', formData.photoCouverture);
  }
 
  return this.http.put<any>(`${this.apiUrl3}${id}`, formDataWithFile );
}

deleteServicePhoto(serviceId: string, photoIndex: number): Observable<any> {
  return this.http.delete(`${this.apiUrl4}${serviceId}/${photoIndex}`);
}

addServicePhotos(serviceId: string, photos: File[]): Observable<any> {
  const formData = new FormData();
  photos.forEach(photo => {
    formData.append('Photos', photo);
  });
  return this.http.post(`${this.apiUrl5}${serviceId}`, formData);
}
replaceServicePhotos(serviceId: string, photos: File[]): Observable<any> {
  const formData = new FormData();
  photos.forEach(photo => {
    formData.append('Photos', photo);
  });
  return this.http.put(`${this.apiUrl6}${serviceId}`, formData);
}

getAllPres(): Observable<any> {
return this.http.get<any>(`${this.apiUrl8}`);
}
approveService(serviceId: string, approoved: boolean) {
  return this.http.put<any>(`${this.apiUrl9}${serviceId}`, {
    approoved: approoved
  });
}
deleteserviceById(id: string): Observable<any> {
  return this.http.delete<any>(`${this.apiUrl10}${id}`);
}

getServices(params: any): Observable<any> {
  let httpParams = new HttpParams();
  
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined) {
      const value = typeof params[key] === 'boolean' ? params[key].toString() : params[key];
      httpParams = httpParams.append(key, value);
    }
  });

  return this.http.get(this.apiUrl11, { params: httpParams }).pipe(
    catchError(error => {
      console.error('API Error:', error);
      return throwError(() => new Error('Service unavailable'));
    })
  );
}
getServicesByType(type: string): Observable<any> {
  const params = { type: type };
  return this.http.get(`${this.apiUrl}`, { params });
}
cancelService(serviceId: string): Observable<any> {
  return this.http.put(`${this.apiUrl12}${serviceId}`, {});
}
desabelService(id: string): Observable<any> {
  return this.http.put(`${this.apiUrl13}${id}`, {});
}
activateService(serviceId: string): Observable<any> {
  return this.http.put(`${this.apiUrl14}${serviceId}`, {});
}
}
