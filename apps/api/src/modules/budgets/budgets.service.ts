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
