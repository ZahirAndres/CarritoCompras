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
  }
}

const productoRoutes = new ProductoRoutes();
export default productoRoutes.router;