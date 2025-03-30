import { Injectable } from '@angular/core';
import { environment } from '../enviroments/enviroments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUri = environment.apiUrl + '/usuario';

  constructor(private http: HttpClient) { }

  getUsuario(){
    return this.http.get<{ message: string, usuario: any[], code: number }>(`${this.apiUri}`);
  }
  
  getOnlyUsuario(idUsuario: string): Observable<{ message: string, usuario: any, code: number }> {
    return this.http.get<{ message: string, usuario: any, code: number }>(
      `${this.apiUri}/one/${idUsuario}`
    );
}

  crearUsuario(usuario: any){
    return this.http.post<any[]>(`${this.apiUri}`, usuario);
  }

  editarUsuario(usuario: any) {
    return this.http.put<any>(`${this.apiUri}`, usuario);
  }
  

  eliminarUsuario(usuario: any) {
    return this.http.delete<any[]>(`${this.apiUri}`, {
      headers: { 'Content-Type': 'application/json' },
      body: usuario
    });
  }
}
