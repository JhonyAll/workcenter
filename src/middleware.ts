import { NextRequest, NextResponse } from "next/server";
import { verifyTokenAndGetUser } from "./utils/authHelper";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("authToken")?.value;

  // Tratamento das rotas da API
  if (pathname.startsWith("/api")) {
    // Rotas públicas da API
    if (
      ["/api/auth/login", "/api/auth/signup", "/api/auth/logout"].includes(
        pathname
      )
    ) {
      return NextResponse.next();
    }

    // Impedindo acesso caso token não exista.
    if (!token) {
      return NextResponse.json(
        {
          status: "error",
          code: 401,
          message: "Token de autorização não encontrado. Acesso negado.",
          data: null,
        },
        { status: 401 }
      );
    }

    // Verificando se o token é valido
    const validateToken = verifyTokenAndGetUser(req)

    // Caso token inválido, apagando o cookie referente ao token e não permitindo acesso.
    if (!validateToken) {
      const response = NextResponse.json(
        {
          status: "error",
          code: 401,
          message: "Token de autenticação inválido. Acesso negado.",
          data: null,
        },
        { status: 401 }
      );
      response.cookies.set("authToken", "", {
        expires: new Date(0),
        path: "/",
      });
      return response;
    }

    return NextResponse.next();
  }

  // Rotas públicas
  if (["/login", "/signup"].includes(pathname)) {
    return token
      ? NextResponse.redirect(new URL("/", req.url))
      : NextResponse.next();
  }

  // Redirecionando para a rota /login caso não exista o token
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Validando o token
  const authResponse = await verifyTokenAndGetUser(req);

  // Caso não seja validado, excluindo o cookie referente ao token e redirecionando para /login
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
