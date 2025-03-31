import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl; 
  

  obtenerCarrito(idUsuario: number) {
    return this.http.get<any>(`${this.apiUrl}/carrito/carritoActual/${idUsuario}`);
  }

  crearOrden(total: number) {
    return this.http.post<{ id: string }>(`${this.apiUrl}/payment/create-order`, { amount: total });
  }

  capturarOrden(orderID: string) {
    return this.http.post(`${this.apiUrl}/payment/capture-order`, { orderID });
  }
}
