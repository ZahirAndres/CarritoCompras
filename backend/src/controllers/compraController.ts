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
            let precioCalculado = await model.obtenerProductoPrecio({ idProducto, cantidad });

            // Si no se encuentra un carrito con estatus "Proceso", creamos uno nuevo
            if (!carritoActual || carritoActual.length === 0) {
                const fechaCreacion = new Date();
                const estatus = "Proceso";
                const fechaPago = null;
                const subTotal = precioCalculado[0].subTotal;
                const total = subTotal * 1.16;

                // Crear un nuevo carrito
                await modeloCarrito.add({ estatus, fechaPago, fechaCreacion, idUsuario, total, subTotal });

                carritoActual = await modeloCarrito.obtenerCarrito(idUsuario);
            } else {
                // Si ya existe un carrito, actualizamos el subtotal
                const subtotalActual = carritoActual[0].subTotal;
                const nuevoSubtotal = subtotalActual + precioCalculado[0].subTotal;
                const total = nuevoSubtotal * 1.16;

                await modeloCarrito.updateSubtotal(carritoActual[0].idCarrito, nuevoSubtotal, total);
            }

            if (!carritoActual || carritoActual.length === 0) {
                return res.status(400).json({ message: "No se pudo obtener el carrito", code: 1 });
            }

            const idCarrito = carritoActual[0].idCarrito;
            const totalProducto = precioCalculado[0].subTotal;

            // Verificar si el producto ya está en el carrito
            const productoEnCarrito = await model.obtenerProductoEnCarrito(idCarrito, idProducto);

            if (!productoEnCarrito || productoEnCarrito.length === 0) {
                // Si no existe, agregar el producto al carrito
                await model.add({
                    idProducto,
                    idCarrito,
                    cantidad,
                    totalProducto
                });
            } else {
                // Si el producto ya existe en el carrito, actualizar la cantidad
                const nuevaCantidad = productoEnCarrito[0].cantidad + cantidad;
                const nuevoTotalProducto = productoEnCarrito[0].totalProducto + totalProducto;
                const idCompra = productoEnCarrito[0].idCompra;


                await model.actualizarCantidadProducto(idCompra, nuevaCantidad, nuevoTotalProducto);
            }

            return res.json({ message: "Compra agregada o actualizada", code: 0 });
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

    public async restarCantidadCompra(req: Request, res: Response) {
        try {
            const { idCompra, cantidad } = req.body;
    
            // Validar que cantidad sea un número válido y mayor a 0
            if (!Number.isInteger(cantidad) || cantidad <= 0) {
                return res.status(400).json({ message: "Cantidad inválida", code: 1 });
            }
    
            // Obtener la compra y el carrito al que pertenece
            const compra = await model.obtenerCompraById(idCompra);
            if (!compra || compra.length === 0) {
                return res.status(404).json({ message: "Compra no encontrada", code: 2 });
            }
    
            const { idProducto, idCarrito, cantidad: cantidadActual, totalProducto } = compra[0];
    
            // Verificar si la cantidad a restar es mayor que la cantidad actual
            if (cantidad > cantidadActual) {
                return res.status(400).json({ message: "No puedes restar más de lo que hay", code: 3 });
            }
    
            // Obtener el carrito actual
            const carritoActual = await modeloCarrito.obtenerCarritoById(idCarrito);
            if (!carritoActual || carritoActual.length === 0) {
                return res.status(404).json({ message: "Carrito no encontrado", code: 4 });
            }
    
            // Obtener el precio total a restar
            const precioCalculado = await model.obtenerProductoPrecio({ idProducto, cantidad });
            if (!precioCalculado || precioCalculado.length === 0) {
                return res.status(500).json({ message: "Error al calcular precio", code: 5 });
            }
    
            const totalProductoRestar = precioCalculado[0].subTotal;
    
            // Calcular la nueva cantidad y total del producto en la compra
            const nuevaCantidad = cantidadActual - cantidad;
            const nuevoTotalProducto = totalProducto - totalProductoRestar;
    
            // Calcular nuevo subtotal y total del carrito
            const nuevoSubtotal = carritoActual[0].subTotal - totalProductoRestar;
            const nuevoTotal = nuevoSubtotal * 1.16;
    
            // Si la nueva cantidad es 0, eliminar la compra
            if (nuevaCantidad <= 0) {
                await model.delete(idCompra);
            } else {
                await model.actualizarCantidadProducto(idCompra, nuevaCantidad, nuevoTotalProducto);
            }
    
            // Actualizar subtotal y total del carrito
            await modeloCarrito.updateSubtotal(idCarrito, nuevoSubtotal, nuevoTotal);
    
            // Respuesta de éxito
            return res.json({
                message: nuevaCantidad <= 0 ? "Producto eliminado del carrito" : "Cantidad actualizada",
                code: 0,
            });
    
        } catch (error: any) {
            console.error("Error al restar cantidad de compra:", error);
            return res.status(500).json({ message: `Error: ${error.message}`, code: 500 });
        }
    }
    

}
export const compraController = new CompraController();
