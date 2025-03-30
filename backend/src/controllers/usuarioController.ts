import { Request, Response } from "express";
import validator from "validator";
import model from "../models/usuarioModelo";
import { utils } from "../utils/utils";

class UsuarioController {


    object: any = {
        nombreUsuario: "",
        apellidoP: "",
        apellidoM: "",
        telefono: "",
        ciudad: "",
        codigoPostal: "",
        calleNumero: "",
        colonia: "",
        correoElectronico: "",
        password: "",
        idRol: 0,
    }

    public async list(req: Request, res: Response) {
        try {
            const usuarios = await model.list();
            return res.json({
                message: "listado",
                usuarios: usuarios,
                code: 200
            });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }

    public async listOne(req: Request, res: Response) {
      try {
        const { idUsuario } = req.params;
  
        if (!idUsuario) {
          return res.status(400).json({ message: "ID de usuario requerido", code: 1 });
        }
  
        const usuario = await model.listOne(idUsuario); 
  
        if (!usuario) {
          return res.status(404).json({ message: "Usuario no encontrado", code: 1 });
        }
  
        return res.json({
          message: "Usuario encontrado",
          usuario, // Se envía el objeto directamente
          code: 200,
        });
      } catch (error: any) {
        return res.status(500).json({ message: `${error.message}` });
      }
    }


    public async add(req: Request, res: Response) {
        try {
            let { email, password, role, nombreUsuario, apellidoP, apellidoM, telefono, ciudad, codigoPostal, calleNumero, colonia, avatar } = req.body;

            // Validación de email
            if (!email || !validator.isEmail(email)) {
                return res.status(400).json({ message: "Email inválido", code: 1 });
            }

            // Verificar si el usuario ya existe
            const usuarios = await model.list();
            const usuarioExistente = usuarios.some((usuario: any) => usuario.correoElectronico === email);
            if (usuarioExistente) {
                return res.status(400).json({ message: "Email en uso", code: 2 });
            }

            // Encriptar la contraseña
            const encryptedText = await utils.hashPassword(password);

            // Validar role (por si es nulo o no es un número)
            const idRol = Number(role) || 0;

            // Estructurar el objeto con los valores recibidos
            const newUser = {
                nombreUsuario: nombreUsuario || "",
                apellidoP: apellidoP || "",
                apellidoM: apellidoM || "",
                telefono: telefono || "",
                ciudad: ciudad || "",
                codigoPostal: codigoPostal || "",
                calleNumero: calleNumero || "",
                colonia: colonia || "",
                correoElectronico: email,
                password: encryptedText,
                idRol: idRol,
                avatar: avatar || "", 
            };

            // Guardar el usuario
            await model.add(newUser);

            return res.json({ message: "Usuario agregado", code: 0 });
        } catch (error: any) {
            return res.status(500).json({ message: `Error en el servidor: ${error.message}` });
        }
    }


    public async update(req: Request, res: Response) {
        try {
          let { 
            correoElectronico, 
            password, 
            role, 
            nombreUsuario, 
            apellidoP, 
            apellidoM, 
            telefono, 
            ciudad, 
            codigoPostal, 
            calleNumero, 
            colonia, 
            correoElectronicoC, 
            avatar
          } = req.body;
      
          // Validación de email
          if (!correoElectronicoC || !correoElectronico || !validator.isEmail(correoElectronicoC) ||  !validator.isEmail(correoElectronico)) {
            return res.status(400).json({ message: "Email inválido", code: 1 });
          }
      
          // Verificar si el usuario existe (buscamos el objeto completo)
          const usuarios = await model.list();
          const usuarioExistente = usuarios.find((usuario: any) => usuario.correoElectronico === correoElectronicoC);
      
          if (!usuarioExistente) {
            return res.status(404).json({ message: "Usuario no encontrado", code: 3 });
          }
      
          const idRol = role ? Number(role) : usuarioExistente.idRol;
      
          const updatedUser = {
            nombreUsuario: nombreUsuario || usuarioExistente.nombreUsuario,
            apellidoP: apellidoP || usuarioExistente.apellidoP,
            apellidoM: apellidoM || usuarioExistente.apellidoM,
            telefono: telefono || usuarioExistente.telefono,
            ciudad: ciudad || usuarioExistente.ciudad,
            codigoPostal: codigoPostal || usuarioExistente.codigoPostal,
            calleNumero: calleNumero || usuarioExistente.calleNumero,
            colonia: colonia || usuarioExistente.colonia,
            correoElectronico: correoElectronico || usuarioExistente.correoElectronico,
            password: usuarioExistente.password, // Mantener la contraseña anterior
            idRol: idRol,
            email: correoElectronicoC, // Este es el email que se va a actualizar,
            avatar: avatar || usuarioExistente.avatar,
          };
      
          // Actualizar el usuario
          await model.update(updatedUser);
      
          return res.status(200).json({ message: "Usuario actualizado correctamente", code: 0 });
        } catch (error: any) {
          return res.status(500).json({ message: `Error en el servidor: ${error.message}` });
        }
      }
      

      public async ascender(req: Request, res: Response) {
        try {
          let { 
            email
          } = req.body;
      
          // Validación de email
          if (!email || !validator.isEmail(email)) {
            return res.status(400).json({ message: "Email inválido", code: 1 });
          }
      
          // Verificar si el usuario existe (buscamos el objeto completo)
          const usuarios = await model.list();
          const usuarioExistente = usuarios.find((usuario: any) => usuario.correoElectronico === email);
      
          if (!usuarioExistente) {
            return res.status(404).json({ message: "Usuario no encontrado", code: 3 });
          }
      
     
      
          // Estructurar el objeto actualizado: si algún campo no se envía, se mantiene el valor anterior
          const updatedUser = {
            correoElectronico: email,
          };
      
          // Actualizar el usuario
          await model.update(updatedUser);
      
          return res.status(200).json({ message: "Usuario ascendido correctamente", code: 0 });
        } catch (error: any) {
          return res.status(500).json({ message: `Error en el servidor: ${error.message}` });
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
            const usuarioExistente = usuarios.some((usuario: any) => usuario.correoElectronico === email);

            if (!usuarioExistente) {
                return res.status(404).json({ message: "Usuario no encontrado", code: 3 });
            }
            var correoElectronico = email;
            // Realizar la eliminación
            await model.delete(correoElectronico);
            return res.json({ message: "Usuario eliminado correctamente", code: 0 });
        } catch (error: any) {
            return res.status(500).json({ message: `${error.message}` });
        }
    }

}
export const usuarioController = new UsuarioController();
