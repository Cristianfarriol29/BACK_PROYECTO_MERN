import {
  obtenerProyectos,
  nuevoProyecto,
  obtenerProyecto,
  editarProyecto,
  eliminarProyecto,
  agregarColaborador,
  eliminarColaborador,
  obtenerTareas,
} from "../controllers/proyectoController.js";
import checkAuth from "../middleware/checkAuth.js";
import express, { application } from "express";

const router = express.Router();

router
  .route("/")
  .get(checkAuth, obtenerProyectos)
  .post(checkAuth, nuevoProyecto);
router
  .route("/:id")
  .get(checkAuth, obtenerProyecto)
  .put(checkAuth, editarProyecto)
  .delete(checkAuth, eliminarProyecto);

router.get("/tareas/:id", checkAuth, obtenerTareas);
router.post("/agregar-colaborador/:id", checkAuth, agregarColaborador);
router.post("/eliminar-colaborador/:id", checkAuth, eliminarColaborador);

export default router;
