import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, gallery, links, hashtags, codeSnippet, userId } = body;

    // Criação do post no banco de dados
    const post = await prisma.post.create({
      data: {
        title,
        description,
        gallery: gallery || [],
        links: links || [],
        hashtags: {
          connectOrCreate: hashtags.map((hashtag: string) => ({
            where: { name: hashtag },
            create: { name: hashtag },
          })),
        },
        embedCode: codeSnippet,
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
        message: "Post criado com sucesso",
        data: { post },
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        status: "error",
        code: 500,
        message: "Erro ao criar post",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const recentOnly = searchParams.get("recentOnly") === "true";
    const orderBy = searchParams.get("orderBy") || "createdAt"; // Define o critério de ordenação
    const quant = searchParams.get("quant") || null;
    const orderDirection = searchParams.get("orderDirection") || "desc"; // Define a direção da ordenação

    // Validar valores de `orderBy` para evitar erros
    const validOrderByFields = ["createdAt", "likes"];
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

    // Obtenção de todos os posts, incluindo suas hashtags e informações do autor
    const posts = await prisma.post.findMany({
      orderBy: {
        [orderBy]: orderDirection, // Ordenação dinâmica
      },
      ...(quant && { take: parseInt(quant) }),
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
    });

    return NextResponse.json(
      {
        status: "success",
        code: 200,
        message: "Posts recuperados com sucesso",
        data: { posts },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        status: "error",
        code: 500,
        message: "Erro ao recuperar posts",
      },
      { status: 500 }
    );
  }
}
