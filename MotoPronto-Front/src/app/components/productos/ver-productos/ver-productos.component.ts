import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../../services/productos/productos.service';
import { Producto } from '../../../models/producto';

@Component({
  selector: 'app-ver-productos',
  templateUrl: './ver-productos.component.html',
  styleUrls: ['./ver-productos.component.css'] // ✅ Corregido
})
export class VerProductosComponent implements OnInit {
  productos: Producto[] = [];
  currentProducto: Producto = this.initProducto();
  newProducto: Producto = this.initProducto();

  constructor(private productoService: ProductosService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  private initProducto(): Producto {
    return {
      idProducto: 0,
      nombreProducto: '',
      imagen: '',
      precio: 0,
      cantidadProducto: 0,
      idCategoria: 0,
      descripcion: ''
    };
  }

  cargarProductos(): void {
    this.productoService.getProductos().subscribe(
      (data) => {
        if (data && Array.isArray(data.productos)) {
          this.productos = [...data.productos]; 
          console.log("Productos Cargados Correctamente", this.productos);
        } else {
          console.error("Formato de datos incorrecto:", data);
        }
      },
      (error) => {
        console.error("Error al cargar los productos", error);
      }
    );
  }
}
