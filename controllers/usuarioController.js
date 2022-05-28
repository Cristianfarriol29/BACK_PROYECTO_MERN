import Usuario from "../models/Usuario.js";
import generarID from "../helpers/generarID.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/emails.js";

const registrar = async (req, res) => {
  //EVITAR REGISTROS DUPLICADOS
  const { email } = req.body;
  const existeUsuario = await Usuario.findOne({ email });
  if (existeUsuario) {
    const error = new Error("Usuario ya registrado");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const usuario = new Usuario(req.body);
    usuario.token = generarID();
    await usuario.save();
    //Enviar el email de confirmacion
    emailRegistro({
      nombre: usuario.nombre,
      email: usuario.email,
      token: usuario.token,
    });
    res.json({
      msg: "Usuario creado correctamente, te hemos enviado un correo para confirmar tu cuenta",
    });
  } catch (error) {
    res.json(error);
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;
  //Comprobar si el usuario existe
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error("El usuario no existe");
    res.status(404).json({ msg: error.message });
  }
  //Comprobar si el usuario esta confirmado
  if (!usuario.confirmado) {
    const error = new Error("Tu cuenta no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }
  //Comprabar la contraseña
  if (await usuario.comprobarPassword(password)) {
    return res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id),
    });
  } else {
    const error = new Error("Password incorrecto");
    return res.status(403).json({ msg: error.message });
  }
};

const confirmar = async (req, res) => {
  const { token } = req.params;
  const usuarioConfirmar = await Usuario.findOne({ token });
  if (!usuarioConfirmar) {
    const error = new Error("Token no valido");
    return res.status(403).json({ msg: error.message });
  }

  try {
    usuarioConfirmar.confirmado = true;
    usuarioConfirmar.token = "";
    await usuarioConfirmar.save();
    res.json({ msg: "Usuario Confirmado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const olvidePassword = async (req, res) => {
  const { email } = req.body;
  //Comprobar si el usuario existe
  const usuario = await Usuario.findOne({ email });
  if (!usuario) {
    const error = new Error("El usuario no existe");
    res.status(404).json({ msg: error.message });
  }

  //En caso de que el usuario exista
  try {
    usuario.token = generarID();
    await usuario.save();
    emailOlvidePassword(usuario);
    res.json({ msg: "Hemos enviado con mail con las instrucciones" });
  } catch (error) {
    console.log(error);
  }
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const tokenValido = await Usuario.findOne({ token });
  if (tokenValido) {
    res.json({ msg: "Token valido" });
  } else {
    res.json({ msg: "Token no valido" });
  }
};

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const usuario = await Usuario.findOne({ token });
  if (usuario) {
    usuario.password = password;
    usuario.token = "";
    usuario.save();
    res.json({ msg: "Password actualizado correctamente" });
  } else {
    res.json({ msg: "Token no valido" });
  }
};

const perfil = async (req, res) => {
  const { usuario } = req;
  res.json(usuario);
};

export {
  registrar,
  autenticar,
  confirmar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  perfil,
};
