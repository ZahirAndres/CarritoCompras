import { Router } from "express";
import { carritoController } from "../controllers/carritoController";

class CarritoRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  private config(): void {
    this.router.get("/", carritoController.list);
    this.router.post("/", carritoController.add);
    this.router.put("/", carritoController.update);
    this.router.delete("/:idCarrito", carritoController.delete);
    this.router.get("/carritosPagados/:idUsuario", carritoController.obtenerCarritosPagados);
    this.router.get("/carritoActual/:idUsuario", carritoController.obtenerCarrito);

  }
}

const carritoRoutes = new CarritoRoutes();
export default carritoRoutes.router;