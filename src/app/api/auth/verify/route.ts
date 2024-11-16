// src/app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt"; // Função para verificar o JWT
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  // Obtém o token do cookie
  const token = req.cookies.get("authToken")?.value;

  // Se não houver token, retorna erro de não autorizado
  if (!token) {
    return NextResponse.json(
      { status: "error", code: 401, message: "Token não encontrado", data: null },
      { status: 401 }
    );
  }

  // Tenta decodificar o token
  const decoded = verifyToken(token);

  // Se o token for inválido ou expirado
  if (!decoded) {
    return NextResponse.json(
      { status: "error", code: 401, message: "Token inválido ou expirado", data: null },
      { status: 401 }
    );
  }

  try {
    // Verifica se o token está registrado no banco de dados
    const dbToken = await prisma.token.findFirst({
      where: {
        userId: decoded.userId,
        token,
      },
    });

    if (!dbToken) {
      return NextResponse.json(
        { status: "error", code: 401, message: "Token não registrado", data: null },
        { status: 401 }
      );
    }

    // Busca os dados do usuário
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    
    // Se o usuário não for encontrado
    if (!user) {
      return NextResponse.json(
        { status: "error", code: 404, message: "Usuário não encontrado", data: null },
        { status: 404 }
      );
    }
    user.password = ''

    // Retorna os dados do usuário
    return NextResponse.json(
      { status: "success", code: 200, message: "Usuário autenticado", data: { user } },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { status: "error", code: 500, message: "Erro interno no servidor", data: null },
      { status: 500 }
    );
  }
}
