import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  AUTH_SERVICE_RABBITMQ,
  UPLOAD_SERVICE_RABBITMQ,
} from './utils/servicename';
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
          queueOptions: { durable: true },
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
  ],
  controllers: [AppController, AuthController, AuthController],
  providers: [AppService],

  exports: [],
})
export class ApiGatewayModule {}
