import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Demo user credentials from environment variables
const DEMO_EMAIL = process.env.DEMO_USER_EMAIL || 'demo@budgetapp.com';
const DEMO_PASSWORD = process.env.DEMO_USER_PASSWORD || 'demo123';
const DEMO_NAME = process.env.DEMO_USER_NAME || 'Demo User';

async function main() {
  console.log('🌱 Starting seed...');

  // Clean up existing data
  await prisma.transaction.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.reminder.deleteMany();
  await prisma.recurringTransaction.deleteMany();
  await prisma.settings.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await prisma.currency.deleteMany();

  console.log('🗑️  Cleaned up existing data');

  // Seed currencies
  const currencies = await prisma.currency.createMany({
    data: [
      { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 1 },
      { code: 'USD', name: 'US Dollar', symbol: '$', rate: 0.012 },
      { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.011 },
      { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.0095 },
      { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 1.78 },
      { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 0.018 },
      { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 0.016 },
      { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 0.016 },
      { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', rate: 0.044 },
    ],
  });
  console.log(`💱 Created ${currencies.count} currencies`);

  // Seed expense categories
  const expenseCategories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Food & Dining',
        type: 'expense',
        icon: 'utensils',
        color: '#FF6B6B',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Transportation',
        type: 'expense',
        icon: 'car',
        color: '#4ECDC4',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Shopping',
        type: 'expense',
        icon: 'shopping-bag',
        color: '#45B7D1',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Entertainment',
        type: 'expense',
        icon: 'film',
        color: '#96CEB4',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Bills & Utilities',
        type: 'expense',
        icon: 'file-text',
        color: '#FFEAA7',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Healthcare',
        type: 'expense',
        icon: 'heart',
        color: '#DDA0DD',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Education',
        type: 'expense',
        icon: 'book',
        color: '#98D8C8',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Travel',
        type: 'expense',
        icon: 'plane',
        color: '#F7DC6F',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Groceries',
        type: 'expense',
        icon: 'shopping-cart',
        color: '#82E0AA',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Personal Care',
        type: 'expense',
        icon: 'user',
        color: '#F8B500',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Subscriptions',
        type: 'expense',
        icon: 'credit-card',
        color: '#BB8FCE',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Gifts & Donations',
        type: 'expense',
        icon: 'gift',
        color: '#F1948A',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Home & Rent',
        type: 'expense',
        icon: 'home',
        color: '#85C1E9',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Insurance',
        type: 'expense',
        icon: 'shield',
        color: '#73C6B6',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Other Expenses',
        type: 'expense',
        icon: 'more-horizontal',
        color: '#AEB6BF',
      },
    }),
  ]);
  console.log(`📦 Created ${expenseCategories.length} expense categories`);

  // Seed income categories
  const incomeCategories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Salary',
        type: 'income',
        icon: 'briefcase',
        color: '#27AE60',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Freelance',
        type: 'income',
        icon: 'laptop',
        color: '#3498DB',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Investments',
        type: 'income',
        icon: 'trending-up',
        color: '#9B59B6',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Business',
        type: 'income',
        icon: 'building',
        color: '#E74C3C',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Rental Income',
        type: 'income',
        icon: 'key',
        color: '#F39C12',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Dividends',
        type: 'income',
        icon: 'pie-chart',
        color: '#1ABC9C',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Refunds',
        type: 'income',
        icon: 'rotate-ccw',
        color: '#E67E22',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Gifts Received',
        type: 'income',
        icon: 'gift',
        color: '#EC7063',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Other Income',
        type: 'income',
        icon: 'plus-circle',
        color: '#5DADE2',
      },
    }),
  ]);
  console.log(`💰 Created ${incomeCategories.length} income categories`);

  // Create a demo user from environment variables
  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);
  const demoUser = await prisma.user.create({
    data: {
      email: DEMO_EMAIL,
      password: hashedPassword,
      name: DEMO_NAME,
    },
  });
  console.log(`👤 Created demo user: ${demoUser.email}`);

  // Create settings for demo user
  await prisma.settings.create({
    data: {
      userId: demoUser.id,
      defaultCurrency: 'INR',
      theme: 'system',
      dateFormat: 'MMM dd, yyyy',
      language: 'en',
      notificationsEnabled: true,
    },
  });
  console.log('⚙️  Created user settings');

  // Create sample budgets
  const budgets = await Promise.all([
    prisma.budget.create({
      data: {
        userId: demoUser.id,
        categoryId: expenseCategories[0].id, // Food & Dining
        amount: 15000,
        currency: 'INR',
        period: 'monthly',
        spent: 8500,
        startDate: new Date('2025-12-01'),
      },
    }),
    prisma.budget.create({
      data: {
        userId: demoUser.id,
        categoryId: expenseCategories[1].id, // Transportation
        amount: 5000,
        currency: 'INR',
        period: 'monthly',
        spent: 3200,
        startDate: new Date('2025-12-01'),
      },
    }),
    prisma.budget.create({
      data: {
        userId: demoUser.id,
        categoryId: expenseCategories[2].id, // Shopping
        amount: 10000,
        currency: 'INR',
        period: 'monthly',
        spent: 4500,
        startDate: new Date('2025-12-01'),
      },
    }),
    prisma.budget.create({
      data: {
        userId: demoUser.id,
        categoryId: expenseCategories[3].id, // Entertainment
        amount: 3000,
        currency: 'INR',
        period: 'monthly',
        spent: 1500,
        startDate: new Date('2025-12-01'),
      },
    }),
  ]);
  console.log(`📊 Created ${budgets.length} budgets`);

  // Create sample goals
  const goals = await Promise.all([
    prisma.goal.create({
      data: {
        userId: demoUser.id,
        name: 'Emergency Fund',
        targetAmount: 100000,
        currentAmount: 45000,
        currency: 'INR',
        deadline: new Date('2026-06-30'),
        icon: 'shield',
        color: '#27AE60',
        isCompleted: false,
      },
    }),
    prisma.goal.create({
      data: {
        userId: demoUser.id,
        name: 'New Laptop',
        targetAmount: 80000,
        currentAmount: 25000,
        currency: 'INR',
        deadline: new Date('2026-03-31'),
        icon: 'laptop',
        color: '#3498DB',
        isCompleted: false,
      },
    }),
    prisma.goal.create({
      data: {
        userId: demoUser.id,
        name: 'Vacation Trip',
        targetAmount: 50000,
        currentAmount: 50000,
        currency: 'INR',
        deadline: new Date('2025-12-31'),
        icon: 'plane',
        color: '#F39C12',
        isCompleted: true,
      },
    }),
  ]);
  console.log(`🎯 Created ${goals.length} goals`);

  // Create sample transactions
  const transactions = await Promise.all([
    // Income transactions
    prisma.transaction.create({
      data: {
        type: 'income',
        amount: 75000,
        currency: 'INR',
        categoryId: incomeCategories[0].id, // Salary
        userId: demoUser.id,
        description: 'Monthly salary',
        date: new Date('2025-12-01'),
        tags: ['salary', 'monthly'],
      },
    }),
    prisma.transaction.create({
      data: {
        type: 'income',
        amount: 15000,
        currency: 'INR',
        categoryId: incomeCategories[1].id, // Freelance
        userId: demoUser.id,
        description: 'Website project payment',
        date: new Date('2025-12-03'),
        tags: ['freelance', 'project'],
      },
    }),
    // Expense transactions
    prisma.transaction.create({
      data: {
        type: 'expense',
        amount: 2500,
        currency: 'INR',
        categoryId: expenseCategories[0].id, // Food & Dining
        userId: demoUser.id,
        description: 'Dinner with friends',
        date: new Date('2025-12-02'),
        tags: ['food', 'social'],
      },
    }),
    prisma.transaction.create({
      data: {
        type: 'expense',
        amount: 1500,
        currency: 'INR',
        categoryId: expenseCategories[1].id, // Transportation
        userId: demoUser.id,
        description: 'Fuel refill',
        date: new Date('2025-12-02'),
        tags: ['fuel', 'car'],
      },
    }),
    prisma.transaction.create({
      data: {
        type: 'expense',
        amount: 4500,
        currency: 'INR',
        categoryId: expenseCategories[2].id, // Shopping
        userId: demoUser.id,
        description: 'New headphones',
        date: new Date('2025-12-03'),
        tags: ['electronics', 'gadgets'],
      },
    }),
    prisma.transaction.create({
      data: {
        type: 'expense',
        amount: 500,
        currency: 'INR',
        categoryId: expenseCategories[3].id, // Entertainment
        userId: demoUser.id,
        description: 'Movie tickets',
        date: new Date('2025-12-04'),
        tags: ['movies', 'weekend'],
      },
    }),
    prisma.transaction.create({
      data: {
        type: 'expense',
        amount: 3000,
        currency: 'INR',
        categoryId: expenseCategories[8].id, // Groceries
        userId: demoUser.id,
        description: 'Weekly groceries',
        date: new Date('2025-12-01'),
        tags: ['groceries', 'weekly'],
      },
    }),
    prisma.transaction.create({
      data: {
        type: 'expense',
        amount: 999,
        currency: 'INR',
        categoryId: expenseCategories[10].id, // Subscriptions
        userId: demoUser.id,
        description: 'Netflix subscription',
        date: new Date('2025-12-01'),
        tags: ['subscription', 'entertainment'],
      },
    }),
  ]);
  console.log(`💳 Created ${transactions.length} transactions`);

  // Create sample recurring transactions
  const recurringTransactions = await Promise.all([
    prisma.recurringTransaction.create({
      data: {
        userId: demoUser.id,
        type: 'income',
        amount: 75000,
        currency: 'INR',
        categoryId: incomeCategories[0].id, // Salary
        description: 'Monthly salary',
        frequency: 'monthly',
        startDate: new Date('2025-01-01'),
        nextDueDate: new Date('2026-01-01'),
        isActive: true,
      },
    }),
    prisma.recurringTransaction.create({
      data: {
        userId: demoUser.id,
        type: 'expense',
        amount: 999,
        currency: 'INR',
        categoryId: expenseCategories[10].id, // Subscriptions
        description: 'Netflix subscription',
        frequency: 'monthly',
        startDate: new Date('2025-01-15'),
        nextDueDate: new Date('2026-01-15'),
        isActive: true,
      },
    }),
    prisma.recurringTransaction.create({
      data: {
        userId: demoUser.id,
        type: 'expense',
        amount: 15000,
        currency: 'INR',
        categoryId: expenseCategories[12].id, // Home & Rent
        description: 'Monthly rent',
        frequency: 'monthly',
        startDate: new Date('2025-01-01'),
        nextDueDate: new Date('2026-01-01'),
        isActive: true,
      },
    }),
  ]);
  console.log(
    `🔄 Created ${recurringTransactions.length} recurring transactions`
  );

  // Create sample reminders
  const reminders = await Promise.all([
    prisma.reminder.create({
      data: {
        userId: demoUser.id,
        title: 'Pay electricity bill',
        amount: 2500,
        currency: 'INR',
        dueDate: new Date('2025-12-15'),
        categoryId: expenseCategories[4].id, // Bills & Utilities
        isRecurring: true,
        frequency: 'monthly',
        isPaid: false,
        notifyBefore: 3,
      },
    }),
    prisma.reminder.create({
      data: {
        userId: demoUser.id,
        title: 'Credit card payment',
        amount: 25000,
        currency: 'INR',
        dueDate: new Date('2025-12-20'),
        categoryId: expenseCategories[4].id, // Bills & Utilities
        isRecurring: true,
        frequency: 'monthly',
        isPaid: false,
        notifyBefore: 5,
      },
    }),
    prisma.reminder.create({
      data: {
        userId: demoUser.id,
        title: 'Insurance premium',
        amount: 12000,
        currency: 'INR',
        dueDate: new Date('2025-12-25'),
        categoryId: expenseCategories[13].id, // Insurance
        isRecurring: true,
        frequency: 'quarterly',
        isPaid: false,
        notifyBefore: 7,
      },
    }),
  ]);
  console.log(`🔔 Created ${reminders.length} reminders`);

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
