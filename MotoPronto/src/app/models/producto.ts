export interface Producto {
    idProducto: number;
    nombreProducto: string;
    imagen: string;
    precio: number;
    cantidadProducto: number;
    idCategoria: number;
    descripcion: string;
    fechaCreacion: Date;
}

export interface Compra {
    idProducto: number;
    idUsuario: number
    cantidad: number;
}