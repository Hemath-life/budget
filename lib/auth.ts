import { getDb } from './db';
import { User } from './types';

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
  
  let user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
  
  // Create demo user if doesn't exist
  if (!user) {
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO users (email, name, avatar, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `).run('demo@budgetapp.com', 'Demo User', null, now, now);
    
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
  }
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
}

/**
 * Get user by ID
 */
export function getUserById(userId: number): User | null {
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
  
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
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
  `).run(email, name, avatar || null, now, now);
  
  return getUserById(result.lastInsertRowid as number)!;
}
