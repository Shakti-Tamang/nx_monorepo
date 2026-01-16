import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ProductDto {

  @ApiProperty({
    example: 1,
    description: 'Product ID',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({
    example: 'iPhone 15',
    description: 'Product name',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'Latest Apple smartphone',
    description: 'Product description',
  })
  @IsString()
  description!: string;

  @ApiProperty({
    example: 1299.99,
    description: 'Product price',
  })
  @IsNumber()
  price!: number;

  @ApiProperty({
    example: true,
    description: 'Product active status',
    default: true,
  })
  @IsBoolean()
  isActive!: boolean;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'List of uploaded image IDs',
    type: [Number],
  })
  @IsArray()
  imageIds!: number[];

  @ApiProperty({
    example: '2025-01-01T10:00:00.000Z',
    description: 'Created date',
    required: false,
  })
  @IsOptional()
  createdAt?: Date;

  @ApiProperty({
    example: '2025-01-01T10:05:00.000Z',
    description: 'Last updated date',
    required: false,
  })
  @IsOptional()
  updatedAt?: Date;
}
