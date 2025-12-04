import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

@Injectable()
export class BudgetsService {
  constructor(private prisma: PrismaService) {}

  async create(createBudgetDto: CreateBudgetDto, userId: string) {
    const { category, startDate, ...rest } = createBudgetDto;

    const budget = await this.prisma.budget.create({
      data: {
        ...rest,
        categoryId: category,
        userId,
        startDate: startDate ? new Date(startDate) : new Date(),
      },
    });

    return this.mapToResponse(budget);
  }

  async findAll(userId: string) {
    const budgets = await this.prisma.budget.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return budgets.map((b) => this.mapToResponse(b));
  }

  async findOne(id: string, userId: string) {
    const budget = await this.prisma.budget.findFirst({
      where: { id, userId },
    });

    if (!budget) {
      throw new NotFoundException(`Budget with ID ${id} not found`);
    }

    return this.mapToResponse(budget);
  }

  async update(id: string, updateBudgetDto: UpdateBudgetDto, userId: string) {
    const { category, startDate, ...rest } = updateBudgetDto;
    const data: any = { ...rest };

    if (category) data.categoryId = category;
    if (startDate) data.startDate = new Date(startDate);

    // Verify budget belongs to user
    const existing = await this.prisma.budget.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new NotFoundException(`Budget with ID ${id} not found`);
    }

    const budget = await this.prisma.budget.update({
      where: { id },
      data,
    });
    return this.mapToResponse(budget);
  }

  async remove(id: string, userId: string) {
    // Verify budget belongs to user
    const existing = await this.prisma.budget.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new NotFoundException(`Budget with ID ${id} not found`);
    }

    await this.prisma.budget.delete({
      where: { id },
    });
    return { success: true };
  }

  async loadDefaults(userId: string) {
    const existingBudgets = await this.prisma.budget.findMany({
      where: { userId },
    });

    if (existingBudgets.length > 0) {
      return {
        success: false,
        message:
          'Budgets already exist. Delete existing budgets first to load defaults.',
        count: existingBudgets.length,
      };
    }

    // Get expense categories to create budgets for
    const expenseCategories = await this.prisma.category.findMany({
      where: { type: 'expense' },
      take: 5,
    });

    if (expenseCategories.length === 0) {
      return {
        success: false,
        message: 'No expense categories found. Please create categories first.',
        count: 0,
      };
    }

    const defaultBudgets = [
      { amount: 15000, period: 'monthly' },
      { amount: 8000, period: 'monthly' },
      { amount: 10000, period: 'monthly' },
      { amount: 5000, period: 'monthly' },
      { amount: 6000, period: 'monthly' },
    ];

    const budgetsToCreate = expenseCategories.map((cat, index) => ({
      userId,
      categoryId: cat.id,
      amount: defaultBudgets[index]?.amount || 5000,
      currency: 'INR',
      period: defaultBudgets[index]?.period || 'monthly',
      spent: 0,
      startDate: new Date(),
    }));

    const created = await this.prisma.budget.createMany({
      data: budgetsToCreate,
    });

    return {
      success: true,
      message: 'Default budgets loaded successfully',
      count: created.count,
    };
  }

  private mapToResponse(budget: any) {
    return {
      id: budget.id,
      category: budget.categoryId,
      amount: budget.amount,
      currency: budget.currency,
      period: budget.period,
      spent: budget.spent,
      startDate: budget.startDate.toISOString(),
      createdAt: budget.createdAt.toISOString(),
    };
  }
}
