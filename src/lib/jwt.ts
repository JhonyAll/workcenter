import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const createToken = (userId: string) => {
  return jwt.sign({ userId }, SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET) as { userId: string };
  } catch (error) {
    return null;
  }
};
