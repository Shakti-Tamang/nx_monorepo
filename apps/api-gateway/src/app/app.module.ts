import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  AUTH_SERVICE_RABBITMQ,
  UPLOAD_SERVICE_RABBITMQ,
} from './utils/servicename';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CustomThrottlerGuard } from './guard';

import { configDotenv } from 'dotenv';
configDotenv();

@Module({
  imports: [
    // In ClientsModule configuration:

    ClientsModule.register([
      {
        // connection Retry Logic
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
          // Add these for production:
          socketOptions: {
            heartbeatIntervalInSeconds: 60,
            reconnectTimeInSeconds: 5, // Auto-reconnect
          },
          maxConnectionAttempts: 5, // Retry 5 times
        },
      },
    ]),
    ClientsModule.register([
      {
        name: UPLOAD_SERVICE_RABBITMQ,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'File_Que',
          // Add exchange configuration to match Spring Boot
          exchange: 'upload_Exchange',
          routingKey: 'routing.key', // Must match Spring Boot's ROUTING_KEY
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),

    ThrottlerModule.forRoot({
      throttlers: [
        // {
        //   name: 'short',
        //   ttl: 1000,
        //   limit: parseInt(process.env.RATE_LIMIT_SHORT || '10'),
        // },
        {
          name: 'medium',
          ttl: 10000,
          limit: parseInt(process.env.RATE_LIMIT_MEDIUM || '50'),
        },
        // {
        //   name: 'long',
        //   ttl: 60000,
        //   limit: parseInt(process.env.RATE_LIMIT_LONG || '100'),
        // },
      ],
    }),
  ],
  controllers: [AppController, AuthController],
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
