
import {

  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import {
  Column,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { role } from './role.entity';


@Entity('users')
export class user {
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
