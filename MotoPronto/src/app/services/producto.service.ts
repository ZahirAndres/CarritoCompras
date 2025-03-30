import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../enviroments/enviroments';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private apiUri = environment.apiUrl + '/productos';

  constructor(private http: HttpClient) { }

  getProductos(){
    return this.http.get<{ message: string, productos: any[], code: number }>(`${this.apiUri}`);
  }
  

  crearProductos(producto: any){
    return this.http.post<any[]>(`${this.apiUri}`, producto);
  }

  editarProductos(producto: any){
    return this.http.put<any[]>(`${this.apiUri}`, producto);
  }

  eliminarProductos(producto: any) {
    return this.http.delete<any[]>(`${this.apiUri}`, {
      headers: { 'Content-Type': 'application/json' },
      body: producto
    });
  }
  
}
