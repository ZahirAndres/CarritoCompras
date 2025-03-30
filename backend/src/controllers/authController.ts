import { Request, Response } from "express";
import validator from "validator";
import model from "../models/authModelo";
import { utils } from "../utils/utils";
import jwt from 'jsonwebtoken';
//import db from '../utils/database';
import dotenv from 'dotenv';

class AuthController {
  public async iniciarSesion(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (validator.isEmpty(email?.trim() || '') || validator.isEmpty(password?.trim() || '')) {
        return res.status(400).json({ message: "Los campos son requeridos", code: 1 });
      }
      
      const lstUsers = await model.getuserByEmail(email);
      if (lstUsers.length === 0) {
        return res.status(404).json({ message: "El usuario y/o contraseña es incorrecto", code: 1 });
      }

      const isValid = await utils.checkPassword(password, lstUsers[0].password);
      if (!isValid) {
        return res.status(401).json({ message: "Contraseña incorrecta", code: 1 });
      }

      const rolUsuario = await model.geRolUsuario(email);
      const nombreRol = rolUsuario.length > 0 ? rolUsuario[0].nombreRol : null;

      const newUser = {
        idUsuario: lstUsers[0].idUsuario,
        email: lstUsers[0].email,
        idRol: lstUsers[0].idRol
      };

      const token = jwt.sign(newUser, process.env.SECRET || 'default_secret', { expiresIn: '1h' });

      return res.json({ message: "Autenticación correcta", token, idUsuario: newUser.idUsuario, nombreRol, code: 0 });

    } catch (error: any) {
      return res.status(500).json({ message: `Error interno: ${error.message}` });
    }
  }


}

export const authController = new AuthController();
