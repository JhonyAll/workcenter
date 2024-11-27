// src/server/index.ts
import express from "express";
import http from "http";
import { initSocket } from "./socket"; // A função que inicializa o Socket.IO

const app = express();
const server = http.createServer(app);

initSocket(server);

server.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
