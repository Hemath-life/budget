import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByProvider(
    provider: string,
    providerId: string,
  ): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        provider,
        providerId,
      },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async updateProvider(
    userId: string,
    provider: string,
    providerId: string,
    avatar?: string,
  ): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        provider,
        providerId,
        ...(avatar && { avatar }),
      },
    });
  }

  async update(userId: string, data: { name?: string }): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async delete(userId: string): Promise<void> {
    // Delete all related data in a transaction
    await this.prisma.$transaction([
      // Delete transactions
      this.prisma.transaction.deleteMany({ where: { userId } }),
      // Delete budgets
      this.prisma.budget.deleteMany({ where: { userId } }),
      // Delete goals
      this.prisma.goal.deleteMany({ where: { userId } }),
      // Delete recurring transactions
      this.prisma.recurringTransaction.deleteMany({ where: { userId } }),
      // Delete reminders
      this.prisma.reminder.deleteMany({ where: { userId } }),
      // Delete settings
      this.prisma.settings.deleteMany({ where: { userId } }),
      // Finally delete the user
      this.prisma.user.delete({ where: { id: userId } }),
    ]);
  }
}
