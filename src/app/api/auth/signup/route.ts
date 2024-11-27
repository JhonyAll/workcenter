import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import encryptPassword from "@/utils/encryptPassword";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret_key";

  const body = await req.json();
  const {
    username,
    password,
    type,
    name,
    email,
    profilePhoto,
    profession,
    skills,
    about
  } = body;

  const skillArray: [{ name: string }] = skills

  try {
    if (!username || !password || !type || !name || !email) {
      return NextResponse.json(
        {
          status: "error",
          code: 400,
          message: "Dados obrigatórios faltando",
        },
        { status: 400 }
      );
    }

    // Criptografa a senha antes de salvar no banco
    const hashedPassword = await encryptPassword(password);

    // Cria um novo usuário no banco de dados
    let user;
    if (type === "WORKER") {
      user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          type,
          name,
          email,
          about,
          profilePhoto,
          WorkerProfile: {
            create: {
              profession,
              skills: {
                connectOrCreate: skillArray.map((skill) => {
                  return {
                    where: { name: skill.name },
                    create: { name: skill.name },
                  };
                }),
              },
              contactInfo: "",
              completedTasks: 0, // Define o valor inicial como 0,
              rating: 0,
            },
          },
        },
        include: {
          WorkerProfile: {
            include: {
              skills: true,
            },
          },
        },
      });
    } else {
      user = await prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          type,
          name,
          email,
          profilePhoto,
          about
        },
      });
    }

    if (!user) {
      throw new Error("Erro ao criar usuário");
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    await prisma.token.create({
      data: { token, userId: user.id },
    });

    // Remove a senha do objeto de resposta para segurança
    user.password = "";

    const response = NextResponse.json(
      {
        status: "success",
        code: 201,
        message: "Usuário criado com sucesso",
        data: {
          user,
          token,
        },
      },
      { status: 201 }
    );

    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
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

