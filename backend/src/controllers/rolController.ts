import { Request, Response } from "express";
import model from "../models/rolModelo";

class RolController {

    public async list(req: Request, res: Response) {
        try {
            const roles = await model.list();
            return res.json({
                message: "listado",
                roles: roles,
                code: 200
            });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }

    public async add(req: Request, res: Response) {
        try {
            let { nombreRol } = req.body;

            if (!nombreRol) {
                return res.status(400).json({ message: "El nombre del rol es requerido", code: 2 });
            }

            const resultadoBusqueda = await model.getRolByName(nombreRol);

            if (resultadoBusqueda) {
                return res.status(409).json({ message: "El rol ya existe", code: 1 });
            }

            await model.add({ nombreRol });

            return res.json({ message: "Rol agregado correctamente", code: 0 });
        } catch (error: any) {
            console.error("Error en add:", error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }


    public async update(req: Request, res: Response) {
        try {
            const { nombreRol, idRol } = req.body;

            if (!idRol) {
                return res.status(400).json({ message: "El ID del rol es requerido", code: 4 });
            }

            if (!nombreRol) {
                return res.status(400).json({ message: "El nombre del rol es requerido", code: 2 });
            }

            const roles = await model.list();
            const rolExistente = roles.some((rol: any) => rol.idRol === idRol);

            if (!rolExistente) {
                return res.status(404).json({ message: "rol no encontrado" + rolExistente, code: 3 });
            }

            const resultadoBusqueda = await model.getRolByName(nombreRol);
            if (resultadoBusqueda) {
                return res.status(409).json({ message: "El rol ya existe", code: 1 });
            }

            await model.update({ nombreRol, idRol });

            return res.json({ message: "Rol actualizado correctamente", code: 0 });

        } catch (error: any) {
            console.error("Error en update:", error);
            return res.status(500).json({ message: "Error interno del servidor" });
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
