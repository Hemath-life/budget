import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { generateId } from '@/lib/utils';

// GET all recurring transactions
export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let query = 'SELECT * FROM recurring_transactions';
    
    if (status === 'active') {
      query += ' WHERE is_active = 1';
    } else if (status === 'inactive') {
      query += ' WHERE is_active = 0';
    }
    
    query += ' ORDER BY next_due_date ASC';
    
    const recurring = db.prepare(query).all() as Record<string, unknown>[];
    
    // Format to match frontend expectations
    const formattedRecurring = recurring.map((r) => ({
      id: r.id,
      type: r.type,
      amount: r.amount,
      currency: r.currency,
      category: r.category,
      description: r.description,
      frequency: r.frequency,
      startDate: r.start_date,
      endDate: r.end_date,
      nextDueDate: r.next_due_date,
      isActive: Boolean(r.is_active),
      createdAt: r.created_at,
    }));
    
    return NextResponse.json(formattedRecurring);
  } catch (error) {
    console.error('Error fetching recurring transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch recurring transactions' }, { status: 500 });
  }
}

// POST create new recurring transaction
export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    
    const id = generateId();
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO recurring_transactions (id, type, amount, currency, category, description, frequency, start_date, end_date, next_due_date, is_active, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      body.type,
      body.amount,
      body.currency || 'USD',
      body.category,
      body.description || '',
      body.frequency,
      body.startDate,
      body.endDate || null,
      body.nextDueDate || body.startDate,
      body.isActive !== false ? 1 : 0,
      now
    );
    
    const recurring = db.prepare('SELECT * FROM recurring_transactions WHERE id = ?').get(id) as Record<string, unknown>;
    
    const formatted = {
      id: recurring.id,
      type: recurring.type,
      amount: recurring.amount,
      currency: recurring.currency,
      category: recurring.category,
      description: recurring.description,
      frequency: recurring.frequency,
      startDate: recurring.start_date,
      endDate: recurring.end_date,
      nextDueDate: recurring.next_due_date,
      isActive: Boolean(recurring.is_active),
      createdAt: recurring.created_at,
    };
    
    return NextResponse.json(formatted, { status: 201 });
  } catch (error) {
    console.error('Error creating recurring transaction:', error);
    return NextResponse.json({ error: 'Failed to create recurring transaction' }, { status: 500 });
  }
}
