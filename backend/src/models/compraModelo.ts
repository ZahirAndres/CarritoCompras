import pool from '../config/connection';


class CompraModelo {
    
    public async list() {
        const result = await pool.then(async (connection) => {
            return await connection.query("SELECT c.* FROM compra c");
        });
        return result;
    }

    public async add(compra: any) {
        const connection = await (await pool).getConnection(); 

        try {
            await connection.beginTransaction();

            const [producto]: any[] = await connection.query(
                "SELECT cantidadProducto FROM productos WHERE idProducto = ?", [compra.idProducto]
            );

            if (producto.cantidadProducto < compra.cantidad) {
                throw new Error('No hay suficiente stock para completar la compra.');
            }
            const result = await connection.query("INSERT INTO compra SET ?", [compra]);

            const updateResult = await connection.query(
                "UPDATE productos SET cantidadProducto = cantidadProducto - ? WHERE idProducto = ?",
                [compra.cantidad, compra.idProducto]
            );

            await connection.commit();

            return result;
        } catch (error) {
            await connection.rollback();
            throw error; 
        } finally {
            connection.release();
        }
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
        const result = await pool.then(async (connection) => {
            return await connection.query(
                "DELETE FROM compra WHERE idCompra = ?", [idCompra]
            );
        });
        return result;
    }

    public async getArticulosCarritos(idCarrito: number) {
        const result = await pool.then(async (connection) => {
            return await connection.query(
                "SELECT c.idCarrito, p.nombreProducto, c.cantidad, c.totalProducto " +
                "FROM compra c " +
                "INNER JOIN productos p ON c.idProducto = p.idProducto " +
                "WHERE c.idCarrito = ?", [idCarrito]
            );
        });
        return result;
    }
}

const model = new CompraModelo();
export default model;
