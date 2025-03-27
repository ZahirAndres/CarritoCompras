import { Request, Response } from "express";
import model from "../models/compraModelo";

class CompraController {
  
    public async list(req:Request, res: Response) {
        try {
            const compraes = await model.list();
            return res.json({
                message: "listado",
                compraes: compraes,
                code: 200
            });
        } catch (error: any) {
            return res.status(500).json({message: `${error.message}`});
        }
    }

    public async add (req:Request, res:Response) {
        try {
            let {idProducto, idCarrito, cantidad, totalProducto} = req.body;


            await model.add({idProducto, idCarrito, cantidad, totalProducto});

            return res.json({message: "compra agregado", code:0});
        } catch (error: any) {
            return res.status(500).json({message: `${error.message}`});
        }
    }

    public async update(req: Request, res:Response) {
        try {
            const {idProducto, idCarrito, cantidad, totalProducto, idCompra}  = req.body;

            const compraes = await model.list();
            const compraExistente = compraes.some((compra:any) => compra.idCompra === idCompra);

            if (!compraExistente) {
                return res.status(404).json({ message: "compra no encontrado"+ compraExistente, code: 3});
            }

            await model.update({idProducto, idCarrito, cantidad, totalProducto, idCompra});

            return res.json({message: "compra correctamente actualizado", code:0 });
        } catch (error: any) {
            return res.status(500).json({message: `${error.message}`});
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const { idCompra } = req.body;
      
            const compraes = await model.list();
            const compraExistente = compraes.some((compra: any) => compra.idCompra === idCompra);
      
            if (!compraExistente) {
                return res.status(404).json({ message: "Compra no encontrado", code: 3 });
            }
            await model.delete(idCompra);
            return res.json({ message: "compra eliminado correctamente", code: 0 });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
      }

}
export const compraController = new CompraController();
