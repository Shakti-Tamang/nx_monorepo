import { IsEnum, IsOptional, IsString, Length } from 'class-validator';

import {
  Column,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { role } from './role';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty({ name: 'name' })
  @IsString()
  name!: string;

  @ApiProperty({ name: 'email' })
  @IsString()
  email!: string;

  @ApiProperty({ name: 'password' })
  @Length(6, 20)
  password!: string;

  @ApiProperty({ name: 'role' })
  @IsEnum(role)
  @IsOptional()
  role?: role;

  @ApiProperty({ name: 'address' })
  @IsString()
  @IsOptional()
  address?: string;

  // BIGINT must be string
  @ApiProperty({ name: 'contactNumber' })
  @IsOptional()
  contactNumber?: string;
}
