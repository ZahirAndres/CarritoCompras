import pool from '../config/connection';

class ProductoModelo {
  public async list() {
    const result = await pool.then(async (connection) => {
      return await connection.query("SELECT p.*, c.nombreCategoria FROM productos p INNER JOIN categoria c ON c.idCategoria = p.idCategoria");
    });
    return result;
  }

  public async getById(id: number) {
    const result = await pool.then(async (connection) => {
      return await connection.query("SELECT * FROM productos WHERE idProducto = ?", [id]);
    });
    return result;
  }

  public async add(producto: any) {
      const result = await pool.then(async (connection) => {
        return await connection.query("INSERT INTO productos SET ?", [producto]);
      });
      return result;
  }

  public async update(producto: any) {
    const result = await pool.then(async (connection) => {
      return await connection.query(
        "UPDATE productos SET nombreProducto=?, imagen = ?, idCategoria=?, descripcion=?, precio=?, cantidadProducto=? WHERE idProducto=?",
        [producto.nombreProducto, producto.imagen, producto.idCategoria, producto.descripcion, producto.precio, producto.cantidadProducto, producto.idProducto]
      );
    });
    return result;
  }

  public async delete(id: number) {
    const result = await pool.then(async (connection) => {
      return await connection.query("DELETE FROM productos WHERE idProducto = ?", [id]);
    });
    return result;
  }

  public async buscarPorCategoria(idCategoria: number){
    const result = await pool.then(async (connection) => {
      return await connection.query("SELECT p.*, c.nombreCategoria FROM productos p INNER JOIN categoria c ON c.idCategoria = p.idCategoria WHERE p.idCategoria =?", [idCategoria]);
    });
    return result;
  }

  public async buscarPorNombreProducto(nombreProducto: string) {
    const result = await pool.then(async (connection) => {
      return await connection.query(
        "SELECT p.*, c.nombreCategoria FROM productos p INNER JOIN categoria c ON c.idCategoria = p.idCategoria WHERE p.nombreProducto LIKE ?",
        [`%${nombreProducto}%`]  // Para permitir búsqueda parcial de productos
      );
    });
    return result;
  }
  
}

const model = new ProductoModelo();
export default model;