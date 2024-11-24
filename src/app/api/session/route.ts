// src/app/api/auth/session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("authToken")?.value;

  if (!token) {
    return NextResponse.json({ isAuthenticated: false, user: null });
  }

  const decoded = verifyToken(token);
  console.log(token)

  if (!decoded) {
    return NextResponse.json({ isAuthenticated: false, user: null });
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      profilePhoto: true,
      type: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ isAuthenticated: false, user: null });
  }

  return NextResponse.json({ isAuthenticated: true, user });
}
