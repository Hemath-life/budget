import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

interface FilterParams {
  userId: string;
  type?: string;
  category?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
}

interface PaginationParams extends FilterParams {
  page: number;
  pageSize: number;
}

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(createTransactionDto: CreateTransactionDto, userId: string) {
    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    // Verify the category exists
    const category = await this.prisma.category.findUnique({
      where: { id: createTransactionDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException(
        `Category with ID "${createTransactionDto.categoryId}" not found`
      );
    }

    // Verify category type matches transaction type
    if (category.type !== createTransactionDto.type) {
      throw new BadRequestException(
        `Category type "${category.type}" does not match transaction type "${createTransactionDto.type}"`
      );
    }

    try {
      return await this.prisma.transaction.create({
        data: {
          type: createTransactionDto.type,
          amount: createTransactionDto.amount,
          currency: createTransactionDto.currency || 'INR',
          categoryId: createTransactionDto.categoryId,
          description: createTransactionDto.description,
          date: new Date(createTransactionDto.date),
          isRecurring: createTransactionDto.isRecurring || false,
          recurringId: createTransactionDto.recurringId,
          tags: createTransactionDto.tags
            ? createTransactionDto.tags.split(',').map((t) => t.trim())
            : [],
          userId,
        },
        include: { category: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new BadRequestException(
            `Invalid foreign key reference. Please ensure the user and category exist.`
          );
        }
      }
      throw error;
    }
  }

  private buildWhereClause(params: FilterParams): Prisma.TransactionWhereInput {
    const where: Prisma.TransactionWhereInput = {
      userId: params.userId,
    };

    if (params.type && params.type !== 'all') {
      where.type = params.type;
    }

    if (params.category && params.category !== 'all') {
      where.categoryId = params.category;
    }

    if (params.search) {
      where.description = {
        contains: params.search,
      };
    }

    if (params.dateFrom || params.dateTo) {
      where.date = {};
      if (params.dateFrom) {
        where.date.gte = new Date(params.dateFrom);
      }
      if (params.dateTo) {
        where.date.lte = new Date(params.dateTo);
      }
    }

    return where;
  }

  async findAll(params?: FilterParams) {
    const where = params ? this.buildWhereClause(params) : {};

    return this.prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      take: params?.limit,
    });
  }

  async findAllPaginated(params: PaginationParams) {
    const where = this.buildWhereClause(params);
    const skip = (params.page - 1) * params.pageSize;

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        include: { category: true },
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: params.pageSize,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data: transactions,
      pagination: {
        page: params.page,
        pageSize: params.pageSize,
        total,
        totalPages: Math.ceil(total / params.pageSize),
      },
    };
  }

  findOne(id: string, userId: string) {
    return this.prisma.transaction.findFirst({
      where: { id, userId },
      include: { category: true },
    });
  }

  update(
    id: string,
    userId: string,
    updateTransactionDto: UpdateTransactionDto
  ) {
    const data: Record<string, unknown> = {};

    if (updateTransactionDto.type !== undefined)
      data.type = updateTransactionDto.type;
    if (updateTransactionDto.amount !== undefined)
      data.amount = updateTransactionDto.amount;
    if (updateTransactionDto.currency !== undefined)
      data.currency = updateTransactionDto.currency;
    if (updateTransactionDto.categoryId !== undefined)
      data.categoryId = updateTransactionDto.categoryId;
    if (updateTransactionDto.description !== undefined)
      data.description = updateTransactionDto.description;
    if (updateTransactionDto.date !== undefined)
      data.date = new Date(updateTransactionDto.date);
    if (updateTransactionDto.isRecurring !== undefined)
      data.isRecurring = updateTransactionDto.isRecurring;
    if (updateTransactionDto.recurringId !== undefined)
      data.recurringId = updateTransactionDto.recurringId;
    if (updateTransactionDto.tags !== undefined)
      data.tags = updateTransactionDto.tags.split(',').map((t) => t.trim());

    return this.prisma.transaction.updateMany({
      where: { id, userId },
      data,
    });
  }

  remove(id: string, userId: string) {
    return this.prisma.transaction.deleteMany({
      where: { id, userId },
    });
  }
}
