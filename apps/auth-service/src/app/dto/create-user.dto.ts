import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { role } from '../entity/role.entity';

export class CreateUserDto {
  @IsString()
  name!: string;

  @IsString()
  email!: string;

  @Length(6, 20)
  password!: string;

  @IsEnum(role)
  @IsOptional()
  role?: role;

  @IsString()
  @IsOptional()
  address?: string;

  // BIGINT must be string
  @IsOptional()
  contactNumber?: string;
}
