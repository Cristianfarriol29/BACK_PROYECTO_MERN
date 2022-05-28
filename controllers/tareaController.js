import Tarea from "../models/Tarea.js";
import Proyecto from "../models/Proyecto.js";

const agregarTarea = async (req, res) => {
  const { proyecto } = req.body;
  const existeProyecto = await Proyecto.findById(
    req.body.proyecto.match(/^[0-9a-fA-F]{24}$/) && req.body.proyecto
  );
  if (!existeProyecto) {
    const error = new Error("No se ha encontrado el proyecto");
    return res.status(404).json({ msg: error.message });
  }

  if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("No tienes los permisos para añadir tareas");
    return res.status(404).json({ msg: error.message });
  }

  try {
    const tareaAlmacenada = await Tarea.create(req.body);
    res.json(tareaAlmacenada);
  } catch (error) {
    console.log(error);
  }
};

const obtenerTarea = async (req, res) => {
  const { id } = req.params;
  const tarea = await Tarea.findById(
    id.match(/^[0-9a-fA-F]{24}$/) && id
  ).populate("proyecto");

  if (!tarea) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Accion no valida");
    return res.status(403).json({ msg: error.message });
  }

  res.json(tarea);
};

const actualizarTarea = async (req, res) => {
  //Extraigo el ID
  const { id } = req.params;
  //Consulto en la base para saber si existe dicha tarea
  //El populate evita que deba hacer otra peticion, y añade al cuerpo del objeto, el objeto de proyecto, populandolo
  const tarea = await Tarea.findById(
    id.match(/^[0-9a-fA-F]{24}$/) && id
  ).populate("proyecto");

  //Si no se encuntra en la base
  if (!tarea) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  //Verifico si el creador y el que consulta son la misma persona
  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Accion no valida");
    return res.status(403).json({ msg: error.message });
  }

  tarea.nombre = req.body.nombre || tarea.nombre;
  tarea.descripcion = req.body.descripcion || tarea.descripcion;
  tarea.prioridad = req.body.prioridad || tarea.prioridad;
  tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

  try {
    const tareaAlmacenada = await tarea.save();
    res.json(tareaAlmacenada);
  } catch (error) {
    console.log(error);
  }
};

const eliminarTarea = async (req, res) => {
  //Extraigo el ID
  const { id } = req.params;
  //Consulto en la base para saber si existe dicha tarea
  const tarea = await Tarea.findById(
    id.match(/^[0-9a-fA-F]{24}$/) && id
  ).populate("proyecto");

  //Si no se encuntra en la base
  if (!tarea) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ msg: error.message });
  }

  //Verifico si el creador y el que consulta son la misma persona
  if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Accion no valida");
    return res.status(403).json({ msg: error.message });
  }

  try {
    await tarea.deleteOne();
    res.json({ msg: "Tarea eliminada" });
  } catch (error) {
    console.log(error);
  }
};

const cambiarEstado = async (req, res) => {};

export {
  agregarTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  cambiarEstado,
};
