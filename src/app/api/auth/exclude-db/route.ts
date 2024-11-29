import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteAllData() {
  try {
    // Exclua os dados das tabelas na ordem correta
    await prisma.portfolio.deleteMany();
    await prisma.application.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.hashtag.deleteMany();
    await prisma.workerProfile.deleteMany();
    await prisma.project.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    console.log('Todos os dados foram excluídos com sucesso.');
  } catch (error) {
    console.error('Erro ao excluir os dados:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllData();
