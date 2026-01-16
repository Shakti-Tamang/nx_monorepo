import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  PRODUCT_SERVICE_RABBITMQ,
  UPLOAD_SERVICE_RABBITMQ,
} from './utils/servicename';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './controller/app.controller';
import { ProductEntity } from './entity/product.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: UPLOAD_SERVICE_RABBITMQ,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'image.exist.queue',
          exchange: 'upload_Exchange',
          exchangeType: 'direct',
          routingKey: 'image.exists',
          queueOptions: { durable: true },
        },
      },
    ]),
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

    TypeOrmModule.forFeature([ProductEntity]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
