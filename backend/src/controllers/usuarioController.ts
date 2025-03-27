import { Request, Response } from "express";
import validator from "validator";
import model from "../models/usuarioModelo";
import { utils } from "../utils/utils";

class UsuarioController {
  
    public async list(req:Request, res: Response) {
        try {
            const usuarios = await model.list();
            return res.json({
                message: "listado",
                usuarios: usuarios,
                code: 200
            });
        } catch (error: any) {
            return res.status(500).json({message: `${error.message}`});
        }
    }

    public async add (req:Request, res:Response) {
        try {
            let {email,password,role} = req.body;

            if (!email || !validator.isEmail(email)) {
                return res.status(400).json({message: "Email invalido", code: 1});
            }
            const usuarios = await model.list();
            const usuarioExistente = usuarios.some((usuario:any) => usuario.email === email);

            if (usuarioExistente) {
                return res.status(400).json({message: "email en uso", code: 2});
            }

            var encryptedText = await utils.hashPassword(password);
            password = encryptedText;

            await model.add({email,password,role});

            return res.json({message: "usuario agregado", code:0});
        } catch (error: any) {
            return res.status(500).json({message: `${error.message}`});
        }
    }

    public async update(req: Request, res:Response) {
        try {
            const {email,password} = req.body;

            if(!email || !validator.isEmail(email)) {
                return res.status(400).json({message: "email invalido", code:1});
            }
            const usuarios = await model.list();
            const usuarioExistente = usuarios.some((usuario:any) => usuario.email === email);

            if (!usuarioExistente) {
                return res.status(404).json({ message: "usuario no encontrado", code: 3});
            }

            var encryptedText = await utils.hashPassword(password);

            await model.update({email,password: encryptedText});

            return res.json({message: "usuario correctamente actualizado", code:0 });
        } catch (error: any) {
            return res.status(500).json({message: `${error.message}`});
        }
    }

    public async delete(req: Request, res: Response) {
        try {
            const { email } = req.body;
      
            // Validar que se haya proporcionado un email
            if (!email || !validator.isEmail(email)) {
                return res.status(400).json({ message: "Email inválido o requerido", code: 1 });
            }
      
            // Verificar si el usuario existe
            const usuarios = await model.list();
            const usuarioExistente = usuarios.some((usuario: any) => usuario.email === email);
      
            if (!usuarioExistente) {
                return res.status(404).json({ message: "Usuario no encontrado", code: 3 });
            }
      
            // Realizar la eliminación
            await model.delete(email);
            return res.json({ message: "Usuario eliminado correctamente", code: 0 });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
      }

}
export const usuarioController = new UsuarioController();
