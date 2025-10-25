import type * as Party from "partykit/server";

// Tipos para los mensajes
type ChatMessage = {
  id: string;
  username: string;
  msg: string;
  timestamp: number;
};

type TypingEvent = {
  type: "typing";
  username: string;
};

type MessageEvent = {
  type: "message";
  username: string;
  msg: string;
};

type ClientMessage = TypingEvent | MessageEvent;

export default class ChatServer implements Party.Server {
  // Almacenamiento de mensajes en memoria
  messages: ChatMessage[] = [];

  constructor(readonly room: Party.Room) {}

  // Cuando un cliente se conecta
  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    console.log(
      `Cliente conectado: ${conn.id} desde ${
        ctx.request.cf?.country ?? "unknown"
      }`
    );

    // Cargar mensajes persistentes desde el almacenamiento de PartyKit
    const stored = await this.room.storage.get<ChatMessage[]>("messages");
    if (stored) {
      this.messages = stored;
    }

    // Enviar el historial de los últimos 50 mensajes al nuevo cliente
    conn.send(
      JSON.stringify({
        type: "history",
        messages: this.messages.slice(-50),
      })
    );
  }

  // Cuando se recibe un mensaje de un cliente
  async onMessage(message: string, sender: Party.Connection) {
    try {
      const data: ClientMessage = JSON.parse(message);

      if (data.type === "typing") {
        // Broadcast del evento de escritura a todos excepto al remitente
        this.room.broadcast(
          JSON.stringify({
            type: "typing",
            username: data.username,
          }),
          [sender.id]
        );
      } else if (data.type === "message") {
        // Crear nuevo mensaje
        const newMessage: ChatMessage = {
          id: crypto.randomUUID(),
          username: data.username,
          msg: data.msg,
          timestamp: Date.now(),
        };

        // Agregar a la lista de mensajes
        this.messages.push(newMessage);

        // Mantener solo los últimos 100 mensajes en memoria
        if (this.messages.length > 100) {
          this.messages = this.messages.slice(-100);
        }

        // Persistir en el almacenamiento de PartyKit
        await this.room.storage.put("messages", this.messages);

        // Broadcast del mensaje a todos los clientes conectados
        this.room.broadcast(
          JSON.stringify({
            type: "message",
            message: newMessage,
          })
        );
      }
    } catch (error) {
      console.error("Error procesando mensaje:", error);
    }
  }

  // Cuando un cliente se desconecta
  onClose(conn: Party.Connection) {
    console.log(`Cliente desconectado: ${conn.id}`);
  }
}

ChatServer satisfies Party.Worker;
