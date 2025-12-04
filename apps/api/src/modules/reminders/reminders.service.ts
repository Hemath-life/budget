import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';

@Injectable()
export class RemindersService {
  constructor(private prisma: PrismaService) {}

  async create(createReminderDto: CreateReminderDto, userId: string) {
    const { category, dueDate, ...rest } = createReminderDto;

    const reminder = await this.prisma.reminder.create({
      data: {
        ...rest,
        categoryId: category,
        userId,
        dueDate: new Date(dueDate),
      },
    });

    return this.mapToResponse(reminder);
  }

  async findAll(userId: string, status?: 'paid' | 'unpaid') {
    const where: any = { userId };

    if (status === 'paid') {
      where.isPaid = true;
    } else if (status === 'unpaid') {
      where.isPaid = false;
    }

    const reminders = await this.prisma.reminder.findMany({
      where,
      orderBy: { dueDate: 'asc' },
    });

    return reminders.map((r) => this.mapToResponse(r));
  }

  async findOne(id: string, userId: string) {
    const reminder = await this.prisma.reminder.findFirst({
      where: { id, userId },
    });

    if (!reminder) {
      throw new NotFoundException(`Reminder with ID ${id} not found`);
    }

    return this.mapToResponse(reminder);
  }

  async update(
    id: string,
    updateReminderDto: UpdateReminderDto,
    userId: string,
  ) {
    const { category, dueDate, ...rest } = updateReminderDto;
    const data: any = { ...rest };

    if (category !== undefined) data.categoryId = category;
    if (dueDate) data.dueDate = new Date(dueDate);

    // Verify reminder belongs to user
    const existing = await this.prisma.reminder.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new NotFoundException(`Reminder with ID ${id} not found`);
    }

    const reminder = await this.prisma.reminder.update({
      where: { id },
      data,
    });
    return this.mapToResponse(reminder);
  }

  async markPaid(id: string, userId: string) {
    const reminder = await this.prisma.reminder.findFirst({
      where: { id, userId },
    });
    if (!reminder)
      throw new NotFoundException(`Reminder with ID ${id} not found`);

    // If recurring, update due date to next occurrence
    if (reminder.isRecurring && reminder.frequency) {
      const nextDueDate = this.getNextRecurringDate(
        reminder.dueDate,
        reminder.frequency as
          | 'daily'
          | 'weekly'
          | 'biweekly'
          | 'monthly'
          | 'quarterly'
          | 'yearly',
      );

      const updatedReminder = await this.prisma.reminder.update({
        where: { id },
        data: {
          dueDate: nextDueDate,
          isPaid: false,
        },
      });
      return this.mapToResponse(updatedReminder);
    }

    const updatedReminder = await this.prisma.reminder.update({
      where: { id },
      data: { isPaid: true },
    });
    return this.mapToResponse(updatedReminder);
  }

  async markUnpaid(id: string, userId: string) {
    // Verify reminder belongs to user
    const existing = await this.prisma.reminder.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new NotFoundException(`Reminder with ID ${id} not found`);
    }

    const reminder = await this.prisma.reminder.update({
      where: { id },
      data: { isPaid: false },
    });
    return this.mapToResponse(reminder);
  }

  async remove(id: string, userId: string) {
    // Verify reminder belongs to user
    const existing = await this.prisma.reminder.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      throw new NotFoundException(`Reminder with ID ${id} not found`);
    }

    await this.prisma.reminder.delete({
      where: { id },
    });
    return { success: true };
  }

  private getNextRecurringDate(
    currentDate: Date,
    frequency:
      | 'daily'
      | 'weekly'
      | 'biweekly'
      | 'monthly'
      | 'quarterly'
      | 'yearly',
  ): Date {
    const date = new Date(currentDate);

    switch (frequency) {
      case 'daily':
        date.setDate(date.getDate() + 1);
        break;
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'biweekly':
        date.setDate(date.getDate() + 14);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'quarterly':
        date.setMonth(date.getMonth() + 3);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        break;
    }

    return date;
  }

  private mapToResponse(reminder: any) {
    return {
      id: reminder.id,
      title: reminder.title,
      amount: reminder.amount,
      currency: reminder.currency,
      dueDate: reminder.dueDate.toISOString(),
      category: reminder.categoryId,
      isRecurring: reminder.isRecurring,
      frequency: reminder.frequency,
      isPaid: reminder.isPaid,
      notifyBefore: reminder.notifyBefore,
      createdAt: reminder.createdAt.toISOString(),
    };
  }
}
