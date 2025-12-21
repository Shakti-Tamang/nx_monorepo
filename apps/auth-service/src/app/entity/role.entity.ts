import { IsEnum } from 'class-validator';
import {
  Entity,
  Column,
  OneToMany,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Authorization } from './auth.entity';


export enum role {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  EMPLOYEE = 'EMPLOYEE',
}
@Entity('role')
export class Role {
  @PrimaryColumn({ type: 'varchar', length: 4 })
  id!: string;

  @Column({ type: 'enum', enum: role, unique: true })
  @IsEnum(role)
  role!: role;

  @OneToMany(() => Authorization, (authorization) => authorization.role, {
    cascade: true,
  })
  authorizations!: Authorization[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
