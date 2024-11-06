// Importação de dependências
import { PrismaClient } from "@prisma/client"; // Cliente do Prisma para interagir com o banco de dados
import bcrypt from "bcrypt"; // Biblioteca para fazer o hash das senhas de forma segura
import jwt from "jsonwebtoken"; // Biblioteca para gerar e verificar tokens JWT
import { NextRequest, NextResponse } from "next/server"; // Tipos do Next.js para manipulação de requests e responses em API Routes

// Instância do Prisma para interagir com o banco de dados
const prisma = new PrismaClient(); 

// Definindo o segredo JWT que será usado para assinar os tokens. 
// Pode ser fornecido via variável de ambiente ou usar um valor padrão para desenvolvimento
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Função de manipulação de requisição POST para login do usuário
export async function POST(req: NextRequest) {
  // Extração do corpo da requisição em formato JSON
  const body = await req.json();
  const { usernameOrEmail, password } = body; // Desestrutura o corpo para obter as informações necessárias (username ou email, senha)

  try {
    // Tenta localizar o usuário no banco de dados usando o Prisma.
    // O Prisma usa a operação `findFirst` para buscar um usuário, 
    // onde o username ou o email podem corresponder ao valor fornecido.
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });

    // Se o usuário não for encontrado, retorna uma resposta de erro 401 (não autorizado)
    if (!user) {
      return NextResponse.json(
        {
          status: "error",
          code: 401,
          message: "Usuário não encontrado", // Mensagem de erro caso o usuário não exista
          data: null,
        },
        { status: 401 } // Status HTTP 401
      );
    }

    // Compara a senha fornecida com o hash da senha armazenada no banco de dados
    // O bcrypt.compare verifica se as senhas coincidem
    const passwordMatch = await bcrypt.compare(password, user.password);

    // Se a senha estiver incorreta, retorna erro 401 com a mensagem "Senha incorreta"
    if (!passwordMatch) {
      return NextResponse.json(
        {
          status: "error",
          code: 401,
          message: "Senha incorreta", // Mensagem de erro caso a senha não corresponda
          data: null,
        },
        { status: 401 } // Status HTTP 401
      );
    }

    // Se o usuário foi encontrado e a senha está correta, cria um token JWT
    // O token contém o ID do usuário e expira após 7 dias
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d", // O token vai expirar após 7 dias
    });

    // Armazena o token gerado no banco de dados associando-o ao usuário
    await prisma.token.create({
      data: { token, userId: user.id },
    });

    // Limpa o campo de senha antes de retornar a resposta (para não expor a senha)
    user.password = '';

    // Prepara a resposta de sucesso, incluindo o token e as informações do usuário
    const response = NextResponse.json(
      {
        status: "success", // Indica que o login foi bem-sucedido
        code: 200, // Código HTTP de sucesso
        message: "Login realizado com sucesso", // Mensagem de sucesso
        data: { token: token, user: user }, // Dados de retorno, incluindo o token e o usuário sem a senha
      },
      { status: 200 } // Status HTTP 200 (OK)
    );

    // Define um cookie com o nome "authToken" contendo o token JWT
    // Configura o cookie para ser HTTP-only (não acessível via JavaScript) e seguro
    response.cookies.set("authToken", token, {
      httpOnly: true, // O cookie não pode ser acessado via JavaScript
      secure: process.env.NODE_ENV !== "development", // Em produção, o cookie será seguro (usando HTTPS)
      maxAge: 60 * 60 * 24 * 7, // Define o tempo de expiração do cookie para 7 dias
      path: "/", // O cookie estará disponível para todo o domínio
    });

    // Retorna a resposta para o cliente, incluindo o token e as informações do usuário
    return response;
  } catch (error) {
    // Em caso de erro inesperado no servidor, retorna um erro 500
    return NextResponse.json(
      {
        status: "error",
        code: 500, // Código HTTP de erro interno
        message: "Erro interno no servidor", // Mensagem de erro genérica
        data: null, // Dados nulos pois o erro é genérico
      },
      { status: 500 } // Status HTTP 500 (Erro interno no servidor)
    );
  }
}
