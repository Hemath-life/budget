import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GET all currencies
export async function GET() {
  try {
    const db = getDb();
    
    const currencies = db.prepare('SELECT * FROM currencies ORDER BY code ASC').all();
    
    return NextResponse.json(currencies);
  } catch (error) {
    console.error('Error fetching currencies:', error);
    return NextResponse.json({ error: 'Failed to fetch currencies' }, { status: 500 });
  }
}

// POST add new currency
export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    
    // Check if currency already exists
    const existing = db.prepare('SELECT * FROM currencies WHERE code = ?').get(body.code);
    if (existing) {
      return NextResponse.json({ error: 'Currency already exists' }, { status: 400 });
    }
    
    const stmt = db.prepare(`
      INSERT INTO currencies (code, name, symbol, rate)
      VALUES (?, ?, ?, ?)
    `);
    
    stmt.run(body.code, body.name, body.symbol, body.rate || 1);
    
    const currency = db.prepare('SELECT * FROM currencies WHERE code = ?').get(body.code);
    
    return NextResponse.json(currency, { status: 201 });
  } catch (error) {
    console.error('Error adding currency:', error);
    return NextResponse.json({ error: 'Failed to add currency' }, { status: 500 });
  }
}
