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
  // Create users table (FIRST - referenced by other tables)
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      avatar TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

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
      user_id INTEGER NOT NULL,
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
      FOREIGN KEY (category) REFERENCES categories(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Create budgets table
  db.exec(`
    CREATE TABLE IF NOT EXISTS budgets (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'INR',
      period TEXT NOT NULL CHECK (period IN ('weekly', 'monthly', 'quarterly', 'yearly')),
      spent REAL DEFAULT 0,
      start_date TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (category) REFERENCES categories(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Create goals table
  db.exec(`
    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
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
      FOREIGN KEY (category) REFERENCES categories(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Create reminders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS reminders (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
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
      FOREIGN KEY (category) REFERENCES categories(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Create recurring_transactions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS recurring_transactions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
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
      FOREIGN KEY (category) REFERENCES categories(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
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

  // Create subscriptions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      plan_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'past_due', 'trialing')),
      current_period_start TEXT NOT NULL,
      current_period_end TEXT,
      cancel_at_period_end INTEGER DEFAULT 0,
      trial_end TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
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

  // Seed dummy transactions if empty
  const transactionCount = db.prepare('SELECT COUNT(*) as count FROM transactions').get() as { count: number };
  if (transactionCount.count === 0) {
    seedDummyData(db);
  }
}

function seedDummyData(db: Database.Database) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Helper to generate dates
  const getDate = (daysAgo: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  };

  const generateId = () => Math.random().toString(36).substring(2, 15);

  // ============ DEMO USER (CREATE FIRST) ============
  const insertUser = db.prepare(`
    INSERT INTO users (email, name, avatar, created_at, updated_at)
    VALUES (?, ?, ?, datetime('now'), datetime('now'))
  `);

  const userResult = insertUser.run('demo@budgetapp.com', 'Demo User', null);
  const userId = userResult.lastInsertRowid as number; // Use the auto-generated ID

  // ============ TRANSACTIONS ============
  const insertTransaction = db.prepare(`
    INSERT INTO transactions (id, user_id, type, amount, currency, category, description, date, is_recurring, tags, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);

  const transactions = [
    // Income - Current month
    { type: 'income', amount: 85000, category: 'salary', description: 'November Salary', date: getDate(5), tags: '["monthly"]' },
    { type: 'income', amount: 15000, category: 'freelance', description: 'Website project payment', date: getDate(10), tags: '["project","web"]' },
    { type: 'income', amount: 5000, category: 'investments', description: 'Dividend from stocks', date: getDate(15), tags: '["stocks"]' },
    
    // Income - Last month
    { type: 'income', amount: 85000, category: 'salary', description: 'October Salary', date: getDate(35), tags: '["monthly"]' },
    { type: 'income', amount: 8000, category: 'freelance', description: 'Logo design project', date: getDate(40), tags: '["design"]' },
    
    // Expenses - Current month
    { type: 'expense', amount: 25000, category: 'rent', description: 'Monthly rent payment', date: getDate(3), tags: '["housing","monthly"]' },
    { type: 'expense', amount: 8500, category: 'groceries', description: 'Weekly groceries - BigBasket', date: getDate(2), tags: '["food"]' },
    { type: 'expense', amount: 3500, category: 'groceries', description: 'Fruits and vegetables', date: getDate(8), tags: '["food","organic"]' },
    { type: 'expense', amount: 4200, category: 'utilities', description: 'Electricity bill', date: getDate(7), tags: '["bills"]' },
    { type: 'expense', amount: 1800, category: 'utilities', description: 'Internet bill', date: getDate(7), tags: '["bills"]' },
    { type: 'expense', amount: 2500, category: 'transport', description: 'Petrol', date: getDate(4), tags: '["fuel"]' },
    { type: 'expense', amount: 1200, category: 'transport', description: 'Metro card recharge', date: getDate(12), tags: '["commute"]' },
    { type: 'expense', amount: 3500, category: 'dining', description: 'Dinner at restaurant', date: getDate(1), tags: '["social"]' },
    { type: 'expense', amount: 1500, category: 'dining', description: 'Coffee and snacks', date: getDate(6), tags: '["cafe"]' },
    { type: 'expense', amount: 2000, category: 'entertainment', description: 'Movie tickets', date: getDate(9), tags: '["movies"]' },
    { type: 'expense', amount: 999, category: 'subscriptions', description: 'Netflix subscription', date: getDate(11), tags: '["streaming"]' },
    { type: 'expense', amount: 199, category: 'subscriptions', description: 'Spotify subscription', date: getDate(11), tags: '["music"]' },
    { type: 'expense', amount: 5500, category: 'shopping', description: 'New shoes', date: getDate(14), tags: '["clothing"]' },
    { type: 'expense', amount: 2800, category: 'healthcare', description: 'Medicine and vitamins', date: getDate(18), tags: '["health"]' },
    { type: 'expense', amount: 1500, category: 'gifts', description: 'Birthday gift for friend', date: getDate(20), tags: '["birthday"]' },
    
    // Expenses - Last month
    { type: 'expense', amount: 25000, category: 'rent', description: 'October rent payment', date: getDate(33), tags: '["housing","monthly"]' },
    { type: 'expense', amount: 7200, category: 'groceries', description: 'Monthly groceries', date: getDate(38), tags: '["food"]' },
    { type: 'expense', amount: 3800, category: 'utilities', description: 'Electricity bill', date: getDate(37), tags: '["bills"]' },
    { type: 'expense', amount: 15000, category: 'travel', description: 'Weekend trip to Goa', date: getDate(42), tags: '["vacation"]' },
    { type: 'expense', amount: 8000, category: 'shopping', description: 'Diwali shopping', date: getDate(45), tags: '["festival"]' },
  ];

  for (const t of transactions) {
    insertTransaction.run(generateId(), userId, t.type, t.amount, 'INR', t.category, t.description, t.date, 0, t.tags);
  }

  // ============ BUDGETS ============
  const insertBudget = db.prepare(`
    INSERT INTO budgets (id, user_id, category, amount, currency, period, spent, start_date, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);

  const budgets = [
    { category: 'groceries', amount: 15000, spent: 12000, period: 'monthly' },
    { category: 'dining', amount: 8000, spent: 5000, period: 'monthly' },
    { category: 'entertainment', amount: 5000, spent: 2999, period: 'monthly' },
    { category: 'transport', amount: 6000, spent: 3700, period: 'monthly' },
    { category: 'shopping', amount: 10000, spent: 5500, period: 'monthly' },
    { category: 'utilities', amount: 8000, spent: 6000, period: 'monthly' },
  ];

  const monthStart = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
  for (const b of budgets) {
    insertBudget.run(generateId(), userId, b.category, b.amount, 'INR', b.period, b.spent, monthStart);
  }

  // ============ GOALS ============
  const insertGoal = db.prepare(`
    INSERT INTO goals (id, user_id, name, target_amount, current_amount, currency, deadline, icon, color, is_completed, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);

  const goals = [
    { name: 'Emergency Fund', target: 300000, current: 185000, icon: 'Shield', color: '#10B981', deadline: '2025-06-30' },
    { name: 'New Laptop', target: 120000, current: 45000, icon: 'Laptop', color: '#3B82F6', deadline: '2025-03-31' },
    { name: 'Vacation to Europe', target: 500000, current: 125000, icon: 'Plane', color: '#F59E0B', deadline: '2025-12-31' },
    { name: 'Home Down Payment', target: 1500000, current: 350000, icon: 'Home', color: '#8B5CF6', deadline: '2026-12-31' },
    { name: 'New Phone', target: 80000, current: 72000, icon: 'Smartphone', color: '#EC4899', deadline: '2025-02-28' },
  ];

  for (const g of goals) {
    insertGoal.run(generateId(), userId, g.name, g.target, g.current, 'INR', g.deadline, g.icon, g.color, 0);
  }

  // ============ REMINDERS ============
  const insertReminder = db.prepare(`
    INSERT INTO reminders (id, user_id, title, amount, currency, due_date, category, is_recurring, frequency, is_paid, notify_before, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);

  const reminders = [
    { title: 'Rent Payment', amount: 25000, category: 'rent', dueDate: getDate(-5), isRecurring: 1, frequency: 'monthly', isPaid: 0 },
    { title: 'Electricity Bill', amount: 4500, category: 'utilities', dueDate: getDate(-10), isRecurring: 1, frequency: 'monthly', isPaid: 0 },
    { title: 'Internet Bill', amount: 1800, category: 'utilities', dueDate: getDate(-12), isRecurring: 1, frequency: 'monthly', isPaid: 0 },
    { title: 'Netflix Subscription', amount: 999, category: 'subscriptions', dueDate: getDate(-15), isRecurring: 1, frequency: 'monthly', isPaid: 0 },
    { title: 'Credit Card Bill', amount: 35000, category: 'other', dueDate: getDate(-8), isRecurring: 1, frequency: 'monthly', isPaid: 0 },
    { title: 'Insurance Premium', amount: 15000, category: 'insurance', dueDate: getDate(-20), isRecurring: 1, frequency: 'quarterly', isPaid: 0 },
    { title: 'Gym Membership', amount: 3000, category: 'healthcare', dueDate: getDate(-25), isRecurring: 1, frequency: 'monthly', isPaid: 1 },
  ];

  for (const r of reminders) {
    insertReminder.run(generateId(), userId, r.title, r.amount, 'INR', r.dueDate, r.category, r.isRecurring, r.frequency, r.isPaid, 3);
  }

  // ============ RECURRING TRANSACTIONS ============
  const insertRecurring = db.prepare(`
    INSERT INTO recurring_transactions (id, user_id, type, amount, currency, category, description, frequency, start_date, next_due_date, is_active, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `);

  const recurringTransactions = [
    { type: 'income', amount: 85000, category: 'salary', description: 'Monthly Salary', frequency: 'monthly', startDate: '2024-01-01' },
    { type: 'expense', amount: 25000, category: 'rent', description: 'Monthly Rent', frequency: 'monthly', startDate: '2024-01-01' },
    { type: 'expense', amount: 999, category: 'subscriptions', description: 'Netflix', frequency: 'monthly', startDate: '2024-03-15' },
    { type: 'expense', amount: 199, category: 'subscriptions', description: 'Spotify', frequency: 'monthly', startDate: '2024-02-01' },
    { type: 'expense', amount: 3000, category: 'healthcare', description: 'Gym Membership', frequency: 'monthly', startDate: '2024-01-01' },
  ];

  const nextMonth = new Date(currentYear, currentMonth + 1, 1).toISOString().split('T')[0];
  for (const rt of recurringTransactions) {
    insertRecurring.run(generateId(), userId, rt.type, rt.amount, 'INR', rt.category, rt.description, rt.frequency, rt.startDate, nextMonth, 1);
  }

  console.log('✅ Dummy data seeded successfully!');
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}
