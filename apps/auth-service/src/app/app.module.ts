import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { join } from 'node:path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import ormConfigProd from '../../../product/src/app/config/orm.config.prod';
import ormConfig from '../../../product/src/app/config/orm.config';
import { user } from './entity/user.entity';
import { Role } from './entity/role.entity';
import { Authorization } from './entity/auth.entity';
import type ms from 'ms';
import { AuthorizationService } from './guards/authorization.service';
import { JwtModule } from '@nestjs/jwt';
import { AppService } from './app.service';
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
    }),
  JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    secret: configService.getOrThrow<string>('JWT_SECRET'),
    signOptions: {
      expiresIn: configService.getOrThrow<string>('ACCESS_TOKEN_EXPIRY') as import('ms').StringValue,
    },
  }),
}),

  
  ],
  controllers: [AppController],
  providers: [AuthorizationService,AppService],
})
export class AppModule {}
