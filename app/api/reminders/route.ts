import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { generateId } from '@/lib/utils';

// GET all reminders
export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    let query = 'SELECT * FROM reminders';
    const params: number[] = [];
    
    if (status === 'paid') {
      query += ' WHERE is_paid = 1';
    } else if (status === 'unpaid') {
      query += ' WHERE is_paid = 0';
    }
    
    query += ' ORDER BY due_date ASC';
    
    const reminders = db.prepare(query).all(...params);
    
    // Format to match frontend expectations
    const formattedReminders = (reminders as Record<string, unknown>[]).map((r) => ({
      id: r.id,
      title: r.title,
      amount: r.amount,
      currency: r.currency,
      dueDate: r.due_date,
      category: r.category,
      isRecurring: Boolean(r.is_recurring),
      frequency: r.frequency,
      isPaid: Boolean(r.is_paid),
      notifyBefore: r.notify_before,
      createdAt: r.created_at,
    }));
    
    return NextResponse.json(formattedReminders);
  } catch (error) {
    console.error('Error fetching reminders:', error);
    return NextResponse.json({ error: 'Failed to fetch reminders' }, { status: 500 });
  }
}

// POST create new reminder
export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    
    const id = generateId();
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO reminders (id, title, amount, currency, due_date, category, is_recurring, frequency, is_paid, notify_before, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      body.title,
      body.amount,
      body.currency || 'USD',
      body.dueDate,
      body.category,
      body.isRecurring ? 1 : 0,
      body.frequency || null,
      body.isPaid ? 1 : 0,
      body.notifyBefore || 3,
      now
    );
    
    const reminder = db.prepare('SELECT * FROM reminders WHERE id = ?').get(id) as Record<string, unknown>;
    
    const formatted = {
      id: reminder.id,
      title: reminder.title,
      amount: reminder.amount,
      currency: reminder.currency,
      dueDate: reminder.due_date,
      category: reminder.category,
      isRecurring: Boolean(reminder.is_recurring),
      frequency: reminder.frequency,
      isPaid: Boolean(reminder.is_paid),
      notifyBefore: reminder.notify_before,
      createdAt: reminder.created_at,
    };
    
    return NextResponse.json(formatted, { status: 201 });
  } catch (error) {
    console.error('Error creating reminder:', error);
    return NextResponse.json({ error: 'Failed to create reminder' }, { status: 500 });
  }
}
