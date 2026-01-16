import { NestFactory } from '@nestjs/core';

import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
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
      noAck: false,
      prefetchCount: 10,
    },
  });

  await app.startAllMicroservices();
  await app.listen(3010);

  console.log('🚀 Auth Service running on port 3010');
}
bootstrap();
