import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const mongoDB = process.env.MONGO_DB;

const conectarDB = async () => {
  try {
    const connection = await mongoose.connect(mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const url = `${connection.connection.host}:${connection.connection.port}`;
    console.log(`MongoDB conectado en ${url}`);
  } catch (error) {
    console.log(`error:${error.message}`);
    process.exit(1);
  }
};

export default conectarDB;
