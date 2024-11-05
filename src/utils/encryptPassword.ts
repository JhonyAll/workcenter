import bcrypt from 'bcrypt';

// Função para criptografar a senha
const encryptPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // Custo do fator de encriptação
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

export default encryptPassword