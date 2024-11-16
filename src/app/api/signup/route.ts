// Importação das dependências necessárias
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import encryptPassword from "@/utils/encryptPassword";
import jwt from "jsonwebtoken"; // Biblioteca para gerar e verificar tokens JWT

// Função para a requisição POST
export async function POST(req: NextRequest) {
    const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret_key";
  
    const body = await req.json();
    const { username, password, type, name, email, profilePhoto } = body;
  
    try {
      // Criptografa a senha antes de salvar no banco
      const hashedPassword = await encryptPassword(password);
  
      // Cria um novo usuário no banco de dados
      const user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          type,
          name,
          email,
          profilePhoto,
        },
      });
  
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "7d", // O token vai expirar após 7 dias
      });
  
      await prisma.token.create({
        data: { token, userId: user.id },
      });
  
      // Remove a senha do objeto de resposta para segurança
      user.password = '';
  
      // Retorna os dados do novo usuário com status de sucesso
      const response = NextResponse.json(
        {
          status: "success",
          code: 201,
          message: "Usuário criado com sucesso",
          data: { user: user },
        },
        { status: 201 }
      );
  
      response.cookies.set("authToken", token, {
        httpOnly: true, // O cookie não pode ser acessado via JavaScript
        secure: process.env.NODE_ENV !== "development", // Em produção, o cookie será seguro (usando HTTPS)
        maxAge: 60 * 60 * 24 * 7, // Define o tempo de expiração do cookie para 7 dias
        path: "/", // O cookie estará disponível para todo o domínio
      });
  
      return response
    } catch (error) {
      // Em caso de erro, loga e retorna um erro genérico
      console.log(error);
      return NextResponse.json(
        {
          status: "error",
          code: 500,
          message: "Erro ao criar usuário",
        },
        { status: 500 }
      );
    }
  }