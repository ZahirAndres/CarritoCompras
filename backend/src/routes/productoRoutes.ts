import { Router } from "express";
import { productoController } from "../controllers/productoController";

class ProductoRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  private config(): void {
    this.router.get("/", productoController.list);
    this.router.post("/", productoController.add);
    this.router.put("/", productoController.update);
    this.router.delete("/", productoController.delete);
    this.router.get("/buscarCategoria/:idCategoria", productoController.buscarPorCategoria);
    this.router.get("/buscarNombre/:nombreProducto", productoController.buscarPorNombre);
  }
}

const productoRoutes = new ProductoRoutes();
export default productoRoutes.router;