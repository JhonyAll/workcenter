import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import cleanUserPasswords from "@/utils/cleanUsersPassword";
import encryptPassword from "@/utils/encryptPassword";

export async function GET(req: NextRequest) {
  try {
    const users = cleanUserPasswords(await prisma.user.findMany());
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

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password, type, name, email, profilePhoto } = body;
  try {
    const hashedPassword = await encryptPassword(password)

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

    user.password = ''
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
