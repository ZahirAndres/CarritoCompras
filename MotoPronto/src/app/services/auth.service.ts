import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/auth';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiUrl;

  constructor(private http:HttpClient) { }

  registerUser(usuario: User) {
    return this.http.post(`${this.baseUrl}/usuario`, usuario);
  }

  /*
  *Extrae los registros en base al Email
  */
  getUserByEmail(email:string):Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/usuario`);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/`, { email, password });
  }
}
