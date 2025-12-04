import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ enum: ['income', 'expense'] })
  @IsNotEmpty()
  @IsString()
  @IsIn(['income', 'expense'])
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  icon: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  color: string;
}
