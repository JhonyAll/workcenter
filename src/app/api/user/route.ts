// Importação das dependências necessárias
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import cleanUserPasswords from "@/utils/cleanUsersPassword";
import encryptPassword from "@/utils/encryptPassword";

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

// Função para a requisição POST
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password, type, name, email, profilePhoto } = body;

  try {
    // Criptografa a senha antes de salvar no banco
    const hashedPassword = await encryptPassword(password);

    // Cria um novo usuário no banco de dados
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        type,
        name,
        email,
        profilePhoto,
      },
    });

    // Remove a senha do objeto de resposta para segurança
    user.password = '';

    // Retorna os dados do novo usuário com status de sucesso
    return NextResponse.json(
      {
        status: "success",
        code: 201,
        message: "Usuário criado com sucesso",
        data: { user },
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
        message: "Erro ao criar usuário",
      },
      { status: 500 }
    );
  }
}
