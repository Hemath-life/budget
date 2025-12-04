import { User } from './types';

const demoUser: User = {
  id: 1,
  email: 'demo@budgetapp.com',
  name: 'Demo User',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const users: User[] = [demoUser];
let nextUserId = 2;

export function getCurrentUser(): User {
  return demoUser;
}

export function getUserById(userId: number): User | null {
  return users.find((user) => user.id === userId) ?? null;
}

export function createUser(email: string, name: string, avatar?: string): User {
  const now = new Date().toISOString();
  const newUser: User = {
    id: nextUserId++,
    email,
    name,
    avatar,
    createdAt: now,
    updatedAt: now,
  };
  users.push(newUser);
  return newUser;
}
