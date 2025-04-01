import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { Compra, Producto } from '../../../models/producto';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CompraService } from '../../../services/compra.service';
import { VerProductosComponent } from '../ver-productos/ver-productos.component';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css']
})
export class DetalleProductoComponent implements OnInit {
  @Input() currentProducto: Producto = this.initProducto();
  @Output() close = new EventEmitter<void>();
  compraForm: FormGroup;
  cantidadProductoCompra: number = 1;

  mostrarDescripcionCompleta: boolean = false;
  descripcionEsLarga: boolean = false;

  constructor(private compraService: CompraService, private verProductos: VerProductosComponent,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.compraForm = new FormGroup({
      cantidadCompra: new FormControl(1, [Validators.required, Validators.min(1)])
    });
  }

  ngOnInit(): void {
    if (!this.currentProducto) {
      this.currentProducto = this.initProducto();
    }

    this.compraForm.patchValue({ cantidadCompra: 1 }); // Asegura que cantidad inicial es 1

    this.verProductos.cargarProductos();
    this.descripcionEsLarga = this.currentProducto.descripcion?.length > 150;
  }

  closeEditDialog(): void {
    this.verProductos.isProducto = false;
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
      nombreCategoria:''
    };
  }

  getDisponibilidadProducto(cantidad: number): string {
    return cantidad > 0 ? 'Disponible' : 'Agotado';
  }

  getEstadoProducto(fechaCreacion: any): string {
    if (!fechaCreacion) return '';
    const hoy = new Date();
    const fecha = new Date(fechaCreacion);
    if (isNaN(fecha.getTime())) return '';
    const diferenciaDias = Math.floor((hoy.getTime() - fecha.getTime()) / (1000 * 3600 * 24));
    return diferenciaDias < 30 ? 'Nuevo' : '';
  }

  agregarAlCarrito(): void {
    if (this.compraForm.invalid) return;
    if (!isPlatformBrowser(this.platformId)) {
      console.warn('Intentando acceder a sessionStorage en un entorno no navegador.');
      return;
    }

    const idUsuarioLocal = Number(sessionStorage.getItem('idUsuario'));

    const compraData: Compra = {
      idProducto: this.currentProducto.idProducto,
      idUsuario: idUsuarioLocal,
      cantidad: this.cantidadProductoCompra
    };

    this.compraService.add(compraData).subscribe({
      next: () => {alert('Producto agregado al carrito')
        this.verProductos.cargarProductos();
      },
      error: error => alert('Error al agregar el producto al carrito'),
      
      
    });

    this.cantidadProductoCompra = 1;
  }

  toggleDescripcion(): void {
    this.mostrarDescripcionCompleta = !this.mostrarDescripcionCompleta;
  }
}
