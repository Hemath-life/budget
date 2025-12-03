import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBudgetDto {
  @IsNotEmpty()
  @IsString()
  category: string; // This is the category ID

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsNotEmpty()
  @IsEnum(['weekly', 'monthly', 'quarterly', 'yearly'])
  period: 'weekly' | 'monthly' | 'quarterly' | 'yearly';

  @IsOptional()
  @IsNumber()
  spent?: number;

  @IsOptional()
  @IsString()
  startDate?: string;
}
