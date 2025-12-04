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
