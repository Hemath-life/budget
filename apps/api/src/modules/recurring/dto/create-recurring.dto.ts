import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRecurringDto {
  @IsNotEmpty()
  @IsEnum(['income', 'expense'])
  type!: 'income' | 'expense';

  @IsNotEmpty()
  @IsNumber()
  amount!: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsNotEmpty()
  @IsString()
  category!: string; // categoryId

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsEnum(['daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly'])
  frequency!:
    | 'daily'
    | 'weekly'
    | 'biweekly'
    | 'monthly'
    | 'quarterly'
    | 'yearly';

  @IsNotEmpty()
  @IsString()
  startDate!: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsString()
  nextDueDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
