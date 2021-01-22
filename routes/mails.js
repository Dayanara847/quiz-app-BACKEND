require("dotenv").config();
const express = require("express");
const sendMailRouter = express.Router();
const nodemailer = require("nodemailer");
const { User } = require("../models/index");
const FRONT_URL = process.env.FRONT_URL;

const transport = {
  service: "gmail",

  auth: {
    user: process.env.THE_EMAIL,
    pass: process.env.THE_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(transport);

// Para registro, cambio de password, promovido

sendMailRouter.post("/", (req, res) => {
  let text;
  let subject;
  let { user, type, quiz } = req.body;

  // Armar mail lindo del QUIZ, con info

  switch (type) {
    case "Welcome":
      subject = `Bienvenid@, ${user.firstName} a Quizapp`;
      text = "Te damos la bienvenida a Quizapp!";   // Activar la cuenta
      break;

    case "Accepted":
      subject = `Bienvenido al curso ${quiz}`;
      text = `Te informamos que tu inscripción al curso ${quiz} ya fue aceptada.`;
      break;

    case "Promote":
      subject = `${user.firstName} has sido promovido a Teacher`;
      text = "Te damos la bienvenida al equipo docente de Quizapp!";
      break;

    case "Dispatch":
      subject = `Inscripción al curso ${quiz}`;
      text = `Tu inscripción al curso ${quiz} ha sido enviada. Se te enviará una confirmación a este mismo mail.`;
      break;

    case "ResetPassword":
      const link = FRONT_URL + "resetpassword/" + user.resetPasswordToken;
      subject = "Recuperación de contraseña";
      text = `Para restrablecer la contraseña ingrese al siguiente link: ${link}.`;
/*       html = `${<a href="${link}">Restablecer contraseña</a>}`; */
      break;
  }

  let mail = {
    from: process.env.THE_EMAIL,
    to: user.email,
    subject,
    text,
  };
  transporter.sendMail(mail, (err, data) => {
    if (err) {
      console.log("NO se ha enviado el mail", err);
    } else {
      console.log("Se ha enviado el mail");
    }
  });
});

module.exports = sendMailRouter;
