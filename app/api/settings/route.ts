import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GET settings
export async function GET() {
  try {
    const db = getDb();
    
    const settings = db.prepare('SELECT * FROM settings WHERE id = 1').get() as Record<string, unknown> | undefined;
    const currencies = db.prepare('SELECT * FROM currencies ORDER BY code ASC').all();
    
    if (!settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 });
    }
    
    const formatted = {
      defaultCurrency: settings.default_currency,
      currencies: currencies,
      theme: settings.theme,
      dateFormat: settings.date_format,
      language: settings.language,
      notificationsEnabled: Boolean(settings.notifications_enabled),
    };
    
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// PUT update settings
export async function PUT(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    
    const stmt = db.prepare(`
      UPDATE settings 
      SET default_currency = ?, theme = ?, date_format = ?, language = ?, notifications_enabled = ?
      WHERE id = 1
    `);
    
    stmt.run(
      body.defaultCurrency || 'INR',
      body.theme || 'system',
      body.dateFormat || 'MMM dd, yyyy',
      body.language || 'en',
      body.notificationsEnabled !== false ? 1 : 0
    );
    
    const settings = db.prepare('SELECT * FROM settings WHERE id = 1').get() as Record<string, unknown>;
    const currencies = db.prepare('SELECT * FROM currencies ORDER BY code ASC').all();
    
    const formatted = {
      defaultCurrency: settings.default_currency,
      currencies: currencies,
      theme: settings.theme,
      dateFormat: settings.date_format,
      language: settings.language,
      notificationsEnabled: Boolean(settings.notifications_enabled),
    };
    
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

// PATCH - update specific setting
export async function PATCH(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    
    if (body.defaultCurrency !== undefined) {
      db.prepare('UPDATE settings SET default_currency = ? WHERE id = 1').run(body.defaultCurrency);
    }
    
    if (body.theme !== undefined) {
      db.prepare('UPDATE settings SET theme = ? WHERE id = 1').run(body.theme);
    }
    
    if (body.dateFormat !== undefined) {
      db.prepare('UPDATE settings SET date_format = ? WHERE id = 1').run(body.dateFormat);
    }
    
    if (body.language !== undefined) {
      db.prepare('UPDATE settings SET language = ? WHERE id = 1').run(body.language);
    }
    
    if (body.notificationsEnabled !== undefined) {
      db.prepare('UPDATE settings SET notifications_enabled = ? WHERE id = 1')
        .run(body.notificationsEnabled ? 1 : 0);
    }
    
    const settings = db.prepare('SELECT * FROM settings WHERE id = 1').get() as Record<string, unknown>;
    const currencies = db.prepare('SELECT * FROM currencies ORDER BY code ASC').all();
    
    const formatted = {
      defaultCurrency: settings.default_currency,
      currencies: currencies,
      theme: settings.theme,
      dateFormat: settings.date_format,
      language: settings.language,
      notificationsEnabled: Boolean(settings.notifications_enabled),
    };
    
    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error updating setting:', error);
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}
