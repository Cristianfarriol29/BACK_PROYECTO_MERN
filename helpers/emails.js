import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
  const { email, token, nombre } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const informacionEmail = await transport.sendMail({
    from: "UpTask - Administrador de proyectos <administracion@uptask.com>",
    to: email,
    subject: "Confirma tu cuenta",
    text: "Solo queda un ultimo paso",
    html: `<p>¡Hola ${nombre}! termina de confirmar tu cuenta en UpTask </p>
      <p>¡Solo te queda un ultimo paso! Pincha en el enlace y termina de confirmar tu cuenta</p>

      <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a>

      <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
      `,
  });
};

const emailOlvidePassword = async (datos) => {
  const { email, token, nombre } = datos;

  //TODO: Mover hacia variables de entorno
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const informacionEmail = await transport.sendMail({
    from: "UpTask - Administrador de proyectos <administracion@uptask.com>",
    to: email,
    subject: "UpTask - Reestablece tu password",
    text: "Reestablece tu password",
    html: `<p>¡Hola ${nombre}! has solicitado reestablecer tu password </p>
      <p>Pincha el enlace para reestablecer tu contraseña</p>

      <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer contraseña</a>

      <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
      `,
  });
};

export { emailRegistro, emailOlvidePassword };
