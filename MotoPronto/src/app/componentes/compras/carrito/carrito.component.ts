import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CarritoService } from '../../../services/carrito.service';
import { isPlatformBrowser } from '@angular/common';
import { Carrito, ProductoCarrito } from '../../../models/carrito';
import { CompraService } from '../../../services/compra.service';
import { Compra } from '../../../models/producto';
import { PaymentService } from '../../../services/payment.service';
import { loadScript } from '@paypal/paypal-js';

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
  cantidadProductos: number=0;

  productosCarrito: ProductoCarrito[] = [];

  errorMessage: string = '';

  constructor(
    private carritoService: CarritoService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private compraService: CompraService,
    private paymentService: PaymentService
  ) { }

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
          this.getArticulosCarrito(this.carritoActual.idCarrito); // Usa el ID del carrito obtenido
        } else {
          // Si no hay carrito activo, mostramos que está vacío
          this.errorMessage = 'El carrito está vacío';
        }
      },
      error: (error) => {
        console.error('Error al obtener el carrito:', error);
        // En lugar de mostrar un error, indicamos que el carrito está vacío
        this.errorMessage = 'El carrito está vacío';
      }
    });
  }
  

  getArticulosCarrito(idCarrito: number) {
    this.compraService.getArticulosCarrito(idCarrito).subscribe(
      (data) => {
        if (data && data.productosCarrito && data.productosCarrito.length > 0) {
          this.productosCarrito = data.productosCarrito;
          this.cantidadProductos = this.productosCarrito.length;
        } else {
          // Si no hay productos, mostramos que el carrito está vacío
          this.errorMessage = 'El carrito está vacío';
        }
      },
      (error) => {
        console.error('Error al obtener los productos del carrito:', error);
        // En caso de error, indicamos que el carrito está vacío
        this.errorMessage = 'El carrito está vacío';
      }
    );
  }
  
  procesarPago() { }

  continuarComprando() { }

  explorarProductos() { }

  eliminarProducto(productosCarrito: ProductoCarrito) {
    const compraResta = {
      idCompra: productosCarrito.idCompra,
      cantidad: productosCarrito.cantidadTotal
    };
 
    this.compraService.restarCantidadCompra(compraResta).subscribe(
      (data) => {
        if (data && (data.message === "Cantidad actualizada" || data.message === "Producto eliminado del carrito")) {
          console.log('Compra actualizada correctamente');
          this.getCarritoActual();

          // Si el producto fue eliminado, recargar el carrito
          this.getArticulosCarrito(this.carritoActual.idCarrito);
        } else {
          console.error('Error al actualizar la compra:', data.message);
        }
      },
      (error) => console.error('Error al actualizar la compra:', error)
    );
  }

  incrementarCantidad(productosCarrito: ProductoCarrito) {
    if (!this.carritoActual.idUsuario) {
      console.error('Error: No hay usuario autenticado para agregar productos al carrito.');
      return;
    }

    const compraData: Compra = {
      idProducto: productosCarrito.idProducto,
      idUsuario: this.carritoActual.idUsuario, // Asegurar que el idUsuario proviene del carrito actual
      cantidad: 1
    };

    this.compraService.add(compraData).subscribe({
      next: () => {
        this.getArticulosCarrito(this.carritoActual.idCarrito); // Refrescar el carrito
        this.getCarritoActual();
      },
      error: (error) => {
        console.error('Error al agregar el producto al carrito:', error);
        alert('Error al agregar el producto al carrito');
      }
    });
  }

  decrementarCantidad(idCompra: number) {
    const compraResta = {
      idCompra: idCompra,
      cantidad: 1
    };

    this.compraService.restarCantidadCompra(compraResta).subscribe(
      (data) => {
        if (data && (data.message === "Cantidad actualizada" || data.message === "Producto eliminado del carrito")) {
          console.log('Compra actualizada correctamente');
          this.getCarritoActual();

          // Si el producto fue eliminado, recargar el carrito
          this.getArticulosCarrito(this.carritoActual.idCarrito);
        } else {
          console.error('Error al actualizar la compra:', data.message);
        }
      },
      (error) => console.error('Error al actualizar la compra:', error)
    );
  } 

  
}
