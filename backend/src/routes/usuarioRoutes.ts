import { Router } from "express";
import { usuarioController } from "../controllers/usuarioController";


class UsuarioRoutes {


    public router: Router;


    constructor() {
        this.router = Router();
        this.config();
    }


    private config() {
        this.router.get('/', usuarioController.list);        
        this.router.get('/one/:idUsuario', usuarioController.listOne);        
        this.router.post('/', usuarioController.add)
        this.router.put('/', usuarioController.update)
        this.router.delete('/', usuarioController.delete)
        this.router.get('/:idUsuario', usuarioController.listOne)
        this.router.put('/ascender', usuarioController.ascender)
        this.router.put('/aceptoTerminos', usuarioController.aceptoTerminos)
    }
}
const usuarioRoutes = new UsuarioRoutes();
export default usuarioRoutes.router;
