import { verifyToken } from '@/lib/jwt';
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";

// Função para a requisição POST
export async function POST(req: NextRequest) {
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
    const userId = decoded?.userId;
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

    // Obtém o corpo da requisição
    const { postId, content } = await req.json();

    // Validação simples
    if (!postId || !content) {
      return NextResponse.json(
        {
          status: "error",
          code: 400,
          message: "Parâmetros 'postId' e 'content' são obrigatórios.",
        },
        { status: 400 }
      );
    }

    // Cria o novo comentário no banco de dados
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: userId,
      },
      include: {
        author: {
            select: {
                id: true,
                username: true,
                profilePhoto: true,
                name: true
            }
        }
      }
    });

    return NextResponse.json(
      {
        status: "success",
        code: 201,
        message: "Comentário criado com sucesso.",
        data: newComment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar comentário:", error);
    return NextResponse.json(
      {
        status: "error",
        code: 500,
        message: "Erro ao criar comentário.",
      },
      { status: 500 }
    );
  }
}
