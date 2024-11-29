// Importação das dependências necessárias
import { verifyToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import encryptPassword from "@/utils/encryptPassword";
import { NextResponse, NextRequest } from "next/server";

// Função para a requisição GET, buscando um usuário específico pelo username
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const username = (await params).username; // Obtém o username diretamente dos parâmetros

  try {
    // Tenta buscar o usuário no banco com base no 'username'
    const user = await prisma.user.findUnique({
      where: { username: username },
      select: {
        id: true,
        username: true,
        type: true,
        name: true,
        email: true,
        profilePhoto: true,
        createdAt: true,
        updatedAt: true,
        instagram: true,
        twitter: true,
        phone: true,
        WorkerProfile: {
          include: {
            skills: true,
            portfolio: true
          }
        }
      },
    });

    // Se o usuário não for encontrado, retorna erro 404
    if (!user) {
      return NextResponse.json(
        {
          status: "not found", // Status indicando que o usuário não foi encontrado
          code: 404, // Código de erro 404
          message: "Usuário não encontrado", // Mensagem explicativa
        },
        { status: 404 }
      );
    }

    // Se o usuário for encontrado, retorna seus dados com status de sucesso
    return NextResponse.json(
      {
        status: "success", // Indica sucesso
        code: 201, // Código de sucesso 201
        message: "Usuário recuperado com sucesso", // Mensagem de sucesso
        data: { user }, // Dados do usuário recuperado
      },
      { status: 201 }
    );
  } catch (error) {
    // Se ocorrer erro, loga e retorna erro genérico
    console.log(error);
    return NextResponse.json(
      {
        status: "error", // Indica erro
        code: 500, // Código de erro 500
        message: "Erro ao recuperar usuário", // Mensagem de erro
      },
      { status: 500 }
    );
  }
}

