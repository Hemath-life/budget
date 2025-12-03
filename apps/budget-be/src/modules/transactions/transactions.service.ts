import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

interface FilterParams {
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

  create(createTransactionDto: CreateTransactionDto) {
    return this.prisma.transaction.create({
      data: createTransactionDto,
    });
  }

  private buildWhereClause(params: FilterParams): Prisma.TransactionWhereInput {
    const where: Prisma.TransactionWhereInput = {};

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
      orderBy: { date: 'desc' },
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
        orderBy: { date: 'desc' },
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

  findOne(id: string) {
    return this.prisma.transaction.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  update(id: string, updateTransactionDto: UpdateTransactionDto) {
    return this.prisma.transaction.update({
      where: { id },
      data: updateTransactionDto,
    });
  }

  remove(id: string) {
    return this.prisma.transaction.delete({
      where: { id },
    });
  }
}
