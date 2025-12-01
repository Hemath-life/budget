import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { generateId } from '@/lib/utils';
import { getCurrentUser } from '@/lib/auth';

// GET all transactions
export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    
    const currentUser = getCurrentUser();
    const userId = currentUser.id;
    
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    
    let query = 'SELECT * FROM transactions WHERE user_id = ?';
    const params: (string | number)[] = [userId];
    
    if (type && type !== 'all') {
      query += ' AND type = ?';
      params.push(type);
    }
    
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    if (dateFrom) {
      query += ' AND date >= ?';
      params.push(dateFrom);
    }
    
    if (dateTo) {
      query += ' AND date <= ?';
      params.push(dateTo);
    }
    
    if (search) {
      query += ' AND (description LIKE ? OR category LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY date DESC, created_at DESC';
    
    if (limit) {
      query += ' LIMIT ?';
      params.push(parseInt(limit));
    }
    
    const transactions = db.prepare(query).all(...params);
    
    // Convert SQLite integer booleans to actual booleans and parse tags
    const formattedTransactions = (transactions as Record<string, unknown>[]).map((t) => ({
      ...t,
      isRecurring: Boolean(t.is_recurring),
      recurringId: t.recurring_id,
      tags: t.tags ? JSON.parse(t.tags as string) : [],
      createdAt: t.created_at,
      updatedAt: t.updated_at,
    }));
    
    return NextResponse.json(formattedTransactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

// POST create new transaction
export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    
    const currentUser = getCurrentUser();
    const userId = currentUser.id;
    
    const id = generateId();
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO transactions (id, user_id, type, amount, currency, category, description, date, is_recurring, recurring_id, tags, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      userId,
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
      now
    );
    
    // Update budget spent amount if it's an expense
    if (body.type === 'expense') {
      const budget = db.prepare('SELECT * FROM budgets WHERE category = ? AND user_id = ?').get(body.category, userId) as Record<string, unknown> | undefined;
      if (budget) {
        db.prepare('UPDATE budgets SET spent = spent + ? WHERE id = ?').run(body.amount, budget.id);
      }
    }
    
    const transaction = db.prepare('SELECT * FROM transactions WHERE id = ?').get(id);
    
    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}
