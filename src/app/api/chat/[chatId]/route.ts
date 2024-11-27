// Importação das dependências necessárias
import { verifyToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const { chatId } = await params;
  const token = req.cookies.get("authToken")?.value;
  const decoded = verifyToken(token || "");
  const userId = decoded?.userId;

  if (!userId) {
    return NextResponse.json(
      {
        status: "error",
        code: 400,
        message: "Usuário não autenticado.",
      },
      { status: 400 }
    );
  }

  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId, AND: { participants: { some: {id: userId}} } },
      include: {
        participants: {
          select: { id: true, username: true, profilePhoto: true },
        },
        messages: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            sender: {
              select: { id: true, username: true, profilePhoto: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!chat) {
      return NextResponse.json(
        {
          status: "error",
          code: 404,
          message: "Chat não encontrado.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        code: 200,
        message: "Chat recuperado com sucesso.",
        data: chat,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao recuperar o chat:", error);
    return NextResponse.json(
      {
        status: "error",
        code: 500,
        message: "Erro ao recuperar o chat.",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const { chatId } = await params;
  const token = req.cookies.get("authToken")?.value;
  const decoded = verifyToken(token || "");
  const userId = decoded?.userId;

  if (!userId) {
    return NextResponse.json(
      {
        status: "error",
        code: 400,
        message: "Usuário não autenticado.",
      },
      { status: 400 }
    );
  }

  // Obtendo o corpo da requisição (mensagem)
  const { content } = await req.json();

  // Validação para garantir que o conteúdo da mensagem foi enviado
  if (!content || content.trim().length === 0) {
    return NextResponse.json(
      {
        status: "error",
        code: 400,
        message: "Conteúdo da mensagem é obrigatório.",
      },
      { status: 400 }
    );
  }

  try {
    // Verificando se o chat existe e se o usuário está participando
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        participants: {
          select: { id: true },
        },
      },
    });

    if (!chat) {
      return NextResponse.json(
        {
          status: "error",
          code: 404,
          message: "Chat não encontrado.",
        },
        { status: 404 }
      );
    }

    // Verificar se o usuário é um dos participantes do chat
    const isParticipant = chat.participants.some((participant) => participant.id === userId);

    if (!isParticipant) {
      return NextResponse.json(
        {
          status: "error",
          code: 403,
          message: "Usuário não é um participante deste chat.",
        },
        { status: 403 }
      );
    }

    // Criar a nova mensagem e associar ao chat e ao usuário
    const message = await prisma.message.create({
      data: {
        content,
        senderId: userId,
        chatId,
      },
      include: {
        sender: {
            select: {
                name: true,
                username: true,
                profilePhoto: true,
                id: true
            }
        }
      }
    });

    return NextResponse.json(
      {
        status: "success",
        code: 200,
        message: "Mensagem enviada com sucesso.",
        data: message,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao enviar a mensagem:", error);
    return NextResponse.json(
      {
        status: "error",
        code: 500,
        message: "Erro ao enviar a mensagem.",
      },
      { status: 500 }
    );
  }
}

