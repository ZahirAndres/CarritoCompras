import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private apiUrl = environment.apiUrl + '/compra'; // Ajusta la URL según tu backend

  constructor(private http: HttpClient) { }

  // Obtener lista de compras
  list(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/`);
  }

  // Agregar una compra
  add(compra: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, compra);
  }

  // Actualizar una compra
  update(compra: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/`, compra);
  }

  // Eliminar una compra
  delete(idCompra: number): Observable<any> {
    return this.http.request<any>('delete', `${this.apiUrl}/`, { body: { idCompra } });
  }

  // Obtener artículos de un carrito
  getArticulosCarrito(idCarrito: number): Observable<any> {
    return this.http.get<{ message: string, productosCarrito: any[], code: number }>(`${this.apiUrl}/productosCarrito/${idCarrito}`);
  }

  restarCantidadCompra(compra:any){
    return this.http.post<any>(`${this.apiUrl}/restarCantidad`, compra);
  }
}
