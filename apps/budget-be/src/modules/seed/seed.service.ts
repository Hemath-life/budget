import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeedService {
  constructor(private prisma: PrismaService) {}

  async seed() {
    // Clear existing data
    await this.prisma.transaction.deleteMany();
    await this.prisma.budget.deleteMany();
    await this.prisma.goal.deleteMany();
    await this.prisma.reminder.deleteMany();
    await this.prisma.recurringTransaction.deleteMany();
    await this.prisma.category.deleteMany();
    await this.prisma.currency.deleteMany();
    await this.prisma.settings.deleteMany();
    await this.prisma.user.deleteMany();

    // Seed Demo User
    const hashedPassword = await bcrypt.hash('demo123', 10);
    const demoUser = await this.prisma.user.create({
      data: {
        email: 'demo@budgetapp.com',
        password: hashedPassword,
      },
    });

    // Seed Categories
    const categories = await Promise.all([
      // Income categories
      this.prisma.category.create({
        data: {
          name: 'Salary',
          type: 'income',
          icon: 'Briefcase',
          color: '#22C55E',
        },
      }),
      this.prisma.category.create({
        data: {
          name: 'Freelance',
          type: 'income',
          icon: 'Laptop',
          color: '#3B82F6',
        },
      }),
      this.prisma.category.create({
        data: {
          name: 'Investments',
          type: 'income',
          icon: 'TrendingUp',
          color: '#8B5CF6',
        },
      }),
      this.prisma.category.create({
        data: { name: 'Gifts', type: 'income', icon: 'Gift', color: '#EC4899' },
      }),
      // Expense categories
      this.prisma.category.create({
        data: {
          name: 'Food & Dining',
          type: 'expense',
          icon: 'Utensils',
          color: '#F97316',
        },
      }),
      this.prisma.category.create({
        data: {
          name: 'Transportation',
          type: 'expense',
          icon: 'Car',
          color: '#06B6D4',
        },
      }),
      this.prisma.category.create({
        data: {
          name: 'Shopping',
          type: 'expense',
          icon: 'ShoppingBag',
          color: '#F43F5E',
        },
      }),
      this.prisma.category.create({
        data: {
          name: 'Entertainment',
          type: 'expense',
          icon: 'Film',
          color: '#A855F7',
        },
      }),
      this.prisma.category.create({
        data: {
          name: 'Bills & Utilities',
          type: 'expense',
          icon: 'Zap',
          color: '#EAB308',
        },
      }),
      this.prisma.category.create({
        data: {
          name: 'Healthcare',
          type: 'expense',
          icon: 'Heart',
          color: '#EF4444',
        },
      }),
      this.prisma.category.create({
        data: {
          name: 'Education',
          type: 'expense',
          icon: 'GraduationCap',
          color: '#14B8A6',
        },
      }),
      this.prisma.category.create({
        data: { name: 'Rent', type: 'expense', icon: 'Home', color: '#6366F1' },
      }),
    ]);

    const [
      salary,
      freelance,
      investments,
      gifts,
      food,
      transport,
      shopping,
      entertainment,
      bills,
      healthcare,
      education,
      rent,
    ] = categories;

    // Seed Currencies
    await Promise.all([
      this.prisma.currency.create({
        data: { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 1 },
      }),
      this.prisma.currency.create({
        data: { code: 'USD', name: 'US Dollar', symbol: '$', rate: 0.012 },
      }),
      this.prisma.currency.create({
        data: { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.011 },
      }),
      this.prisma.currency.create({
        data: { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.0095 },
      }),
    ]);

    // Seed Settings
    await this.prisma.settings.create({
      data: {
        id: 1,
        defaultCurrency: 'INR',
        theme: 'system',
        dateFormat: 'MMM dd, yyyy',
        language: 'en',
        notificationsEnabled: true,
      },
    });

    // Helper to get random date in last N days
    const getRandomDate = (daysAgo: number) => {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
      return date;
    };

    // Seed Transactions (last 90 days)
    const transactions = [
      // Income transactions
      {
        type: 'income',
        amount: 75000,
        categoryId: salary.id,
        description: 'Monthly Salary - November',
        date: new Date('2025-11-01'),
      },
      {
        type: 'income',
        amount: 75000,
        categoryId: salary.id,
        description: 'Monthly Salary - October',
        date: new Date('2025-10-01'),
      },
      {
        type: 'income',
        amount: 75000,
        categoryId: salary.id,
        description: 'Monthly Salary - December',
        date: new Date('2025-12-01'),
      },
      {
        type: 'income',
        amount: 15000,
        categoryId: freelance.id,
        description: 'Website project',
        date: getRandomDate(30),
      },
      {
        type: 'income',
        amount: 8000,
        categoryId: freelance.id,
        description: 'Logo design',
        date: getRandomDate(45),
      },
      {
        type: 'income',
        amount: 5000,
        categoryId: investments.id,
        description: 'Dividend income',
        date: getRandomDate(20),
      },
      {
        type: 'income',
        amount: 2000,
        categoryId: gifts.id,
        description: 'Birthday gift',
        date: getRandomDate(60),
      },
      // Expense transactions
      {
        type: 'expense',
        amount: 25000,
        categoryId: rent.id,
        description: 'Monthly rent',
        date: new Date('2025-12-01'),
      },
      {
        type: 'expense',
        amount: 25000,
        categoryId: rent.id,
        description: 'Monthly rent',
        date: new Date('2025-11-01'),
      },
      {
        type: 'expense',
        amount: 3500,
        categoryId: food.id,
        description: 'Grocery shopping',
        date: getRandomDate(5),
      },
      {
        type: 'expense',
        amount: 1200,
        categoryId: food.id,
        description: 'Restaurant dinner',
        date: getRandomDate(10),
      },
      {
        type: 'expense',
        amount: 800,
        categoryId: food.id,
        description: 'Coffee & snacks',
        date: getRandomDate(3),
      },
      {
        type: 'expense',
        amount: 2500,
        categoryId: food.id,
        description: 'Weekly groceries',
        date: getRandomDate(15),
      },
      {
        type: 'expense',
        amount: 5000,
        categoryId: transport.id,
        description: 'Petrol',
        date: getRandomDate(7),
      },
      {
        type: 'expense',
        amount: 1500,
        categoryId: transport.id,
        description: 'Uber rides',
        date: getRandomDate(12),
      },
      {
        type: 'expense',
        amount: 8000,
        categoryId: shopping.id,
        description: 'New clothes',
        date: getRandomDate(20),
      },
      {
        type: 'expense',
        amount: 3500,
        categoryId: shopping.id,
        description: 'Electronics',
        date: getRandomDate(25),
      },
      {
        type: 'expense',
        amount: 500,
        categoryId: entertainment.id,
        description: 'Netflix subscription',
        date: getRandomDate(5),
      },
      {
        type: 'expense',
        amount: 1200,
        categoryId: entertainment.id,
        description: 'Movie tickets',
        date: getRandomDate(14),
      },
      {
        type: 'expense',
        amount: 2000,
        categoryId: entertainment.id,
        description: 'Concert tickets',
        date: getRandomDate(30),
      },
      {
        type: 'expense',
        amount: 3000,
        categoryId: bills.id,
        description: 'Electricity bill',
        date: getRandomDate(8),
      },
      {
        type: 'expense',
        amount: 1500,
        categoryId: bills.id,
        description: 'Internet bill',
        date: getRandomDate(10),
      },
      {
        type: 'expense',
        amount: 800,
        categoryId: bills.id,
        description: 'Mobile recharge',
        date: getRandomDate(5),
      },
      {
        type: 'expense',
        amount: 2500,
        categoryId: healthcare.id,
        description: 'Doctor visit',
        date: getRandomDate(35),
      },
      {
        type: 'expense',
        amount: 1800,
        categoryId: healthcare.id,
        description: 'Medicines',
        date: getRandomDate(20),
      },
      {
        type: 'expense',
        amount: 5000,
        categoryId: education.id,
        description: 'Online course',
        date: getRandomDate(40),
      },
      {
        type: 'expense',
        amount: 1500,
        categoryId: education.id,
        description: 'Books',
        date: getRandomDate(50),
      },
    ];

    for (const tx of transactions) {
      await this.prisma.transaction.create({
        data: {
          type: tx.type,
          amount: tx.amount,
          description: tx.description,
          date: tx.date,
          userId: demoUser.id,
          categoryId: tx.categoryId,
          currency: 'INR',
          isRecurring: false,
        },
      });
    }

    // Seed Budgets
    await Promise.all([
      this.prisma.budget.create({
        data: {
          categoryId: food.id,
          amount: 15000,
          currency: 'INR',
          period: 'monthly',
          spent: 8000,
          startDate: new Date('2025-12-01'),
        },
      }),
      this.prisma.budget.create({
        data: {
          categoryId: transport.id,
          amount: 8000,
          currency: 'INR',
          period: 'monthly',
          spent: 6500,
          startDate: new Date('2025-12-01'),
        },
      }),
      this.prisma.budget.create({
        data: {
          categoryId: shopping.id,
          amount: 10000,
          currency: 'INR',
          period: 'monthly',
          spent: 11500,
          startDate: new Date('2025-12-01'),
        },
      }),
      this.prisma.budget.create({
        data: {
          categoryId: entertainment.id,
          amount: 5000,
          currency: 'INR',
          period: 'monthly',
          spent: 3700,
          startDate: new Date('2025-12-01'),
        },
      }),
      this.prisma.budget.create({
        data: {
          categoryId: bills.id,
          amount: 6000,
          currency: 'INR',
          period: 'monthly',
          spent: 5300,
          startDate: new Date('2025-12-01'),
        },
      }),
    ]);

    // Seed Goals
    await Promise.all([
      this.prisma.goal.create({
        data: {
          name: 'Emergency Fund',
          targetAmount: 300000,
          currentAmount: 150000,
          currency: 'INR',
          deadline: new Date('2026-06-30'),
          icon: 'Shield',
          color: '#22C55E',
          isCompleted: false,
        },
      }),
      this.prisma.goal.create({
        data: {
          name: 'New Laptop',
          targetAmount: 100000,
          currentAmount: 45000,
          currency: 'INR',
          deadline: new Date('2025-03-31'),
          icon: 'Laptop',
          color: '#3B82F6',
          isCompleted: false,
        },
      }),
      this.prisma.goal.create({
        data: {
          name: 'Vacation Trip',
          targetAmount: 80000,
          currentAmount: 80000,
          currency: 'INR',
          deadline: new Date('2025-01-15'),
          icon: 'Plane',
          color: '#F97316',
          isCompleted: true,
        },
      }),
      this.prisma.goal.create({
        data: {
          name: 'Home Down Payment',
          targetAmount: 1000000,
          currentAmount: 250000,
          currency: 'INR',
          deadline: new Date('2027-12-31'),
          icon: 'Home',
          color: '#8B5CF6',
          isCompleted: false,
        },
      }),
    ]);

    // Seed Reminders
    await Promise.all([
      this.prisma.reminder.create({
        data: {
          title: 'Rent Payment',
          amount: 25000,
          currency: 'INR',
          dueDate: new Date('2025-12-05'),
          categoryId: rent.id,
          isRecurring: true,
          frequency: 'monthly',
          isPaid: false,
          notifyBefore: 3,
        },
      }),
      this.prisma.reminder.create({
        data: {
          title: 'Electricity Bill',
          amount: 3000,
          currency: 'INR',
          dueDate: new Date('2025-12-10'),
          categoryId: bills.id,
          isRecurring: true,
          frequency: 'monthly',
          isPaid: false,
          notifyBefore: 5,
        },
      }),
      this.prisma.reminder.create({
        data: {
          title: 'Insurance Premium',
          amount: 15000,
          currency: 'INR',
          dueDate: new Date('2025-12-15'),
          categoryId: healthcare.id,
          isRecurring: true,
          frequency: 'quarterly',
          isPaid: false,
          notifyBefore: 7,
        },
      }),
      this.prisma.reminder.create({
        data: {
          title: 'Credit Card Bill',
          amount: 12000,
          currency: 'INR',
          dueDate: new Date('2025-12-20'),
          categoryId: bills.id,
          isRecurring: true,
          frequency: 'monthly',
          isPaid: false,
          notifyBefore: 5,
        },
      }),
    ]);

    // Seed Recurring Transactions
    await Promise.all([
      this.prisma.recurringTransaction.create({
        data: {
          type: 'income',
          amount: 75000,
          currency: 'INR',
          categoryId: salary.id,
          description: 'Monthly Salary',
          frequency: 'monthly',
          startDate: new Date('2025-01-01'),
          nextDueDate: new Date('2026-01-01'),
          isActive: true,
        },
      }),
      this.prisma.recurringTransaction.create({
        data: {
          type: 'expense',
          amount: 25000,
          currency: 'INR',
          categoryId: rent.id,
          description: 'Monthly Rent',
          frequency: 'monthly',
          startDate: new Date('2025-01-01'),
          nextDueDate: new Date('2026-01-01'),
          isActive: true,
        },
      }),
      this.prisma.recurringTransaction.create({
        data: {
          type: 'expense',
          amount: 500,
          currency: 'INR',
          categoryId: entertainment.id,
          description: 'Netflix Subscription',
          frequency: 'monthly',
          startDate: new Date('2025-01-01'),
          nextDueDate: new Date('2026-01-01'),
          isActive: true,
        },
      }),
      this.prisma.recurringTransaction.create({
        data: {
          type: 'expense',
          amount: 1500,
          currency: 'INR',
          categoryId: bills.id,
          description: 'Internet Bill',
          frequency: 'monthly',
          startDate: new Date('2025-01-01'),
          nextDueDate: new Date('2026-01-01'),
          isActive: true,
        },
      }),
    ]);

    return {
      success: true,
      message: 'Database seeded successfully',
      data: {
        users: 1,
        categories: categories.length,
        currencies: 4,
        transactions: transactions.length,
        budgets: 5,
        goals: 4,
        reminders: 4,
        recurringTransactions: 4,
      },
      demoCredentials: {
        email: 'demo@budgetapp.com',
        password: 'demo123',
      },
    };
  }
}
