// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyTokenAndGetUser } from "./utils/authHelper";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("authToken")?.value;

  if (["/login", "/signup"].includes(pathname)) {
    return token ? NextResponse.redirect(new URL("/", req.url)) : NextResponse.next();
  }

  // Tratamento de rotas da API
  if (pathname.startsWith("/api")) {
    const authToken = req.headers.get("authorization") || token;

    if (["/api/login", "/api/signup", "/api/logout"].includes(pathname)) {
      return NextResponse.next();
    }

    if (!authToken) {
      return NextResponse.json({
        status: "error",
        code: 401,
        message: "Token de autorização não encontrado. Acesso negado.",
        data: null,
      }, { status: 401 });
    }

    const authResponse = await verifyTokenAndGetUser(req);
    if (!authResponse) {
      const response = NextResponse.json({
        status: "error",
        code: 401,
        message: "Token de autenticação inválido. Acesso negado.",
        data: null,
      }, { status: 401 });
      
      response.cookies.set("authToken", "", { expires: new Date(0), path: "/" });
      return response;
    }

    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const authResponse = await verifyTokenAndGetUser(req);
  if (!authResponse) {
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.set("authToken", "", { expires: new Date(0), path: "/" });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|favicon.ico).*)"],
};
