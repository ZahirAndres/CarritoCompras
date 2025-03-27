import { Router } from "express";
import { compraController } from "../controllers/compraController";

class CompraRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  private config(): void {
    this.router.get("/", compraController.list);
    this.router.post("/", compraController.add);
    this.router.put("/", compraController.update);
    this.router.delete("/", compraController.delete);
  }
}

const compraRoutes = new CompraRoutes();
export default compraRoutes.router;