import { Request, Response } from "express";
import model from "../models/rolModelo";

class RolController {
  
    public async list(req:Request, res: Response) {
        try {
            const roles = await model.list();
            return res.json({
                message: "listado",
                roles: roles,
                code: 200
            });
        } catch (error: any) {
            return res.status(500).json({message: `${error.message}`});
        }
    }

    public async add (req:Request, res:Response) {
        try {
            let {nombreRol} = req.body;


            await model.add({nombreRol});

            return res.json({message: "rol agregado", code:0});
        } catch (error: any) {
            return res.status(500).json({message: `${error.message}`});
        }
    }

    public async update(req: Request, res:Response) {
        try {
            const {nombreRol,idRol} = req.body;

            const roles = await model.list();
            const rolExistente = roles.some((rol:any) => rol.idRol === idRol);

            if (!rolExistente) {
                return res.status(404).json({ message: "rol no encontrado"+ rolExistente, code: 3});
            }

            await model.update({nombreRol,idRol});

            return res.json({message: "rol correctamente actualizado", code:0 });
        } catch (error: any) {
            return res.status(500).json({message: `${error.message}`});
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const { idRol } = req.body;
      
            const roles = await model.list();
            const rolExistente = roles.some((rol: any) => rol.idRol === idRol);
      
            if (!rolExistente) {
                return res.status(404).json({ message: "Rol no encontrado", code: 3 });
            }
            await model.delete(idRol);
            return res.json({ message: "rol eliminado correctamente", code: 0 });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
      }

}
export const rolController = new RolController();
