import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;

    // Obtenção de todos os post, incluindo suas hashtags e informações do autor
    const post = await prisma.post.findFirst({
      where: {
        id: postId,
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
        comments: {
          include: {
            author: {
              select: { id: true, username: true, profilePhoto: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!post) {
      return NextResponse.json(
        { status: "error", code: 404, message: "Post não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        code: 200,
        message: "Post recuperado com sucesso",
        data: { post },
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        status: "error",
        code: 500,
        message: "Erro ao recuperar post",
      },
      { status: 500 }
    );
  }
}
