import mysql from 'promise-mysql';


const pool = mysql.createPool({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'linux123',
    database: 'apliweb'
});
export default pool;
