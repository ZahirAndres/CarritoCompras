import { Component, Inject, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { ProductosService } from '../../../services/producto.service';
import { Producto } from '../../../models/producto';
import { ActivatedRoute, Router } from '@angular/router';
import { CompraService } from '../../../services/compra.service';
import { CarritoService } from '../../../services/carrito.service';
import { isPlatformBrowser } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { UsuarioService } from '../../../services/usuario.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TerminosCondicionesComponent } from '../../terminos-condiciones/terminos-condiciones.component';

@Component({
  selector: 'app-ver-productos',
  templateUrl: './ver-productos.component.html',
  styleUrls: ['./ver-productos.component.css']
})

export class VerProductosComponent implements OnInit, OnDestroy {
  productos: Producto[] = [];
  currentProducto: Producto = this.initProducto();
  newProducto: Producto = this.initProducto();
  isAddDialogOpen: boolean = false;
  isEditDialogOpen: boolean = false;
  isProducto: boolean = false;
  mostrarDescripcionCompleta: boolean = false;
  cantidadProductos: number = 0;
  mostrarModalTerminos = false; 
  ref: DynamicDialogRef | undefined;

  // Subscriptions
  private cartUpdateSubscription?: Subscription;
  private loadingProducts: boolean = false;

  constructor(
    private productoService: ProductosService,
    private router: Router,
    private compraService: CompraService,
    private carritoService: CarritoService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService,
    private dialogService: DialogService ){}

  idRol: number = 0;
    // Variable para controlar la visibilidad del chat
    showChat: boolean = false;

  ngOnInit(): void {
    this.verificarTerminos();
    this.idRol = this.getIdRol();
    this.cargarProductos();
    // Iniciar el polling del carrito cada 30 segundos
    if (isPlatformBrowser(this.platformId)) {
      this.getCarritoActual(); // Cargar inmediatamente

      this.cartUpdateSubscription = interval(30000)
        .pipe(
          switchMap(() => {
            // Verificar si estamos en un navegador
            if (!isPlatformBrowser(this.platformId)) {
              return of(null);
            }

            const idUsuarioLocal = sessionStorage.getItem('idUsuario');
            if (!idUsuarioLocal) {
              console.warn('No hay usuario autenticado para actualizar el carrito');
              return of(null);
            }

            return this.carritoService.obtenerCarrito(idUsuarioLocal)
              .pipe(
                catchError(error => {
                  console.error('Error al actualizar el carrito:', error);
                  return of(null);
                })
              );
          })
        )
        .subscribe({
          next: (data) => {
            if (data && data.carritosPagados && data.carritosPagados.length > 0) {
              this.getArticulosCarrito(data.carritosPagados[0].idCarrito);
            }
          }
        });
    }

    this.activatedRoute.params.subscribe(params => {
      const idCategoria = params['idCategoria'];
      const nombreProducto = params['nombreProducto'];

      if (idCategoria) {
        this.cargarProductosPorCategoria(idCategoria);
      } else if (nombreProducto && nombreProducto.trim() !== '') {
        this.buscarProductoPorNombre(nombreProducto);
      } else {
        this.cargarProductos();
      }
    });
  }

  ngOnDestroy(): void {
    // Limpiar las suscripciones al destruir el componente
    if (this.cartUpdateSubscription) {
      this.cartUpdateSubscription.unsubscribe();
    }
  }

  getCarritoActual() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const idUsuarioLocal = sessionStorage.getItem('idUsuario');

    if (!idUsuarioLocal) {
      console.warn('No hay usuario autenticado');
      return;
    }

    this.carritoService.obtenerCarrito(idUsuarioLocal).subscribe({
      next: (data) => {
        if (data && data.carritosPagados && data.carritosPagados.length > 0) {
          this.getArticulosCarrito(data.carritosPagados[0].idCarrito);
        }
      },
      error: (error) => {
        console.error('Error al obtener el carrito:', error);
      }
    });
  }

  getArticulosCarrito(idCarrito: number) {
    this.compraService.getArticulosCarrito(idCarrito).subscribe(
      (data) => {
        if (data && data.productosCarrito && data.productosCarrito.length > 0) {
          this.cantidadProductos = data.productosCarrito.length;
        } else {
          this.cantidadProductos = 0;
        }
      },
      error => console.error('Error al obtener los productos del carrito:', error)
    );
  }

  private initProducto(): Producto {
    return {
      idProducto: 0,
      nombreProducto: '',
      imagen: '',
      precio: 0,
      cantidadProducto: 0,
      idCategoria: 0,
      descripcion: '',
      fechaCreacion: new Date(),
      nombreCategoria: ''
    };
  }

  cargarProductos() {
    if (this.loadingProducts) return;

    this.loadingProducts = true;
    this.productoService.getProductos().subscribe(
      (data) => {
        if (data && Array.isArray(data.productos)) {
          this.productos = [...data.productos];
        } else {
          console.error("Formato de datos incorrecto:", data);
        }
        this.loadingProducts = false;
      },
      (error) => {
        console.error("Error al cargar los productos", error);
        this.loadingProducts = false;
      }
    );
  }

  getDisponibilidadProducto(cantidad: number) {
    if (cantidad > 0) {
      return "Disponible";
    } else {
      return "Agotado";
    }
  }

  getEstadoProducto(fechaCreacion: any) {
    const hoy = new Date();
    const fecha = new Date(fechaCreacion); // Convertir a Date
    const diferenciaDias = Math.floor((hoy.getTime() - fecha.getTime()) / (1000 * 3600 * 24));
    return diferenciaDias < 30 ? "Nuevo" : "";
  }

  openAddDialog(): void {
    this.newProducto = this.initProducto();
    this.isAddDialogOpen = true;
  }

  closeAddDialog() {
    this.isAddDialogOpen = false;
    this.isEditDialogOpen = false;
    this.router.navigate(['/home']);
  }

  borrarProducto(idProducto: number): void {
    if (confirm('¿Está seguro que desea eliminar este producto?')) {
      const producto = {
        "idProducto": idProducto
      }

      this.productoService.eliminarProductos(producto).subscribe(
        () => {
          console.log("Producto borrado correctamente");
          this.cargarProductos();
        },
        (error) => {
          console.error("Error al borrar el producto", error);
        }
      );
    }
  }

  openEditDialog(producto: Producto): void {
    this.currentProducto = { ...producto };
    this.isEditDialogOpen = true;
  }

  openProductoDialog(producto: Producto): void {
    this.currentProducto = { ...producto };
    this.isProducto = true;
  }

  toggleDescripcion(): void {
    this.mostrarDescripcionCompleta = !this.mostrarDescripcionCompleta;
  }

  irACarritoCompras() {
    this.router.navigate(['carrito-compras']);
  }

  toggleChat(): void {
    this.showChat = !this.showChat;
  }

  getIdRol(): number {
    const idRolStr = sessionStorage.getItem('idRol');
    return idRolStr ? Number(idRolStr) : 0; // Si es null, asignamos 0
  }

  cargarProductosPorCategoria(idCategoria: number): void {
    this.productoService.buscarPorCategoria(idCategoria).subscribe(
      (data) => {
        if (data && Array.isArray(data.productos)) {
          this.productos = [...data.productos];
        } else {
          console.error("Formato de datos incorrecto:", data);
        }
      },
      (error) => {
        console.error("Error al cargar productos filtrados", error);
      }
    );
  }

  buscarProductoPorNombre(nombreProducto: string): void {
    this.productoService.buscarPorNombre(nombreProducto).subscribe(
      (data) => {
        if (data && Array.isArray(data.productos)) {
          this.productos = [...data.productos];
        } else {
          console.error("Formato de datos incorrecto:", data);
        }
      },
      (error) => {
        console.error("Error al buscar productos por nombre", error);
      }
    );
  }


  verificarTerminos() {
    const terminosAceptados = sessionStorage.getItem('terminos');

    if (terminosAceptados !== '1') {
      this.abrirModalTerminos();
    }
  }

  abrirModalTerminos() {
    this.ref = this.dialogService.open(TerminosCondicionesComponent, {
      header: 'Términos y Condiciones',
      width: '50%',
      closable: false
    });

    this.ref?.onClose.subscribe((aceptado: boolean) => {
      if (aceptado) {
        this.aceptarTerminos();
      }
    });
  }

  aceptarTerminos() {
    const email = sessionStorage.getItem('email');

    if (email) {
      this.usuarioService.aceptarTerminos({ correoElectronico: email }).subscribe(() => {
        sessionStorage.setItem('terminos', '1');
      });
    }
  }
}