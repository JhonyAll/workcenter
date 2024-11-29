import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

// Função para a requisição GET
export async function GET(req: NextRequest) {
  try {
    // Recupera o token do cookie
    const token = req.cookies.get("authToken")?.value;
    if (!token) {
      return NextResponse.json(
        {
          status: "error",
          code: 400,
          message: "Token de autenticação não encontrado.",
        },
        { status: 400 }
      );
    }

    // Valida o token e extrai o userId
    const decoded = verifyToken(token);
    const userId = decoded?.userId
    if (!userId) {
      return NextResponse.json(
        {
          status: "error",
          code: 401,
          message: "Token de autenticação inválido.",
        },
        { status: 401 }
      );
    }

    // Busca todos os posts do usuário autenticado
    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      include: {
        hashtags: true,
        author: {
          select: {
            id: true,
            username: true,
            profilePhoto: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                profilePhoto: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return NextResponse.json(
      {
        status: "success",
        code: 200,
        message: "Posts recuperados com sucesso.",
        data: posts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao recuperar posts:", error);

    return NextResponse.json(
      {
        status: "error",
        code: 500,
        message: "Erro ao recuperar posts.",
      },
      { status: 500 }
    );
  }
}
