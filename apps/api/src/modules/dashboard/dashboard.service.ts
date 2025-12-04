import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const now = new Date();

    // Get current month range
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get last month range
    const firstDayOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );
    const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Calculate totals for current month
    const currentMonthIncomeResult = await this.prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        type: 'income',
        date: { gte: firstDayOfMonth, lte: lastDayOfMonth },
      },
    });

    const currentMonthExpensesResult = await this.prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        type: 'expense',
        date: { gte: firstDayOfMonth, lte: lastDayOfMonth },
      },
    });

    // Calculate totals for last month
    const lastMonthIncomeResult = await this.prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        type: 'income',
        date: { gte: firstDayOfLastMonth, lte: lastDayOfLastMonth },
      },
    });

    const lastMonthExpensesResult = await this.prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        type: 'expense',
        date: { gte: firstDayOfLastMonth, lte: lastDayOfLastMonth },
      },
    });

    // Calculate all-time totals
    const allTimeIncomeResult = await this.prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { userId, type: 'income' },
    });

    const allTimeExpensesResult = await this.prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { userId, type: 'expense' },
    });

    // Get recent transactions
    const recentTransactions = await this.prisma.transaction.findMany({
      where: { userId },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      take: 5,
      include: { category: true },
    });

    // Get expenses by category for current month
    const expensesByCategory = await this.prisma.transaction.groupBy({
      by: ['categoryId'],
      _sum: { amount: true },
      where: {
        userId,
        type: 'expense',
        date: { gte: firstDayOfMonth, lte: lastDayOfMonth },
      },
    });

    // Get upcoming reminders
    const upcomingReminders = await this.prisma.reminder.findMany({
      where: {
        userId,
        isPaid: false,
        dueDate: { gte: now },
      },
      orderBy: { dueDate: 'asc' },
      take: 5,
    });

    // Get budgets
    const budgets = await this.prisma.budget.findMany({
      where: { userId },
    });

    // Get active goals
    const goals = await this.prisma.goal.findMany({
      where: { userId, isCompleted: false },
      orderBy: { deadline: 'asc' },
    });

    const currentMonthIncome = currentMonthIncomeResult._sum.amount || 0;
    const currentMonthExpenses = currentMonthExpensesResult._sum.amount || 0;
    const lastMonthIncome = lastMonthIncomeResult._sum.amount || 0;
    const lastMonthExpenses = lastMonthExpensesResult._sum.amount || 0;
    const allTimeIncome = allTimeIncomeResult._sum.amount || 0;
    const allTimeExpenses = allTimeExpensesResult._sum.amount || 0;

    const balance = allTimeIncome - allTimeExpenses;
    const currentMonthBalance = currentMonthIncome - currentMonthExpenses;
    const lastMonthBalance = lastMonthIncome - lastMonthExpenses;

    const savingsRate =
      currentMonthIncome > 0
        ? Math.round((currentMonthBalance / currentMonthIncome) * 100)
        : 0;

    return {
      summary: {
        totalIncome: allTimeIncome,
        totalExpenses: allTimeExpenses,
        balance,
        currentMonth: {
          income: currentMonthIncome,
          expenses: currentMonthExpenses,
          balance: currentMonthBalance,
        },
        lastMonth: {
          income: lastMonthIncome,
          expenses: lastMonthExpenses,
          balance: lastMonthBalance,
        },
        savingsRate,
      },
      recentTransactions: recentTransactions.map((t) => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        currency: t.currency,
        category: t.categoryId,
        description: t.description,
        date: t.date.toISOString(),
        isRecurring: t.isRecurring,
        recurringId: t.recurringId,
        tags: t.tags ? JSON.parse(t.tags) : [],
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
      })),
      expensesByCategory: expensesByCategory.map((e) => ({
        category: e.categoryId,
        total: e._sum.amount || 0,
      })),
      upcomingReminders: upcomingReminders.map((r) => ({
        id: r.id,
        title: r.title,
        amount: r.amount,
        currency: r.currency,
        dueDate: r.dueDate.toISOString(),
        category: r.categoryId,
        isRecurring: r.isRecurring,
        frequency: r.frequency,
        isPaid: r.isPaid,
        notifyBefore: r.notifyBefore,
        createdAt: r.createdAt.toISOString(),
      })),
      budgets: budgets.map((b) => ({
        id: b.id,
        category: b.categoryId,
        amount: b.amount,
        currency: b.currency,
        period: b.period,
        spent: b.spent,
        startDate: b.startDate.toISOString(),
        createdAt: b.createdAt.toISOString(),
      })),
      goals: goals.map((g) => ({
        id: g.id,
        name: g.name,
        targetAmount: g.targetAmount,
        currentAmount: g.currentAmount,
        currency: g.currency,
        deadline: g.deadline.toISOString(),
        category: g.categoryId,
        icon: g.icon,
        color: g.color,
        isCompleted: g.isCompleted,
        createdAt: g.createdAt.toISOString(),
      })),
    };
  }
}
