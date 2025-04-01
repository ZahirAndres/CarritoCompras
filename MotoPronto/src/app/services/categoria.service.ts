import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = 'http://localhost:3000/categoria'; // Asegúrate de que esta URL coincida con tu backend

  constructor(private http: HttpClient) {}

  // Obtener todas las categorías
  listarCategorias(): Observable<any> {
    return this.http.get<{ message: string, categorias: any[], code: number }>(`${this.apiUrl}/`);
  }

  // Agregar una nueva categoría
  agregarCategoria(nombreCategoria: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, { nombreCategoria });
  }

  // Actualizar una categoría
  actualizarCategoria(idCategoria: number, nombreCategoria: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/`, { idCategoria, nombreCategoria });
  }

  // Eliminar una categoría
  eliminarCategoria(idCategoria: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/`, { body: { idCategoria } });
  }
}
