// Importação das dependências necessárias
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import cleanUserPasswords from "@/utils/cleanUsersPassword";
import { Prisma } from "@prisma/client";

// Função para a requisição GET
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('query');

    // Condição para busca
    const whereCondition = query
      ? {
          OR: [
            { username: { contains: query, mode: Prisma.QueryMode.insensitive } },
            { name: { contains: query, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : {};

    const users = await prisma.user.findMany({
      where: whereCondition,
    });

    // Limpa as senhas dos usuários antes de enviar
    const cleanedUsers = cleanUserPasswords(users);

    return NextResponse.json(
      {
        status: "success",
        code: 200,
        message: "Usuários recuperados com sucesso",
        data: { users: cleanedUsers },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao recuperar usuários:", error);

    return NextResponse.json(
      {
        status: "error",
        code: 500,
        message: "Erro ao recuperar usuários",
      },
      { status: 500 }
    );
  }
}
