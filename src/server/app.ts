import express from "express";
import http from "http";
import next from "next";
import { initSocket } from "./socket"; // Importando a configuração do Socket.IO
import { NextApiRequest, NextApiResponse } from "next"; // Importando os tipos corretos para Next.js

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    // Criar servidor HTTP
    const httpServer = http.createServer(server);

    // Inicializar o Socket.IO com o servidor HTTP
    const io = initSocket(httpServer);

    // Roteamento para Next.js
    server.all("*", (req: NextApiRequest, res: NextApiResponse) => {
        return handle(req, res);
    });

    // Rodando o servidor
    httpServer.listen(3000, (err?: any) => {
        if (err) throw err;
        console.log("> Ready on http://localhost:3000");
    });
});
