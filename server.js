/*
===========================================================
APLICACIÓN DE CHAT - SERVIDOR (server.js)
===========================================================
Funcionalidades principales:
Servidor web usando Express
Conexión en tiempo real con Socket.IO
Almacenamiento y recuperación de mensajes con MongoDB (Mongoose)
Historial persistente de los últimos 50 mensajes
Indicador de usuario escribiendo

Tecnologías: Node.js, Express, Socket.IO, Mongoose, EJS
===========================================================
*/

//  Importaciones necesarias para levantar el servidor y conectarse a la base de datos
const express = require('express') // Framework web
const http = require('http')/*<= Módulo para crear servidor HTTP*/
const socketIo = require('socket.io')/*<= Biblioteca para comunicación en tiempo real (WebSocket)*/
const mongoose = require('mongoose')/*<= ODM para MongoDB*/
const Message = require('./model/messageModel')/*<= Modelo de mensaje (definido con mongoose)*/

/*Inicializa la aplicación Express y configura el servidor*/
const app = express()
const server = http.createServer(app) /*<= Crea el servidor HTTP con Express*/
const io = socketIo(server)/*<= Inicializa Socket.IO sobre ese servidor*/

/*Conexión a la base de datos MongoDB*/
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))/*<= Confirmación exitosa*/
.catch(err => console.error(err))/*<= Muestra errores de conexión*/ 

/*Configuraciones de Express*/
app.set('view engine', 'ejs')/*<= Usa EJS como motor de plantillas para las vistas*/
app.use(express.static('public'))/*<= Sirve archivos estáticos desde la carpeta "public"*/
app.use(express.urlencoded({ extended: true }))/*<= Permite recibir datos de formularios*/

/*Ruta principal*/
app.get('/', (req, res) => {
    res.render('index')/*<= Renderiza la vista "index.ejs"*/
});

/*===========================================================
          Conexión en tiempo real con Socket.IO
===========================================================*/
io.on('connection', async (socket) => {
    console.log('Nuevo usuario conectado')

    try {
        /*Carga los últimos 50 mensajes del historial (ordenados por fecha ascendente)*/
        const messages = await Message.find().sort({ timestamp: 1 }).limit(50)
        socket.emit('load messages', messages)/*<= Envía el historial al cliente recién conectado*/
    } catch (error) {
        console.error('Error cargando mensajes:', error)
    }

    /*Escucha los mensajes enviados por el cliente*/
    socket.on('chat message', async (msg, username) => {
        try {
            /*Crea un nuevo mensaje con el nombre de usuario y el contenido*/
            const newMessage = new Message({
                username: username,
                msg: msg 
            });
            await newMessage.save()/*Guarda el mensaje en la base de datos*/
            console.log('Mensaje guardado en DB:', newMessage)

            io.emit('chat message', { msg, username })/*<= Reenvía el mensaje a todos los usuarios conectados*/
        } catch (error) {
            console.error('Error guardando mensajes:', error)
        }
    });

    /*Indicador de que un usuario está escribiendo*/
    socket.on('typing', (username) => {
        socket.broadcast.emit('typing', username)/*<= Notifica a los demás usuarios que alguien está escribiendo*/
    })

    /*Evento cuando un usuario se desconecta*/
    socket.on('disconnect', () => {
        console.log('Usuario desconectado')
    })
})

/*===========================================================
                Inicio del servidor
===========================================================*/
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
})

