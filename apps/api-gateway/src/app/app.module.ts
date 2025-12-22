import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE_RABBITMQ } from './utils/servicename';
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
          },
        },
      },
    ]),

  ],
  controllers: [AppController, AuthController,AuthController],
  providers: [AppService],
  
  exports:[],
})
export class ApiGatewayModule {}
