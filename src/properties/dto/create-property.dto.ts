import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePropertyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  price!: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  bedrooms!: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  bathrooms!: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  type?: string | null;
}
