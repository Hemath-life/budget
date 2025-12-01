import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getNextRecurringDate } from '@/lib/utils';

// GET single reminder
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    
    const reminder = db.prepare('SELECT * FROM reminders WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    
    if (!reminder) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }
    
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
    
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching reminder:', error);
    return NextResponse.json({ error: 'Failed to fetch reminder' }, { status: 500 });
  }
}

// PUT update reminder
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    const body = await request.json();
    
    const existing = db.prepare('SELECT * FROM reminders WHERE id = ?').get(id);
    
    if (!existing) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }
    
    const stmt = db.prepare(`
      UPDATE reminders 
      SET title = ?, amount = ?, currency = ?, due_date = ?, category = ?, is_recurring = ?, frequency = ?, is_paid = ?, notify_before = ?
      WHERE id = ?
    `);
    
    stmt.run(
      body.title,
      body.amount,
      body.currency || 'INR',
      body.dueDate,
      body.category,
      body.isRecurring ? 1 : 0,
      body.frequency || null,
      body.isPaid ? 1 : 0,
      body.notifyBefore || 3,
      id
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
    
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error updating reminder:', error);
    return NextResponse.json({ error: 'Failed to update reminder' }, { status: 500 });
  }
}

// DELETE reminder
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    
    const existing = db.prepare('SELECT * FROM reminders WHERE id = ?').get(id);
    
    if (!existing) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }
    
    db.prepare('DELETE FROM reminders WHERE id = ?').run(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return NextResponse.json({ error: 'Failed to delete reminder' }, { status: 500 });
  }
}

// PATCH - mark as paid/unpaid
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    const body = await request.json();
    
    const existing = db.prepare('SELECT * FROM reminders WHERE id = ?').get(id) as Record<string, unknown> | undefined;
    
    if (!existing) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }
    
    if (body.action === 'markPaid') {
      db.prepare('UPDATE reminders SET is_paid = 1 WHERE id = ?').run(id);
      
      // If recurring, create next reminder
      if (existing.is_recurring && existing.frequency) {
        const nextDueDate = getNextRecurringDate(
          existing.due_date as string, 
          existing.frequency as 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly'
        );
        
        db.prepare('UPDATE reminders SET due_date = ?, is_paid = 0 WHERE id = ?')
          .run(nextDueDate, id);
      }
    } else if (body.action === 'markUnpaid') {
      db.prepare('UPDATE reminders SET is_paid = 0 WHERE id = ?').run(id);
    }
    
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
    
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error updating reminder status:', error);
    return NextResponse.json({ error: 'Failed to update reminder status' }, { status: 500 });
  }
}
