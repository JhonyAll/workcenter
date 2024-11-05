import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { usernameOrEmail, password } = body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          status: "error",
          code: 401,
          message: "Usuário não encontrado",
          data: null,
        },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        {
          status: "error",
          code: 401,
          message: "Senha incorreta",
          data: null,
        },
        { status: 401 }
      );
    }

    // Gera o token JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Armazena o novo token no banco de dados
    await prisma.token.create({
      data: { token, userId: user.id },
    });

    user.password = ''
    // Define o cookie com o token usando NextResponse
    const response = NextResponse.json(
      {
        status: "success",
        code: 200,
        message: "Login realizado com sucesso",
        data: { token: token, user: user },
      },
      { status: 200 }
    );
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        code: 500,
        message: "Erro interno no servidor",
        data: null,
      },
      { status: 500 }
    );
  }
}
