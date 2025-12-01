import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GET single category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

// PUT update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    const body = await request.json();
    
    const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    
    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    const stmt = db.prepare(`
      UPDATE categories 
      SET name = ?, type = ?, icon = ?, color = ?
      WHERE id = ?
    `);
    
    stmt.run(body.name, body.type, body.icon, body.color, id);
    
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = getDb();
    const { id } = await params;
    
    const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    
    if (!existing) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    // Check if category is used in transactions
    const usageCount = db.prepare('SELECT COUNT(*) as count FROM transactions WHERE category = ?').get(id) as { count: number };
    
    if (usageCount.count > 0) {
      return NextResponse.json({ error: 'Category is in use and cannot be deleted' }, { status: 400 });
    }
    
    db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
