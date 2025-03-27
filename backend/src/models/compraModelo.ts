import pool from '../config/connection';


class CompraModelo {


    public async list() {
        const result = await pool.then( async (connection) => {
            return await connection.query(
                " SELECT c.* "
                + " FROM compra c ")  });
        return result;
    }


    public async add(compra: any) {
        const result = await pool.then( async (connection) => {
            return await connection.query(
                " INSERT INTO compra SET ? ", [compra]);
        });
        return result;
    }
   


    public async update(compra: any) {
        const result = await pool.then(async (connection) => {
          return await connection.query(
            "UPDATE compra SET idProducto=?, idCarrito=?, cantidad=?, totalProducto=? WHERE idCompra=?",
            [compra.idProducto, compra.idCarrito, compra.cantidad, compra.totalProducto, compra.idCompra]
          );
        });
        return result;
      }

    public async delete(idCompra: number) {
        console.log('Eliminando');
        const result = await pool.then( async (connection) => {
            return await connection.query(
             "DELETE FROM compra where idCompra= ?", [idCompra]
             );
        });
        return result;
    }
}
const model = new CompraModelo();
export default model;