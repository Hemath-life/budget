import { getDb } from './db';
import { User } from './types';

interface UserRow {
  id: number;
  email: string;
  name: string;
  avatar: string | null;
  created_at: string;
  updated_at: string;
}

function mapUserRowToUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    avatar: row.avatar ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Get the current user from the session
 * In production, this would check authentication headers/cookies
 * For now, returns the demo user or creates one if it doesn't exist
 */
export function getCurrentUser(): User {
  const db = getDb();
  
  // In production, you would get the user ID from:
  // - NextAuth session
  // - JWT token
  // - Cookie
  // - Auth header
  // For demo purposes, we use user ID 1
  const userId = 1;
  
  let user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as UserRow | undefined;
  
  // Create demo user if doesn't exist
  if (!user) {
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO users (email, name, avatar, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).run('demo@budgetapp.com', 'Demo User', null, now, now);
    
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as UserRow;
  }
  
  return mapUserRowToUser(user);
}

/**
 * Get user by ID
 */
export function getUserById(userId: number): User | null {
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as UserRow | undefined;
  
  if (!user) return null;
  
  return mapUserRowToUser(user);
}

/**
 * Create a new user
 */
export function createUser(email: string, name: string, avatar?: string): User {
  const db = getDb();
  const now = new Date().toISOString();
  
  const result = db.prepare(`
    INSERT INTO users (email, name, avatar, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(email, name, avatar ?? null, now, now);
  
  return getUserById(result.lastInsertRowid as number)!;
}
