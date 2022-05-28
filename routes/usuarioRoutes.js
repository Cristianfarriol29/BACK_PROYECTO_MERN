import express from "express";
import {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil,
} from "../controllers/usuarioController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

//AUTENTICACION, REGISTRO Y CONFIRMACION DE USUARIOS
router.post("/register", registrar); //Registra usuario
router.post("/login", autenticar); //Autentica usuario
router.get("/confirmar/:token", confirmar); //Crea un nuevo usuario
router.post("/olvide-password", olvidePassword); //Usuario postea mail y recibe token
// router.get("/olvide-password/:token", comprobarToken); //Usuario gestiona con token recibido
// router.post("/olvide-password/:token", nuevoPassword); //Usuario gestiona con token recibido
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);

router.get("/perfil", checkAuth, perfil);

export default router;
