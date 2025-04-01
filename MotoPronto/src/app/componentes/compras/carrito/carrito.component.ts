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
          this.getArticulosCarrito(this.carritoActual.idCarrito); // Ahora usa el ID correcto
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

  getArticulosCarrito(idCarrito: number) {
    this.compraService.getArticulosCarrito(idCarrito).subscribe(
      (data) => {
        if (data && data.productosCarrito && data.productosCarrito.length > 0) {
          this.productosCarrito = data.productosCarrito;
          console.log(this.productosCarrito);
        } else {
          this.errorMessage = 'No hay productos en el carrito.';
        }
      },
      error => console.error('Error al obtener los productos del carrito:', error)
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
