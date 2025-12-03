import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { generateId } from '@/lib/utils';
import { getCurrentUser } from '@/lib/auth';

// GET all budgets
export async function GET() {
  try {
    const db = getDb();
    
    const currentUser = getCurrentUser();
    const userId = currentUser.id;
    
    const budgets = db.prepare('SELECT * FROM budgets WHERE user_id = ? ORDER BY created_at DESC').all(userId) as Record<string, unknown>[];
    
    // Format to match frontend expectations
    const formattedBudgets = budgets.map((b) => ({
      id: b.id,
      category: b.category,
      amount: b.amount,
      currency: b.currency,
      period: b.period,
      spent: b.spent,
      startDate: b.start_date,
      createdAt: b.created_at,
    }));
    
    return NextResponse.json(formattedBudgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
}

// POST create new budget
export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    
    const currentUser = getCurrentUser();
    const userId = currentUser.id;
    
    // Check if budget already exists for this category
    const existing = db.prepare('SELECT * FROM budgets WHERE category = ? AND user_id = ?').get(body.category, userId);
    if (existing) {
      return NextResponse.json({ error: 'Budget already exists for this category' }, { status: 400 });
    }
    
    const id = generateId();
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO budgets (id, user_id, category, amount, currency, period, spent, start_date, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      userId,
      body.category,
      body.amount,
      body.currency || 'INR',
      body.period,
      body.spent || 0,
      body.startDate || new Date().toISOString().split('T')[0],
      now
    );
    
    const budget = db.prepare('SELECT * FROM budgets WHERE id = ?').get(id) as Record<string, unknown>;
    
    const formatted = {
      id: budget.id,
      category: budget.category,
      amount: budget.amount,
      currency: budget.currency,
      period: budget.period,
      spent: budget.spent,
      startDate: budget.start_date,
      createdAt: budget.created_at,
    };
    
    return NextResponse.json(formatted, { status: 201 });
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 });
  }
}
