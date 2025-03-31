import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = environment.apiUrl+'/usuario'; 
  constructor(private http: HttpClient) { }

  // Obtener lista de usuarios
  getUsuarios(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // Obtener usuario por ID
  getUsuarioById(idUsuario: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${idUsuario}`);
  }

  // Agregar un nuevo usuario
  addUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, usuario);
  }

  // Actualizar un usuario
  updateUsuario(usuario: any): Observable<any> {
    return this.http.put(`${this.apiUrl}`, usuario);
  }

  // Eliminar un usuario
  deleteUsuario(email: string): Observable<any> {
    return this.http.request('delete', `${this.apiUrl}`, { body: { email } });
  }
}
