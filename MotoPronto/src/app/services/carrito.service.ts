import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private apiUri = 'http://localhost:3000/carrito'; // Ajusta la URL según tu backend

  constructor(private http: HttpClient) { }

  // Obtener todos los carritos
  getCarritos(): Observable<any> {
    return this.http.get<{ message: string, carrito: any[], code: number }>(`${this.apiUri}/`);
  }

  // Obtener el carrito de un usuario específico
  obtenerCarrito(idUsuario: string): Observable<any> {
    return this.http.get<{ message: string, carritosPagados: any[], code: number }>(`${this.apiUri}/carritoActual/${idUsuario}`);
  }

  // Obtener carritos pagados de un usuario
  obtenerCarritosPagados(idUsuario: string): Observable<any> {
    return this.http.get<{ message: string, carritosPagados: any[], code: number }>(`${this.apiUri}/carritosPagados/${idUsuario}`);
  }

  // Agregar un nuevo carrito
  addCarrito(carrito: any): Observable<any> {
    return this.http.post(`${this.apiUri}/add`, carrito);
  }

  // Actualizar un carrito existente
  updateCarrito(carrito: any): Observable<any> {
    return this.http.put(`${this.apiUri}/update`, carrito);
  }

  // Eliminar un carrito por ID
  deleteCarrito(idCarrito: number): Observable<any> {
    return this.http.delete(`${this.apiUri}/delete/${idCarrito}`);
  }
}
