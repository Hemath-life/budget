import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET dashboard summary
export async function GET() {
  try {
    const db = getDb();
    
    const currentUser = getCurrentUser();
    const userId = currentUser.id;
    
    // Get current month range
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    
    // Get last month range
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
    const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
    
    // Calculate totals for current month
    const currentMonthIncome = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total FROM transactions 
      WHERE user_id = ? AND type = 'income' AND date >= ? AND date <= ?
    `).get(userId, firstDayOfMonth, lastDayOfMonth) as { total: number };
    
    const currentMonthExpenses = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total FROM transactions 
      WHERE user_id = ? AND type = 'expense' AND date >= ? AND date <= ?
    `).get(userId, firstDayOfMonth, lastDayOfMonth) as { total: number };
    
    // Calculate totals for last month
    const lastMonthIncome = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total FROM transactions 
      WHERE user_id = ? AND type = 'income' AND date >= ? AND date <= ?
    `).get(userId, firstDayOfLastMonth, lastDayOfLastMonth) as { total: number };
    
    const lastMonthExpenses = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total FROM transactions 
      WHERE user_id = ? AND type = 'expense' AND date >= ? AND date <= ?
    `).get(userId, firstDayOfLastMonth, lastDayOfLastMonth) as { total: number };
    
    // Calculate all-time totals
    const allTimeIncome = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = ? AND type = 'income'
    `).get(userId) as { total: number };
    
    const allTimeExpenses = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = ? AND type = 'expense'
    `).get(userId) as { total: number };
    
    // Get recent transactions
    const recentTransactions = db.prepare(`
      SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC, created_at DESC LIMIT 5
    `).all(userId);
    
    // Get expenses by category for current month
    const expensesByCategory = db.prepare(`
      SELECT category, SUM(amount) as total FROM transactions 
      WHERE user_id = ? AND type = 'expense' AND date >= ? AND date <= ?
      GROUP BY category
    `).all(userId, firstDayOfMonth, lastDayOfMonth);
    
    // Get upcoming reminders
    const upcomingReminders = db.prepare(`
      SELECT * FROM reminders 
      WHERE user_id = ? AND is_paid = 0 AND due_date >= date('now')
      ORDER BY due_date ASC LIMIT 5
    `).all(userId);
    
    // Get budgets with progress
    const budgets = db.prepare('SELECT * FROM budgets WHERE user_id = ?').all(userId);
    
    // Get active goals
    const goals = db.prepare('SELECT * FROM goals WHERE user_id = ? AND is_completed = 0 ORDER BY deadline ASC').all(userId);
    
    const balance = allTimeIncome.total - allTimeExpenses.total;
    const currentMonthBalance = currentMonthIncome.total - currentMonthExpenses.total;
    const lastMonthBalance = lastMonthIncome.total - lastMonthExpenses.total;
    
    const savingsRate = currentMonthIncome.total > 0 
      ? Math.round((currentMonthBalance / currentMonthIncome.total) * 100) 
      : 0;
    
    return NextResponse.json({
      summary: {
        totalIncome: allTimeIncome.total,
        totalExpenses: allTimeExpenses.total,
        balance,
        currentMonth: {
          income: currentMonthIncome.total,
          expenses: currentMonthExpenses.total,
          balance: currentMonthBalance,
        },
        lastMonth: {
          income: lastMonthIncome.total,
          expenses: lastMonthExpenses.total,
          balance: lastMonthBalance,
        },
        savingsRate,
      },
      recentTransactions: (recentTransactions as Record<string, unknown>[]).map((t) => ({
        ...t,
        isRecurring: Boolean(t.is_recurring),
        recurringId: t.recurring_id,
        tags: t.tags ? JSON.parse(t.tags as string) : [],
        createdAt: t.created_at,
        updatedAt: t.updated_at,
      })),
      expensesByCategory,
      upcomingReminders: (upcomingReminders as Record<string, unknown>[]).map((r) => ({
        id: r.id,
        title: r.title,
        amount: r.amount,
        currency: r.currency,
        dueDate: r.due_date,
        category: r.category,
        isRecurring: Boolean(r.is_recurring),
        frequency: r.frequency,
        isPaid: Boolean(r.is_paid),
        notifyBefore: r.notify_before,
        createdAt: r.created_at,
      })),
      budgets: (budgets as Record<string, unknown>[]).map((b) => ({
        id: b.id,
        category: b.category,
        amount: b.amount,
        currency: b.currency,
        period: b.period,
        spent: b.spent,
        startDate: b.start_date,
        createdAt: b.created_at,
      })),
      goals: (goals as Record<string, unknown>[]).map((g) => ({
        id: g.id,
        name: g.name,
        targetAmount: g.target_amount,
        currentAmount: g.current_amount,
        currency: g.currency,
        deadline: g.deadline,
        category: g.category,
        icon: g.icon,
        color: g.color,
        isCompleted: Boolean(g.is_completed),
        createdAt: g.created_at,
      })),
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
