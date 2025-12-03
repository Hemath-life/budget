import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCurrencyDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  symbol: string;

  @IsOptional()
  @IsNumber()
  rate?: number;
}
