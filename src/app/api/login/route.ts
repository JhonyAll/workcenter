import { createToken } from "@/lib/jwt";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

// Instância do Prisma
const prisma = new PrismaClient();

// Função de login
export async function POST(req: NextRequest) {
  const { usernameOrEmail, password } = await req.json();

  try {
    // Busca o usuário pelo username ou email
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });

    // Retorna erro se o usuário não for encontrado
    if (!user) {
      return NextResponse.json(
        { status: "error", code: 401, message: "Usuário não encontrado", data: null },
        { status: 401 }
      );
    }

    // Verifica se a senha está correta
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { status: "error", code: 401, message: "Senha incorreta", data: null },
        { status: 401 }
      );
    }

    // Gera e armazena o token JWT
    const token = createToken(user.id);
    await prisma.token.create({ data: { token, userId: user.id } });

    // Limpa a senha do objeto user antes de retornar
    user.password = '';

    // Configura a resposta com o token e define o cookie
    const response = NextResponse.json(
      { status: "success", code: 200, message: "Login realizado com sucesso", data: { token, user } },
      { status: 200 }
    );
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    // Retorna erro 500 em caso de exceção
    console.log(error)
    return NextResponse.json(
      { status: "error", code: 500, message: "Erro interno no servidor", data: null },
      { status: 500 }
    );
  }
}
