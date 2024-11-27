// src/server/socket.ts
import { Server } from "socket.io";
import http from "http"; // Para usar o servidor HTTP, se ainda não estiver configurado

let io: Server;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Ou o domínio do seu front-end, como "http://localhost:3000"
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log(`Novo cliente conectado: ${socket.id}`);

    socket.on("joinChat", (chatId: string) => {
      socket.join(chatId);
      console.log(`Usuário ${socket.id} entrou no chat ${chatId}`);
    });

    socket.on("sendMessage", (message) => {
      io.to(message.chatId).emit("newMessage", message);
    });

    socket.on("disconnect", () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });
};
