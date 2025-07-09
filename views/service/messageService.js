/* Servicio de mensajes (MessageService)*/
/*Encargado de guardar y obtener mensajes del chat desde la base de datos (archivo server.js).*/


const Message = require('../models/messageModel')/*<=Importa el modelo de mensaje para interactuar con la base de datos.*/

class MessageService {/*<=Clase que contiene métodos para manejar los mensajes (como obtenerlos o crearlos).*/
    constructor() {}/*<=Constructor vacío, por ahora no se necesita inicializar nada especial.*/

    async getAll() {/*<=Función asíncrona que obtiene todos los mensajes de la base de datos.*/
        const messages = await Message.find({})/*<=Busca todos los mensajes sin ningún filtro, osea, se trae todos los documentos.*/
        return messages/*<=Devuelve la lista de mensajes encontrados.*/
    }

    async create(msg) {/*<=Función asíncrona que se encarga de crear un nuevo mensaje y guardarlo en la base de datos, esperando a que todo termine antes de continuar.*/
        const message = new Message(msg) // Crea un nuevo objeto de mensaje usando los datos recibidos.
        return await message.save()/*<=Guarda ese mensaje en la base de datos y retorna o devuelve el resultado guardado.*/
    }
}

