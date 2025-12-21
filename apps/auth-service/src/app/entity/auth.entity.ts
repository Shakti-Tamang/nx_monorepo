import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
@Entity('auth')
export class Authorization {
  @PrimaryColumn({ type: 'varchar', length: 4 })
  id!: string;

  @Column()
  path!: string;

  @Column('simple-json')
  methods!: string[];

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'roleId' })
  role!: Role;



  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
