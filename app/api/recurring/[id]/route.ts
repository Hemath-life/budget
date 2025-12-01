import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET single recurring transaction
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    
    const currentUser = getCurrentUser();
    const userId = currentUser.id;
    
    const recurring = db.prepare('SELECT * FROM recurring_transactions WHERE id = ? AND user_id = ?').get(id, userId) as Record<string, unknown> | undefined;
    
    if (!recurring) {
      return NextResponse.json({ error: 'Recurring transaction not found' }, { status: 404 });
    }
    
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
    
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching recurring transaction:', error);
    return NextResponse.json({ error: 'Failed to fetch recurring transaction' }, { status: 500 });
  }
}

// PUT update recurring transaction
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
    
    const existing = db.prepare('SELECT * FROM recurring_transactions WHERE id = ? AND user_id = ?').get(id, userId);
    
    if (!existing) {
      return NextResponse.json({ error: 'Recurring transaction not found' }, { status: 404 });
    }
    
    const stmt = db.prepare(`
      UPDATE recurring_transactions 
      SET type = ?, amount = ?, currency = ?, category = ?, description = ?, frequency = ?, start_date = ?, end_date = ?, next_due_date = ?, is_active = ?
      WHERE id = ?
    `);
    
    stmt.run(
      body.type,
      body.amount,
      body.currency || 'INR',
      body.category,
      body.description || '',
      body.frequency,
      body.startDate,
      body.endDate || null,
      body.nextDueDate,
      body.isActive !== false ? 1 : 0,
      id
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
    
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error updating recurring transaction:', error);
    return NextResponse.json({ error: 'Failed to update recurring transaction' }, { status: 500 });
  }
}

// DELETE recurring transaction
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    
    const currentUser = getCurrentUser();
    const userId = currentUser.id;
    
    const existing = db.prepare('SELECT * FROM recurring_transactions WHERE id = ? AND user_id = ?').get(id, userId);
    
    if (!existing) {
      return NextResponse.json({ error: 'Recurring transaction not found' }, { status: 404 });
    }
    
    db.prepare('DELETE FROM recurring_transactions WHERE id = ?').run(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting recurring transaction:', error);
    return NextResponse.json({ error: 'Failed to delete recurring transaction' }, { status: 500 });
  }
}

// PATCH - toggle active status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    
    const currentUser = getCurrentUser();
    const userId = currentUser.id;
    
    const existing = db.prepare('SELECT * FROM recurring_transactions WHERE id = ? AND user_id = ?').get(id, userId) as Record<string, unknown> | undefined;
    
    if (!existing) {
      return NextResponse.json({ error: 'Recurring transaction not found' }, { status: 404 });
    }
    
    const newStatus = existing.is_active ? 0 : 1;
    
    db.prepare('UPDATE recurring_transactions SET is_active = ? WHERE id = ?').run(newStatus, id);
    
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
    
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error toggling recurring transaction status:', error);
    return NextResponse.json({ error: 'Failed to toggle recurring transaction status' }, { status: 500 });
  }
}
