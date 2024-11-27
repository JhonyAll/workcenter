import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
    try {
      const { projectId } = await params
  
      // Obtenção de todos os post, incluindo suas hashtags e informações do autor
      const project = await prisma.project.findFirst({
        where: {
            id: projectId
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
      });
  
      return NextResponse.json(
        {
          status: "success",
          code: 200,
          message: "Post recuperado com sucesso",
          data: { project },
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