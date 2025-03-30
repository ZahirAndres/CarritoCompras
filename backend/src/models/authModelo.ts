import pool from '../config/connection';


class AuthModelo {

    /*
    *Método para buscar un usuario por username
    */
    public async getuserByEmail(email: string) {
        let query = "SELECT * FROM usuario WHERE correoElectronico='" + email + "'"
        const result = await pool.then(async (connection) => {
            return await connection.query(query);
        });
        return result;
    }

    public async geRolUsuario(email: string) {
        let query = "SELECT r.nombreRol FROM usuario u INNER JOIN rol r ON u.idRol = r.idRol WHERE u.correoElectronico='" + email + "'"
        const result = await pool.then(async (connection) => {
            return await connection.query(query);
        });
        return result;
    }
}
const model = new AuthModelo();
export default model;
