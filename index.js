import express from "express";
import cors from "cors";
import conectarDB from "./config/db.js";
import dotenv from "dotenv";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import proyectoRoutes from "./routes/proyectoRoutes.js";
import tareaRoutes from "./routes/tareaRoutes.js";

const app = express();

//Para habilitar el parseo a json de los datos
app.use(express.json());

conectarDB();

dotenv.config();

//Configurar CORS
const whiteList = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.includes(origin)) {
      //Puede consultar la api
      callback(null, true);
    } else {
      //No esta permitido su request
      callback(new Error("Error de CORS"));
    }
  },
};

const PORT = process.env.PORT || 4000;

//ROUTING
app.use(cors(corsOptions));
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/proyectos", proyectoRoutes);
app.use("/api/tareas", tareaRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
