import { Request, Response } from "express";
import model from "../models/categoriaModelo";

class CategoriaController {
  
    public async list(req:Request, res: Response) {
        try {
            const categorias = await model.list();
            return res.json({
                message: "listado",
                categorias: categorias,
                code: 200
            });
        } catch (error: any) {
            return res.status(500).json({message: `${error.message}`});
        }
    }

    public async add (req:Request, res:Response) {
        try {
            let {nombreCategoria} = req.body;


            await model.add({nombreCategoria});

            return res.json({message: "categoria agregado", code:0});
        } catch (error: any) {
            return res.status(500).json({message: `${error.message}`});
        }
    }

    public async update(req: Request, res:Response) {
        try {
            const {nombreCategoria,idCategoria} = req.body;

            const categorias = await model.list();
            const categoriaExistente = categorias.some((categoria:any) => categoria.idCategoria === idCategoria);

            if (!categoriaExistente) {
                return res.status(404).json({ message: "categoria no encontrado"+ categoriaExistente, code: 3});
            }

            await model.update({nombreCategoria,idCategoria});

            return res.json({message: "categoria correctamente actualizado", code:0 });
        } catch (error: any) {
            return res.status(500).json({message: `${error.message}`});
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
