import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { generateId } from '@/lib/utils';

// GET all categories
export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    let query = 'SELECT * FROM categories';
    const params: string[] = [];
    
    if (type) {
      query += ' WHERE type = ?';
      params.push(type);
    }
    
    query += ' ORDER BY name ASC';
    
    const categories = db.prepare(query).all(...params);
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST create new category
export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    
    const id = generateId();
    
    const stmt = db.prepare(`
      INSERT INTO categories (id, name, type, icon, color)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, body.name, body.type, body.icon, body.color);
    
    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
