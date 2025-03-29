import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private apiUrl = environment.apiUrl+'/rol/'; // Cambia la URL a la de tu backend

  constructor(private http: HttpClient) {}

  // Método para hacer un GET
  getData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/`);
  }

  // Método para hacer un POST
  postData(endpoint: string, body: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${endpoint}`, body);
  }

  // Método para hacer un PUT
  putData(endpoint: string, body: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${endpoint}`, body);
  }

  // Método para hacer un DELETE
  deleteData(endpoint: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${endpoint}`);
  }
}
