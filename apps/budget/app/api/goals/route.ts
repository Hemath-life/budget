import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { generateId } from '@/lib/utils';
import { getCurrentUser } from '@/lib/auth';

// GET all goals
export async function GET() {
  try {
    const db = getDb();
    
    const currentUser = getCurrentUser();
    const userId = currentUser.id;
    
    const goals = db.prepare('SELECT * FROM goals ORDER BY deadline ASC').all() as Record<string, unknown>[];
    
    // Format to match frontend expectations
    const formattedGoals = goals.map((g) => ({
      id: g.id,
      name: g.name,
      targetAmount: g.target_amount,
      currentAmount: g.current_amount,
      currency: g.currency,
      deadline: g.deadline,
      category: g.category,
      icon: g.icon,
      color: g.color,
      isCompleted: Boolean(g.is_completed),
      createdAt: g.created_at,
    }));
    
    return NextResponse.json(formattedGoals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
}

// POST create new goal
export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    
    const currentUser = getCurrentUser();
    const userId = currentUser.id;
    
    const id = generateId();
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO goals (id, user_id, name, target_amount, current_amount, currency, deadline, category, icon, color, is_completed, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      userId,
      body.name,
      body.targetAmount,
      body.currentAmount || 0,
      body.currency || 'INR',
      body.deadline,
      body.category || null,
      body.icon || 'Target',
      body.color || '#3B82F6',
      body.isCompleted ? 1 : 0,
      now
    );
    
    const goal = db.prepare('SELECT * FROM goals WHERE id = ?').get(id) as Record<string, unknown>;
    
    const formatted = {
      id: goal.id,
      name: goal.name,
      targetAmount: goal.target_amount,
      currentAmount: goal.current_amount,
      currency: goal.currency,
      deadline: goal.deadline,
      category: goal.category,
      icon: goal.icon,
      color: goal.color,
      isCompleted: Boolean(goal.is_completed),
      createdAt: goal.created_at,
    };
    
    return NextResponse.json(formatted, { status: 201 });
  } catch (error) {
    console.error('Error creating goal:', error);
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
  }
}
