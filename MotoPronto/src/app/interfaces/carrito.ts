export interface Carrito {
    id?: string;  
    estatus: string;
    fechaPago: Date;
    fechaCreacion: Date;
    total?: DoubleRange;
    subTotal?: DoubleRange;
    idUsuario: string;
  }
  