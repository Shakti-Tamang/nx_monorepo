import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'node:path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import ormConfigProd from './config/orm.config.prod';
import ormConfig from './config/orm.config';
@Module({
   imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: '.env', 
      isGlobal: true,
      load: [ormConfig, ormConfigProd],
      expandVariables: true,
    }),
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return configService.getOrThrow<TypeOrmModuleOptions>('orm.config');
  },
}),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
