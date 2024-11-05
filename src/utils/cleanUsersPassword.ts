import { User } from '@prisma/client';

const cleanUserPasswords = (users: User[]): Omit<User, 'password'>[] => {
  return users.map(({ password, ...user }) => user);
};

export default cleanUserPasswords;
