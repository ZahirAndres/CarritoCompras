import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Compra, Producto } from '../../../models/producto';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CompraService } from '../../../services/compra.service';
import { VerProductosComponent } from '../ver-productos/ver-productos.component';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.css']
})
export class DetalleProductoComponent implements OnInit {
  @Input() currentProducto: Producto = this.initProducto();
  @Output() close = new EventEmitter<void>();
  compraForm: FormGroup;

  mostrarDescripcionCompleta: boolean = false;
  descripcionEsLarga: boolean = false;

  constructor(private compraService: CompraService, private verProductos: VerProductosComponent) {
    this.compraForm = new FormGroup({
      cantidadCompra: new FormControl(1, [Validators.required, Validators.min(1)])
    });
  }

  ngOnInit(): void {
    if (!this.currentProducto) {
      this.currentProducto = this.initProducto();
    }
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
      fechaCreacion: new Date()
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

    const cantidad = this.compraForm.value.cantidadCompra;
    const compraData: Compra = {
      idProducto: this.currentProducto.idProducto,
      idUsuario: 5,
      cantidad: cantidad,
      totalProducto: this.currentProducto.precio * cantidad
    };
    console.log(compraData);
    this.compraService.add(compraData).subscribe({
      next: () => alert('Producto agregado al carrito'),
      error: error => alert('Error al agregar el producto al carrito')
    });
  }

  toggleDescripcion(): void {
    this.mostrarDescripcionCompleta = !this.mostrarDescripcionCompleta;
  }
}
