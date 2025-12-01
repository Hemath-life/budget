import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST() {
  try {
    const db = getDb();
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

    // Clear existing data
    db.exec('DELETE FROM transactions');
    db.exec('DELETE FROM budgets');
    db.exec('DELETE FROM goals');
    db.exec('DELETE FROM reminders');
    db.exec('DELETE FROM recurring_transactions');

    // ============ TRANSACTIONS ============
    const insertTransaction = db.prepare(`
      INSERT INTO transactions (id, type, amount, currency, category, description, date, is_recurring, tags, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
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
      insertTransaction.run(generateId(), t.type, t.amount, 'INR', t.category, t.description, t.date, 0, t.tags);
    }

    // ============ BUDGETS ============
    const insertBudget = db.prepare(`
      INSERT INTO budgets (id, category, amount, currency, period, spent, start_date, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
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
      insertBudget.run(generateId(), b.category, b.amount, 'INR', b.period, b.spent, monthStart);
    }

    // ============ GOALS ============
    const insertGoal = db.prepare(`
      INSERT INTO goals (id, name, target_amount, current_amount, currency, deadline, icon, color, is_completed, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `);

    const goals = [
      { name: 'Emergency Fund', target: 300000, current: 185000, icon: 'Shield', color: '#10B981', deadline: '2025-06-30' },
      { name: 'New Laptop', target: 120000, current: 45000, icon: 'Laptop', color: '#3B82F6', deadline: '2025-03-31' },
      { name: 'Vacation to Europe', target: 500000, current: 125000, icon: 'Plane', color: '#F59E0B', deadline: '2025-12-31' },
      { name: 'Home Down Payment', target: 1500000, current: 350000, icon: 'Home', color: '#8B5CF6', deadline: '2026-12-31' },
      { name: 'New Phone', target: 80000, current: 72000, icon: 'Smartphone', color: '#EC4899', deadline: '2025-02-28' },
    ];

    for (const g of goals) {
      insertGoal.run(generateId(), g.name, g.target, g.current, 'INR', g.deadline, g.icon, g.color, 0);
    }

    // ============ REMINDERS ============
    const insertReminder = db.prepare(`
      INSERT INTO reminders (id, title, amount, currency, due_date, category, is_recurring, frequency, is_paid, notify_before, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
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
      insertReminder.run(generateId(), r.title, r.amount, 'INR', r.dueDate, r.category, r.isRecurring, r.frequency, r.isPaid, 3);
    }

    // ============ RECURRING TRANSACTIONS ============
    const insertRecurring = db.prepare(`
      INSERT INTO recurring_transactions (id, type, amount, currency, category, description, frequency, start_date, next_due_date, is_active, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
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
      insertRecurring.run(generateId(), rt.type, rt.amount, 'INR', rt.category, rt.description, rt.frequency, rt.startDate, nextMonth, 1);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Dummy data added successfully!',
      counts: {
        transactions: transactions.length,
        budgets: budgets.length,
        goals: goals.length,
        reminders: reminders.length,
        recurring: recurringTransactions.length,
      }
    });
  } catch (error) {
    console.error('Error seeding dummy data:', error);
    return NextResponse.json({ error: 'Failed to seed dummy data' }, { status: 500 });
  }
}
