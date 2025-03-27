import {Router, RouterOptions} from "express";
import { authController } from "../controllers/authController";
//import { authController } from "../controllers/auth.Controller";

class AuthRoutes {
    //objeto tipo router
    public router: Router;

    //inicializa
    constructor() {
       this.router = Router();
       this.config();
    }

    config() {
        this.router.post('/', authController.iniciarSesion);        
    }
}
const authRoutes = new AuthRoutes();
export default authRoutes.router;