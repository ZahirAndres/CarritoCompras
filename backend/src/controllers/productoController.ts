import { Request, Response } from "express";
import validator from "validator";
import model from "../models/productoModelo";

class ProductoController {

    public async list(req: Request, res: Response) {
        try {
            const productos = await model.list();
            return res.json({
                message: "Listado de productos",
                productos: productos,
                code: 200
            });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }

    public async add(req: Request, res: Response) {
        try {
            let { nombreProducto, imagen, idCategoria, descripcion, precio, cantidadProducto } = req.body;

            // Validaciones
            if (!nombreProducto || validator.isEmpty(nombreProducto)) {
                return res.status(400).json({ message: "El nombre es obligatorio", code: 1 });
            }
            if (!idCategoria || isNaN(idCategoria) || idCategoria <= 0) {
                return res.status(400).json({ message: "La categoría es obligatoria", code: 2 });
            }
            if (!precio || isNaN(precio) || precio <= 0) {
                return res.status(400).json({ message: "El precio debe ser un número válido", code: 3 });
            }
            if (!cantidadProducto || isNaN(cantidadProducto) || cantidadProducto < 0) {
                return res.status(400).json({ message: "El stock debe ser un número válido", code: 4 });
            }

            // Verificar si el producto ya existe
            const resultadoBusqueda = await model.getProductoByName(nombreProducto);
            if (resultadoBusqueda) {
                return res.status(400).json({ message: "El producto ya existe, ingrese otro nombre de producto", code: 5 });
            }

            var fechaCreacion = new Date();


            await model.add({ nombreProducto, imagen, idCategoria, descripcion, precio, cantidadProducto, fechaCreacion });

            return res.json({ message: "Producto agregado correctamente", code: 0 });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }

    public async update(req: Request, res: Response) {
        try {
            const { idProducto, nombreProducto, imagen, idCategoria, descripcion, precio, cantidadProducto } = req.body;

            if (!idProducto || isNaN(idProducto)) {
                return res.status(400).json({ message: "ID inválido", code: 6 });
            }
            if (!nombreProducto || validator.isEmpty(nombreProducto)) {
                return res.status(400).json({ message: "El nombre es obligatorio", code: 1 });
            }
            if (!idCategoria || isNaN(idCategoria) || idCategoria <= 0) {
                return res.status(400).json({ message: "La categoría es obligatoria", code: 2 });
            }
            if (!precio || isNaN(precio) || precio <= 0) {
                return res.status(400).json({ message: "El precio debe ser un número válido", code: 3 });
            }
            if (!cantidadProducto || isNaN(cantidadProducto) || cantidadProducto < 0) {
                return res.status(400).json({ message: "El stock debe ser un número válido", code: 4 });
            }


            // Verificar si el producto existe
            const productoExistente = await model.getById(idProducto);
            if (productoExistente.length === 0) {
                return res.status(404).json({ message: "El producto no existe", code: 7 });
            }

            if (productoExistente.nombreProducto == nombreProducto) {
                await model.update({ idProducto, imagen, nombreProducto, idCategoria, descripcion, precio, cantidadProducto });
                return res.json({ message: "Producto actualizado correctamente", code: 0 });
            } else {
                const resultadoBusqueda = await model.getProductoByName(nombreProducto);
                if (resultadoBusqueda) {
                    return res.status(400).json({ message: "El producto ya existe, ingrese otro nombre de producto", code: 5 });
                }

                await model.update({ idProducto, imagen, nombreProducto, idCategoria, descripcion, precio, cantidadProducto });
                return res.json({ message: "Producto actualizado correctamente", code: 0 });

            }

        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const { idProducto } = req.body;

            if (!idProducto || isNaN(idProducto)) {
                return res.status(400).json({ message: "ID inválido", idProducto });
            }

            // Verificar si el producto existe
            const productoExistente = await model.getById(idProducto);
            if (productoExistente.length === 0) {
                return res.status(404).json({ message: "El producto no existe", code: 7 });
            }
            await model.delete(idProducto);

            return res.json({ message: "Producto eliminado correctamente", code: 0 });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }

    public async buscarPorCategoria(req: Request, res: Response) {
        try {
            const { idCategoria } = req.params;
            if (!idCategoria || isNaN(idCategoria) || idCategoria <= 0) {
                return res.status(400).json({ message: "ID de categoría requerido", code: 1 });
            }
            const productos = await model.buscarPorCategoria(idCategoria);
            if (productos.length === 0) {
                return res.status(404).json({ message: "No hay productos en esta categoría", code: 2 });
            }
            return res.json({
                message: "Productos en la categoría",
                productos: productos,
                code: 200
            });

        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }

    public async buscarPorNombre(req: Request, res: Response) {
        try {
            const { nombreProducto } = req.params;
            if (!nombreProducto || validator.isEmpty(nombreProducto)) {
                return res.status(400).json({ message: "Nombre de producto requerido", code: 1 });
            }
            const productos = await model.buscarPorNombreProducto(nombreProducto);
            if (productos.length === 0) {
                return res.status(404).json({ message: "No hay productos con este nombre", code: 2 });
            }
            return res.json({
                message: "Productos con el nombre",
                productos: productos,
                code: 200
            });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }
}

export const productoController = new ProductoController();
