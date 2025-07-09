/*
===========================================================
MODELO DE MENSAJE - messageModel.js
===========================================================
Función principal:
Define cómo se estructura y almacena cada mensaje en la base de datos MongoDB

Este archivo usa Mongoose para crear un esquema (estructura) que describe los
campos que debe tener cada mensaje enviado en el chat.

Cada mensaje tendrá:
  .Nombre del usuario (username)
  .Contenido del mensaje (msg)
  .Fecha y hora en que fue enviado (timestamp)

Tecnología: Mongoose (ODM para MongoDB)
===========================================================
*/

/*Importa Mongoose, que permite definir esquemas para MongoDB*/
const mongoose = require('mongoose')

/*===========================================================
   Define el esquema del mensaje (estructura del documento)
===========================================================*/
const messageSchema = new mongoose.Schema({
  username: String,/*<= El nombre del usuario que envió el mensaje*/
  msg: String,/*<= El contenido del mensaje (texto)*/
  timestamp: {/*<=La fecha y hora en que se envió*/
    type: Date,
    default: Date.now // Si no se especifica, se coloca la hora actual automáticamente*/
  }
})

/*===========================================================
  Exporta el modelo de mensaje para usarlo en otras partes
===========================================================*/
/* Esto permite usar "Message" en otros archivos para crear, guardar o buscar mensajes*/
module.exports = mongoose.model('Message', messageSchema)
