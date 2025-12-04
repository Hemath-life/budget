import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

const DEFAULT_CATEGORIES = [
  // Income categories
  { name: 'Salary', type: 'income', icon: 'Briefcase', color: '#22C55E' },
  { name: 'Freelance', type: 'income', icon: 'Laptop', color: '#3B82F6' },
  { name: 'Investments', type: 'income', icon: 'TrendingUp', color: '#8B5CF6' },
  { name: 'Gifts', type: 'income', icon: 'Gift', color: '#EC4899' },
  { name: 'Other Income', type: 'income', icon: 'Plus', color: '#14B8A6' },
  // Expense categories
  {
    name: 'Food & Dining',
    type: 'expense',
    icon: 'Utensils',
    color: '#F97316',
  },
  { name: 'Transportation', type: 'expense', icon: 'Car', color: '#06B6D4' },
  { name: 'Shopping', type: 'expense', icon: 'ShoppingBag', color: '#F43F5E' },
  { name: 'Entertainment', type: 'expense', icon: 'Film', color: '#A855F7' },
  { name: 'Bills & Utilities', type: 'expense', icon: 'Zap', color: '#EAB308' },
  { name: 'Healthcare', type: 'expense', icon: 'Heart', color: '#EF4444' },
  {
    name: 'Education',
    type: 'expense',
    icon: 'GraduationCap',
    color: '#14B8A6',
  },
  { name: 'Rent', type: 'expense', icon: 'Home', color: '#6366F1' },
  {
    name: 'Groceries',
    type: 'expense',
    icon: 'ShoppingCart',
    color: '#84CC16',
  },
  { name: 'Travel', type: 'expense', icon: 'Plane', color: '#0EA5E9' },
  { name: 'Personal Care', type: 'expense', icon: 'Smile', color: '#D946EF' },
  {
    name: 'Other Expense',
    type: 'expense',
    icon: 'MoreHorizontal',
    color: '#64748B',
  },
];

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  findAll() {
    return this.prisma.category.findMany();
  }

  findOne(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  remove(id: string) {
    return this.prisma.category.delete({
      where: { id },
    });
  }

  async loadDefaults() {
    const existingCategories = await this.prisma.category.findMany();

    if (existingCategories.length > 0) {
      return {
        success: false,
        message:
          'Categories already exist. Delete existing categories first to load defaults.',
        count: existingCategories.length,
      };
    }

    const created = await this.prisma.category.createMany({
      data: DEFAULT_CATEGORIES,
    });

    return {
      success: true,
      message: 'Default categories loaded successfully',
      count: created.count,
    };
  }
}
