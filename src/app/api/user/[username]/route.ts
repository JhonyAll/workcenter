import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: { username: string };
  }
) {
  const username = (await params).username;
  try {
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
      },
    });
    if (!user) {
      return NextResponse.json(
        {
          status: "not found",
          code: 404,
          message: "Usuário não encontrado",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        status: "success",
        code: 201,
        message: "Usuário recuperado com sucesso",
        data: { user },
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        status: "error",
        code: 500,
        message: "Erro ao recuperar usuário",
      },
      { status: 500 }
    );
  }
}
