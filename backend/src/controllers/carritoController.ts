import { Request, Response } from "express";
import validator from "validator";
import model from "../models/carritoModelo";

class CarritoController {

    public async list(req: Request, res: Response) {
        try {
            const carrito = await model.list();
            return res.json({
                message: "Listado de carritos",
                carrito: carrito,
                code: 200
            });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }

    public async add(req: Request, res: Response) {
        try {
            let { estatus, fechaPago, fechaCreacion, total, subTotal, idUsuario } = req.body;

            // Validaciones
            if (!estatus || validator.isEmpty(estatus)) {
                return res.status(400).json({ message: "El estatus es obligatorio", code: 1 });
            }
            if (!total || isNaN(total) || total <= 0) {
                return res.status(400).json({ message: "La el total debe ser un número válido", code: 2 });
            }
            if (!subTotal || isNaN(subTotal) || subTotal <= 0) {
                return res.status(400).json({ message: "El subTotal debe ser un número válido", code: 3 });
            }
            if (!idUsuario || isNaN(idUsuario) || idUsuario < 0) {
                return res.status(400).json({ message: "El carrito debe pertenecer a un usuario, agrega su idUsuario", code: 4 });
            }

            fechaCreacion = new Date();
            const carritoActual = await model.obtenerCarrito(idUsuario);

            if (carritoActual.length === 0) {
                await model.add({ estatus, fechaPago, fechaCreacion, total, subTotal, idUsuario });

                return res.json({ message: "Carrito agregado correctamente", code: 0 });

            } else {
                return res.status(404).json({ message: "No puedes agregar otro carrito hasta que pagues el primero", code: 7 });
            }



        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }

    public async update(req: Request, res: Response) {
        try {
            let { idCarrito, estatus, fechaPago, total, subTotal } = req.body;

            if (!idCarrito || isNaN(idCarrito)) {
                return res.status(400).json({ message: "ID inválido", code: 6 });
            }
            if (!estatus || validator.isEmpty(estatus)) {
                return res.status(400).json({ message: "El estatus es obligatorio", code: 1 });
            }
            if (!total || isNaN(total) || total <= 0) {
                return res.status(400).json({ message: "La el total debe ser un número válido", code: 2 });
            }
            if (!subTotal || isNaN(subTotal) || subTotal <= 0) {
                return res.status(400).json({ message: "El subTotal debe ser un número válido", code: 3 });
            }

            if (fechaPago && !validator.isEmpty(fechaPago)) {
                fechaPago = new Date(fechaPago).toISOString().split('T')[0];
            } else {
                fechaPago = null;
            }
            await model.update({ idCarrito, estatus, fechaPago, total, subTotal });



            return res.json({ message: "Carrito actualizado correctamente", code: 0 });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }

    public async updateEstado(req: Request, res: Response) {
        try {
            let { idCarrito } = req.params;


            const fechaPago = new Date().toISOString().split('T')[0];

            await model.updateEstado({ idCarrito, fechaPago, estatus: "Pagado" });



            return res.json({ message: "Carrito actualizado correctamente", code: 0 });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            let { idCarrito } = req.params;

            if (!idCarrito || isNaN(idCarrito)) {
                return res.status(400).json({ message: "ID inválido", code: 6 });
            }

            const carritoExistente = await model.getById(idCarrito);
            if (carritoExistente.length === 0) {
                return res.status(404).json({ message: "El carrito no existe", code: 7 });
            }
            await model.delete(idCarrito);

            return res.json({ message: "Carrito eliminado correctamente", code: 0 });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }

    public async obtenerCarritosPagados(req: Request, res: Response) {
        try {
            let { idUsuario } = req.params;
            const carritosPagados = await model.obtenerCarritosPagados(idUsuario);

            if (carritosPagados.length === 0) {
                return res.status(404).json({ message: "No tiene carritos pagados", code: 7 });
            }

            return res.json({
                message: "Listado de carritos pagados",
                carritosPagados: carritosPagados,
                code: 200
            });

        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }


    public async obtenerCarrito(req: Request, res: Response) {
        try {
            let { idUsuario } = req.params;
            const carritoActual = await model.obtenerCarrito(idUsuario);

            if (carritoActual.length === 0) {
                return res.status(404).json({ message: "No tiene carritos pagados", code: 7 });
            }

            return res.json({
                message: "Listado de tu carrito actual",
                carritosPagados: carritoActual,
                code: 200
            });

        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }


}

export const carritoController = new CarritoController();
