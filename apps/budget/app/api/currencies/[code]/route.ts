import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GET single currency
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const db = getDb();
    const { code } = await params;
    
    const currency = db.prepare('SELECT * FROM currencies WHERE code = ?').get(code);
    
    if (!currency) {
      return NextResponse.json({ error: 'Currency not found' }, { status: 404 });
    }
    
    return NextResponse.json(currency);
  } catch (error) {
    console.error('Error fetching currency:', error);
    return NextResponse.json({ error: 'Failed to fetch currency' }, { status: 500 });
  }
}

// PUT update currency rate
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const db = getDb();
    const { code } = await params;
    const body = await request.json();
    
    const existing = db.prepare('SELECT * FROM currencies WHERE code = ?').get(code);
    
    if (!existing) {
      return NextResponse.json({ error: 'Currency not found' }, { status: 404 });
    }
    
    const stmt = db.prepare(`
      UPDATE currencies 
      SET name = ?, symbol = ?, rate = ?
      WHERE code = ?
    `);
    
    stmt.run(body.name, body.symbol, body.rate, code);
    
    const currency = db.prepare('SELECT * FROM currencies WHERE code = ?').get(code);
    
    return NextResponse.json(currency);
  } catch (error) {
    console.error('Error updating currency:', error);
    return NextResponse.json({ error: 'Failed to update currency' }, { status: 500 });
  }
}

// DELETE currency
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const db = getDb();
    const { code } = await params;
    
    const existing = db.prepare('SELECT * FROM currencies WHERE code = ?').get(code);
    
    if (!existing) {
      return NextResponse.json({ error: 'Currency not found' }, { status: 404 });
    }
    
    // Check if it's the default currency
    const settings = db.prepare('SELECT default_currency FROM settings WHERE id = 1').get() as { default_currency: string };
    if (settings.default_currency === code) {
      return NextResponse.json({ error: 'Cannot delete the default currency' }, { status: 400 });
    }
    
    db.prepare('DELETE FROM currencies WHERE code = ?').run(code);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting currency:', error);
    return NextResponse.json({ error: 'Failed to delete currency' }, { status: 500 });
  }
}
