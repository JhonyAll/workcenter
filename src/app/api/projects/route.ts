import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, budget, deadline, hashtags, userId } = body;

    // Criação do projeto no banco de dados
    const project = await prisma.project.create({
      data: {
        title,
        description,
        budget,
        deadline: new Date(deadline), // Converte para formato Date
        hashtags: {
          connectOrCreate: hashtags.map((hashtag: string) => ({
            where: { name: hashtag },
            create: { name: hashtag },
          })),
        },
        authorId: userId,
      },
      include: {
        hashtags: true, // Inclui as hashtags relacionadas no retorno
      },
    });

    return NextResponse.json(
      {
        status: "success",
        code: 201,
        message: "Projeto criado com sucesso",
        data: { project },
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        status: "error",
        code: 500,
        message: "Erro ao criar projeto",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const recentOnly = searchParams.get("recentOnly") === "true";
      const orderBy = searchParams.get("orderBy") || "createdAt";
      const quant = searchParams.get("quant") || null;
      const orderDirection = searchParams.get("orderDirection") || "desc";
  
      // Validar valores de `orderBy`
      const validOrderByFields = ["createdAt", "budget"];
      if (!validOrderByFields.includes(orderBy)) {
        return NextResponse.json(
          {
            status: "error",
            code: 400,
            message: `Critério de ordenação inválido. Use um destes: ${validOrderByFields.join(", ")}`,
          },
          { status: 400 }
        );
      }
  
      // Consulta ao banco de dados para obter projetos
      const projects = await prisma.project.findMany({
        orderBy: {
          [orderBy]: orderDirection, // Ordenação dinâmica
        },
        ...(quant && { take: parseInt(quant) }),
        include: {
          hashtags: true, // Inclui as hashtags relacionadas
          author: {
            select: {
              id: true,
              username: true,
              profilePhoto: true,
            },
          },
        },
      });
  
      return NextResponse.json(
        {
          status: "success",
          code: 200,
          message: "Projetos recuperados com sucesso",
          data: { projects },
        },
        { status: 200 }
      );
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        {
          status: "error",
          code: 500,
          message: "Erro ao recuperar projetos",
        },
        { status: 500 }
      );
    }
  }
  