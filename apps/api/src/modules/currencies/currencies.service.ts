import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';

@Injectable()
export class CurrenciesService {
  constructor(private prisma: PrismaService) {}

  async create(createCurrencyDto: CreateCurrencyDto) {
    const existing = await this.prisma.currency.findUnique({
      where: { code: createCurrencyDto.code },
    });

    if (existing) {
      throw new ConflictException('Currency already exists');
    }

    return this.prisma.currency.create({
      data: {
        ...createCurrencyDto,
        rate: createCurrencyDto.rate ?? 1,
      },
    });
  }

  async findAll() {
    return this.prisma.currency.findMany({
      orderBy: { code: 'asc' },
    });
  }

  async findOne(code: string) {
    const currency = await this.prisma.currency.findUnique({
      where: { code },
    });

    if (!currency) {
      throw new NotFoundException(`Currency with code ${code} not found`);
    }

    return currency;
  }

  async update(code: string, updateCurrencyDto: UpdateCurrencyDto) {
    try {
      return await this.prisma.currency.update({
        where: { code },
        data: updateCurrencyDto,
      });
    } catch (error) {
      throw new NotFoundException(`Currency with code ${code} not found`);
    }
  }

  async remove(code: string) {
    try {
      await this.prisma.currency.delete({
        where: { code },
      });
      return { success: true };
    } catch (error) {
      throw new NotFoundException(`Currency with code ${code} not found`);
    }
  }
}
