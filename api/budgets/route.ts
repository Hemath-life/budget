import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { generateId } from '@/lib/utils';

// GET all budgets
export async function GET() {
  try {
    const db = getDb();
    
    const budgets = db.prepare('SELECT * FROM budgets ORDER BY created_at DESC').all() as Record<string, unknown>[];
    
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
    
    // Check if budget already exists for this category
    const existing = db.prepare('SELECT * FROM budgets WHERE category = ?').get(body.category);
    if (existing) {
      return NextResponse.json({ error: 'Budget already exists for this category' }, { status: 400 });
    }
    
    const id = generateId();
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO budgets (id, category, amount, currency, period, spent, start_date, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
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
