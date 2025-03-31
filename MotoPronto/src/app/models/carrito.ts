export interface Carrito {
    idCarrito: number;
    estatus: string;
    fechaPago?: string;  // Puede ser opcional si aún no se ha pagado
    fechaCreacion: string;
    total: number;
    subTotal: number;
    idUsuario: number;
  }

  export interface ProductoCarrito {
    idCarrito: number;
    imagen: string;
    nombreProducto: string;
    cantidadTotal: number;
    totalProducto: number;
  }
  