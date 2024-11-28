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

    // Obtém o corpo da requisição
    const { projectId, coverLetter, proposedFee } = await req.json();

    // Validação simples
    if (!projectId || typeof proposedFee !== 'number') {
      return NextResponse.json(
        {
          status: "error",
          code: 400,
          message: "Parâmetros 'projectId' e 'proposedFee' são obrigatórios.",
        },
        { status: 400 }
      );
    }

    // Cria a nova aplicação no banco de dados
    const newApplication = await prisma.application.create({
      data: {
        workerId: userId,
        projectId,
        coverLetter,
        proposedFee,
      },
    });

    return NextResponse.json(
      {
        status: "success",
        code: 201,
        message: "Aplicação criada com sucesso.",
        data: newApplication,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar aplicação:", error);
    return NextResponse.json(
      {
        status: "error",
        code: 500,
        message: "Erro ao criar aplicação.",
      },
      { status: 500 }
    );
  }
}

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

    // Busca todos os projetos do usuário autenticado com as aplicações
    const projects = await prisma.project.findMany({
      where: { authorId: userId },
      include: {
        applications: {
          include: {
            worker: {
              select: {
                id: true,
                username: true,
                profilePhoto: true,
              },
            },
            project: true
          },
        },
      },
    });

    return NextResponse.json(
      {
        status: "success",
        code: 200,
        message: "Projetos e aplicações recuperados com sucesso.",
        data: projects,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao recuperar projetos e aplicações:", error);
    return NextResponse.json(
      {
        status: "error",
        code: 500,
        message: "Erro ao recuperar projetos e aplicações.",
      },
      { status: 500 }
    );
  }
}
