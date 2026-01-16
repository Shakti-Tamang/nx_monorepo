import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  AUTH_SERVICE_RABBITMQ,
  PRODUCT_SERVICE_RABBITMQ,
  UPLOAD_SERVICE_RABBITMQ,
} from './utils/servicename';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CustomThrottlerGuard } from './guard';
import { configDotenv } from 'dotenv';
import { UploadImages } from './auth/uploadimage.controller';
import { ProductController } from './auth/product';

configDotenv();

@Module({
  imports: [
    ClientsModule.register([
       {
        name: AUTH_SERVICE_RABBITMQ,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'auth_queue',
          queueOptions: {
            durable: true,
            arguments: {
              'x-dead-letter-exchange': 'dlx.auth',
              'x-dead-letter-routing-key': 'failed.auth',
            },
          },
        },
      },
      {
        name: PRODUCT_SERVICE_RABBITMQ,
          transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'product_queue',
          queueOptions: {
            durable: true,
            arguments: {
              'x-dead-letter-exchange': 'dlx.product',
              'x-dead-letter-routing-key': 'failed.product',
            },
          },
        },
      },
      {
        name: UPLOAD_SERVICE_RABBITMQ,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'image.upload.queue',
          queueOptions: { durable: true },
          socketOptions: {
            heartbeatIntervalInSeconds: 60,
            reconnectTimeInSeconds: 5,
          },
          maxConnectionAttempts: 10,
        },
      },
    ]),

    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'medium',
          ttl: 10000,
          limit: parseInt(process.env.RATE_LIMIT_MEDIUM || '50'),
        },
      ],
    }),
  ],
  controllers: [AppController, AuthController, UploadImages,ProductController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
  exports: [],
})
export class ApiGatewayModule {}