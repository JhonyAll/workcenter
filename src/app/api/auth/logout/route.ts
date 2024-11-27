import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const response = NextResponse.json({message: 'Log Out executado com sucesso'}, {status: 201})
    response.cookies.delete('authToken')
    response.headers.delete('authorization')
    return response
}