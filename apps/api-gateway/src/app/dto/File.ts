import { Column, PrimaryColumn } from 'typeorm';
import { FileType } from './file-type';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class File {
  @PrimaryColumn()
  file_id!: string;

  @ApiProperty({ name: 'fileURL' })
  @IsOptional()
  @Column({ nullable: true })
  @IsString()
  file!: string;

  @ApiProperty({ name: 'type', enum: FileType })
  @IsOptional()
  @IsEnum(FileType)
  @Column({ type: 'enum', enum: FileType })
  type!: FileType;
}
