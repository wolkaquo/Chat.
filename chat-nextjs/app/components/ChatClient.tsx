"use client";

import { useState, useEffect, useRef } from "react";
import usePartySocket from "partysocket/react";

type ChatMessage = {
  id: string;
  username: string;
  msg: string;
  timestamp: number;
};

export default function ChatClient() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Configurar conexión con PartyKit
  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST || "localhost:1999",
    room: "chatroom",
    party: "chatroom",
    onMessage(event) {
      const data = JSON.parse(event.data);

      if (data.type === "history") {
        // Cargar historial de mensajes
        setMessages(data.messages);
      } else if (data.type === "message") {
        // Nuevo mensaje recibido
        setMessages((prev) => [...prev, data.message]);
      } else if (data.type === "typing") {
        // Alguien está escribiendo
        setTypingUser(data.username);

        // Limpiar el indicador después de 1 segundo
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          setTypingUser("");
        }, 1000);
      }
    },
  });

  // Auto-scroll al nuevo mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Enviar mensaje
  const sendMessage = () => {
    if (!message.trim() || !username.trim()) return;

    socket.send(
      JSON.stringify({
        type: "message",
        username,
        msg: message,
      })
    );

    setMessage("");
  };

  // Manejar tecla Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    } else {
      // Enviar evento de escritura
      if (username.trim()) {
        socket.send(
          JSON.stringify({
            type: "typing",
            username,
          })
        );
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4">
      <div className="w-full max-w-2xl h-[600px] p-6 border-2 border-cyan-400 rounded-3xl bg-black shadow-[0_0_20px_rgba(0,255,255,0.5)] flex flex-col">

        {/* Header con input de nombre */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Tu nombre"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-cyan-400 bg-transparent text-cyan-400 placeholder-cyan-400/50 shadow-[0_0_8px_rgba(255,0,255,0.5)] focus:outline-none focus:shadow-[0_0_12px_rgba(0,255,255,0.8)] text-center font-medium"
          />
        </div>

        {/* Lista de mensajes */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2 scrollbar-thin scrollbar-thumb-cyan-400 scrollbar-track-transparent">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-transparent border-2 border-cyan-400 rounded-2xl px-4 py-3 shadow-[0_0_10px_rgba(0,255,255,0.5)] max-w-[80%] break-words"
            >
              <span className="text-cyan-400 font-medium">
                {msg.username}:{" "}
              </span>
              <span className="text-cyan-400">{msg.msg}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Indicador de escritura */}
        <div className="min-h-[28px] mb-2">
          {typingUser && (
            <p className="text-cyan-400 italic opacity-70 text-sm">
              {typingUser} está escribiendo...
            </p>
          )}
        </div>

        {/* Input de mensaje */}
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-cyan-400 bg-transparent text-cyan-400 placeholder-cyan-400/50 shadow-[0_0_8px_rgba(0,255,255,0.5)] focus:outline-none focus:shadow-[0_0_12px_rgba(0,255,255,0.8)]"
          />
          <button
            onClick={sendMessage}
            className="px-6 py-3 rounded-xl border-2 border-cyan-400 bg-transparent text-cyan-400 font-bold shadow-[0_0_8px_rgba(0,255,255,0.5)] hover:bg-cyan-400/10 transition-colors cursor-pointer [text-shadow:0_0_5px_rgba(0,255,255,1)]"
          >
            ENVIAR
          </button>
        </div>
      </div>
    </div>
  );
}
