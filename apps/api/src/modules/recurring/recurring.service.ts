import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecurringDto } from './dto/create-recurring.dto';
import { UpdateRecurringDto } from './dto/update-recurring.dto';

@Injectable()
export class RecurringService {
  constructor(private prisma: PrismaService) {}

  async create(createRecurringDto: CreateRecurringDto, userId: string) {
    const { category, startDate, endDate, nextDueDate, ...rest } =
      createRecurringDto;

    const recurring = await this.prisma.recurringTransaction.create({
      data: {
        ...rest,
        categoryId: category,
        userId,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        nextDueDate: nextDueDate ? new Date(nextDueDate) : new Date(startDate),
      },
    });

    return this.mapToResponse(recurring);
  }

  async findAll(userId: string, status?: 'active' | 'inactive') {
    const where: any = { userId };

    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'inactive') {
      where.isActive = false;
    }

    const recurring = await this.prisma.recurringTransaction.findMany({
      where,
      orderBy: { nextDueDate: 'asc' },
    });

    return recurring.map((r) => this.mapToResponse(r));
  }

  async findOne(id: string, userId: string) {
    const recurring = await this.prisma.recurringTransaction.findFirst({
      where: { id, userId },
    });

    if (!recurring) {
      throw new NotFoundException(
        `Recurring transaction with ID ${id} not found`,
      );
    }

    return this.mapToResponse(recurring);
  }

  async update(
    id: string,
    updateRecurringDto: UpdateRecurringDto,
    userId: string,
  ) {
    const { category, startDate, endDate, nextDueDate, ...rest } =
      updateRecurringDto;
    const data: any = { ...rest };

    if (category !== undefined) data.categoryId = category;
    if (startDate) data.startDate = new Date(startDate);
    if (endDate !== undefined)
      data.endDate = endDate ? new Date(endDate) : null;
    if (nextDueDate) data.nextDueDate = new Date(nextDueDate);

    // Verify recurring transaction belongs to user
    const existing = await this.prisma.recurringTransaction.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new NotFoundException(
        `Recurring transaction with ID ${id} not found`,
      );
    }

    const recurring = await this.prisma.recurringTransaction.update({
      where: { id },
      data,
    });
    return this.mapToResponse(recurring);
  }

  async toggle(id: string, userId: string) {
    const recurring = await this.prisma.recurringTransaction.findFirst({
      where: { id, userId },
    });

    if (!recurring) {
      throw new NotFoundException(
        `Recurring transaction with ID ${id} not found`,
      );
    }

    const updatedRecurring = await this.prisma.recurringTransaction.update({
      where: { id },
      data: { isActive: !recurring.isActive },
    });

    return this.mapToResponse(updatedRecurring);
  }

  async remove(id: string, userId: string) {
    // Verify recurring transaction belongs to user
    const existing = await this.prisma.recurringTransaction.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new NotFoundException(
        `Recurring transaction with ID ${id} not found`,
      );
    }

    await this.prisma.recurringTransaction.delete({
      where: { id },
    });
    return { success: true };
  }

  private mapToResponse(recurring: any) {
    return {
      id: recurring.id,
      type: recurring.type,
      amount: recurring.amount,
      currency: recurring.currency,
      category: recurring.categoryId,
      description: recurring.description,
      frequency: recurring.frequency,
      startDate: recurring.startDate.toISOString(),
      endDate: recurring.endDate?.toISOString() || null,
      nextDueDate: recurring.nextDueDate.toISOString(),
      isActive: recurring.isActive,
      createdAt: recurring.createdAt.toISOString(),
    };
  }
}
