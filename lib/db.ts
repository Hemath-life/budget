import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'budget.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    initializeDatabase(db);
  }
  return db;
}

function initializeDatabase(db: Database.Database) {
  // Create categories table
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
      icon TEXT NOT NULL,
      color TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Create transactions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
      amount REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'INR',
      category TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      is_recurring INTEGER DEFAULT 0,
      recurring_id TEXT,
      tags TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (category) REFERENCES categories(id)
    )
  `);

  // Create budgets table
  db.exec(`
    CREATE TABLE IF NOT EXISTS budgets (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'INR',
      period TEXT NOT NULL CHECK (period IN ('weekly', 'monthly', 'quarterly', 'yearly')),
      spent REAL DEFAULT 0,
      start_date TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (category) REFERENCES categories(id)
    )
  `);

  // Create goals table
  db.exec(`
    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      target_amount REAL NOT NULL,
      current_amount REAL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'INR',
      deadline TEXT NOT NULL,
      category TEXT,
      icon TEXT NOT NULL,
      color TEXT NOT NULL,
      is_completed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (category) REFERENCES categories(id)
    )
  `);

  // Create reminders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS reminders (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'INR',
      due_date TEXT NOT NULL,
      category TEXT NOT NULL,
      is_recurring INTEGER DEFAULT 0,
      frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly')),
      is_paid INTEGER DEFAULT 0,
      notify_before INTEGER DEFAULT 3,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (category) REFERENCES categories(id)
    )
  `);

  // Create recurring_transactions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS recurring_transactions (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
      amount REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'INR',
      category TEXT NOT NULL,
      description TEXT,
      frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly')),
      start_date TEXT NOT NULL,
      end_date TEXT,
      next_due_date TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (category) REFERENCES categories(id)
    )
  `);

  // Create settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      default_currency TEXT NOT NULL DEFAULT 'INR',
      theme TEXT NOT NULL DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
      date_format TEXT NOT NULL DEFAULT 'MMM dd, yyyy',
      language TEXT NOT NULL DEFAULT 'en',
      notifications_enabled INTEGER DEFAULT 1
    )
  `);

  // Create currencies table
  db.exec(`
    CREATE TABLE IF NOT EXISTS currencies (
      code TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      symbol TEXT NOT NULL,
      rate REAL NOT NULL DEFAULT 1
    )
  `);

  // Seed default categories if empty
  const categoryCount = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
  if (categoryCount.count === 0) {
    const insertCategory = db.prepare('INSERT INTO categories (id, name, type, icon, color) VALUES (?, ?, ?, ?, ?)');
    const defaultCategories = [
      // Income categories
      ['salary', 'Salary', 'income', 'Briefcase', '#10B981'],
      ['freelance', 'Freelance', 'income', 'Laptop', '#3B82F6'],
      ['investments', 'Investments', 'income', 'TrendingUp', '#8B5CF6'],
      ['rental', 'Rental Income', 'income', 'Home', '#F59E0B'],
      ['gifts-income', 'Gifts', 'income', 'Gift', '#EC4899'],
      ['other-income', 'Other Income', 'income', 'Plus', '#6B7280'],
      // Expense categories
      ['rent', 'Rent', 'expense', 'Home', '#EF4444'],
      ['groceries', 'Groceries', 'expense', 'ShoppingCart', '#F97316'],
      ['utilities', 'Utilities', 'expense', 'Zap', '#EAB308'],
      ['transport', 'Transportation', 'expense', 'Car', '#84CC16'],
      ['entertainment', 'Entertainment', 'expense', 'Film', '#06B6D4'],
      ['shopping', 'Shopping', 'expense', 'ShoppingBag', '#8B5CF6'],
      ['healthcare', 'Healthcare', 'expense', 'Heart', '#EC4899'],
      ['education', 'Education', 'expense', 'GraduationCap', '#14B8A6'],
      ['dining', 'Dining', 'expense', 'Utensils', '#F43F5E'],
      ['travel', 'Travel', 'expense', 'Plane', '#0EA5E9'],
      ['subscriptions', 'Subscriptions', 'expense', 'CreditCard', '#A855F7'],
      ['insurance', 'Insurance', 'expense', 'Shield', '#64748B'],
      ['gifts', 'Gifts', 'expense', 'Gift', '#FB7185'],
      ['other', 'Other', 'expense', 'MoreHorizontal', '#9CA3AF'],
    ];
    
    for (const cat of defaultCategories) {
      insertCategory.run(...cat);
    }
  }

  // Seed default currencies if empty
  const currencyCount = db.prepare('SELECT COUNT(*) as count FROM currencies').get() as { count: number };
  if (currencyCount.count === 0) {
    const insertCurrency = db.prepare('INSERT INTO currencies (code, name, symbol, rate) VALUES (?, ?, ?, ?)');
    const defaultCurrencies = [
      ['USD', 'US Dollar', '$', 1],
      ['EUR', 'Euro', '€', 0.92],
      ['GBP', 'British Pound', '£', 0.79],
      ['JPY', 'Japanese Yen', '¥', 149.50],
      ['CAD', 'Canadian Dollar', 'C$', 1.36],
      ['AUD', 'Australian Dollar', 'A$', 1.53],
      ['CHF', 'Swiss Franc', 'CHF', 0.88],
      ['CNY', 'Chinese Yuan', '¥', 7.24],
      ['INR', 'Indian Rupee', '₹', 83.12],
      ['MXN', 'Mexican Peso', '$', 17.15],
    ];
    
    for (const curr of defaultCurrencies) {
      insertCurrency.run(...curr);
    }
  }

  // Seed default settings if empty
  const settingsCount = db.prepare('SELECT COUNT(*) as count FROM settings').get() as { count: number };
  if (settingsCount.count === 0) {
    db.prepare('INSERT INTO settings (id, default_currency, theme, date_format, language, notifications_enabled) VALUES (1, ?, ?, ?, ?, ?)')
      .run('INR', 'system', 'MMM dd, yyyy', 'en', 1);
  }
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}
