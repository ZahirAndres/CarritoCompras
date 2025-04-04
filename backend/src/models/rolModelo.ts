import pool from '../config/connection';


class RolModelo {


    public async list() {
        const result = await pool.then( async (connection) => {
            return await connection.query(
                " SELECT c.* "
                + " FROM rol c ")  });
        return result;
    }


    public async add(rol: any) {
        const result = await pool.then( async (connection) => {
            return await connection.query(
                " INSERT INTO rol SET ? ", [rol]);
        });
        return result;
    }

    public async getRolByName(name: string){
        const result = await pool.then( async (connection) => {
            return await connection.query(
                " SELECT * FROM rol WHERE nombreRol=?", [name]
             );
        });
        return result[0];
    }
   


    public async update(rol: any) {
       const update = "UPDATE rol SET nombreRol='" + rol.nombreRol +
            "' where idRol='" + rol.idRol + "'";
        console.log("Update  "+ update)
        const result = await pool.then( async (connection) => {
            return await connection.query(update)              
        });
        return result;
    }


    public async delete(idRol: number) {
        console.log('Eliminando');
        const result = await pool.then( async (connection) => {
            return await connection.query(
             "DELETE FROM rol where idRol= ?", [idRol]
             );
        });
        return result;
    }
}
const model = new RolModelo();
export default model;