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
            let { nombre, categoria, descripcion, precio, stock } = req.body;
            
            // Validaciones
            if (!nombre || validator.isEmpty(nombre)) {
                return res.status(400).json({ message: "El nombre es obligatorio", code: 1 });
            }
            if (!categoria || isNaN(categoria) || categoria <= 0) {
                return res.status(400).json({ message: "La categoría es obligatoria", code: 2 });
            }
            if (!precio || isNaN(precio) || precio <= 0) {
                return res.status(400).json({ message: "El precio debe ser un número válido", code: 3 });
            }
            if (!stock || isNaN(stock) || stock < 0) {
                return res.status(400).json({ message: "El stock debe ser un número válido", code: 4 });
            }

            // Verificar si el producto ya existe
            const productos = await model.list();
            const productoExistente = productos.some((producto: any) => producto.nombreProducto === nombre && producto.idCategoria === categoria);

            if (productoExistente) {
                return res.status(400).json({ message: "El producto ya existe en esta categoría", code: 5 });
            }
            var nombreProducto = nombre;
            var idCategoria = Number(categoria);
            var cantidadProducto = Number(stock);
           
 
            await model.add({ nombreProducto, idCategoria, descripcion, precio, cantidadProducto });

            return res.json({ message: "Producto agregado correctamente", code: 0 });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }

    public async update(req: Request, res: Response) {
        try {
            const { id, nombre, categoria, descripcion, precio, stock } = req.body;

            if (!id || isNaN(id)) {
                return res.status(400).json({ message: "ID inválido", code: 6 });
            }   
            if (!nombre || validator.isEmpty(nombre)) {
                return res.status(400).json({ message: "El nombre es obligatorio", code: 1 });
            }
            if (!categoria || isNaN(categoria) || categoria <= 0) {
                return res.status(400).json({ message: "La categoría es obligatoria", code: 2 });
            }
            if (!precio || isNaN(precio) || precio <= 0) {
                return res.status(400).json({ message: "El precio debe ser un número válido", code: 3 });
            }
            if (!stock || isNaN(stock) || stock < 0) {
                return res.status(400).json({ message: "El stock debe ser un número válido", code: 4 });
            }

            var idProducto = id;
            // Verificar si el producto existe
            const productoExistente = await model.getById(idProducto);
            if (productoExistente.length === 0) {
                return res.status(404).json({ message: "El producto no existe", code: 7 });
            }
            var nombreProducto = nombre;
            var idCategoria = categoria;
            var cantidadProducto = Number(stock);

            await model.update({ idProducto, nombreProducto, idCategoria, descripcion, precio, cantidadProducto  });

            return res.json({ message: "Producto actualizado correctamente", code: 0 });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const { id } = req.body;

            if (!id || isNaN(id)) {
                return res.status(400).json({ message: "ID inválido", code: 6 });
            }

            var idProducto = id;
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
}

export const productoController = new ProductoController();
