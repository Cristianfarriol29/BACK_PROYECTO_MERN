import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const checkAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //Separa a la cadena en dos partes desde el espacio, y en la posicion 1 se encuentra el token
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //El select "-password" se trae los datos excepto el pass para hacerlo
      //mas seguro
      req.usuario = await Usuario.findById(decoded.id).select(
        "-password -confirmado -createdAt -updatedAt -token -__v"
      );
      return next();
    } catch (error) {
      return res.status(404).json({ msg: "Hubo un error" });
    }
  }

  if (!token) {
    const error = new Error("Token no valido");
    return res.status(401).json({ msg: error.message });
  }
  next();
};

export default checkAuth;
