export interface Producto {
    idProducto: number;
    nombreProducto: string;
    imagen: string;
    precio: number;
    cantidadProducto: number;
    idCategoria: number;
    descripcion: string;
    fechaCreacion: Date;
    nombreCategoria?: string;
}

export interface Compra {
    idProducto: number;
    idUsuario: number
    cantidad: number;
}