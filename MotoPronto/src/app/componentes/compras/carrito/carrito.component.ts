import { Component, Inject, OnInit, PLATFORM_ID, ApplicationRef, NgZone } from '@angular/core';
import { CarritoService } from '../../../services/carrito.service';
import { isPlatformBrowser } from '@angular/common';
import { Carrito, ProductoCarrito } from '../../../models/carrito';
import { CompraService } from '../../../services/compra.service';
import { Compra } from '../../../models/producto';
import { PaymentService } from '../../../services/payment.service';
import { take, first } from 'rxjs/operators';

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
  cantidadProductos: number = 0;
  productosCarrito: ProductoCarrito[] = [];
  errorMessage: string = '';

  constructor(
    private carritoService: CarritoService,
    private appRef: ApplicationRef,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object,
    private compraService: CompraService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.getCarritoActual();
    });

    this.appRef.isStable.pipe(first((stable) => stable === true)).subscribe(() => {
      console.log('La aplicación está estable');
    });
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

    this.carritoService.obtenerCarrito(idUsuarioLocal).pipe(take(1)).subscribe({
      next: (data) => {
        if (data?.carritosPagados?.length > 0) {
          this.carritoActual = data.carritosPagados[0];
          this.getArticulosCarrito(this.carritoActual.idCarrito);
        } else {
          this.errorMessage = 'El carrito está vacío';
        }
      },
      error: (error) => {
        console.error('Error al obtener el carrito:', error);
        this.errorMessage = 'El carrito está vacío';
      }
    });
  }

  getArticulosCarrito(idCarrito: number) {
    this.compraService.getArticulosCarrito(idCarrito).pipe(take(1)).subscribe(
      (data) => {
        if (data?.productosCarrito?.length > 0) {
          this.productosCarrito = data.productosCarrito;
          this.cantidadProductos = this.productosCarrito.length;
        } else {
          this.errorMessage = 'El carrito está vacío';
        }
      },
      (error) => {
        console.error('Error al obtener los productos del carrito:', error);
        this.errorMessage = 'El carrito está vacío';
      }
    );
  }

  eliminarProducto(productosCarrito: ProductoCarrito) {
    const compraResta = {
      idCompra: productosCarrito.idCompra,
      cantidad: productosCarrito.cantidadTotal
    };

    this.compraService.restarCantidadCompra(compraResta).pipe(take(1)).subscribe(
      (data) => {
        if (data?.message === 'Cantidad actualizada' || data?.message === 'Producto eliminado del carrito') {
          console.log('Compra actualizada correctamente');
          this.getCarritoActual();
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
      idUsuario: this.carritoActual.idUsuario,
      cantidad: 1
    };

    this.compraService.add(compraData).pipe(take(1)).subscribe({
      next: () => {
        this.getArticulosCarrito(this.carritoActual.idCarrito);
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

    this.compraService.restarCantidadCompra(compraResta).pipe(take(1)).subscribe(
      (data) => {
        if (data?.message === 'Cantidad actualizada' || data?.message === 'Producto eliminado del carrito') {
          console.log('Compra actualizada correctamente');
          this.getCarritoActual();
          this.getArticulosCarrito(this.carritoActual.idCarrito);
        } else {
          console.error('Error al actualizar la compra:', data.message);
        }
      },
      (error) => console.error('Error al actualizar la compra:', error)
    );
  }
}
