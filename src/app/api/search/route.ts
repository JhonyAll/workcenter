import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.trim();

    if (!query) {
      return NextResponse.json(
        {
          status: "error",
          code: 400,
          message: "A query de busca não foi fornecida.",
        },
        { status: 400 }
      );
    }

    // Busca simultânea em posts e projetos
    const [posts, projects] = await Promise.all([
      prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { hashtags: { some: { name: { contains: query, mode: "insensitive" } } } },
          ],
        },
        include: {
          hashtags: true,
          author: {
            select: {
              id: true,
              username: true,
              profilePhoto: true,
            },
          },
        },
        take: 10, // Limite de resultados
      }),
      prisma.project.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { hashtags: { some: { name: { contains: query, mode: "insensitive" } } } },
          ],
        },
        include: {
          hashtags: true,
          author: {
            select: {
              id: true,
              username: true,
              profilePhoto: true,
            },
          },
        },
        take: 10, // Limite de resultados
      }),
    ]);

    return NextResponse.json(
      {
        status: "success",
        code: 200,
        message: "Resultados encontrados com sucesso.",
        data: { posts, projects },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Erro na rota de busca:", error);
    return NextResponse.json(
      {
        status: "error",
        code: 500,
        message: "Erro ao buscar resultados.",
      },
      { status: 500 }
    );
  }
}
