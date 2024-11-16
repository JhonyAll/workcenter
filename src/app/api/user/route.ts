// Importação das dependências necessárias
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import cleanUserPasswords from "@/utils/cleanUsersPassword";


// Função para a requisição GET
export async function GET(req: NextRequest) {
  try {
    // Recupera os usuários do banco e limpa as senhas antes de enviar
    const users = cleanUserPasswords(await prisma.user.findMany());

    // Retorna os dados dos usuários com um status de sucesso
    return NextResponse.json(
      {
        status: "success",
        code: 201,
        message: "Usuários recuperados com sucesso",
        data: { users },
      },
      { status: 201 }
    );
  } catch (error) {
    // Em caso de erro, loga e retorna um erro genérico
    console.log(error);
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


