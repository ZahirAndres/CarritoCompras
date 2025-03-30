import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../../services/producto.service';
import { Producto } from '../../../models/producto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ver-productos',
  templateUrl: './ver-productos.component.html',
  styleUrls: ['./ver-productos.component.css']
})

export class VerProductosComponent implements OnInit {
  productos: Producto[] = [];
  currentProducto: Producto = this.initProducto();
  newProducto: Producto = this.initProducto();
  isAddDialogOpen: boolean = false;
  isEditDialogOpen: boolean = false;
  isProducto: boolean = false;
  mostrarDescripcionCompleta: boolean = false;
  descripcionEsLarga: boolean = false;


  constructor(private productoService: ProductosService, private router: Router) { }

  ngOnInit(): void {
    this.cargarProductos();
    this.descripcionEsLarga = this.currentProducto.descripcion?.length > 50;
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

  closeAddDialog(): void {
    this.isAddDialogOpen = false;
    this.cargarProductos();
  }

  borrarProducto(idProducto: number): void {
    const producto = {
      "idProducto": idProducto
    }

    console.log(producto);
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
  openEditDialog(producto: Producto): void {
    this.currentProducto = { ...producto };
    this.isEditDialogOpen = true;
  }

  openProductoDialog(producto: Producto): void {
    this.currentProducto = { ...producto };
    console.log(this.currentProducto);
    this.isProducto = true;
  }
  toggleDescripcion(): void {
    this.mostrarDescripcionCompleta = !this.mostrarDescripcionCompleta;
  }
  irACarritoCompras() {
    this.router.navigate(['carrito-compras']);
  }
}