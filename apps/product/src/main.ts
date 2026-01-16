/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';


import { MicroserviceOptions, Transport } from '@nestjs/microservices';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
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
      noAck: false,
      prefetchCount: 10,
    },
  });

  await app.startAllMicroservices();
  await app.listen(3002);

  Logger.log('🚀 Product Service running');
}
bootstrap();
