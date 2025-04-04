import { Request, Response } from "express";
import model from "../models/categoriaModelo";

class CategoriaController {

    public async list(req: Request, res: Response) {
        try {
            const categorias = await model.list();
            return res.json({
                message: "listado",
                categorias: categorias,
                code: 200
            });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }

    public async add(req: Request, res: Response) {
        try {
            let { nombreCategoria } = req.body;

            if (!nombreCategoria || nombreCategoria.trim() === "") {
                return res.status(400).json({ message: "El nombre de la categoría es requerido", code: 2 });
            }

            const resultadoBusqueda = await model.getCategoriaByName(nombreCategoria);

            if (resultadoBusqueda) {
                return res.status(409).json({ message: "Ya existe una categoría con ese nombre", code: 1 });
            }

            await model.add({ nombreCategoria });

            return res.status(200).json({ message: "Categoría agregada correctamente", code: 0 });
        } catch (error: any) {
            console.error("Error en add:", error);
            return res.status(500).json({ message: "Error interno del servidor" });
        }
    }


    public async update(req: Request, res: Response) {
        try {
            const { nombreCategoria, idCategoria } = req.body;

            const categorias = await model.list();
            const categoriaExistente = categorias.some((categoria: any) => categoria.idCategoria === idCategoria);

            if (!categoriaExistente) {
                return res.status(404).json({ message: "categoria no encontrado" + categoriaExistente, code: 3 });
            }

            const resultadoBusqueda = await model.getCategoriaByName(nombreCategoria);

            if (resultadoBusqueda) {
                return res.status(409).json({ message: "Ya existe una categoría con ese nombre", code: 1 });
            }

            await model.update({ nombreCategoria, idCategoria });

            return res.json({ message: "categoria correctamente actualizado", code: 0 });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const { idCategoria } = req.body;

            const categorias = await model.list();
            const categoriaExistente = categorias.some((categoria: any) => categoria.idCategoria === idCategoria);

            if (!categoriaExistente) {
                return res.status(404).json({ message: "Categoria no encontrado", code: 3 });
            }
            await model.delete(idCategoria);
            return res.json({ message: "categoria eliminado correctamente", code: 0 });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }

}
export const categoriaController = new CategoriaController();
