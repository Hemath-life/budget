import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GET single transaction
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    
    const transaction = db.prepare('SELECT * FROM transactions WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    
    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    
    const formatted = {
      ...transaction,
      isRecurring: Boolean(transaction.is_recurring),
      recurringId: transaction.recurring_id,
      tags: transaction.tags ? JSON.parse(transaction.tags as string) : [],
      createdAt: transaction.created_at,
      updatedAt: transaction.updated_at,
    };
    
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json({ error: 'Failed to fetch transaction' }, { status: 500 });
  }
}

// PUT update transaction
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    const body = await request.json();
    
    const existing = db.prepare('SELECT * FROM transactions WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    
    if (!existing) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    
    const now = new Date().toISOString();
    
    // If it was an expense, subtract from old budget
    if (existing.type === 'expense') {
      const oldBudget = db.prepare('SELECT * FROM budgets WHERE category = ?').get(existing.category as string) as Record<string, unknown> | undefined;
      if (oldBudget) {
        db.prepare('UPDATE budgets SET spent = spent - ? WHERE id = ?').run(existing.amount, oldBudget.id);
      }
    }
    
    const stmt = db.prepare(`
      UPDATE transactions 
      SET type = ?, amount = ?, currency = ?, category = ?, description = ?, date = ?, is_recurring = ?, recurring_id = ?, tags = ?, updated_at = ?
      WHERE id = ?
    `);
    
    stmt.run(
      body.type,
      body.amount,
      body.currency || 'INR',
      body.category,
      body.description || '',
      body.date,
      body.isRecurring ? 1 : 0,
      body.recurringId || null,
      body.tags ? JSON.stringify(body.tags) : null,
      now,
      id
    );
    
    // If it's an expense, add to new budget
    if (body.type === 'expense') {
      const newBudget = db.prepare('SELECT * FROM budgets WHERE category = ?').get(body.category) as Record<string, unknown> | undefined;
      if (newBudget) {
        db.prepare('UPDATE budgets SET spent = spent + ? WHERE id = ?').run(body.amount, newBudget.id);
      }
    }
    
    const transaction = db.prepare('SELECT * FROM transactions WHERE id = ?').get(id);
    
    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

// DELETE transaction
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    
    const existing = db.prepare('SELECT * FROM transactions WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    
    if (!existing) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    
    // If it was an expense, subtract from budget
    if (existing.type === 'expense') {
      const budget = db.prepare('SELECT * FROM budgets WHERE category = ?').get(existing.category as string) as Record<string, unknown> | undefined;
      if (budget) {
        db.prepare('UPDATE budgets SET spent = spent - ? WHERE id = ?').run(existing.amount, budget.id);
      }
    }
    
    db.prepare('DELETE FROM transactions WHERE id = ?').run(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}
