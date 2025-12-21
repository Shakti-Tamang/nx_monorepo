import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

export default registerAs('orm.config.prod', (): TypeOrmModuleOptions => ({
  type: 'postgres', // Database type
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'mydatabase',
  synchronize: true,       // Use with caution in PROD! For dev, ok
  logging: false,          // Set true if you want query logs
  autoLoadEntities: true,  // Automatically load entities registered in modules
  entities: [path.join(__dirname, '**/*.entity.{ts,js}')], // All entity files
  migrations: [path.join(__dirname, '..', 'migrations/*.{ts,js}')], // Optional
  migrationsRun: true,     // Run migrations automatically on startup
}));
