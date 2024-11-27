import { verifyToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const token = req.cookies.get("authToken")?.value;
  const { user2Id } = body;

  if (!token) {
    return NextResponse.json(
      { status: "error", code: 401, message: "Token não fornecido." },
      { status: 401 }
    );
  }

  const decoded = verifyToken(token || "");
  const user1Id = decoded?.userId;

  if (!user1Id) {
    return NextResponse.json(
      { status: "error", code: 401, message: "Usuário não autenticado." },
      { status: 401 }
    );
  }

  try {
    // Verificar se já existe um chat entre os dois usuários
    let chat = await prisma.chat.findFirst({
      where: {
        participants: {
          some: { id: user1Id },
        },
        AND: {
          participants: {
            some: { id: user2Id },
          },
        },
      },
      include: {
        messages: true,
      },
    });

    // Criar o chat se não existir
    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          participants: {
            connect: [{ id: user1Id }, { id: user2Id }],
          },
        },
        include: {
          messages: true,
        },
      });
    }

    return NextResponse.json(
      {
        status: "success",
        code: 200,
        message: "Chat encontrado ou criado com sucesso.",
        data: { chatId: chat.id },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao criar/verificar chat:", error);
    return NextResponse.json(
      {
        status: "error",
        code: 500,
        message: "Erro interno ao criar/verificar chat.",
      },
      { status: 500 }
    );
  }
}
