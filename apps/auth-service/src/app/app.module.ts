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
import { user } from './entity/user.entity';
import { Role } from './entity/role.entity';
import { Authorization } from './entity/auth.entity';
@Module({
   imports: [
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

 TypeOrmModule.forFeature([user, Role, Authorization]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
