
import {
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { role } from '../entity/role.entity';
import { Column, CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export class CreateUserDto {

  @PrimaryColumn()
  id!: string;


  @Column()
  name!: string;



  @Column({ unique: true })
  email!: string;


  @Length(6, 20)
  @Column()
  password!: string;


  @IsEnum(role)

  @Column({ type: 'enum', enum: role, default: role.ADMIN })
  role!: role;

  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  address!: string;



  @Column({ type: 'bigint', nullable: true })
  contactNumber!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;


}
