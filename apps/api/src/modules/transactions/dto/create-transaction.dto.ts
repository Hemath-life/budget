import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ enum: ['income', 'expense'] })
  @IsNotEmpty()
  @IsString()
  @IsIn(['income', 'expense'])
  type!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount!: number;

  @ApiProperty({ default: 'INR' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  categoryId!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  date!: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  recurringId?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  tags?: string;
}
