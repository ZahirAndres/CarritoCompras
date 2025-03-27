import { Router } from "express";
import { rolController } from "../controllers/rolController";

class RolRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  private config(): void {
    this.router.get("/", rolController.list);
    this.router.post("/", rolController.add);
    this.router.put("/", rolController.update);
    this.router.delete("/", rolController.delete);
  }
}

const rolRoutes = new RolRoutes();
export default rolRoutes.router;