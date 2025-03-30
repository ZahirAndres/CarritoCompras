import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CarritoService } from '../../../services/carrito.service';
import { isPlatformBrowser } from '@angular/common';
import { Carrito } from '../../../models/carrito';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  carritoActual: Carrito = {
    idCarrito: 0,
    estatus: '',
    fechaPago: '',
    fechaCreacion: '',
    total: 0,
    subTotal: 0,
    idUsuario: 0
  };
  

  errorMessage: string = '';

  constructor(
    private carritoService: CarritoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.getCarritoActual();
  }

  getCarritoActual(): void {
    if (!isPlatformBrowser(this.platformId)) {
      console.warn('Intentando acceder a sessionStorage en un entorno no navegador.');
      return;
    }

    const idUsuarioLocal = sessionStorage.getItem('idUsuario');

    if (!idUsuarioLocal) {
      console.error('No hay usuario autenticado');
      this.errorMessage = 'No hay usuario autenticado';
      return;
    }

    this.carritoService.obtenerCarrito(idUsuarioLocal).subscribe({
      next: (data) => {
        if (data && data.carritosPagados && data.carritosPagados.length > 0) {
          this.carritoActual = data.carritosPagados[0]; 
          console.log('Prueba de que se ve en consola',this.carritoActual);
        } else {
     
          this.errorMessage = 'No hay un carrito activo para mostrar.';
        }
      },
      error: (error) => {
        console.error('Error al obtener el carrito:', error);
        this.errorMessage = 'Ocurrió un error al obtener los datos del carrito.';
      }
    });
  }
}
