import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("authToken");

  // Permite que a página de login prossiga sem redirecionamento
  if (pathname === "/login" || pathname === "/signup") {
    if (token) {
      const loginUrl = new URL("/", req.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api")) {
    const token = req.headers.get("authorization");

    // Se não houver token, redireciona ou retorna erro
    if (!token) {
      // Permite que login e criação de usuário prossigam sem token
      if (pathname === "/api/login" || (pathname === "/api/user" && req.method === 'POST') || pathname === "/api" || pathname === "/api/logout") {
        return NextResponse.next();
      }

      return NextResponse.json({
        "status": "error",
        "code": 401,
        "message": "Token de autorização não encontrado. Acesso negado.",
        "data": null
      }, { status: 401 });
    }

    return NextResponse.next();
  }

  
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  const headers = new Headers(req.headers);
  headers.set("x-current-path", req.nextUrl.pathname);

  return NextResponse.next({ headers });
}

export const config = {
  matcher: ["/((?!_next/static|favicon.ico).*)"], // Exclui API e arquivos estáticos do middleware
};
