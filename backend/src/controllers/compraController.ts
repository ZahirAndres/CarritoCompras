import { Request, Response } from "express";
import model from "../models/compraModelo";
import modeloCarrito from "../models/carritoModelo";

class CompraController {

    public async list(req: Request, res: Response) {
        try {
            const compraes = await model.list();
            return res.json({
                message: "listado",
                compraes: compraes,
                code: 200
            });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }

    public async add(req: Request, res: Response) {
        try {
            let { idProducto, idUsuario, cantidad } = req.body;
    
            // Obtener el carrito actual del usuario
            let carritoActual = await modeloCarrito.obtenerCarrito(idUsuario);
    
            // Si no se encuentra un carrito con estatus "Proceso", creamos uno nuevo
            if (!carritoActual || carritoActual.length === 0) {
                const fechaCreacion = new Date();
                const estatus = "Proceso";
                const fechaPago = null;
                const total = 0;
                const subTotal = 0;

    
                // Crear un nuevo carrito
                await modeloCarrito.add({ estatus, fechaPago, fechaCreacion, idUsuario, total, subTotal });
    
                carritoActual = await modeloCarrito.obtenerCarrito(idUsuario);
            }
    
            if (!carritoActual || carritoActual.length === 0) {
                return res.status(400).json({ message: "No se pudo obtener el carrito", code: 1 });
            }
    
            const idCarrito = carritoActual[0].idCarrito;
            let precio = await model.obtenerProductoPrecio({idProducto, cantidad});
            const totalProducto = precio[0].subTotal;
            await model.add({
                idProducto,
                idCarrito,
                cantidad,
                totalProducto
            });
    
            return res.json({ message: "Compra agregada", code: 0 });
        } catch (error: any) {
            console.error("Error al agregar al carrito:", error);
            return res.status(500).json({ message: `Error: ${error.message}`, code: 500 });
        }
    }
    
    public async update(req: Request, res: Response) {
        try {
            const { idProducto, idCarrito, cantidad, totalProducto, idCompra } = req.body;

            const compraes = await model.list();
            const compraExistente = compraes.some((compra: any) => compra.idCompra === idCompra);

            if (!compraExistente) {
                return res.status(404).json({ message: "compra no encontrado" + compraExistente, code: 3 });
            }

            await model.update({ idProducto, idCarrito, cantidad, totalProducto, idCompra });

            return res.json({ message: "compra correctamente actualizado", code: 0 });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
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

    public async getArticulosCarritos(req: Request, res: Response) {
        try {
            const { idCarrito } = req.params;
            const productosCarrito = await model.getArticulosCarritos(idCarrito);

            if (productosCarrito.length === 0) {
                return res.status(407).json({ message: "No hay productos en el carrito", code: 3 });
            }

            return res.json({
                message: "Artículos en el carrito",
                productosCarrito: productosCarrito,
                code: 200
            });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }

}
export const compraController = new CompraController();
