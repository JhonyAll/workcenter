// authHelper.ts
import { NextRequest } from "next/server";

interface UserAuthData {
  isAuthenticated: boolean;
  userData?: {
    name: string | null;
    id: string;
    username: string;
    password: string;
    type: 'WORKER' | 'CLIENT';
    email: string | null;
    profilePhoto: string;
    createdAt: Date;
    updatedAt: Date;
  }; // Altere `any` para o tipo específico dos dados do usuário, se conhecido
}

const authCache: Record<string, UserAuthData> = {};

export const verifyTokenAndGetUser = async (req: NextRequest): Promise<UserAuthData | false> => {
  const tokenKey = req.cookies.get("authToken")?.value || req.headers.get("authorization") || "";

  // Retorna do cache se já verificado
  if (authCache[tokenKey]) {
    return authCache[tokenKey];
  }

  let token = req.cookies.get("authToken")?.value;
  if (!token) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }
  if (!token) return false;

  try {
    // Alteração: A requisição foi modificada para /session
    const response = await fetch(`${req.nextUrl.origin}/api/auth/session`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
        cookie: req.headers.get('cookie') || '',
      },
    });

    const isAuthenticated = response.ok ? await response.json() : false;

    // Define o objeto `UserAuthData` a ser armazenado no cache
    const authData: UserAuthData = {
      isAuthenticated: !!isAuthenticated,
      userData: isAuthenticated || null,
    };

    authCache[tokenKey] = authData; // Armazena no cache para a requisição atual
    return authData;
  } catch (error) {
    console.error("Erro na verificação de autenticação:", error);
    return false;
  }
};
