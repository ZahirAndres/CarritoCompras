import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../../models/producto';
import { ProductosService } from '../../../services/producto.service';
import { VerProductosComponent } from '../ver-productos/ver-productos.component';
import { CategoriaService } from '../../../services/categoria.service';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css']
})
export class CrearProductoComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() currentProducto: Producto = this.initProducto();
  productoForm: FormGroup;
  imagenPreview: string | null = null;
  mostrarPreview = false;
  submitAttempted = false;
  productoCreado = false;
  newProducto: Producto = this.initProducto();
  mensajeExitoso: string = "";

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

  categorias: any[] = [];
  errorMessage: string = '';


  constructor(private fb: FormBuilder, private productoService: ProductosService,
    private verProductos: VerProductosComponent, private categoriaService: CategoriaService
  ) {
    this.productoForm = this.fb.group({
      nombreProducto: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      cantidadProducto: ['', [Validators.required, Validators.min(0)]],
      idCategoria: ['', Validators.required],
      imagen: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.mensajeExitoso = "";
    if (this.currentProducto.idProducto !== 0) {
      // Si estamos editando un producto, setear los valores
      this.productoForm.setValue({
        nombreProducto: this.currentProducto.nombreProducto,
        precio: this.currentProducto.precio,
        cantidadProducto: this.currentProducto.cantidadProducto,
        idCategoria: this.currentProducto.idCategoria,
        imagen: this.currentProducto.imagen,
        descripcion: this.currentProducto.descripcion
      });
      this.imagenPreview = this.currentProducto.imagen;
      this.mostrarPreview = this.imagenPreview != null;
    }
    this.obtenerCategorias();
  }

  obtenerCategorias(): void {
    this.categoriaService.listarCategorias().subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.categorias = response.categorias;
        } else {
          this.errorMessage = 'Error al obtener categorías';
        }
      },
      error: (error) => {
        console.error('Error al obtener categorías:', error);
        this.errorMessage = 'No se pudo cargar la lista de categorías';
      }
    });
  }
  // Método para manejar la URL de la imagen
  onUrlImagenSeleccionada(event: any): void {
    const url = event.target.value;
    const regex = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,6}(\/[\w\.-]*)*\/?$/; // Regex para URL

    if (regex.test(url)) {
      this.imagenPreview = url;
      this.mostrarPreview = true;
    } else {
      this.imagenPreview = null;
      this.mostrarPreview = false;
      console.error('URL no válida');
    }
  }

  eliminarImagen(): void {
    this.productoForm.get('imagen')?.setValue('');
    this.mostrarPreview = false;
    this.imagenPreview = null;
  }

  guardarProducto(): void {
    this.submitAttempted = true;

    if (this.productoForm.valid) {
      const productoData: Producto = {
        idProducto: this.currentProducto.idProducto, // Usar el idProducto si es edición
        nombreProducto: this.productoForm.value.nombreProducto,
        imagen: this.productoForm.value.imagen,
        precio: this.productoForm.value.precio,
        cantidadProducto: this.productoForm.value.cantidadProducto,
        idCategoria: this.productoForm.value.idCategoria,
        descripcion: this.productoForm.value.descripcion,
        fechaCreacion: this.currentProducto.fechaCreacion // Mantener la fecha si estamos editando
      };

      if (productoData.idProducto === 0) {
        // Crear producto
        this.productoService.crearProductos(productoData).subscribe(
          (response) => {
            this.submitAttempted = false;
            this.productoCreado = true;
            this.newProducto = this.initProducto();
            this.mensajeExitoso = "Producto creado exitosamente";
            this.verProductos.cargarProductos();
            this.resetForm();

          },
          (error) => {
            console.error(error);
          }
        );
      } else {
        // Editar producto
        this.productoService.editarProductos(productoData).subscribe(
          (response) => {
            console.log('Producto editado correctamente');
            this.submitAttempted = false;
            this.productoCreado = true;
            this.newProducto = this.initProducto();
            this.mensajeExitoso = "Producto editado exitosamente";
            this.verProductos.cargarProductos();
          },
          (error) => {
            console.error(error);
          }
        );
      }
    }
  }


  resetForm(): void {
    this.productoForm.reset();
    this.submitAttempted = false;
    this.productoCreado = false;
    this.mostrarPreview = false;
    this.imagenPreview = null;
  }

  // Métodos de ayuda para validación
  campoInvalido(campo: string): boolean {
    return (this.productoForm.get(campo)?.invalid &&
      (this.productoForm.get(campo)?.touched || this.submitAttempted)) || false;
  }
}
