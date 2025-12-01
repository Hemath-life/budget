import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET single budget
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    
    const currentUser = getCurrentUser();
    const userId = currentUser.id;
    
    const budget = db.prepare('SELECT * FROM budgets WHERE id = ? AND user_id = ?').get(id, userId) as Record<string, unknown> | undefined;
    
    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    
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
    
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching budget:', error);
    return NextResponse.json({ error: 'Failed to fetch budget' }, { status: 500 });
  }
}

// PUT update budget
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    const body = await request.json();
    
    const currentUser = getCurrentUser();
    const userId = currentUser.id;
    
    const existing = db.prepare('SELECT * FROM budgets WHERE id = ? AND user_id = ?').get(id, userId);
    
    if (!existing) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    
    const stmt = db.prepare(`
      UPDATE budgets 
      SET category = ?, amount = ?, currency = ?, period = ?, spent = ?, start_date = ?
      WHERE id = ?
    `);
    
    stmt.run(
      body.category,
      body.amount,
      body.currency || 'INR',
      body.period,
      body.spent || 0,
      body.startDate,
      id
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
    
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error updating budget:', error);
    return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 });
  }
}

// DELETE budget
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    
    const currentUser = getCurrentUser();
    const userId = currentUser.id;
    
    const existing = db.prepare('SELECT * FROM budgets WHERE id = ? AND user_id = ?').get(id, userId);
    
    if (!existing) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    
    db.prepare('DELETE FROM budgets WHERE id = ?').run(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting budget:', error);
    return NextResponse.json({ error: 'Failed to delete budget' }, { status: 500 });
  }
}
