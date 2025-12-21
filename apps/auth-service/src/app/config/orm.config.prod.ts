import * as path from 'path';
import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs('orm.config.prod', (): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10), // Default to '5432' if undefined
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.DB_SYNCHRONIZE === 'false', // Use this cautiously in production environments
    logging: process.env.DB_LOGGING === 'false',
    autoLoadEntities: true,
    entities: [
      path.resolve(__dirname, '..', '**/*.entity{.ts,.js}'),
      path.resolve(__dirname, '..', '**/entities/*.entity{.ts,.js}'),
    ],
  };
});