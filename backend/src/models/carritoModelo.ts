import pool from '../config/connection';

class CarritoModelo {
  public async list() {
    const result = await pool.then(async (connection) => {
      return await connection.query("SELECT * FROM carrito");
    });
    return result;
  }

  public async getById(id: number) {
    const result = await pool.then(async (connection) => {
      return await connection.query("SELECT * FROM carrito WHERE idCarrito = ?", [id]);
    });
    return result;
  }

  public async add(producto: any) {
      const result = await pool.then(async (connection) => {
        return await connection.query("INSERT INTO carrito SET ?", [producto]);
      });
      return result;
  }

  public async update(producto: any) {
    const result = await pool.then(async (connection) => {
      return await connection.query(
        "UPDATE carrito SET estatus=?, fechaPago=?, total=?, subTotal=?  WHERE idCarrito=?",
        [producto.estatus, producto.fechaPago, producto.total, producto.subTotal, producto.idCarrito]
      );
    });
    return result;
  }

  public async delete(id: number) {
    const result = await pool.then(async (connection) => {
      return await connection.query("DELETE FROM carrito WHERE idCarrito = ?", [id]);
    });
    return result;
  }

  public async obtenerCarritosPagados(idCarrito: number){
    const result = await pool.then(async (connection) => {
        return await connection.query("SELECT * FROM carrito WHERE idCarrito =? AND estatus = 'Pagado'", [idCarrito]);
    });
    return result;
  }

  public async obtenerCarrito(idCarrito: number){
    const result = await pool.then(async (connection) => {
        return await connection.query("SELECT * FROM carrito WHERE idCarrito =? AND estatus = 'Proceso' LIMIT 1", [idCarrito]);
    });
    return result;
  }
}

const carritoModelo = new CarritoModelo();
export default carritoModelo;