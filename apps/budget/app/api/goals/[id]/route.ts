import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET single goal
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    
    const currentUser = getCurrentUser();
    const userId = currentUser.id;
    
    const goal = db.prepare('SELECT * FROM goals WHERE id = ? AND user_id = ?').get(id, userId) as Record<string, unknown> | undefined;
    
    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }
    
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
    
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching goal:', error);
    return NextResponse.json({ error: 'Failed to fetch goal' }, { status: 500 });
  }
}

// PUT update goal
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
    
    const existing = db.prepare('SELECT * FROM goals WHERE id = ? AND user_id = ?').get(id, userId);
    
    if (!existing) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }
    
    const stmt = db.prepare(`
      UPDATE goals 
      SET name = ?, target_amount = ?, current_amount = ?, currency = ?, deadline = ?, category = ?, icon = ?, color = ?, is_completed = ?
      WHERE id = ?
    `);
    
    stmt.run(
      body.name,
      body.targetAmount,
      body.currentAmount || 0,
      body.currency || 'INR',
      body.deadline,
      body.category || null,
      body.icon || 'Target',
      body.color || '#3B82F6',
      body.isCompleted ? 1 : 0,
      id
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
    
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error updating goal:', error);
    return NextResponse.json({ error: 'Failed to update goal' }, { status: 500 });
  }
}

// DELETE goal
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    
    const currentUser = getCurrentUser();
    const userId = currentUser.id;
    
    const existing = db.prepare('SELECT * FROM goals WHERE id = ? AND user_id = ?').get(id, userId);
    
    if (!existing) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }
    
    db.prepare('DELETE FROM goals WHERE id = ?').run(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting goal:', error);
    return NextResponse.json({ error: 'Failed to delete goal' }, { status: 500 });
  }
}

// PATCH - contribute to goal
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    const body = await request.json();
    
    const currentUser = getCurrentUser();
    const userId = currentUser.id;
    
    const existing = db.prepare('SELECT * FROM goals WHERE id = ? AND user_id = ?').get(id, userId) as Record<string, unknown> | undefined;
    
    if (!existing) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }
    
    const newAmount = (existing.current_amount as number) + (body.amount || 0);
    const isCompleted = newAmount >= (existing.target_amount as number);
    
    db.prepare('UPDATE goals SET current_amount = ?, is_completed = ? WHERE id = ?')
      .run(newAmount, isCompleted ? 1 : 0, id);
    
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
    
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error contributing to goal:', error);
    return NextResponse.json({ error: 'Failed to contribute to goal' }, { status: 500 });
  }
}
