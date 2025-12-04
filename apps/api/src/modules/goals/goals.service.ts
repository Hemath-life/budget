import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalsService {
  constructor(private prisma: PrismaService) {}

  async create(createGoalDto: CreateGoalDto, userId: string) {
    const { category, deadline, ...rest } = createGoalDto;

    const goal = await this.prisma.goal.create({
      data: {
        ...rest,
        categoryId: category,
        userId,
        deadline: new Date(deadline),
      },
    });

    return this.mapToResponse(goal);
  }

  async findAll(userId: string) {
    const goals = await this.prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return goals.map((g) => this.mapToResponse(g));
  }

  async findOne(id: string, userId: string) {
    const goal = await this.prisma.goal.findFirst({
      where: { id, userId },
    });

    if (!goal) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }

    return this.mapToResponse(goal);
  }

  async update(id: string, updateGoalDto: UpdateGoalDto, userId: string) {
    const { category, deadline, ...rest } = updateGoalDto;
    const data: any = { ...rest };

    if (category !== undefined) data.categoryId = category;
    if (deadline) data.deadline = new Date(deadline);

    // Verify goal belongs to user
    const existing = await this.prisma.goal.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }

    const goal = await this.prisma.goal.update({
      where: { id },
      data,
    });
    return this.mapToResponse(goal);
  }

  async contribute(id: string, amount: number, userId: string) {
    const goal = await this.prisma.goal.findFirst({ where: { id, userId } });
    if (!goal) throw new NotFoundException(`Goal with ID ${id} not found`);

    const newAmount = goal.currentAmount + amount;
    const isCompleted = newAmount >= goal.targetAmount;

    const updatedGoal = await this.prisma.goal.update({
      where: { id },
      data: {
        currentAmount: newAmount,
        isCompleted,
      },
    });
    return this.mapToResponse(updatedGoal);
  }

  async remove(id: string, userId: string) {
    // Verify goal belongs to user
    const existing = await this.prisma.goal.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }

    await this.prisma.goal.delete({
      where: { id },
    });
    return { success: true };
  }

  async loadDefaults(userId: string) {
    const existingGoals = await this.prisma.goal.findMany({
      where: { userId },
    });

    if (existingGoals.length > 0) {
      return {
        success: false,
        message:
          'Goals already exist. Delete existing goals first to load defaults.',
        count: existingGoals.length,
      };
    }

    const defaultGoals = [
      {
        name: 'Emergency Fund',
        targetAmount: 300000,
        currentAmount: 0,
        currency: 'INR',
        deadline: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1),
        ),
        icon: 'Shield',
        color: '#22C55E',
        isCompleted: false,
      },
      {
        name: 'Vacation Trip',
        targetAmount: 100000,
        currentAmount: 0,
        currency: 'INR',
        deadline: new Date(new Date().setMonth(new Date().getMonth() + 6)),
        icon: 'Plane',
        color: '#3B82F6',
        isCompleted: false,
      },
      {
        name: 'New Gadget',
        targetAmount: 50000,
        currentAmount: 0,
        currency: 'INR',
        deadline: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        icon: 'Laptop',
        color: '#8B5CF6',
        isCompleted: false,
      },
      {
        name: 'Home Down Payment',
        targetAmount: 1000000,
        currentAmount: 0,
        currency: 'INR',
        deadline: new Date(
          new Date().setFullYear(new Date().getFullYear() + 3),
        ),
        icon: 'Home',
        color: '#F97316',
        isCompleted: false,
      },
    ];

    const goalsToCreate = defaultGoals.map((goal) => ({
      ...goal,
      userId,
    }));

    const created = await this.prisma.goal.createMany({
      data: goalsToCreate,
    });

    return {
      success: true,
      message: 'Default goals loaded successfully',
      count: created.count,
    };
  }

  private mapToResponse(goal: any) {
    return {
      id: goal.id,
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      currency: goal.currency,
      deadline: goal.deadline.toISOString(),
      category: goal.categoryId,
      icon: goal.icon,
      color: goal.color,
      isCompleted: goal.isCompleted,
      createdAt: goal.createdAt.toISOString(),
    };
  }
}
