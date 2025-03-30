import pool from '../config/connection';


class UsuarioModelo {


    public async list() {
        const result = await pool.then(async (connection) => {
            return await connection.query(
                " SELECT u.* "
                + " FROM usuario u ")
        });
        return result;
    }

    public async listOne(usuario: any) {
        const result = await pool.then(async (connection) => {
            return await connection.query(
                " SELECT u.* "
                + " FROM usuario u WHERE u.idUsuario = ? ", [usuario]);
        });
              
        return result;
    }



    public async add(usuario: any) {
        const result = await pool.then(async (connection) => {
            return await connection.query(
                " INSERT INTO usuario SET ? ", [usuario]);
        });
        return result;
    }

    



    public async update(usuario: any) {
        const query = `
          UPDATE usuario SET 
            nombreUsuario = ?,
            apellidoP = ?,
            apellidoM = ?,
            telefono = ?,
            ciudad = ?,
            codigoPostal = ?,
            calleNumero = ?,
            colonia = ?,
            password = ?,
            idRol = ?,
            correoElectronico = ?
          WHERE correoElectronico = ?
        `;
        const values = [
            usuario.nombreUsuario,
            usuario.apellidoP,
            usuario.apellidoM,
            usuario.telefono,
            usuario.ciudad,
            usuario.codigoPostal,
            usuario.calleNumero,
            usuario.colonia,
            usuario.password,
            usuario.idRol,
            usuario.correoElectronico,
            usuario.email
        ];

        console.log("Ejecutando update:", query, values);
        const result = await pool.then(async (connection) => {
            return await connection.query(query, values);
        });
        return result;
    }


    public async ascender(usuario: any) {
        const update = "UPDATE usuario SET idRol='" + usuario.idRol +
            "' where correoElectronico='" + usuario.correoElectronico + "'";
        console.log("Update  " + update)
        const result = await pool.then(async (connection) => {
            return await connection.query(update)
        });
        return result;
    }



    public async delete(correoElectronico: string) {
        console.log('Eliminando');
        const result = await pool.then(async (connection) => {
 
            return await connection.query(
                "DELETE FROM usuario where correoElectronico= ?", [correoElectronico]
            );
               
        });
        return result;
    }

    public async getById(idUsuario: number) {
        const result = await pool.then(async (connection) => {
            return await connection.query("SELECT * FROM usuario WHERE idUsuario =?", [idUsuario]);
        });
        return result;
    }
}
const model = new UsuarioModelo();
export default model;