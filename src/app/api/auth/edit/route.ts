// Importação das dependências necessárias
import { verifyToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import encryptPassword from "@/utils/encryptPassword";
import { NextResponse, NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
    const body = await req.json();
    const token = req.cookies.get("authToken")?.value;
    const { name, password, about, profilePhoto, profession, skills, instagram, twitter, phone } = body;
    const decoded = verifyToken(token || '');
    const userId = decoded?.userId
  
    if (!userId) {
      return NextResponse.json(
        {
          status: "error",
          code: 400,
          message: "ID do usuário é obrigatório para a atualização.",
        },
        { status: 400 }
      );
    }
  
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { WorkerProfile: { include: { skills: true } } },
      });
  
      if (!user) {
        return NextResponse.json(
          {
            status: "error",
            code: 404,
            message: "Usuário não encontrado.",
          },
          { status: 404 }
        );
      }
  
      // Atualização de dados básicos
      const updates: any = {};
      if (name) updates.name = name;
      if (password) updates.password = await encryptPassword(password);
      if (about) updates.about = about;
      if (profilePhoto) updates.profilePhoto = profilePhoto;
      if (instagram) updates.instagram = instagram;
      if (twitter) updates.twitter = twitter;
      if (phone) updates.phone = phone;
  
      // Atualização no modelo User
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updates,
        include: { WorkerProfile: { include: { skills: true } } },
      });
  
      // Atualização específica para WORKER
      if (user.type === "WORKER" && (profession || skills)) {
        const skillArray: [{ name: string }] = skills || [];
  
        await prisma.workerProfile.update({
          where: { userId: userId },
          data: {
            ...(profession && { profession }),
            ...(skills && {
              skills: {
                connectOrCreate: skillArray.map((skill) => ({
                  where: { name: skill.name },
                  create: { name: skill.name },
                })),
              },
            }),
          },
        });
      }
  
      return NextResponse.json(
        {
          status: "success",
          code: 200,
          message: "Usuário atualizado com sucesso.",
          data: updatedUser,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      return NextResponse.json(
        {
          status: "error",
          code: 500,
          message: "Erro ao atualizar usuário.",
        },
        { status: 500 }
      );
    }
  }