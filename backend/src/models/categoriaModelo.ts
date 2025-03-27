import pool from '../config/connection';


class CategoriaModelo {


    public async list() {
        const result = await pool.then( async (connection) => {
            return await connection.query(
                " SELECT c.* "
                + " FROM categoria c ")  });
        return result;
    }


    public async add(categoria: any) {
        const result = await pool.then( async (connection) => {
            return await connection.query(
                " INSERT INTO categoria SET ? ", [categoria]);
        });
        return result;
    }
   


    public async update(categoria: any) {
       const update = "UPDATE categoria SET nombreCategoria='" + categoria.nombreCategoria +
            "' where idCategoria='" + categoria.idCategoria + "'";
        console.log("Update  "+ update)
        const result = await pool.then( async (connection) => {
            return await connection.query(update)              
        });
        return result;
    }


    public async delete(idCategoria: number) {
        console.log('Eliminando');
        const result = await pool.then( async (connection) => {
            return await connection.query(
             "DELETE FROM categoria where idCategoria= ?", [idCategoria]
             );
        });
        return result;
    }
}
const model = new CategoriaModelo();
export default model;