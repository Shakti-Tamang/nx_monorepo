import * as path from 'path';
import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs('orm.config', (): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10), // Default to '5432' if undefined
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.DB_SYNCHRONIZE === 'false', // Will automatically synchronize the schema (use caution in production)
    logging: process.env.DB_LOGGING === 'false', // Logs SQL queries
    autoLoadEntities: true, // Auto loads entities from the app
    entities: [
      path.resolve(__dirname, '..', '**/*.entity{.ts,.js}'),
      path.resolve(__dirname, '..', '**/entities/*.entity{.ts,.js}'),
    ],
    migrations: [
      path.resolve(__dirname, '..', 'core/config/migrations/*{.ts,.js}'),
    ],
    migrationsRun: true,
  };
});