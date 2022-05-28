import mongoose from "mongoose";

const proyectosSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      trim: true,
      required: true,
    },
    descripcion: {
      type: String,
      trim: true,
      required: true,
    },
    fechaEntrega: {
      type: Date,
      default: Date.now(),
    },
    cliente: {
      type: String,
      trim: true,
      required: true,
    },
    //Un creador y los colaboradores que se denotan serán varios por los corchetes
    creador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      colaboradores: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Usuario",
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Proyecto = mongoose.model("Proyecto", proyectosSchema);

export default Proyecto;
